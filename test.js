const Discord = require('discord.js')
const Pagenation = require('./src/lib/index')
const Client = new Discord.Client()

Client.on('message', async (m) => {
  if (m.content === 'test') {
    const pagination = new Pagenation.Pagination({ pageText: '페이지 %CURRENT% / %ALL%' })
    pagination.addEmbed(new Discord.MessageEmbed().setColor('#FFBABA').setTitle('테스트 1'))
    pagination.addEmbed(new Discord.MessageEmbed().setColor('#FFBABA').setTitle('테스트 2'))
    pagination.addEmbed(new Discord.MessageEmbed().setColor('#FFBABA').setTitle('테스트 3'))
    pagination.addUser(m.author.id)
    await pagination.send(m.channel)
  }
})

Client.login('')
