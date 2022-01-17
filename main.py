import discord
from discord.ext import commands
import os
import requests
import datetime

prefix = ["!"]
intents = discord.Intents.default()
intents.members = True
bot = commands.Bot(command_prefix=prefix, intents=intents)

bypass_id = [Your_ID_here]

@bot.event
async def on_ready():
    print("Logged in as {} (ID: {})!".format(bot.user.name, bot.user.id))

def convert(seconds):
    seconds = seconds % (24 * 3600)
    hour = seconds // 3600
    seconds %= 3600
    minutes = seconds // 60
    seconds %= 60
      
    return "%d hour(s), %02d minute(s) and %02d second(s)" % (hour, minutes, seconds)

@bot.command(brief='Generate Minecraft account.', description='Use this command to generate Minecraft account and send to your DM.')
@commands.cooldown(1, 60*60*12, commands.BucketType.user)
async def gen(ctx):
    id = ctx.author.id
    member = bot.get_user(id)
    try:
        channel = await member.create_dm()

        url = requests.get("https://gen.teamic.me/api/generate.php?type=Minecraft")
        data_get = url.text

        account = data_get.split(":")
        email = account[0]
        password = account[1]

        embed = discord.Embed(
            title = 'Generated Account',
            description = f'Email: {email}\nPassword: {password}',
            timestamp=datetime.datetime.utcnow(),
            colour = discord.Colour.blue()
        )

        send = discord.Embed(
            title = 'Done',
            description = 'I have send you an account in DM.',
            timestamp=datetime.datetime.utcnow(),
            colour = discord.Colour.blue()
        )

        await channel.send(embed=embed)
        await ctx.send(embed=send)

        if ctx.author.id in bypass_id:
          gen.reset_cooldown(ctx)

    except:
        embed = discord.Embed(
          title = 'Error',
          description = 'uhh! Enable DM so I can send you!',
          timestamp=datetime.datetime.utcnow(),
          colour = discord.Colour.red()
        )

        await ctx.send(embed=embed)
        gen.reset_cooldown(ctx)

@gen.error
async def gen_error(ctx, error):
    if isinstance(error, commands.CommandOnCooldown):
        time_left = int(error.retry_after)
        embed = discord.Embed(
          title=f":warning: Error!",
          description=f"You need to wait for {convert(time_left)} to continue use this command!",
          color=discord.Colour.red()
        )
        await ctx.send(embed=embed)

TOKEN = os.environ["TOKEN"]
bot.run(TOKEN)  
