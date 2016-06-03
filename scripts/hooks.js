// Description:
//   Listens to github webhooks and emits events when appropriate
//
// Configuration:
//   GITHUB_WEBHOOKS_PORT
//   GITHUB_WEBHOOKS_SECRET
//
// Notes:
//   This script is roughly based on the official documentation (see
//   https://hubot.github.com/docs/scripting/#events) but doesn't use
//   the default router (express) as there's no real way to configure
//   its middleware and therefore to sign raw request bodies.

const util = require('util')
const githubhook = require('githubhook')

const logRoom = 'clarobot-logs'
const github = githubhook({
  path: '/payload',
  secret: process.env.GITHUB_WEBHOOKS_SECRET,
  port: process.env.GITHUB_WEBHOOKS_PORT
})

github.listen()

module.exports = robot => {
  github.on('*', (event, repo, ref, data) => {
    robot.emit('gh-webhook', data)
    delete data.request // avoid inspecting node request object
    robot.messageRoom(logRoom, util.inspect(data, { depth: 4 }))
  })
}
