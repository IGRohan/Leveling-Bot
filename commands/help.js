const { MessageEmbed } = require('discord.js')

module.exports = {
    name: 'help',
    description: 'Shows you the list of commands',
    usage: 'help <commandName>',
    run: async (client, message, args) => {

        const embed = new MessageEmbed()
            .setTitle(`LevelingBot Help Menu`)
            .addField(`help`, `Brings Up the Help Menu`)
            .addField(`rank`, `Check Your Rank`)
            .addField(`setprefix`, `Set prefix for this bot`)
            .setColor('BLUE')

        message.channel.send(embed)

    }
}