const { MessageEmbed, MessageAttachment, MessageActionRow, MessageSelectMenu } = require('discord.js');

const dbSearchURL = 'https://pokemondb.net/pokedex/national';

const dbPartialURL = 'https://pokemondb.net/pokedex/';

const nodeHtmlToImage = require('node-html-to-image')

//const fetch = require('node-fetch');
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

function createSelectMenu(forms, currentform){
	const row = new MessageActionRow().addComponents(
		new MessageSelectMenu()
			.setCustomId('select')
			.setPlaceholder(currentform)
			.addOptions(forms.map((data) => createFormOption(data.pokemon)))
	);
	return row;
}

function createFormOption(form){
	return {
		label: form.name,
		value: form.url
	};
}

function createEmbedMessage(name, dexURL, imgURL, type, ability, stats, placeholder){
	const embed = new MessageEmbed()
		.setColor('#0099FF')
		.setTitle(name)
		.setURL(dexURL)
		.setDescription(`Type: ${type.join('/')}\nAbilities: ${ability.join('/')}`)
		.setImage(placeholder ? 'attachment://placeholder.jpeg':`attachment://${name}.jpeg`)
		.setThumbnail(imgURL)
		/*.addFields(
			{ name: 'Stats', value: 'HP\nATK\nDEF\nSP.ATK\nSP.DEF\nSPD\nTOTAL', inline: true},
			{ name: '\u200B', value: createStatsMeter(stats), inline: true},
		)*/
		.setFooter(dexURL);
	return embed;
}// End createEmbedMessage

async function createHTMLImage(stats){
	const ret = await nodeHtmlToImage({
		type: 'jpeg',
		quality:100,
		encoding: 'buffer',
		html: `
			<!DOCTYPE html>
			<html>
				<head>
					<meta charset="UTF-8" />
					<meta name="viewport" content="width=device-width, initial-scale=1.0" />
					<meta http-equiv="X-UA-Compatible" content="ie=edge" />
					<style>
						body{
							font-family: "Poppins", Arial, Helvetica, sans-serif;
							background: #333333;
					        color: #fff;
					        max-width: 250px;
					        height: 300px;
					        position:absolute;
						}
						table{
							width: 100%;
						}

						td.label{
							width: 25%;
						}
						td.content{
							width: 75%;
						}

						div.flex{
							display: flex;
							float: left;
						}
						div.bar{
							border-radius: 5px 5px 5px 5px;
							margin-top: 5px;
							margin-bottom: 5px;
							margin-right: 3px;
							height: 10px;
						}
						div.outerContainer{
							position:relative;
							top: 40%;
    						transform: translateY(-50%);
						}

					</style>
				</head>
				<body>
					<div class="outerContainer">
						<h2>Base Stats</h2>
						<table>
							<tr>
								<td class="label">HP</td>
								<td class="content">
									<div class="flex bar" style="background-color:${getStatColor(stats[0])};width:${stats[0]/2}px"></div>
									<div class="flex">${stats[0]}</div>
								</td>
							</tr>
							<tr>
								<td class="label">ATK</td>
								<td class="content">
									<div class="flex bar" style="background-color:${getStatColor(stats[1])};width:${stats[1]/2}px"></div>
									<div class="flex">${stats[1]}</div>
								</td>
							</tr>
							<tr>
								<td class="label">DEF</td>
								<td class="content">
									<div class="flex bar" style="background-color:${getStatColor(stats[2])};width:${stats[2]/2}px">
									</div><div class="flex">${stats[2]}</div>
								</td>
							</tr>
							<tr>
								<td class="label">SP.ATK</td>
								<td class="content">
									<div class="flex bar" style="background-color:${getStatColor(stats[3])};width:${stats[3]/2}px"></div>
									<div class="flex">${stats[3]}</div>
								</td>
							</tr>
							<tr>
								<td class="label">SP.DEF</td>
								<td class="content">
									<div class="flex bar" style="background-color:${getStatColor(stats[4])};width:${stats[4]/2}px"></div>
									<div class="flex">${stats[4]}</div>
								</td>
							</tr>
							<tr>
								<td class="label">SPD</td>
								<td class="content">
									<div class="flex bar" style="background-color:${getStatColor(stats[5])};width:${stats[5]/2}px"></div>
									<div class="flex">${stats[5]}</div>
								</td>
							</tr>
							<tr>
								<td class="label">TOTAL</td>
								<td class="content">${stats.reduce((a, b) => (a + b))}</div></td>
							</tr>
						</table>
					</div>
				</body>
			</html>
		`
	});
	return ret;
}

function getStatColor(stat){
	if(stat < 30)
		return "#B30000";
	else if(stat < 60)
		return "#CC4400";
	else if(stat < 90)
		return "#FFD500";
	else if(stat < 120)
		return "#22CC00"; 
	return "#009966";
}// End getStatColor

module.exports = {
	getPokemonMessage: async (url, placeholder) => {
		let pokedata = await fetch(url).then(res => res.json());
		let pokespecies = await fetch(pokedata.species.url).then(res => res.json());
		let selectMenu = createSelectMenu(pokespecies.varieties, pokedata.name);
		//console.log(selectMenu);
		let name = pokedata.name[0].toUpperCase() + pokedata.name.slice(1);
		let pokeurl = dbPartialURL + name.toLowerCase();
		let pokeimg = pokedata.sprites.other["official-artwork"].front_default;
		let poketype = pokedata.types.map(({type}) => type.name);
		let pokeability = pokedata.abilities.map(({ability}) => ability.name);
		let pokestat = pokedata.stats.map(({base_stat}) => base_stat);	
		//let attachment = new MessageAttachment('placeholder.jpeg', 'placeholder.jpeg');	
		//await interaction.editReply({components:[selectMenu], embeds: [createEmbedMessage(name, pokeurl, pokeimg, poketype, pokeability, pokestat, true)], files:[attachment]});
		let check = await createHTMLImage(pokestat);
		let attachment = placeholder ? new MessageAttachment('placeholder.jpeg', `placeholder.jpeg`) : new MessageAttachment(check, `${name}.jpeg`);
		return {components:[selectMenu], embeds: [createEmbedMessage(name, pokeurl, pokeimg, poketype, pokeability, pokestat, placeholder)], files:[attachment]};
	},
};