const crons = require('./')
const { each } = require('lodash')

each(crons, cron => cron.schedule())
