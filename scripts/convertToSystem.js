const Discord = require('discord.js')
const client = new Discord.Client()
const config = require('../src/config.json')
const Moderation = require('../src/structures/Moderation')

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`)

client.channels.get(config.old_log_channel).fetchMessages()
    .then(async messages => {
        console.log(`${messages.size} logs found.`)
        let x = await Moderation.getIncompleteLogId()

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
            let user = log[0].split("Username: ")[1].split("#")[0]
            let discriminator = log[0].split("Username: ")[1].split("#")[1].substring(0, 4)
            let username = `${user}#${discriminator}`
            //console.log(`${username}`)
            let id
            if (log[0].split("Username: ")[1].split("#")[1].replace("(", "").replace(")", "").substring(5).length > 4) {
                id = log[0].split("Username: ")[1].split("#")[1].replace("(", "").replace(")", "").replace("ID:", "").replace("Id:", "").replace("id:", "").replace(/\s/g,'').substring(4)

            } else if (log[1].length > 4 && log[1].includes("ID") || log[1].includes("Id") || log[1].includes("id") || log[1].includes("(")) {
                id = log[1].replace("(", "").replace(")", "").replace("ID:", "").replace("Id:", "").replace("id:", "").replace(/\s/g,'')

            } else if (log[2].length > 4 && log[2].includes("ID") || log[2].includes("Id") || log[2].includes("id") || log[2].includes("(")) {
                id = log[2].replace("(", "").replace(")", "").replace("ID:", "").replace("Id:", "").replace("id:", "").replace(/\s/g,'')
            }
            //console.log(id)

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
            Moderation.addLogLegacy(x, datetime, msg['id'], username, id, staff, staffId, details, action)
        })
    })
    .catch(console.error)
})

client.login(config.token)