const Discord = require('discord.js')
const client = new Discord.Client()
require('dotenv').config()
const db = require('quick.db')
const fs = require('fs')

client.commands = new Discord.Collection()

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'))
for (const file of commandFiles) {
    const commands = require(`./commands/${file}`)
    client.commands.set(commands.name, commands)

    console.log(`Successfully loaded command ${commands.name}`)
}

client.once('ready', () => {
    console.log(`Logged in as ${client.user.username}`)
})

client.on('message', async message => {
    let prefix = await db.get(`prefix_${message.guild.id}`)
    if(prefix === null) prefix = '?';
    if(!message.guild) return;
    if(message.author.bot) return;
    xp(message)
    const args = message.content.slice(prefix.length).trim().split(/ +/g)
    const command = args.shift().toLowerCase()

    const cmd = client.commands.get(command)
    if(cmd) cmd.run(client, message, args)

})

async function xp(message) {
    let prefix = await db.get(`prefix_${message.guild.id}`)
    if(prefix === null) prefix = '?'
    if(message.content.startsWith(prefix)) return;
    const randomNumber = Math.floor(Math.random() * 10) + 15
    db.add(`guild_${message.guild.id}_xp_${message.author.id}`, randomNumber)
    db.add(`guild_${message.guild.id}_xptotal_${message.guild.id}`, randomNumber)
    var level = db.get(`guild_${message.guild.id}_level_${message.author.id}`) || 1
    var xp = db.get(`guild_${message.guild.id}_xp_${message.author.id}`)
    var xpNeeded = level * 500
    if(xpNeeded < xp) {
        var newLevel = db.add(`guild_${message.guild.id}_level_${message.author.id}`, 1)
        db.subtract(`guild_${message.guild.id}_xp_${message.author.id}`, xpNeeded)
        message.channel.send(`Congrats ${message.author}, you have levelled up to Level ${newLevel}`)
    }
}

client.login(process.env.token)