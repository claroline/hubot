// Description:
//   Refreshes the sources of the bot and restarts it.
//
// Commands:
//   hubot self-deploy - re-deploy the bot with the latest sources

const makeExec = require('./../lib/exec-promise')
const appDir = `${__dirname}/..`

module.exports = robot => {
  robot.respond(/self\-deploy( (.+))?/, res => {
    const branch = res.match[2] || 'master'
    const exec = makeExec(res.reply.bind(res))

    res.reply(`Re-deploying myself from ${branch} branch...`)

    exec(`cd ${appDir}`)
      .then(() => exec('git fetch'))
      .then(() => exec(`git checkout ${branch}`))
      .then(() => exec('npm install'))
      .then(() => exec('echo "Going to restart now..."'))
      .then(() => exec('sleep 1'))
      .then(() => exec('supervisorctl restart clarobot'))
      .catch(() => res.reply('Self deployment failed'))
  })
}
