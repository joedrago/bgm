BGMGameScene = require './BGMGameScene'
BGMHudScene = require './BGMHudScene'

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
    ]

  game = new Phaser.Game(config)


window.addEventListener('load', (e) ->
    init()
, false)
