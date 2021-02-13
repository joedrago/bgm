BGMGameScene = require './BGMGameScene'
BGMHudScene = require './BGMHudScene'
BGMMenuScene = require './BGMMenuScene'

init = ->
  console.log "Bad Guy Minesweeper: init()"

  config =
    type: Phaser.AUTO
    width: document.documentElement.clientWidth
    height: document.documentElement.clientHeight
    backgroundColor: '#000000' # '#2d2d2d'
    parent: 'screen'
    input:
      activePointers: 2
    scene: [
      BGMGameScene
      BGMHudScene
      BGMMenuScene
    ]

  game = new Phaser.Game(config)


window.addEventListener('load', (e) ->
  fonts = [
    {
      name: 'Eagle Lake'
      url:  'fonts/eaglelake.ttf'
    }
  ]
  promises = []
  for font in fonts
    do (font) ->
      promises.push new Promise (resolve, reject) ->
        newFont = new FontFace(font.name, "url(#{font.url})")
        newFont.load().then (loaded) ->
          if loaded
            document.fonts.add(loaded)
            console.log "Loaded Font: #{font.name}"
            resolve()
          else
            reject()

    Promise.all(promises).then((loaded) ->
      init()
    ).catch (error) ->
      console.log "Error: ", error

, false)
