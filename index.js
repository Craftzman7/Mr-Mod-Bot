const Discord = require('discord.js');
const client = new Discord.Client();
const {Client} = require('discord.js');
const package = require('./package.json');
const fs = require("fs");
const ms = require("ms");
const SelfReloadJSON = require('self-reload-json');
const profanities = require('./swears.json');
const racialSlur = require('./swears.json');
const snekfetch = require('snekfetch');
let modlog = new SelfReloadJSON(__dirname + '/modlog.json');
let welcome = new SelfReloadJSON(__dirname + '/welcome.json');
var weather = require('weather-js');
const config = require('./config.json');
let cooldown = new Set();
let cdseconds = 5;
client.on('ready', () => {
 console.log(`Logged in as ${client.user.tag}!`);
  console.log('I am ready!');
  console.log(client.guilds.size);

})

   

	

// custom modlog
   client.on('message', async message => {
let prefix = [message.guild.id].prefix;
 var command = message.content.toLowerCase().slice(prefix.length).split(' ')[0];
    var args = message.content.split(' ').slice(1);
  if (!message.guild) return console.log('Command Used in DM\'s'); 
   if (!message.content.startsWith(prefix) || message.author.bot) return;
   if (command ==='setup-modlog') {
   	if (!message.member.hasPermission("MANAGE_GUILD")) return message.reply('You do not have permission to do this! You need \`Mannage Server\` permission.');
   	if(!args[0]) return message.reply('You didn\'t specify a channel');
message.reply(`**Channel Set!**`);

   	let modlog = JSON.parse(fs.readFileSync('./modlog.json', 'utf8'));
    modlog[message.guild.id] = {
    	channel: args[0]
    };
    
    fs.writeFile('./modlog.json', JSON.stringify(modlog), (err) => {
    if(err) console.log(err);
});


}
}); 



   client.on('message', async message => {
let prefix = config.prefix
 var command = message.content.toLowerCase().slice(prefix.length).split(' ')[0];
    var args = message.content.split(' ').slice(1);
  if (!message.guild) return console.log('Command Used in DM\'s'); 
   if (!message.content.startsWith(prefix) || message.author.bot) return;
   if (command ==='setup-welcome') {
   	if (!message.member.hasPermission("MANAGE_GUILD")) return message.reply('You do not have permission to do this! You need \`Mannage Server\` permission.');
   	if(!args[0]) return message.reply('You didn\'t specify the channel!');
   	if(!args[1]) return message.reply('You didn\'t specify the message!');
message.reply(`**Welcome Setup!**`);

   	let file = JSON.parse(fs.readFileSync('./welcome.json', 'utf8'));
    welcome[message.guild.id] = {
    	channel: args[0],
    	message: args.slice(1).join(' ')
    };
    
    fs.writeFile('./welcome.json', JSON.stringify(welcome), (err) => {
    if(err) console.log(err);
});


}
}); 

//Profanity
client.on('message', message => {
if (message.author.id === '537808581496537108') return;
if (message.guild.id === '551351989124988933') return;
if (message.author.bot) return;
for (x = 0; x < profanities.length; x++) {
	if (message.content.includes(profanities[x])) {
		message.channel.send('Boi! Dont Swear!')
		message.delete()
		return;
	}
 }
}); 

//Racial Slur
client.on('message', message => {
if (message.author.bot) return;
for (x = 0; x < racialSlur.length; x++) {
	if (message.content.includes(racialSlur[x])) {
		message.channel.send('Boi! Dont Swear!')
		message.delete();
	}
 }
}); 	

// Create an event listener for new guild members
client.on('guildMemberAdd', member => {
  if (!member.guild) return;
  // Send the message to a designated channel on a server:
  let welcomeChannelName = welcome[member.guild.id].channel;
  if (error) return;
let welcomeMessage = welcome[member.guild.id].message;
  const channel = member.guild.channels.find(ch => ch.name === welcomeChannelName);
  // Do nothing if the channel wasn't found on this server
  if (!channel) return;
  // Send the message, mentioning the member
  channel.send(`${welcomeMessage}, ${member}`);
  member.send(`Welcome to ${member.guild}`);
});

client.on('guildMemberRemove', member => {
  // Send the message to a designated channel on a server:
  const channel = member.guild.channels.find(ch => ch.name === 'member-log');
  // Do nothing if the channel wasn't found on this server
  if (!channel) return;
  // Send the message, mentioning the member
  channel.send(`**${member.displayName}** has left the server :(`);
});

//Messages Respond
client.on('message', message => {
let prefix = config.prefix
 
  if (message.content === 'hi') {
    message.channel.send('sup');
  }
  
  if (message.content === 'oof') {
    message.channel.send('oof!');
  }

  if (message.content === 'ha') {
    message.channel.send('gottem');
  }  

 if (message.content === 'your mom') {
 message.reply('no ur mom');
 } 

if (message.content === '<@547978397163192320> prefix') {
	message.reply(`this servers prefix is \`${prefix}\``);

}

 if (message.content === `${prefix}ping`) {
 message.reply(`pong \`${client.pings.length}ms\``);
 }
  
  if (message.content === `${prefix}guilds`) {
  	message.channel.send(`${client.guilds.size}`);
 } 	

  if (message.content === 'hello') {
    message.channel.send('Hey');
  }  
 
  if (message.content === 'j.clear') {
    if(!message.member.hasPermission('MANAGE_MESSAGES')) return message.channel.send('You dont have permission to do this!');       
        if (message.author.bot) return;
        async function clear() {
            message.delete();
            const fetched = await message.channel.fetchMessages({limit: 99});
            message.channel.bulkDelete(fetched);
        }
        clear();
    }
 
 if (message.content === `${prefix}help`) {	
  	if (message.author.bot) return;
   if (!message.guild) return console.log('Command Used in DM\'s');  
  const embed = new message()
  .setAuthor(`${client.user.tag}`)
.addField('Moderation Commands',`
**In order to use commands here, you must have the permission of what the bot is doing.**
- "ping" sends the ping in ms
- "clear" Clears messages | Usage: \`${prefix}\`clear [amount]
- "warn" warns mentioned member | Manage Messages perm is required for this command.
- "kick" kicks mentioned member
- "ban" bans mentioned member
- "suggest" suggest a command or bug fix. | Usage: \`${prefix}\`suggest [suggestion]
- "status" shows current status of the bot
- "setup" shows help for setting up guild config.
- "config" shows you'r guilds settigs.`, true)
  .addField('Bug Fixes',`
  	**Make sure to give Mr Mod Bot Administrator Permission**
  	-If there is a bug please let me know on the support server`)
  .addField('Command Suggestions', `Please let me know if you have any command suggestions. Using the "\`${prefix}\`suggest" command`)
  .setFooter('commands updated 9/28/20')
  .setColor(0xe0b533)
message.author.send(embed);
message.react('📩');
 }
});

//kick
client.on('message', message => {
let prefix = config.prefix
  var args = message.content.split(' ').slice(1);
 
 //This is the log channel 
  // Ignore messages that aren't from a guild
  if (!message.guild) return console.log('Command Used in DM\'s'); 

  // If the message content starts with "j.kick"
  if (message.content.startsWith(`${prefix}kick`)) {
    // Check permissions
    if(!message.member.hasPermission('KICK_MEMBERS')) return message.channel.send('You dont have permission to do this!');     
    // Assuming we mention someone in the message, this will return the user
//must have kick members perm
    // Read more about mentions over at https://discord.js.org/#/docs/main/stable/class/MessageMentions
    const user = message.mentions.users.first();
     
     let reason = args.slice(1).join(' ') // .slice(1) removes the user mention, .join(' ') joins all the words in the message, instead of just sending 1 word   
    // If we have a user mentioned
    if (user) {
      // Now we get the member from the user
      const member = message.guild.member(user);
      // If the member is in the guild
      if (member) {
        /**
         * Kick the member
         * Make sure you run this on a member, not a user!
         * There are big differences between a user and a member
         */
            member.send(`**You\'ve been kicked from** \`${message.guild}\` **for:**${reason}`);       
        member.kick(reason).then(() => {
          // We let the message author know we were able to kick the person
          message.reply(`Successfully kicked ${user.tag}`); 

        }).catch(err => {
          // An error happened
          // This is generally due to the bot not being able to kick the member,
          // either due to missing permissions or role hierarchy
          message.reply('I was unable to kick the member');
          // Log the error
          console.error(err);
        });
      } else {
        // The mentioned user isn't in this guild
        message.reply('That user isn\'t in this guild!');
      }
    // Otherwise, if no user was mentioned
    } else {
      message.reply('You didn\'t mention the user to kick!');
    }
  }

  if (!message.guild) return console.log('Command Used in DM\'s'); 
  // if the message content starts with "!ban"
  if (message.content.startsWith(`${prefix}ban`)) {
    //Check permissions
    if(!message.member.hasPermission('BAN_MEMBERS')) return message.channel.send('You dont have permission to do this!');    
    // Assuming we mention someone in the message, this will return the user
    // Read more about mentions over at https://discord.js.org/#/docs/main/stable/class/MessageMentions
    const user = message.mentions.users.first();
    // If we have a user mentioned
    if (user) {
      // Now we get the member from the user
      const member = message.guild.member(user);
      // If the member is in the guild
      if (member) {
        /**
         * Ban the member
         * Make sure you run this on a member, not a user!
         * There are big differences between a user and a member
         * Read more about what ban options there are over at
         * https://discord.js.org/#/docs/main/stable/class/GuildMember?scrollTo=ban
         */
            member.send(`**You\'ve been banned from** \`${message.guild}\` **for:**${reason}`);       
        member.ban({
          reason: reason,
        }).then(() => {
          // We let the message author know we were able to ban the person
          message.reply(`Successfully banned ${user.tag}`);
        }).catch(err => {
          // An error happened
          // This is generally due to the bot not being able to ban the member,
          // either due to missing permissions or role hierarchy
          message.reply('I was unable to ban the member');
          // Log the error
          console.error(err);
        });
      } else {
        // The mentioned user isn't in this guild
        message.reply('That user isn\'t in this guild!');
      }
    } else {
    // Otherwise, if no user was mentioned
      message.reply('You didn\'t mention the user to ban!');
    }
  }
  if (!message.guild) return console.log('Command Used in DM\'s'); 

  // if the message content starts with "!ban"
  if (message.content.startsWith(`${prefix}mute`)) {

 let tomute = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]));
  if(!tomute) return message.reply("Couldn't find user.");
  if(tomute.hasPermission("MANAGE_GUILD")) return message.reply("Can't mute them!");
  let muterole = message.guild.roles.find(`name`, "muted");
  //start of create role
  if(!muterole){
    try{
      message.guild.createRole({
        name: "muted",
        color: "#000000",
        permissions:[]
      })
      message.guild.channels.forEach(async (channel, id) => {
        await channel.overwritePermissions(muterole, {
          SEND_MESSAGES: false,
          ADD_REACTIONS: false
        });
      });
    }catch(e){
      console.log(e.stack);
    }
  }
  //end of create role
  let mutetime = args[1];
  if(!mutetime) return message.reply("You didn't specify a time!");

  await(tomute.addRole(muterole.id));
  message.reply(`<@${tomute.id}> has been muted for ${ms(ms(mutetime))}`);
var muteembed = new Discord.MessageEmbed()
.setTitle('Member Muted')
.setAuthor(client.user.tag, client.user.avatarURL)
.addField('Moderator', message.author)
.addField('Reason', 'Mute Command')
.addField('User', tomute)
.setFooter(tomute.id)
.setTimestamp();
 logchannel.send(muteembed);  
  setTimeout(function(){
    tomute.removeRole(muterole.id);
    message.channel.send(`<@${tomute.id}> has been unmuted!`);
  }, ms(mutetime));


}
}); 
client.on("messageDelete", (messageDelete) => {
let modlogName = modlog[messageDelete.guild.id].channel;
  const modlogChannel = messageDelete.guild.channels.find(ch => ch.name === modlogName);
  if (!modlogChannel) return;
    const embed = new MessageEmbed()
    .setTitle(`Message Deleted in #${messageDelete.channel.name}`)
    .setColor(0xd81313)
    .addField('Message', messageDelete.content) 
    .addField('User', messageDelete.author)
    .addField('User ID', messageDelete.author.id)
    .setAuthor(messageDelete.author.username, messageDelete.author.avatarURL) 
    .setFooter(messageDelete.author.id)
    .setTimestamp();
modlogChannel.send(embed);
});


client.on('ready', () => {
client.user.setActivity('for 1help', { type: 'WATCHING' });
});
//set activity command
   client.on('message', async message => {
 let prefix = config.prefix
 var command = message.content.toLowerCase().slice(prefix.length).split(' ')[0];
    var args = message.content.split(' ').slice(1);
   if (!message.content.startsWith(prefix) || message.author.bot) return;
    if (message.author.id !== '517704267889639446', '542572136112324629') return;
if (command ==='setpresence') {

client.user.setActivity(args.join(' '));

message.reply('Presence Updated!');
}

if (command =='resetpresence') {
client.user.setActivity('Prefix j. | j.help', { type: 'WATCHING' });
message.reply('Done!');
}

if (command ==='setstatusstream') {
    client.user.setActivity(args.join(' '), { type: "STREAMING", url: "https://www.twitch.tv/discord-jerome" });
message.reply('status set!');

}

if (command ==='setstatus-online') {

    client.user.setStatus("online");
message.reply('status set!');

}

if (command ==='setstatus-idle') {

client.user.setStatus("idle");    

message.reply('status set!');

}

if (command ==='setstatus-dnd') {
	client.user.setStatus("dnd");

message.reply('status set!');

}

if (command ==='setstatus-invis') {
	client.user.setStatus("invisible");

message.reply('status set!');

}
});

client.on('message', async message => {
 let prefix = config.prefix
 var command = message.content.toLowerCase().slice(prefix.length).split(' ')[0];
    var args = message.content.split(' ').slice(1);
   if (!message.content.startsWith(prefix) || message.author.bot) return;
  if (!message.guild) return console.log('Command Used in DM\'s'); 

if (command ==='clear') {
    if(!message.member.hasPermission('MANAGE_MESSAGES')) return message.channel.send('You dont have permission to do this!');  
        if (message.author.bot) return;
        async function clear() {
            message.delete();
            const fetched = await message.channel.fetchMessages({limit: args.join(' ')});
            message.channel.bulkDelete(fetched);
        }
        clear();
    }
});



 client.on('message', async message => {
let prefix = config.prefix
var msg = message.content.toUpperCase();
  var command = message.content.toLowerCase().slice(prefix.length).split(' ')[0];
 
  //These are the arguments behind the commands.
  var args = message.content.split(' ').slice(1);
    if (!message.content.startsWith(prefix)) return;  
  if (!message.guild) return console.log('Command Used in DM\'s'); 
   
    if (command ==='announce') {
   if (!args[0]) return message.reply('You didn\'t choose a title.');
   if (!args[1]) return message.reply('You didn\'t specify the announcement');	
    	message.delete();
   const announceEmbed = new Discord.MessageEmbed()
   .setAuthor(message.author.username, message.author.avatarURL)
   .setTitle(args[0])
   .setColor(0xd6ab48)
   .setDescription(args.slice(1).join(' '))
   .setTimestamp();
message.delete();
  message.channel.send('@everyone', announceEmbed);

       }

if (!message.content.startsWith(prefix)) return;
if (command ==='suggest') {
message.delete();
const suggestembed = new Discord.MessageEmbed()
 .setTitle('Command Suggestion')
 .setAuthor(message.author.tag)
 .setThumbnail(message.author.avatarURL)
 .addField('User', message.author)
 .addField('Suggestion', `Reason: ${args.join(' ')}`)
 .setTimestamp()
 .setColor(0x42f4dc);


client.users.get("517704267889639446", "542572136112324629").send(suggestembed);

const succesfulembed = new Discord.MessageEmbed()
.setTitle('Suggestion Succesful!')
.setColor(0x42f4dc);

message.channel.send(succesfulembed);
}
	




if (command ==='status') {
const uptime = (client.uptime / 60000);
const statusEmbed = new Discord.MessageEmbed()
.setTitle('Mr Ed Bot Status')
.setAuthor(client.user.tag, client.user.avatarURL)
.addField('This Bots Status', "**ONLINE**")
.addField('Your Server', 'Florent **ONLINE**')
.addField('Problems', 'No issues at this time!')
.addField('Ping', `\`${client.pings.length}ms\``)
.addField('Uptime', `\`${uptime} mins.\``)
.setColor(0x43ce1c)
.setTimestamp()
.setFooter('Made by Crafterzman and LlamaBoiq');
message.channel.send(statusEmbed);

}


if (command ==='setup') {
	const setupEmbed = new Discord.MessageEmbed()
	.setTitle('Setup Help')
	.addField('Welcome Messages', `
		**Command:** \`${prefix}setup-welcome\`
		**Usage:** \`${prefix}setup-welcome [channel] [message]\`
		**Example:** \`${prefix}setup-welcome member-log Hey! Welcome to the server!!!\`
		**Parameters:** \${member} - mentions member  \${member.guild} - Displays Guild Name  \${member.tag} - Shows the members name.`)
	.addField('Modlog Channel', `
		**Command:** \`${prefix}setup-modlog\`
		**Usage:** \`${prefix}setup-modlog [channel]\`
		**Example:** \`${prefix}setup-modlog logs\``)
	.setColor(0x42f4dc)
	.setAuthor(client.user.username, client.user.avatarURL)
	.setTimestamp()
	.setFooter('Made by Crafterzman and LlamaBoiq');
	message.channel.send(setupEmbed);

}

if (command ==='config') {
	  const modlogChannelName = modlog[message.guild.id].channel;
	  const modlogChannel = message.guild.channels.find(ch => ch.name === modlog[message.guild.id].channel);
let welcomeChannelName = welcome[message.guild.id].channel;
let welcomeMessage = welcome[message.guild.id].message;
  const welcomeChannel = message.guild.channels.find(ch => ch.name === welcomeChannelName);
  const configEmbed = new Discord.MessageEmbed()
  .setTitle('This Guilds config')
  .addField('Guild Name', `- ${message.guild}`)
  .addField('Prefix', `- ${prefix}`)
  .addField('Logging Channel', `- ${modlogChannelName}`)
  .addField('Welcome Channel', `- ${welcomeChannelName}`)
  .addField('Welcome Message', `- ${welcomeMessage}`)
  .setAuthor(client.user.username, client.user.avatarURL)
  .setTimestamp()
  .setColor(0xd81313)
  .setFooter('Made by Crafterzman and LlamaBoiq');
  message.channel.send(configEmbed);

}

if (command ==='esuggest') {
	message.reply('Done!');
 const channel = client.channels.get('580146755895820298');
 if (!channel) return; 
 channel.send(`${message.author} You'r suggestion was made: ${args.join(' ')} Please wait for your suggestion to be confirmed or denied. |<@537808581496537108>|`);

}

    if (!message.content.startsWith(prefix)) return;  
    if (command ==='warn') {
    var embedColor = '#e5f442' // Change this to change the color of the embeds!
    
    var missingPermissionsEmbed = new Discord.MessageEmbed() // Creates the embed thats sent if the user is missing permissions
        .setColor(embedColor)
        .setAuthor(message.author.username, message.author.avatarURL)
        .setTitle('Insufficient Permissions!')
        .setDescription('You need the `MANAGE_MESSAGES` permission to use this command!')
        .setTimestamp();
    var missingArgsEmbed = new Discord.MessageEmbed() // Creates the embed thats sent if the command isnt run right
        .setColor(embedColor)
        .setAuthor(message.author.username, message.author.avatarURL)
        .setTitle('Missing Arguments!')
        .setDescription('Usage: `warn [@User] [Reason]')
        .setTimestamp();
    if(!message.member.hasPermission('MANAGE_MESSAGES')) return message.channel.send(missingPermissionsEmbed); // Checks if the user has the permission
    let mentioned = message.mentions.users.first(); // Gets the user mentioned!
    if(!mentioned) return message.channel.send(missingArgsEmbed); // Triggers if the user donsn't tag a user in the message
    let reason = args.slice(1).join(' ') // .slice(1) removes the user mention, .join(' ') joins all the words in the message, instead of just sending 1 word
    if(!reason) return message.channel.send(missingArgsEmbed); // Triggers if the user dosn't provide a reason for the warning
  const modlogChannel = message.guild.channels.find(ch => ch.name === modlog[message.guild.id].channel);
    if(!modlogChannel) return;
    var warningEmbed = new Discord.MessageEmbed() // Creates the embed that's DM'ed to the user when their warned!
        .setColor(embedColor)
        .setAuthor(message.author.username, message.author.avatarURL)
        .setTitle(`You've been warned in ${message.guild.name}`)
        .addField('Warned by', message.author.tag)
        .addField('Reason', reason)
        .setTimestamp();
    mentioned.send(warningEmbed); // DMs the user the above embed!
    var warnSuccessfulEmbed = new Discord.message() // Creates the embed thats returned to the person warning if its sent.
        .setColor(embedColor)
        .setTitle('User Successfully Warned!');
    message.channel.send(warnSuccessfulEmbed); // Sends the warn successful embed
    message.delete(); // Deletes the command
var warninglogEmbed = new Discord.MessageEmbed() // Creates the embed that's DM'ed to the user when their warned!
        .setColor(embedColor)
        .setAuthor(message.author.username, message.author.avatarURL)
        .setTitle(`Warn!`)
        .addField('User', mentioned.tag)
        .addField('Moderator', message.author.tag)
        .addField('Reason', reason)
        .setTimestamp();
    modlogChannel.send(warninglogEmbed); 

}
});

const setupCMD = "j.createrolemessage";
const initialMessage = `**React to the messages below to receive the associated role. If you would like to remove the role, simply remove your reaction!**`;
const embedMessage = `
React to the emoji that matches the role you wish to receive.
If you would like to remove the role, simply remove your reaction!
`;
const embedFooter = "Role Reactions"; // Must set this if "embed" is set to true
const roles = ["Apply"];
const reactions = ["💻"]; // For custom emojis, provide the name of the emoji
const embed = true; // Set to "true" if you want all roles to be in a single embed
const embedColor = "#dd2423"; // Set the embed color if the "embed" variable is set to true
const embedThumbnail = true; // Set to "true" if you want to set a thumbnail in the embed
const embedThumbnailLink = "https://i.imgur.com/P8PD7DD.png"; // The link for the embed thumbnail
/**
 * You'll have to set this up yourself! Read more below:
 * 
 * https://github.com/reactiflux/discord-irc/wiki/Creating-a-discord-bot-&-getting-a-token
 */

// Import constructords and login the client
const { Emoji, MessageReaction } = require('discord.js');



// If there isn't a reaction for every role, scold the user!
if (roles.length !== reactions.length) throw "Roles list and reactions list are not the same length!";

// Function to generate the role messages, based on your config
function generateMessages() {
    let messages = [];
    for (const role of roles) messages.push({ role, message: `React below to get the **"${role}"** role!` }); //DONT CHANGE THIS
    return messages;
}

// Function to generate the embed fields, based on your config and if you set "const embed = true;"
function generateEmbedFields() {
    return roles.map((r, e) => {
        return {
            emoji: reactions[e],
            role: r
        };
    });
}

function checkRole(guild, role) {
    const checkRole = guild.roles.find(r => r.name === role);
    if (checkRole) return true;
    else return false;
}

// Client events to let you know if the bot is online and to handle any Discord.js errors
client.on("ready", () => console.log("Bot is online!"));
client.on('error', console.error);

// Handles the creation of the role reactions. Will either send the role messages separately or in an embed
client.on("message", message => {
    if (message.content.toLowerCase() == setupCMD) {

        if (!embed) {
            if (!initialMessage) throw "The 'initialMessage' property is not set. Please do this!";

            message.channel.send(initialMessage);

            const messages = generateMessages();
            messages.forEach((obj, react) => {
                if (!checkRole(message.guild, obj.role)) throw `The role '${obj.role}' does not exist!`;

                message.channel.send(obj.message).then(async m => {
                    const emoji = reactions[react];
                    const customEmote = client.emojis.find(e => e.name === emoji);
                    
                    if (!customEmote) await m.react(emoji);
                    else await m.react(customEmote.id);
                });
            });
        } else {
            if (!embedMessage) throw "The 'embedMessage' property is not set. Please do this!";
            if (!embedFooter) throw "The 'embedFooter' property is not set. Please do this!";

            const roleEmbed = new message()
                .setDescription(embedMessage)
                .setFooter(embedFooter);

            if (embedColor) roleEmbed.setColor(embedColor);
            if (embedThumbnail) roleEmbed.setThumbnail(embedThumbnailLink);

            const fields = generateEmbedFields();
            if (fields.length >= 25) throw "That maximum roles that can be set for an embed is 25!";

            for (const f of fields) {
                if (!checkRole(message.guild, f.role)) throw `The role '${role}' does not exist!`;

                const emoji = f.emoji;
                const customEmote = client.emojis.find(e => e.name === emoji);
                
                if (!customEmote) roleEmbed.addField(emoji, f.role, true);
                else roleEmbed.addField(customEmote, f.role, true);
            }

            message.channel.send(roleEmbed).then(async m => {
                for (const r of reactions) {
                    const emoji = r;
                    const customEmote = client.emojis.find(e => e.name === emoji);
                    
                    if (!customEmote) await m.react(emoji);
                    else await m.react(customEmote.id);
                }
            });
        }
    }
});

// This makes the events used a bit more readable
const events = {
	MESSAGE_REACTION_ADD: 'messageReactionAdd',
	MESSAGE_REACTION_REMOVE: 'messageReactionRemove',
};

// This event handles adding/removing users from the role(s) they chose
client.on('raw', async event => {

    if (!events.hasOwnProperty(event.t)) return;

    const { d: data } = event;
    const user = client.users.get(data.user_id);
    const channel = client.channels.get(data.channel_id);

    const message = await channel.fetchMessage(data.message_id);
    const member = message.guild.members.get(user.id);

    const emojiKey = (data.emoji.id) ? `${data.emoji.name}:${data.emoji.id}` : data.emoji.name;
    let reaction = message.reactions.get(emojiKey);

    if (!reaction) {
        // Create an object that can be passed through the event like normal
        const emoji = new Emoji(client.guilds.get(data.guild_id), data.emoji);
        reaction = new MessageReaction(message, emoji, 1, data.user_id === client.user.id);
    }

    let embedFooterText;
    if (message.embeds[0]) embedFooterText = message.embeds[0].footer.text;

    if (message.author.id === client.user.id && (message.content !== initialMessage || (message.embeds[0] && (embedFooterText !== embedFooter)))) {

        if (!embed) {
            const re = `\\*\\*"(.+)?(?="\\*\\*)`;
            const role = message.content.match(re)[1];

            if (member.id !== client.user.id) {
                const roleObj = message.guild.roles.find(r => r.name === role);

                if (event.t === "MESSAGE_REACTION_ADD") {
                    member.addRole(roleObj.id);
                } else {
                    member.removeRole(roleObj.id);
                }
            }
        } else {
            const fields = message.embeds[0].fields;

            for (let i = 0; i < fields.length; i++) {
                if (member.id !== client.user.id) {
                    const role = message.guild.roles.find(r => r.name === fields[i].value);

                    if ((fields[i].name === reaction.emoji.name) || (fields[i].name === reaction.emoji.toString())) {
                        if (event.t === "MESSAGE_REACTION_ADD") {
                            member.addRole(role.id);
                            break;
                        } else {
                            member.removeRole(role.id);
                            break;
                        }
                    }
                }
            }
        }
    }
});

process.on('unhandledRejection', err => {
    let msg = err.stack.replace(new RegExp(`${__dirname}/`, 'g'), './');
	console.error(`Unhandled Rejection: \n ${msg}`);
}); 
 // Log our bot in using the token from https://discordapp.com/developers/applications/me
client.login(config.token);
