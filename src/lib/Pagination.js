const Discord = require('discord.js')
class PaginationManager {
  /**
   * @param {Array} options.controlKeys - control Keys (Array Of Emoji) ['◀️', '▶️', '❌']
   * @param {Number} options.timeout - EmojiCollector TimeOut
   * @param {String} options.pageText - footer text if none, unset
   */
  constructor (options = {}) {
    this.index = 0
    this.embeds = []
    this.users = [] // User ID
    if (options.controlKeys) this.controlKeys = options.controlKeys
    else this.controlKeys = ['◀️', '▶️', '❌']
    if (options.timeout) this.timeout = options.timeout
    else this.timeout = 15000
    this._pageText = options.pageText || '%CURRENT% / %ALL%'
  }

  /**
   * @description - Add Embed Page
   * @param {Discord.MessageEmbed} embed - Discord Embed
   * @returns {PaginationEmbed} - this class
   */
  addEmbed (embed) {
    if (!embed) return new Error('embed is not provided')
    this.embeds.push(embed)
    return this
  }

  /**
   * @description - Add User for control page
   * @param {String} id - User ID for control this page
   * @returns {PaginationEmbed} - this class
   */
  addUser (id) {
    if (!id) return new Error('User ID is not provided')
    this.users.push(id)
    return this
  }

  /**
   * @description - get page of embed and set footer
   */
  getEmbed () {
    const embed = this.embeds[this.index]
    if (!this._pageText) return embed
    else return embed.setFooter(this.pageText)
  }

  /**
   * @description - Send Pages to Textchannel
   * @param {Discord.TextChannel} channel - Textchannel to send it.
   * @param {String} message - Message With Embed
   */
  async send (channel, message) {
    if (this.embeds.length === 0) return new Error('The number of Embeds must be at least one.')
    const params = []
    if (message) params.push(message)
    params.push(this.getEmbed())
    const m = await channel.send(...params)
    await this._massReact(m, this.controlKeys)
    await this._handleControlKeys(m)
  }

  /**
   * @description - Edit Message
   * @param {Discord.TextChannel} channel - Textchannel to send it.
   * @param {String} message - Message With Embed
   */
  async edit (m, message) {
    if (this.embeds.length === 0) return new Error('The number of Embeds must be at least one.')
    const params = []
    if (message) params.push(message)
    params.push(this.getEmbed())
    await m.edit(...params)
    await this._massReact(m, this.controlKeys)
    await this._handleControlKeys(m)
  }

  async _handleControlKeys (m) {
    const filter = (reaction, user) => {
      const flag = this.controlKeys.includes(reaction.emoji.name) && this.users.includes(user.id)
      if (flag) reaction.users.remove(user)
      return flag
    }
    const reaction = await m.awaitReactions(filter, { max: this.users.length, timeout: this.timeout, errors: ['time'] })
    switch (this.controlKeys.findIndex(e => e === reaction.first().emoji.name)) {
      case 0:
        this.index--
        if (this.index < 0) this.index = this.embeds.length - 1
        await m.edit(this.getEmbed())
        await this._handleControlKeys(m)
        break
      case 1:
        this.index++
        if (this.index >= this.embeds.length) this.index = 0
        await m.edit(this.getEmbed())
        await this._handleControlKeys(m)
        break
      default:
        m.reactions.removeAll()
    }
  }

  get pageText () {
    if (typeof this._pageText === 'string') return this._pageText.replace('%ALL%', this.embeds.length).replace('%CURRENT%', this.index + 1)
    else return null
  }

  /**
   * @description - React Array of emojis
   * @param {Discord.Message} m - Message to React Emojis
   * @param {Array} array - Emojis Array
   */
  async _massReact (m, array) {
    for (const item of array) {
      await m.react(item)
    }
  }
}

module.exports = PaginationManager
