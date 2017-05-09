module.exports = (robot) ->
  robot.listen(
    (message) ->
       message.user.name is "LaurentGruber"
    (response) ->
       response.reply "Hey Laurent, don't forget to give Thomas the tram ticket ;-)"
  )
