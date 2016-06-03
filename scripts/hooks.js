// Description:
//   Listens to github webhooks and emits events when appropriate.
//
//   Event names are made of the following parts separated by semi-colons:
//     - repository or organization, depending on the type of event
//     - action (the event name in the github API)
//     - reference (if applicable)
//
//   Examples:
//     - claroline/Distribution:push:refs/heads/master
//     - claroline/Distribution:issue_comment
//     - claroline:membership
//
//  The data passed along with the event is the raw JSON response returned
//  by the github API.
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

const githubhook = require('./../lib/githubhook')

const logRoom = 'claroline/clarobot-logs'

if (!process.env.GITHUB_WEBHOOKS_SECRET) {
  throw new Error('Environment variable "GITHUB_WEBHOOKS_SECRET" is not set')
}

if (!process.env.GITHUB_WEBHOOKS_PORT) {
  throw new Error('Environment variable "GITHUB_WEBHOOKS_PORT" is not set')
}

module.exports = robot => {
  const github = githubhook({
    path: '/payload',
    secret: process.env.GITHUB_WEBHOOKS_SECRET,
    port: process.env.GITHUB_WEBHOOKS_PORT,
    handler: (event, data) => {
      // no need to dispatch the node request object (set by githubhook)
      delete data.request

      const prefix = data.repository ?
        data.repository.full_name :
        data.organization
      const parts = [prefix, event]

      if (data.ref) {
        parts.push(data.ref)
      }

      const name = parts.join(':')
      robot.emit(name, data)
      robot.messageRoom(
        logRoom,
        `Received "${event}" webhook from ${repo}, emitted event "${name}"`
      )
    }
  })

  github.listen()
}

