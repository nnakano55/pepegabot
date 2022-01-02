
const fs = require('fs');

module.exports = {
	name: 'ready',
	once: true,
	execute(client) {
		console.log(`Ready! Logged in as ${client.user.tag}`);
		const guilds = client.guilds.cache.map(guild => guild.id);
    	console.log(guilds);

    	fs.readFile('./config.json', 'utf8', (err, data) => {
    		if(err){
    			console.log('something went wrong(reading)');
    		}else{
    			 let dataJSON = JSON.parse(data);
    			 dataJSON.guildId = guilds;
    			 console.log(JSON.stringify(dataJSON));
    			 fs.writeFile('./config.json', JSON.stringify(dataJSON), 'utf8', (err) => {
    			 	if(err){
    			 		console.log('something went wrong(writing)');
    			 	}else{
    			 		console.log('rewrite complete');
    			 	}
    			 });
    		}
    	});
	},
};
