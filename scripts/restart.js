// Description:
//   Refreshes the sources of the bot and restarts it.
//
// Commands:
//   hubot refresh - re-deploy the bot with the latest sources

const makeExec = require('./../lib/exec-promise')
const exec = makeExec(console.log.bind(console))
const appDir = `${__dirname}/..`

module.exports = robot => {
  robot.respond(/refresh/i, res => {
    res.reply('Re-deploying myself...')
    exec(`cd ${appDir}`)
      .then(() => exec('git checkout master'))
      .then(() => exec('git pull'))
      .then(() => exec('npm i'))
      .then(() => exec('supervisorctl restart clarobot'))
  })
}
