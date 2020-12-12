const Discord = require('discord.js')
const client = new Discord.Client()
require('dotenv').config()
const db = require('quick.db')
const canvacord = require('canvacord')
const { Rank } = require('canvacord')

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

    if(message.content.startsWith(`${prefix}rank`)) {
        const member = message.mentions.users.first() || message.author;
        var level = db.get(`guild_${message.guild.id}_level_${member.id}`) || 0
        // level = level.toString()
        let xp = db.get(`guild_${message.guild.id}_xp_${member.id}`) || 0
        var xpNeeded = level * 500 + 500
        let every = db
            .all()
            .filter(i => i.ID.startsWith(`guild_${message.guild.id}_xptotal_`))
            .sort((a, b) => b.data - a.data)

        var rank = every.map(x => x.ID).indexOf(`guild_${message.guild.id}_xptotal_${member.id}`) + 1
        // rank = rank.toString() 
        var image = new canvacord.Rank()
            .setUsername(member.username)
            .setDiscriminator(member.discriminator)
            .setStatus(member.presence.status)
            .setCurrentXP(xp)
            .setRequiredXP(xpNeeded)
            .setLevel(level)
            .setRank(rank)
            .setAvatar(member.displayAvatarURL({ format: 'png' }))
            .setRankColor('white')

            image.build().then(data => {
                const rankImage = new Discord.MessageAttachment(data, 'Rank.png')
                message.channel.send(rankImage)
            })
    }
    if(message.content.startsWith(`${prefix}setprefix`)) {
        let newPrefix = args[0]
        if(message.member.hasPermission('ADMINISTRATOR')) {
            if(!message.member.id === message.guild.ownerID) {
                return message.channel.send('You Do not have permission to change prefix.')
            }
        }
        if(!args[0]) return message.channel.send(`You need to provide a prefix to set. \n **Example:** setprefix <prefix>`)
        if(args[1]) return message.channel.send(`\`${args.slice(0).join(' ')}\` cannot be set as a prefix \n\
Reason: **A Prefix Cannot have spaces!**`)
        if(args[0].length > 3) return message.channel.send(`\`${args.slice(0).join(' ')}\` cannot be set as a prefix \n\
Reason: **A prefix cannot be of more than 3 letters!**`)


        db.set(`prefix_${message.guild.id}`, args[0])   
        const embed = new Discord.MessageEmbed()
        .setDescription(`Successfully set Prefix to \`${args[0]}\``)
        .setColor('BLUE')

        message.channel.send(embed)
    }
        


    if(message.content.startsWith(`${prefix}help`)) {
        const embed = new Discord.MessageEmbed()
        .setTitle(`LevelingBot Help Menu`)
        .addField(`help`, `Brings Up the Help Menu`)
        .addField(`rank`, `Check Your Rank`)
        .addField(`setprefix`, `Set prefix for this bot`)
        .setColor('BLUE')
        
        return message.channel.send(embed)
    }
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