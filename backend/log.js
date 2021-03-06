const Logger = require('bunyan')

module.exports = new Logger({
  name: 'prisonStaffHub',
  streams: [
    {
      stream: process.stdout,
      level: process.env.LOG_LEVEL || 'info',
    },
  ],
})
