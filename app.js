//nodeJS discordBOT testing

const fs = require('fs');
const {token} = require('./config.json');

const { Client, Collection, Intents } = require('discord.js');
const client = new Client({ 
	partials: ['MESSAGE', 'CHANNEL', 'REACTION', 'GUILDS', 'GUILD_MESSAGES', 'DIRECT_MESSAGES'],
	intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] 
});
client.commands = new Collection();

const commandFiles = fs.readdirSync(`./commands/`).filter(file => file.endsWith('.js'));
for(const file of commandFiles){
	const command = require(`./commands/${file}`);
	client.commands.set(command.data.name, command);
}

const eventFiles = fs.readdirSync('./events').filter(file => file.endsWith('.js'));
for (const file of eventFiles) {
	const event = require(`./events/${file}`);
	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args));
	} else {
		console.log("messageCreate event created");
		client.on(event.name, (...args) => event.execute(...args));
	}
}

client.login(token);

global.client = client;