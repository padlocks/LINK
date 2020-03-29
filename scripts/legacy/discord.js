const Discord = require('discord.js')
const client = new Discord.Client()
const config = require('../../src/config.json')
const Moderation = require('../../src/structures/Moderation')
const fs = require('fs')
var c = require('../../src/structures/Settings').load()
const Flatted = require('flatted')

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag} (${client.user.id})`)

  getData()
})

client.login(c.token)

async function getData(limit = 1000000) {
    const sum_messages = [];
    let last_id;

    while (true) {
        const options = { limit: 100 };
        if (last_id) {
            options.before = last_id;
        }

        const messages = await client.channels.get(config.old_log_channel).fetchMessages(options);
        sum_messages.push(...messages.array());
        last_id = messages.last().id;

        if (messages.size != 100 || sum_messages >= limit) {
            break;
        }
    }

    let data = Flatted.stringify(sum_messages);

    fs.writeFile('discord-logs.json', data, (err) => {
        if (err) throw err;
        console.log('Legacy chat data written to file');
        client.logout()
    });
}