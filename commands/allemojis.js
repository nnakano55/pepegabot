const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('allemojis')
		.setDescription('Replies with user info'),
	async execute(interaction) {
		console.log(client.guilds);
		if(client.emojis.cache.map(emoji => emoji.toString()).length > 0)
			await interaction.reply(client.emojis.cache.map(emoji => emoji.toString()).join(" "));
		else
			await interaction.reply("no emojis");
	},
};
