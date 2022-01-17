// To create a bot we'll need this module
const Discord = require('discord.js');
// To get the account from Team-IC's API we'll be using request
const request = require('request');
// Prefix so people don't trigger the command from every message
const prefix = ["!"];//You can change this prefix if you want

// Creating a way for us to login using the bot
const client = new Discord.Client({
  disableEveryone: true,
  allowedMentions: {
    parse: [ ],
    repliedUser: true,
  },
  partials: ['MESSAGE', 'CHANNEL', 'REACTION'],
  intents: [
    Discord.Intents.FLAGS.GUILDS,
    Discord.Intents.FLAGS.GUILD_MEMBERS,
    Discord.Intents.FLAGS.GUILD_MESSAGES,
    Discord.Intents.FLAGS.DIRECT_MESSAGES,
  ]
});

// Event that gets triggered when we are connected to discord using our bot
client.once('ready', () => {
  console.log(`Logged in as : ${client.user.tag}`)
});

// Event that we will use to know if someone triggers the command
client.on('messageCreate', msg => {
  // Stops the event if the author of the command is a bot
  if(msg.author.bot) return;

  // Check if the message starts with '{prefix}gen' and removing case sensitivity
  if(msg.content.toLowerCase().startsWith(`${prefix}gen`)) {
    // Accessing Team-IC's API to generate a Minecraft account
    request("https://gen.teamic.me/api/generate.php?type=Minecraft", function (error, response, body) {
      // Checking if we got any errors while accessing Team-IC's API
      if(error) {
        return console.error(error)
      }
      // Getting the data from Team-IC's API
      let content = body;
      // Splitting the data
      let data = content.split(":");
      // Storing email and password separately
      let [ email , password , username ] = data;
      // Creating an embed to store Minecraft account details
      let embed = new Discord.MessageEmbed()
        .setTitle("Generated Account")
        .setDescription(`Username: ||${username}||\nEmail: ||${email}||\nPassword: ||${password}||`)
        .setColor("BLUE")
        .setTimestamp();
      // Creating an embed to send a success message
      let send = new Discord.MessageEmbed()
        .setTitle("Done")
        .setDescription("I have send you an account in DM.")
        .setColor("BLUE")
        .setTimestamp();
      // Creating an embed if the user doesn't have DM open
      let err = new Discord.MessageEmbed()
        .setTitle("Error")
        .setDescription("uhh! Enable DM so I can send you!")
        .setColor("BLUE")
        .setTimestamp();
      // Sending the Minecraft account details in the user's dm
      msg.author.send({ embeds : [embed] })
        .catch(() => {return msg.reply(err)});// Sending error embed as user's DM not open
      // Sending success message
      msg.reply({ embeds : [send] });
    });
  }
});

// Logging in to our bot's account
client.login(process.env.TOKEN);
