// cors options to allow requests from the front end
const { options } = require('../routes/root')
const allowedOrigins = require('./allowedOrigins')

// allow origins from the allowedOrigins array and non provided origins (postman)
const corsOptions = {
  origin: (origin, callback) => {
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      callback(null, true)
    } else {
        callback(new Error('Not allowed by CORS'))
    }
  },
    // set the access control allow credentials header to true
    credentials: true,
    optionsSuccessStatus: 200
}

module.exports = corsOptions
