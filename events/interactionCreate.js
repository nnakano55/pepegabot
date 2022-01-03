const Pokemon = require('../app_modules/pokemonMessage');

module.exports = {
	name: 'interactionCreate',
	async execute(interaction) {
		
		if(interaction.isSelectMenu()){
			await interaction.deferReply();
			await interaction.editReply(await Pokemon.getPokemonMessage(interaction.values[0], true));
			await interaction.editReply(await Pokemon.getPokemonMessage(interaction.values[0], false));
		}


		if (!interaction.isCommand()) return;

		const command = client.commands.get(interaction.commandName);
		if (!command) return;

		try {
			await command.execute(interaction);
		} catch (error) {
			console.error(error);
			await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
		}
	},
};

