module.exports = (robot) ->
  robot.hear /bonjour|salut/i, (msg) ->
    messages = [
      "Bonjour!",
      "Salut"
    ]
    msg.reply msg.random messages
