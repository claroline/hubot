module.exports = (robot) ->
  robot.hear /bonjour|salut|yop/i, (msg) ->
    messages = [
      "Bonjour!",
      "Salut",
      "Bien le bonjour",
      "Salutations"
    ]
    msg.reply msg.random messages
