// Description:
//   Refreshes the sources of the bot and restarts it.
//
// Commands:
//   hubot refresh - re-deploy the bot with the latest sources

const makeExec = require('./../lib/exec-promise')
const appDir = `${__dirname}/..`

module.exports = robot => {
  robot.respond(/refresh/i, res => {
    res.reply('Re-deploying myself...')

    const exec = makeExec(res.reply.bind(res))

    exec(`cd ${appDir}`)
      .then(() => exec('git checkout master'))
      .then(() => exec('git pull'))
      .then(() => exec('npm i'))
      .then(() => exec('supervisorctl restart clarobot'))
  })
}
