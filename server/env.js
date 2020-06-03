// set environment variables based on PROFILE environment variable
// defaults to dev if not found
const dotenv = require('dotenv')

const envDetected = process.env.PROFILE
console.log(`Environment: ${envDetected}`)

if (envDetected) {
  dotenv.config({ path: `./environment/${envDetected.toLowerCase()}.env` })
} else {
  dotenv.config({ path: './environment/dev.env' })
}
