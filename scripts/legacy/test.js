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

        const messages = await client.channels.cache.get(config.old_log_channel).fetchMessages(options);

        let x = await Moderation.generateLogId()

        messages.map(msg => {
            let log = msg['content']

            // remove all markdown...
            // must be ordered like such:
            log = log.replace("***", "")
            log = log.replace("**", "")
            log = log.replace("*", "")
            log = log.replace("```", "")
            log = log.replace("`", "")
            log = log.replace("||", "")
            log = log.replace("_", "")
            log = log.replace("~~", "")
            // split
            log = log.split("\n")

            // individual log fields..
            // username & id
            let user
            let discriminator
            if (log[0].indexOf("Username: ") >= 0) {
                user = log[0].split("Username: ")[1].split("#")[0]
                if (err) user = ""
                if (log[1].length == 5) {
                    discriminator = log[1].split("#")[1].substring(0, 4)
                    if (err) discriminator = ""
                }
                else {
                    discriminator = log[0].split("Username: ")[1].split("#")[1].substring(0, 4)
                    if (err) discriminator = ""
                }
            }
            else if (log[0].indexOf("username: ") >= 0) {
                user = log[0].split("username: ")[1].split("#")[0]
                if (err) user = ""
                discriminator = log[0].split("username: ")[1].split("#")[1].substring(0, 4)
                if (err) discriminator = ""
            }
            let username = `${user}#${discriminator}`
            //console.log(`${username}`)
            let id
            if (log[0].indexOf("Username: ") >= 0) {
                if (log[0].split("Username: ")[1].split("#")[1].replace("(", "").replace(")", "").substring(5).length > 4) {
                    id = log[0].split("Username: ")[1].split("#")[1].replace("(", "").replace(")", "").replace("ID:", "").replace("Id:", "").replace("id:", "").replace(/\s/g,'').substring(4)
                    if (err) id = ""
    
                } else if (log[1].length > 4 && log[1].includes("ID") || log[1].includes("Id") || log[1].includes("id") || log[1].includes("(")) {
                    id = log[1].replace("(", "").replace(")", "").replace("ID:", "").replace("Id:", "").replace("id:", "").replace(/\s/g,'')
                    if (err) id = ""
                } else if (log[2].length > 4 && log[2].includes("ID") || log[2].includes("Id") || log[2].includes("id") || log[2].includes("(")) {
                    id = log[2].replace("(", "").replace(")", "").replace("ID:", "").replace("Id:", "").replace("id:", "").replace(/\s/g,'')
                    if (err) id = ""
                }
            }
            else if (log[0].indexOf("username: ") >= 0) {
                if (log[0].split("username: ")[1].split("#")[1].replace("(", "").replace(")", "").substring(5).length > 4) {
                    id = log[0].split("username: ")[1].split("#")[1].replace("(", "").replace(")", "").replace("ID:", "").replace("Id:", "").replace("id:", "").replace(/\s/g,'').substring(4)
                    if (err) id = ""
                } else if (log[1].length > 4 && log[1].includes("ID") || log[1].includes("Id") || log[1].includes("id") || log[1].includes("(")) {
                    id = log[1].replace("(", "").replace(")", "").replace("ID:", "").replace("Id:", "").replace("id:", "").replace(/\s/g,'')
                    if (err) id = ""
                } else if (log[2].length > 4 && log[2].includes("ID") || log[2].includes("Id") || log[2].includes("id") || log[2].includes("(")) {
                    id = log[2].replace("(", "").replace(")", "").replace("ID:", "").replace("Id:", "").replace("id:", "").replace(/\s/g,'')
                    if (err) id = ""
                }
            }

            // Log #
            let logNum = log[2].toLowerCase().substring(17)
            //console.log(logNum)

            // type of moderation
            // we can be flexible with the formatting here since it's just information,
            // and isn't required for any performance purposes.  
            let action = log[4].toLowerCase().substring(20)
            //console.log(action)

            // evidence
            let evidence = []
            for (i = 0; i < log.length; i++) { 
                if (log[i].includes("http")) evidence.push(log[i])
            }
            //console.log(evidence)

            // explaination
            let details = 'unknown'
            for (i = 0; i < log.length; i++) { 
                if (log[i].includes('Explanation')) {
                    details = log[i]
                } else if (log[i].includes('explanation')) {
                    details = log[i]
                } else {
                    if (!log[i].includes('http') && log[i].includes('Username') && log[i].includes('Moderation Log') && log[i].includes('Evidence') && log[i].includes('ID')) {
                        details = log[i]
                    }
                }
            }
            details = details.substring(13)
            details = details.replace("***", "")
            details = details.replace("**", "")
            details = details.replace("*", "")
            details = details.replace("```", "")
            details = details.replace("`", "")
            details = details.replace("||", "")
            details = details.replace("_", "")
            details = details.replace("~~", "")
            //console.log(details)

            //console.log("")

            let date = new Date(msg['createdTimestamp'])
            let day = date.toDateString()
            let minutes = (date.getMinutes() < 10 ? "0" : "") + date.getMinutes()
            let hours = (date.getHours() < 10 ? "0" : "") + date.getHours()
            let time = `${hours}:${minutes}`
            let datetime = `${day} @ ${time} (${config.timezone})`

            //console.log(datetime)
            let staff = `${msg['author']['username']}#${msg['author']['discriminator']}`
            let staffId = msg['author']['id']

            x++

            //console.log(x)
            Moderation.addLogLegacy(x, 'DISCORD', `${datetime}`, `${username}`, `${id}`, `${staff}`, `${staffId}`, `${details}`, `${msg['id']}`, `${action}`)
            console.log(`${messages.size - (x-100)} logs need manual review.`)
        })

        sum_messages.push(...messages.array());
        last_id = messages.last().id;

        if (messages.size != 100 || sum_messages >= limit) {
            break;
        }
    }
}