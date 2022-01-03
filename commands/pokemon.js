const { SlashCommandBuilder } = require('@discordjs/builders');

const Pokemon = require('../app_modules/pokemonMessage')
/*
//const DOMParser = require('dom-parser');

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
		.setFooter(dexURL);
	return embed;
}// End createEmbedMessage

function createStatsMeter(stats){
	let meterContainer = '';
	for(let i = 0; i < stats.length; i++){
		meterContainer += `${getStatString(stats[i])}\t${stats[i]}\n`;
	}
	let total = 0;
	for(stat of stats)
		total += stat;
	meterContainer += `${total}`
	return meterContainer;
}// End createStatsMeter

function getStatString(stat){
	let meter = '';
	let loop = Math.ceil(parseFloat(stat) / 5.0);
	for(let i = 0; i < loop; i++){
		meter += '|\u200B'
	};
	return meter;
}// End getStatString

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


async function getPageHTML(url){
	//import fetch from 'node-fetch';
	const response = await fetch(url);
	return response.text();
}// End getPageHTML

async function getPageDoc(url){
	const html = await getPageHTML(url);
	let parser = new DOMParser();
	let doc = parser.parseFromString(html, 'text/html');
	return doc;
}// End getPageDoc

function getTypeAbilityFromDoc(doc){
	let typeAbility = doc.getElementsByClassName('vitals-table')[0].childNodes[1].innerHTML;
	let type = typeAbility.match(/(?<=type\/)\w+/g);
	let ability = typeAbility.match(/(?<=ability\/)\w+-\w+|(?<=ability\/)\w+/g);
	
	return {type: type, ability: ability};
}

function getStatsFromDoc(doc){
	let statsTable = doc.getElementsByClassName('vitals-table')[3].childNodes[1].innerHTML.match(/<td class="cell-num">\d+/g);
	let stats = [];
	for(let i = 0; i < statsTable.length; i += 3){
		stats.push(parseInt(statsTable[i].match(/\d+/g)));
	}
	return stats;
}


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
*/

module.exports = {

	data: new SlashCommandBuilder()
		.setName('pokemon')
		.setDescription('*** prototype ***')
		.addStringOption((option) => {
			return option.setName('pokemon')
				.setDescription("info of input pokemon is returned")
				.setRequired(true);
		}),

	async execute(interaction) {
		
		await interaction.deferReply();
		let input = interaction.options.data;
		if(input.length == 0){

			createHTMLImage("https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/94.png").then(async (img) => {
				await interaction.editReply({files: [img]});
			});
			
		} else {
			let name = input[0].value;
			try{

				await interaction.editReply(await Pokemon.getPokemonMessage('https://pokeapi.co/api/v2/pokemon/' + name, true));
				await interaction.editReply(await Pokemon.getPokemonMessage('https://pokeapi.co/api/v2/pokemon/' + name, false));
				/*
				// fetch pokemon data and output into embed
				let pokespecies = await fetch('https://pokeapi.co/api/v2/pokemon-species/' + name).then(res => res.json());
				let selectMenu = createSelectMenu(pokespecies.varieties, name);
				//console.log(selectMenu);
				let pokedata = await fetch('https://pokeapi.co/api/v2/pokemon/' + name).then(res => res.json());
				name = name[0].toUpperCase() + name.slice(1);
				let pokeurl = dbPartialURL + name.toLowerCase();
				let pokeimg = pokedata.sprites.other["official-artwork"].front_default;
				let poketype = pokedata.types.map(({type}) => type.name);
				let pokeability = pokedata.abilities.map(({ability}) => ability.name);
				let pokestat = pokedata.stats.map(({base_stat}) => base_stat);	
				let attachment = new MessageAttachment('placeholder.jpeg', 'placeholder.jpeg');	
				await interaction.editReply({components:[selectMenu], embeds: [createEmbedMessage(name, pokeurl, pokeimg, poketype, pokeability, pokestat, true)], files:[attachment]});
				let check = await createHTMLImage(pokestat);
				attachment = new MessageAttachment(check, `${name}.jpeg`);
				await interaction.editReply({components:[selectMenu], embeds: [createEmbedMessage(name, pokeurl, pokeimg, poketype, pokeability, pokestat, false)], files:[attachment]});
				*/
			}catch(err){
				console.log(err);
				await interaction.editReply(`Pokemon does not exist!`);
			}	
			/*
			let docNational = await getPageDoc(dbSearchURL);
			if(docNational.getElementById('main').innerHTML.includes(name)){
				let doc = await getPageDoc(dbPartialURL + name.toLowerCase());
				let imglink = doc.getElementsByClassName("grid-col span-md-6 span-lg-4 text-center")[0].childNodes[1].firstChild.innerHTML.split("\"")[1];
				let typeAbility = getTypeAbilityFromDoc(doc);
				let stat = getStatsFromDoc(doc);

				await interaction.editReply({embeds: [createEmbedMessage(name, dbPartialURL + name.toLowerCase(), imglink, typeAbility.type, typeAbility.ability, stat)]});
			}else{
				await interaction.editReply(`Pokemon does not exist!`);
			}
			*/
		}// End if/else

	},// End execute
};// End module.exports
