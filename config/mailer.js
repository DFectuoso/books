module.exports = {
  active: process.env.EMAIL_SEND === 'true',
  mailchimpKey: process.env.EMAIL_KEY,
  sender: {
    email: 'marble-seeds@latteware.io',
    name: 'Marble seeds app'
  }
}
