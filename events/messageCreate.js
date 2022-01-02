
const roastMessage = [
	"え？僕ぅ？ｗ",
	"♪～(´ε｀　)",
	"(　´_ゝ｀)ﾌｰﾝ",
	"NO U",
	"Your granny tranny"
];

const complimentMessage = [
	
];

function getRoastMessage(){
	let index = Math.floor(Math.random() * roastMessage.length + 1);

	return index != roastMessage.length ? roastMessage[index] : client.emojis.cache.find(emoji => emoji.name === 'PepeLaugh').toString();
}

function getComplimentMessage(){
	return client.emojis.cache.find(emoji => emoji.name === 'Okayge').toString()
}

module.exports = {
	name: 'messageCreate',
	async execute(message) {


		if(message.mentions.has(client.user.id)){
			if(message.author.bot){
				if(message.content.split(" ")[1].includes('🔥')){
					await message.channel.send(getRoastMessage());
				} else if(message.content.split(" ")[1].match(/😋|😊|👌|🤩/) !== ''){
					await message.channel.send(getComplimentMessage());
				}
			} else if(message.content[0] !== ';'){
				await message.channel.send(`${client.emojis.cache.find(emoji => emoji.name === 'Pepega')}`);
			}
		}

	},
};