const { format } = require('date-fns')
const { v4: uuid } = require('uuid')
const fs = require('fs')
const fsPromises = require('fs').promises
const path = require('path')

// log messages to a file with a timestamp, id, and message
logEvents = async (message, logFileName) => {
  const dateTimestamp = `${format(new Date(), 'yyyyMMdd\tHH:mm:ss')}`
  const logItem = `${dateTimestamp}\t${uuid()}\t${message}\n`

  try {
    if (!fs.existsSync(path.join(__dirname, '../logs'))) {
      await fsPromises.mkdir(path.join(__dirname, '../logs'))
    }
    await fsPromises.appendFile(path.join(__dirname, `../logs/${logFileName}`), logItem)
  } catch (error) {
    console.log(error)
  }
}

// logger middleware
const logger = (req, res, next) => {
  logEvents(`${req.method}\t${req.url}\t${req.headers.origin}`, 'reqLog.log')
  //TODO only log requests that end in errors
  console.log(`${req.method} ${req.path} ${req.headers.origin}`)
  next()
}

module.exports = {logEvents, logger}