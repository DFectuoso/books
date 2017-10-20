'use strict'
const mandrill = require('mandrill-api/mandrill')
const nunjucks = require('nunjucks')
const inlineCss = require('inline-css')
const path = require('path')

const config = require('config/mailer')

const render = function (template, data) {
  return new Promise(function (resolve, reject) {
    nunjucks.render(template, data, function (err, res) {
      if (err) { return reject(err) }

      resolve(res)
    })
  })
}

const inline = function (html) {
  // Load a css file
  return inlineCss(html, {url: 'file://'})
}

if (!config.active) {
  console.warn('Emails will not be sent!!')
}

const client = new mandrill.Mandrill(config.mailchimpKey)

client.sendEmail = function (conf) {
  var q = new Promise(function (resolve, reject) {
    var message = {
      from_email: conf.sender.email,
      from_name: conf.sender.name
    }

    if (!config.active) {
      console.log(`Email not send, body => \n ${conf.body} \n`)
      return resolve()
    }

    message.html = conf.body
    message.subject = conf.title
    message.to = [{
      email: conf.recipient.email,
      name: conf.recipient.name
    }]

    if (!config.active) {
      console.log(`Email not send, body => \n ${conf.body} \n`)
      return resolve()
    }

    client.messages.send({
      'message': message,
      'async': false,
      'ip_pool': 'Main pool'
    }, function (result) {
      resolve(result)
    }, function (err) {
      reject(err)
    })
  })

  return q
}

module.exports = class Mail {
  constructor (template) {
    this.template = template
  }

  async format (data) {
    const template = path.join('./api/email-templates', this.template + '.html')
    const body = await render(template, data)
    this.body = await inline(body)
  }

  async send (options) {
    options = options || {}
    if (!options.sender) { options.sender = config.sender }

    await client.sendEmail({
      body: this.body,
      title: options.title,
      recipient: options.recipient,
      sender: options.sender
    })
  }
}
