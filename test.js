const D = require('discord.js')
const P = require('./index')
const c = new D.Client()

c.on('message', async (m) => {
  if (m.content === 'test') {
    const pagination = new P.Pagination({ pageText: '페이지 %CURRENT% / %ALL%' })
    pagination.addEmbed(new D.MessageEmbed().setColor('#FFBABA').setTitle('테스트 1'))
    pagination.addEmbed(new D.MessageEmbed().setColor('#FFBABA').setTitle('테스트 2'))
    pagination.addEmbed(new D.MessageEmbed().setColor('#FFBABA').setTitle('테스트 3'))
    pagination.addUser(m.author.id)
    await pagination.send(m.channel)
  }
})

c.on('debug', async (m) => {
  console.log(m)
})

c.login('')
