
const { SlashCommandBuilder } = require('@discordjs/builders');
const pogsName = [
	"dosU", "PogYou", "PogU","zongchamp", "Pog", "peepoPog", "PogTasty", "PokeChamp", "JogChamp"
];

function hasPog(emojiName){
	for(pog of pogsName){
		if(pog === emojiName)
			return true;
	}	
	return false;
}


module.exports = {
	data: new SlashCommandBuilder()
		.setName('randompog')
		.setDescription('Replies with a random POG'),
	async execute(interaction) {

		const emojiList = client.emojis.cache.map(emoji => emoji)
		let lastList = [];

		for(emoji of emojiList){
			if(hasPog(emoji.name))
				lastList.push(emoji);
		}
		await interaction.reply(`${lastList[Math.floor(Math.random() * lastList.length)]}`);
	},
};