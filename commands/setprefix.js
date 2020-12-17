const { MessageEmbed } = require('discord.js')

module.exports = {
    name: 'setprefix',
    description: 'Sets a new prefix for this bot!',
    usage: 'setprefix [prefix]',
    run: async (client, message, args) => {

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
        const embed = new MessageEmbed()
            .setDescription(`Successfully set Prefix to \`${args[0]}\``)
            .setColor('BLUE')

        message.channel.send(embed)

    }
}