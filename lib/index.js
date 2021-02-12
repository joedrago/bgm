(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
var BGMGameScene, TouchInterpreter;

TouchInterpreter = require('./TouchInterpreter');

BGMGameScene = class BGMGameScene extends Phaser.Scene {
  constructor() {
    super();
    Phaser.Scene.call(this, {
      key: 'game',
      active: true
    });
    this.ms = require('./MineSweeper');
    this.touch = new TouchInterpreter();
  }

  preload() {
    this.load.image('blank', 'images/blank.gif');
    this.load.image('flag', 'images/bombflagged.gif');
    this.load.image('bomb', 'images/bomb0.gif');
    this.load.image('bombdeath', 'images/bombdeath.gif');
    this.load.image('bombrevealed', 'images/bombrevealed.gif');
    this.load.image('bombmisflagged', 'images/bombmisflagged.gif');
    this.load.image('shadow0', 'images/shadow0.gif');
    this.load.image('shadow1', 'images/shadow1.gif');
    this.load.image('shadow2', 'images/shadow2.gif');
    this.load.image('shadow3', 'images/shadow3.gif');
    this.load.image('shadow4', 'images/shadow4.gif');
    this.load.image('shadow5', 'images/shadow5.gif');
    this.load.image('shadow6', 'images/shadow6.gif');
    this.load.image('shadow7', 'images/shadow7.gif');
    this.load.image('shadow8', 'images/shadow8.gif');
    this.load.image('bomb0', 'images/bomb0.gif');
    this.load.image('bomb1', 'images/bomb1.gif');
    this.load.image('bomb2', 'images/bomb2.gif');
    this.load.image('bomb3', 'images/bomb3.gif');
    this.load.image('bomb4', 'images/bomb4.gif');
    this.load.image('bomb5', 'images/bomb5.gif');
    this.load.image('bomb6', 'images/bomb6.gif');
    this.load.image('bomb7', 'images/bomb7.gif');
    this.load.image('bomb8', 'images/bomb8.gif');
    this.load.image('open0', 'images/open0.gif');
    this.load.image('open1', 'images/open1.gif');
    this.load.image('open2', 'images/open2.gif');
    this.load.image('open3', 'images/open3.gif');
    this.load.image('open4', 'images/open4.gif');
    this.load.image('open5', 'images/open5.gif');
    this.load.image('open6', 'images/open6.gif');
    this.load.image('open7', 'images/open7.gif');
    return this.load.image('open8', 'images/open8.gif');
  }

  create() {
    var split;
    split = Math.floor(this.cameras.main.width * 0.9);
    this.cameras.main.setViewport(0, 0, split, this.cameras.main.height);
    this.ms.addEventListener((ev, args) => {
      switch (ev) {
        case 'new':
          if ((this.ms.width !== this.gridCols) || (this.ms.height !== this.gridRows)) {
            return this.recreateDisplayList();
          }
          break;
        case 'cell':
          return this.grid[args[0]][args[1]].setTexture(args[2]);
        case 'life':
          return this.scene.get('hud').debugText.text = `Are you suuuuuuure? (${args[0]})`;
      }
    });
    this.recreateDisplayList();
    this.ms.updateAll();
    return this.touch.create(this, this.cameras.main, 0, 0, split, this.cameras.main.height);
  }

  update() {}

  recreateDisplayList() {
    var i, j, k, l, ref, ref1;
    console.log("recreateDisplayList()");
    this.add.displayList.removeAll();
    this.gridCols = this.ms.width;
    this.gridRows = this.ms.height;
    this.grid = new Array(this.gridCols);
    for (i = k = 0, ref = this.gridCols; (0 <= ref ? k < ref : k > ref); i = 0 <= ref ? ++k : --k) {
      this.grid[i] = new Array(this.gridRows);
      for (j = l = 0, ref1 = this.gridRows; (0 <= ref1 ? l < ref1 : l > ref1); j = 0 <= ref1 ? ++l : --l) {
        this.grid[i][j] = this.add.image(i * 16, j * 16, 'blank');
        this.grid[i][j].setOrigin(0, 0);
      }
    }
    return this.resetView();
  }

  centerGrid() {
    var totalH, totalW;
    totalW = this.gridCols * 16;
    totalH = this.gridRows * 16;
    this.cameras.main.scrollX = (totalW - this.cameras.main.width) / 2;
    return this.cameras.main.scrollY = (totalH - this.cameras.main.height) / 2;
  }

  resetView() {
    this.cameras.main.zoom = 1;
    return this.centerGrid();
  }

  setMode(mode) {
    this.mode = mode;
    // console.log "Game Mode: #{@mode}"
    if (this.ms.gameover) {
      return this.ms.newGame();
    }
  }

  setMagnifyingGlass(x, y, alpha) {
    return this.scene.get('hud').setMagnifyingGlass(x, y, alpha);
  }

  rmb(worldX, worldY) {
    return this.scene.get('hud').toggleMode();
  }

  tap(worldX, worldY) {
    var x, y;
    this.scene.get('hud').debugText.text = "";
    if (this.ms.gameover) {
      console.log("game is over, doing nothing");
      return;
    }
    if ((worldX >= 0) && (worldX < (this.gridCols * 16)) && (worldY >= 0) && (worldY < (this.gridRows * 16))) {
      x = Math.floor(worldX / 16);
      y = Math.floor(worldY / 16);
      if (this.mode === 'flag') {
        this.ms.flag(x, y);
      } else {
        this.ms.poke(x, y);
      }
      return this.ms.updateAll();
    }
  }

};

module.exports = BGMGameScene;


},{"./MineSweeper":3,"./TouchInterpreter":4}],2:[function(require,module,exports){
var BGMHudScene;

BGMHudScene = class BGMHudScene extends Phaser.Scene {
  constructor() {
    super();
    Phaser.Scene.call(this, {
      key: 'hud',
      active: true
    });
  }

  preload() {
    this.load.image('glass', 'images/glass.gif');
    this.load.image('btn_bomb', 'images/btn_bomb.png');
    return this.load.image('btn_flag', 'images/btn_flag.png');
  }

  create() {
    this.panelX = Math.floor(this.cameras.main.width * 0.9);
    this.panelY = 0;
    this.panelW = this.cameras.main.width - this.panelX;
    this.panelH = this.cameras.main.height;
    this.panelBackground = this.add.graphics();
    this.panelBackground.fillStyle(0x333333, 1);
    this.panelBackground.fillRect(this.panelX, this.panelY, this.panelW, this.panelH);
    this.panelBackground.lineStyle(1, 0x000000, 1.0);
    this.panelBackground.strokeRect(this.panelX, this.panelY, this.panelW, this.panelH);
    this.button = this.add.image(this.panelX + (this.panelW / 2), this.panelY + (this.panelH / 2), 'btn_bomb');
    this.button.setDisplaySize(this.panelW * 0.8, this.panelW * 0.8);
    this.button.setInteractive();
    this.button.on('pointerdown', () => {
      return this.toggleMode();
    });
    this.toggleMode();
    this.debugText = this.add.text(0, 0, '');
    this.glass = this.add.image(50, 50, 'glass');
    this.glass.setOrigin(0.6, 0.3); // roughly the middle of the magnifying glass
    return this.glass.alpha = 0;
  }

  toggleMode() {
    if (this.mode === 'bomb') {
      this.mode = 'flag';
    } else {
      this.mode = 'bomb';
    }
    this.button.setTexture(`btn_${this.mode}`);
    return this.scene.get('game').setMode(this.mode);
  }

  update() {}

  setMagnifyingGlass(x, y, alpha) {
    this.glass.x = x;
    this.glass.y = y;
    return this.glass.alpha = alpha;
  }

};

module.exports = BGMHudScene;


},{}],3:[function(require,module,exports){
var MineSweeper;

MineSweeper = class MineSweeper {
  constructor() {
    this.listeners = [];
    this.newGame();
  }

  addEventListener(evl) {
    return this.listeners.push(evl);
  }

  rand(x) {
    return Math.floor(Math.bgmrandom() * x);
  }

  neighbors(i, j, unflaggedOnly) {
    var n, x, x1, x2, y, y1, y2;
    n = 0;
    x1 = Math.max(i - 1, 0);
    x2 = Math.min(this.width - 1, i + 1);
    y1 = Math.max(j - 1, 0);
    y2 = Math.min(this.height - 1, j + 1);
    x = x1;
    while (x <= x2) {
      y = y1;
      while (y <= y2) {
        if (x !== i || y !== j) {
          if (!unflaggedOnly || (this.visible[x + y * this.width] === 0)) {
            if (this.bomb[x + y * this.width] === 1) {
              ++n;
            }
          }
        }
        ++y;
      }
      ++x;
    }
    return n;
  }

  hasVisibleZeroNeighbor(i, j) {
    var n, x, x1, x2, y, y1, y2;
    x1 = Math.max(i - 1, 0);
    x2 = Math.min(this.width - 1, i + 1);
    y1 = Math.max(j - 1, 0);
    y2 = Math.min(this.height - 1, j + 1);
    x = x1;
    while (x <= x2) {
      y = y1;
      while (y <= y2) {
        if (x !== i || y !== j) {
          if (this.visible[x + y * this.width] !== 0) {
            n = this.neighbors(x, y, false);
            if (n === 0) {
              return true;
            }
          }
        }
        ++y;
      }
      ++x;
    }
    return false;
  }

  loseLife() {
    var evl, k, len, ref;
    this.lives -= 1;
    if (this.lives > 0) {
      ref = this.listeners;
      for (k = 0, len = ref.length; k < len; k++) {
        evl = ref[k];
        evl('life', [this.lives]);
      }
      return false;
    }
    return true;
  }

  updateCell(i, j, reveal) {
    var evl, image, index, isBomb, isVisible, k, len, n, ref, unflagged;
    image = 'blank';
    index = i + j * this.width;
    isBomb = this.bomb[index];
    isVisible = this.visible[index];
    n = this.neighbors(i, j, false);
    if (isVisible === 0) {
      if (reveal) {
        if (isBomb === 1) {
          image = 'bombrevealed';
        } else {
          image = 'shadow' + n;
        }
      } else {
        image = 'blank';
      }
    } else {
      if (isBomb === 1) {
        if (isVisible === 2) {
          image = 'bombdeath';
        } else {
          unflagged = this.neighbors(i, j, true);
          if (unflagged === 0) {
            n = 0;
          }
          image = 'bomb' + n;
        }
      } else {
        if (isVisible === 2) {
          image = 'bombmisflagged';
        } else {
          image = 'open' + n;
        }
      }
    }
    ref = this.listeners;
    for (k = 0, len = ref.length; k < len; k++) {
      evl = ref[k];
      evl('cell', [i, j, image]);
    }
  }

  updateAll(reveal = false) {
    var i, j, keepGoing;
    if (this.listeners.length === 0) {
      return;
    }
    keepGoing = true;
    while (keepGoing) {
      keepGoing = false;
      j = 0;
      while (j < this.height) {
        i = 0;
        while (i < this.width) {
          if ((this.bomb[i + j * this.width] === 0) && this.hasVisibleZeroNeighbor(i, j)) {
            if (this.poke(i, j)) {
              keepGoing = true;
            }
          }
          ++i;
        }
        ++j;
      }
    }
    j = 0;
    while (j < this.height) {
      i = 0;
      while (i < this.width) {
        this.updateCell(i, j, reveal);
        ++i;
      }
      ++j;
    }
  }

  flag(i, j) {
    var index;
    index = i + j * this.width;
    if (this.visible[index] === 0) {
      if (this.bomb[index] === 1) {
        //bomb[index] = 0;
        //poke(i, j);
        this.visible[index] = 1;
      } else {
        // Bad flag; lose the game
        if (this.loseLife()) {
          this.visible[index] = 2;
          this.updateAll(true);
          this.gameover = true;
          return;
        }
      }
    }
  }

  // $('#winlose').html 'BAD FLAG! You lose!'
  poke(i, j) {
    var index, ret;
    ret = false;
    index = i + j * this.width;
    if (this.visible[index] === 0) {
      if (this.bomb[index] === 1) {
        // Bad spot; lose the game
        if (this.loseLife()) {
          this.visible[index] = 2;
          this.gameover = true;
          // $('#winlose').html 'BOMB! You lose!'
          this.updateAll(true);
          return false;
        } else {
          return false;
        }
      }
      this.visible[index] = 1;
      ret = true;
    }
    return ret;
  }

  firstClickIsFree() {
    var cellCount, i, index, j, n, startIndex;
    cellCount = this.width * this.height;
    startIndex = this.rand(cellCount);
    index = startIndex;
    while (true) {
      i = Math.floor(index % this.width);
      j = Math.floor(index / this.width);
      n = this.neighbors(i, j, false);
      if (this.bomb[index] === 0 && n === 0) {
        this.poke(i, j);
        return;
      }
      index = (index + 1) % cellCount;
      if (index === startIndex) {
        break;
      }
    }
    while (true) {
      i = Math.floor(index % this.width);
      j = Math.floor(index / this.width);
      n = neighbors(i, j, false);
      if (this.bomb[index] === 0) {
        this.poke(i, j);
        return;
      }
      index = (index + 1) % cellCount;
      if (index === startIndex) {
        break;
      }
    }
  }

  newGame(width = 30, height = 30, mineCount = 0, seed = String(Math.floor(Math.random() * 1000000))) {
    var MINE_DENSITY, cellCount, evl, i, indices, j, k, len, m, ref;
    this.width = width;
    this.height = height;
    this.mineCount = mineCount;
    this.seed = seed;
    Math.seedbgmrandom(this.seed);
    this.lives = 3;
    cellCount = this.width * this.height;
    if (this.mineCount === 0) {
      MINE_DENSITY = 0.16;
      this.mineCount = Math.floor(cellCount * MINE_DENSITY);
    }
    this.gameover = false;
    // Create fresh arrays
    this.bomb = new Array(cellCount).fill(0);
    this.visible = new Array(cellCount).fill(0);
    // Drop in the mines randomly
    indices = new Array(cellCount);
    indices[0] = 0;
    i = 1;
    while (i < cellCount) {
      j = this.rand(i);
      indices[i] = indices[j];
      indices[j] = i;
      ++i;
    }
    m = this.mineCount;
    if (m >= cellCount) {
      m = cellCount - 1;
    }
    i = 0;
    while (i < m) {
      this.bomb[indices[i]] = 1;
      ++i;
    }
    this.firstClickIsFree();
    ref = this.listeners;
    for (k = 0, len = ref.length; k < len; k++) {
      evl = ref[k];
      evl('new', []);
    }
    this.updateAll();
  }

};

module.exports = new MineSweeper(); // Singleton


},{}],4:[function(require,module,exports){
var DOUBLE_CLICK_MS, ENGAGE_DRAG_DISTANCE, TouchInterpreter;

ENGAGE_DRAG_DISTANCE = 10;

DOUBLE_CLICK_MS = 400;

TouchInterpreter = class TouchInterpreter {
  constructor() {
    this.tracked = [];
    this.dragX = 0;
    this.dragY = 0;
    this.dragging = false;
    this.doubleClickTime = null;
    this.pinchAnchor = null;
    this.pinchAnchorWorld = null;
  }

  create(scene, camera, x, y, w, h) {
    this.scene = scene;
    this.camera = camera;
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.camera.zoom = 1;
    this.scene.input.addPointer(1);
    this.scene.input.mouse.disableContextMenu();
    this.scene.input.on('pointerdown', (pointer) => {
      var clickDelta, now, worldPos;
      console.log("pointerdown");
      if (pointer.rightButtonDown()) {
        worldPos = this.camera.getWorldPoint(pointer.position.x, pointer.position.y);
        this.scene.rmb(worldPos.x, worldPos.y);
        return;
      }
      if (pointer.position.x > (this.x + this.w)) {
        return;
      }
      if (this.tracked.length === 0) {
        this.dragging = false;
      }
      // console.log "new pointer #{pointer.id}"
      this.tracked.push({
        id: pointer.id,
        pos: pointer.position.clone()
      });
      if (this.tracked.length === 1) {
        this.setDragPoint();
      }
      if (this.tracked.length === 2) {
        // We just added a second touch spot. Calculate the anchor for pinching now
        this.calcPinchAnchor();
      }
      if (this.tracked.length > 1) {
        this.dragging = true;
        return this.doubleClickTime = null;
      } else if (!this.dragging) {
        now = new Date().getTime();
        if (this.doubleClickTime !== null) {
          // second click
          clickDelta = now - this.doubleClickTime;
          if (clickDelta < DOUBLE_CLICK_MS) {
            this.doubleClickTime = null;
            return;
          }
        }
        // console.log "DOUBLE TAP #{@tracked[0].pos.x} #{@tracked[0].pos.y}"
        return this.doubleClickTime = now;
      }
    });
    this.scene.input.on('pointermove', (pointer) => {
      var currDistance, deltaDistance, dragDistance, dx, dy, i, index, j, newZoom, prevDistance, prevX, prevY, ref;
      prevDistance = 0;
      if (this.tracked.length >= 2) {
        prevDistance = this.calcDistance(this.tracked[0].pos.x, this.tracked[0].pos.y, this.tracked[1].pos.x, this.tracked[1].pos.y);
      }
      if (this.tracked.length === 1) {
        prevX = this.tracked[0].pos.x;
        prevY = this.tracked[0].pos.y;
      }
      index = -1;
      for (i = j = 0, ref = this.tracked.length; (0 <= ref ? j < ref : j > ref); i = 0 <= ref ? ++j : --j) {
        if (this.tracked[i].id === pointer.id) {
          index = i;
          break;
        }
      }
      if (index === -1) {
        return;
      }
      this.tracked[index].pos = pointer.position.clone();
      if (this.tracked.length === 1) {
        // single touch, consider dragging
        dragDistance = this.calcDistance(this.dragX, this.dragY, this.tracked[0].pos.x, this.tracked[0].pos.y);
        if (this.dragging || (dragDistance > ENGAGE_DRAG_DISTANCE)) {
          this.dragging = true;
          if (dragDistance > 0.5) {
            dx = this.tracked[0].pos.x - this.dragX;
            dy = this.tracked[0].pos.y - this.dragY;
            // console.log "single drag: #{dx}, #{dy}"
            this.camera.scrollX -= dx / this.camera.zoom;
            this.camera.scrollY -= dy / this.camera.zoom;
          }
          // console.log "scroll #{@camera.scrollX} #{@camera.zoom} #{@camera.width}"
          this.setDragPoint();
        }
      } else if (this.tracked.length >= 2) {
        // at least two fingers present, check for pinch/zoom
        currDistance = this.calcDistance(this.tracked[0].pos.x, this.tracked[0].pos.y, this.tracked[1].pos.x, this.tracked[1].pos.y);
        deltaDistance = currDistance - prevDistance;
        if (deltaDistance !== 0) {
          newZoom = this.camera.zoom * (1 + (deltaDistance * 4 / this.camera.width));
          this.adjustZoom(newZoom);
        }
      }
    });
    this.scene.input.on('pointerup', (pointer) => {
      var i, index, j, ref, worldPos;
      index = -1;
      for (i = j = 0, ref = this.tracked.length; (0 <= ref ? j < ref : j > ref); i = 0 <= ref ? ++j : --j) {
        if (this.tracked[i].id === pointer.id) {
          index = i;
          break;
        }
      }
      if (index === -1) {
        return;
      }
      if (this.tracked.length === 1) {
        if (!this.dragging) {
          worldPos = this.camera.getWorldPoint(this.tracked[0].pos.x, this.tracked[0].pos.y);
          // console.log "TAP #{worldPos.x} #{worldPos.y} #{@camera.scrollX} #{@camera.scrollY} #{@camera.zoom}"
          this.scene.tap(worldPos.x, worldPos.y);
        }
      }
      this.tracked.splice(index, 1);
      if (this.tracked.length === 1) {
        this.setDragPoint();
      }
      if (index < 2) {
        // We just forgot one of our pinch touches. Pick a new anchor spot.
        this.calcPinchAnchor();
      }
      this.scene.setMagnifyingGlass(0, 0, 0);
    });
    return this.scene.input.on('wheel', (pointer, gameObjects, deltaX, deltaY, deltaZ) => {
      var newZoom;
      this.calcPinchAnchor(pointer.position.x, pointer.position.y);
      newZoom = this.camera.zoom * (1 - (deltaY / 480));
      this.adjustZoom(newZoom);
      this.scene.setMagnifyingGlass(0, 0, 0);
    });
  }

  adjustZoom(newZoom) {
    var halfH, halfW, offsetX, offsetY;
    if (newZoom < 0.1) {
      newZoom = 0.1;
    }
    if (newZoom > 5) {
      newZoom = 5;
    }
    this.camera.zoom = newZoom;
    halfW = this.camera.width / 2;
    halfH = this.camera.height / 2;
    offsetX = (this.pinchAnchor.x - halfW) / newZoom;
    offsetY = (this.pinchAnchor.y - halfH) / newZoom;
    this.camera.scrollX = this.pinchAnchorWorld.x - halfW - offsetX;
    this.camera.scrollY = this.pinchAnchorWorld.y - halfH - offsetY;
  }

  setDragPoint() {
    this.dragX = this.tracked[0].pos.x;
    return this.dragY = this.tracked[0].pos.y;
  }

  calcPinchAnchor(pinchX = null, pinchY = null) {
    if ((pinchX === null) && (pinchY === null)) {
      if (this.tracked.length < 2) {
        return;
      }
      pinchX = Math.floor((this.tracked[0].pos.x + this.tracked[1].pos.x) / 2);
      pinchY = Math.floor((this.tracked[0].pos.y + this.tracked[1].pos.y) / 2);
    }
    this.pinchAnchor = {
      x: pinchX,
      y: pinchY
    };
    this.pinchAnchorWorld = this.camera.getWorldPoint(pinchX, pinchY);
    return this.scene.setMagnifyingGlass(this.pinchAnchor.x, this.pinchAnchor.y, 1);
  }

  calcDistance(x1, y1, x2, y2) {
    var dx, dy;
    dx = x2 - x1;
    dy = y2 - y1;
    return Math.sqrt(dx * dx + dy * dy);
  }

};

module.exports = TouchInterpreter;


},{}],5:[function(require,module,exports){
var BGMGameScene, BGMHudScene, init;

BGMGameScene = require('./BGMGameScene');

BGMHudScene = require('./BGMHudScene');

init = function() {
  var config, game;
  console.log("Bad Guy Minesweeper: init()");
  config = {
    type: Phaser.AUTO,
    width: document.documentElement.clientWidth,
    height: document.documentElement.clientHeight,
    backgroundColor: '#000000', // '#2d2d2d'
    parent: 'screen',
    input: {
      activePointers: 2
    },
    scene: [BGMGameScene, BGMHudScene]
  };
  return game = new Phaser.Game(config);
};

window.addEventListener('load', function(e) {
  return init();
}, false);


},{"./BGMGameScene":1,"./BGMHudScene":2}]},{},[5])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvQkdNR2FtZVNjZW5lLmNvZmZlZSIsInNyYy9CR01IdWRTY2VuZS5jb2ZmZWUiLCJzcmMvTWluZVN3ZWVwZXIuY29mZmVlIiwic3JjL1RvdWNoSW50ZXJwcmV0ZXIuY29mZmVlIiwic3JjL21haW4uY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUEsSUFBQSxZQUFBLEVBQUE7O0FBQUEsZ0JBQUEsR0FBbUIsT0FBQSxDQUFRLG9CQUFSOztBQUViLGVBQU4sTUFBQSxhQUFBLFFBQTJCLE1BQU0sQ0FBQyxNQUFsQztFQUNFLFdBQWEsQ0FBQSxDQUFBO1NBQ1gsQ0FBQTtJQUNBLE1BQU0sQ0FBQyxLQUFLLENBQUMsSUFBYixDQUFrQixJQUFsQixFQUF3QjtNQUFFLEdBQUEsRUFBSyxNQUFQO01BQWUsTUFBQSxFQUFRO0lBQXZCLENBQXhCO0lBRUEsSUFBQyxDQUFBLEVBQUQsR0FBTSxPQUFBLENBQVEsZUFBUjtJQUNOLElBQUMsQ0FBQSxLQUFELEdBQVMsSUFBSSxnQkFBSixDQUFBO0VBTEU7O0VBT2IsT0FBUyxDQUFBLENBQUE7SUFDUCxJQUFDLENBQUEsSUFBSSxDQUFDLEtBQU4sQ0FBWSxPQUFaLEVBQXFCLGtCQUFyQjtJQUNBLElBQUMsQ0FBQSxJQUFJLENBQUMsS0FBTixDQUFZLE1BQVosRUFBb0Isd0JBQXBCO0lBQ0EsSUFBQyxDQUFBLElBQUksQ0FBQyxLQUFOLENBQVksTUFBWixFQUFvQixrQkFBcEI7SUFDQSxJQUFDLENBQUEsSUFBSSxDQUFDLEtBQU4sQ0FBWSxXQUFaLEVBQXlCLHNCQUF6QjtJQUNBLElBQUMsQ0FBQSxJQUFJLENBQUMsS0FBTixDQUFZLGNBQVosRUFBNEIseUJBQTVCO0lBQ0EsSUFBQyxDQUFBLElBQUksQ0FBQyxLQUFOLENBQVksZ0JBQVosRUFBOEIsMkJBQTlCO0lBRUEsSUFBQyxDQUFBLElBQUksQ0FBQyxLQUFOLENBQVks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OiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24oKXtmdW5jdGlvbiByKGUsbix0KXtmdW5jdGlvbiBvKGksZil7aWYoIW5baV0pe2lmKCFlW2ldKXt2YXIgYz1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlO2lmKCFmJiZjKXJldHVybiBjKGksITApO2lmKHUpcmV0dXJuIHUoaSwhMCk7dmFyIGE9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitpK1wiJ1wiKTt0aHJvdyBhLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsYX12YXIgcD1uW2ldPXtleHBvcnRzOnt9fTtlW2ldWzBdLmNhbGwocC5leHBvcnRzLGZ1bmN0aW9uKHIpe3ZhciBuPWVbaV1bMV1bcl07cmV0dXJuIG8obnx8cil9LHAscC5leHBvcnRzLHIsZSxuLHQpfXJldHVybiBuW2ldLmV4cG9ydHN9Zm9yKHZhciB1PVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmUsaT0wO2k8dC5sZW5ndGg7aSsrKW8odFtpXSk7cmV0dXJuIG99cmV0dXJuIHJ9KSgpIiwiVG91Y2hJbnRlcnByZXRlciA9IHJlcXVpcmUgJy4vVG91Y2hJbnRlcnByZXRlcidcclxuXHJcbmNsYXNzIEJHTUdhbWVTY2VuZSBleHRlbmRzIFBoYXNlci5TY2VuZVxyXG4gIGNvbnN0cnVjdG9yOiAtPlxyXG4gICAgc3VwZXIoKVxyXG4gICAgUGhhc2VyLlNjZW5lLmNhbGwodGhpcywgeyBrZXk6ICdnYW1lJywgYWN0aXZlOiB0cnVlIH0pO1xyXG5cclxuICAgIEBtcyA9IHJlcXVpcmUgJy4vTWluZVN3ZWVwZXInXHJcbiAgICBAdG91Y2ggPSBuZXcgVG91Y2hJbnRlcnByZXRlclxyXG5cclxuICBwcmVsb2FkOiAtPlxyXG4gICAgQGxvYWQuaW1hZ2UoJ2JsYW5rJywgJ2ltYWdlcy9ibGFuay5naWYnKVxyXG4gICAgQGxvYWQuaW1hZ2UoJ2ZsYWcnLCAnaW1hZ2VzL2JvbWJmbGFnZ2VkLmdpZicpXHJcbiAgICBAbG9hZC5pbWFnZSgnYm9tYicsICdpbWFnZXMvYm9tYjAuZ2lmJylcclxuICAgIEBsb2FkLmltYWdlKCdib21iZGVhdGgnLCAnaW1hZ2VzL2JvbWJkZWF0aC5naWYnKVxyXG4gICAgQGxvYWQuaW1hZ2UoJ2JvbWJyZXZlYWxlZCcsICdpbWFnZXMvYm9tYnJldmVhbGVkLmdpZicpXHJcbiAgICBAbG9hZC5pbWFnZSgnYm9tYm1pc2ZsYWdnZWQnLCAnaW1hZ2VzL2JvbWJtaXNmbGFnZ2VkLmdpZicpXHJcblxyXG4gICAgQGxvYWQuaW1hZ2UoJ3NoYWRvdzAnLCAnaW1hZ2VzL3NoYWRvdzAuZ2lmJylcclxuICAgIEBsb2FkLmltYWdlKCdzaGFkb3cxJywgJ2ltYWdlcy9zaGFkb3cxLmdpZicpXHJcbiAgICBAbG9hZC5pbWFnZSgnc2hhZG93MicsICdpbWFnZXMvc2hhZG93Mi5naWYnKVxyXG4gICAgQGxvYWQuaW1hZ2UoJ3NoYWRvdzMnLCAnaW1hZ2VzL3NoYWRvdzMuZ2lmJylcclxuICAgIEBsb2FkLmltYWdlKCdzaGFkb3c0JywgJ2ltYWdlcy9zaGFkb3c0LmdpZicpXHJcbiAgICBAbG9hZC5pbWFnZSgnc2hhZG93NScsICdpbWFnZXMvc2hhZG93NS5naWYnKVxyXG4gICAgQGxvYWQuaW1hZ2UoJ3NoYWRvdzYnLCAnaW1hZ2VzL3NoYWRvdzYuZ2lmJylcclxuICAgIEBsb2FkLmltYWdlKCdzaGFkb3c3JywgJ2ltYWdlcy9zaGFkb3c3LmdpZicpXHJcbiAgICBAbG9hZC5pbWFnZSgnc2hhZG93OCcsICdpbWFnZXMvc2hhZG93OC5naWYnKVxyXG5cclxuICAgIEBsb2FkLmltYWdlKCdib21iMCcsICdpbWFnZXMvYm9tYjAuZ2lmJylcclxuICAgIEBsb2FkLmltYWdlKCdib21iMScsICdpbWFnZXMvYm9tYjEuZ2lmJylcclxuICAgIEBsb2FkLmltYWdlKCdib21iMicsICdpbWFnZXMvYm9tYjIuZ2lmJylcclxuICAgIEBsb2FkLmltYWdlKCdib21iMycsICdpbWFnZXMvYm9tYjMuZ2lmJylcclxuICAgIEBsb2FkLmltYWdlKCdib21iNCcsICdpbWFnZXMvYm9tYjQuZ2lmJylcclxuICAgIEBsb2FkLmltYWdlKCdib21iNScsICdpbWFnZXMvYm9tYjUuZ2lmJylcclxuICAgIEBsb2FkLmltYWdlKCdib21iNicsICdpbWFnZXMvYm9tYjYuZ2lmJylcclxuICAgIEBsb2FkLmltYWdlKCdib21iNycsICdpbWFnZXMvYm9tYjcuZ2lmJylcclxuICAgIEBsb2FkLmltYWdlKCdib21iOCcsICdpbWFnZXMvYm9tYjguZ2lmJylcclxuXHJcbiAgICBAbG9hZC5pbWFnZSgnb3BlbjAnLCAnaW1hZ2VzL29wZW4wLmdpZicpXHJcbiAgICBAbG9hZC5pbWFnZSgnb3BlbjEnLCAnaW1hZ2VzL29wZW4xLmdpZicpXHJcbiAgICBAbG9hZC5pbWFnZSgnb3BlbjInLCAnaW1hZ2VzL29wZW4yLmdpZicpXHJcbiAgICBAbG9hZC5pbWFnZSgnb3BlbjMnLCAnaW1hZ2VzL29wZW4zLmdpZicpXHJcbiAgICBAbG9hZC5pbWFnZSgnb3BlbjQnLCAnaW1hZ2VzL29wZW40LmdpZicpXHJcbiAgICBAbG9hZC5pbWFnZSgnb3BlbjUnLCAnaW1hZ2VzL29wZW41LmdpZicpXHJcbiAgICBAbG9hZC5pbWFnZSgnb3BlbjYnLCAnaW1hZ2VzL29wZW42LmdpZicpXHJcbiAgICBAbG9hZC5pbWFnZSgnb3BlbjcnLCAnaW1hZ2VzL29wZW43LmdpZicpXHJcbiAgICBAbG9hZC5pbWFnZSgnb3BlbjgnLCAnaW1hZ2VzL29wZW44LmdpZicpXHJcblxyXG4gIGNyZWF0ZTogLT5cclxuICAgIHNwbGl0ID0gTWF0aC5mbG9vcihAY2FtZXJhcy5tYWluLndpZHRoICogMC45KVxyXG4gICAgQGNhbWVyYXMubWFpbi5zZXRWaWV3cG9ydCgwLCAwLCBzcGxpdCwgQGNhbWVyYXMubWFpbi5oZWlnaHQpXHJcblxyXG4gICAgQG1zLmFkZEV2ZW50TGlzdGVuZXIgKGV2LCBhcmdzKSA9PlxyXG4gICAgICBzd2l0Y2ggZXZcclxuICAgICAgICB3aGVuICduZXcnXHJcbiAgICAgICAgICBpZiAoQG1zLndpZHRoICE9IEBncmlkQ29scykgb3IgKEBtcy5oZWlnaHQgIT0gQGdyaWRSb3dzKVxyXG4gICAgICAgICAgICBAcmVjcmVhdGVEaXNwbGF5TGlzdCgpXHJcbiAgICAgICAgd2hlbiAnY2VsbCdcclxuICAgICAgICAgIEBncmlkW2FyZ3NbMF1dW2FyZ3NbMV1dLnNldFRleHR1cmUoYXJnc1syXSlcclxuICAgICAgICB3aGVuICdsaWZlJ1xyXG4gICAgICAgICAgQHNjZW5lLmdldCgnaHVkJykuZGVidWdUZXh0LnRleHQgPSBcIkFyZSB5b3Ugc3V1dXV1dXVyZT8gKCN7YXJnc1swXX0pXCJcclxuICAgIEByZWNyZWF0ZURpc3BsYXlMaXN0KClcclxuICAgIEBtcy51cGRhdGVBbGwoKVxyXG5cclxuICAgIEB0b3VjaC5jcmVhdGUodGhpcywgQGNhbWVyYXMubWFpbiwgMCwgMCwgc3BsaXQsIEBjYW1lcmFzLm1haW4uaGVpZ2h0KVxyXG5cclxuICB1cGRhdGU6IC0+XHJcblxyXG4gIHJlY3JlYXRlRGlzcGxheUxpc3Q6IC0+XHJcbiAgICBjb25zb2xlLmxvZyBcInJlY3JlYXRlRGlzcGxheUxpc3QoKVwiXHJcbiAgICBAYWRkLmRpc3BsYXlMaXN0LnJlbW92ZUFsbCgpXHJcblxyXG4gICAgQGdyaWRDb2xzID0gQG1zLndpZHRoXHJcbiAgICBAZ3JpZFJvd3MgPSBAbXMuaGVpZ2h0XHJcbiAgICBAZ3JpZCA9IG5ldyBBcnJheShAZ3JpZENvbHMpXHJcbiAgICBmb3IgaSBpbiBbMC4uLkBncmlkQ29sc11cclxuICAgICAgQGdyaWRbaV0gPSBuZXcgQXJyYXkoQGdyaWRSb3dzKVxyXG4gICAgICBmb3IgaiBpbiBbMC4uLkBncmlkUm93c11cclxuICAgICAgICBAZ3JpZFtpXVtqXSA9IEBhZGQuaW1hZ2UoaSAqIDE2LCBqICogMTYsICdibGFuaycpXHJcbiAgICAgICAgQGdyaWRbaV1bal0uc2V0T3JpZ2luKDAsIDApXHJcbiAgICBAcmVzZXRWaWV3KClcclxuXHJcbiAgY2VudGVyR3JpZDogLT5cclxuICAgIHRvdGFsVyA9IEBncmlkQ29scyAqIDE2XHJcbiAgICB0b3RhbEggPSBAZ3JpZFJvd3MgKiAxNlxyXG4gICAgQGNhbWVyYXMubWFpbi5zY3JvbGxYID0gKHRvdGFsVyAtIEBjYW1lcmFzLm1haW4ud2lkdGgpIC8gMlxyXG4gICAgQGNhbWVyYXMubWFpbi5zY3JvbGxZID0gKHRvdGFsSCAtIEBjYW1lcmFzLm1haW4uaGVpZ2h0KSAvIDJcclxuXHJcbiAgcmVzZXRWaWV3OiAtPlxyXG4gICAgQGNhbWVyYXMubWFpbi56b29tID0gMVxyXG4gICAgQGNlbnRlckdyaWQoKVxyXG5cclxuICBzZXRNb2RlOiAoQG1vZGUpIC0+XHJcbiAgICAjIGNvbnNvbGUubG9nIFwiR2FtZSBNb2RlOiAje0Btb2RlfVwiXHJcbiAgICBpZiBAbXMuZ2FtZW92ZXJcclxuICAgICAgQG1zLm5ld0dhbWUoKVxyXG5cclxuICBzZXRNYWduaWZ5aW5nR2xhc3M6ICh4LCB5LCBhbHBoYSkgLT5cclxuICAgIEBzY2VuZS5nZXQoJ2h1ZCcpLnNldE1hZ25pZnlpbmdHbGFzcyh4LCB5LCBhbHBoYSlcclxuXHJcbiAgcm1iOiAod29ybGRYLCB3b3JsZFkpIC0+XHJcbiAgICBAc2NlbmUuZ2V0KCdodWQnKS50b2dnbGVNb2RlKClcclxuXHJcbiAgdGFwOiAod29ybGRYLCB3b3JsZFkpIC0+XHJcbiAgICBAc2NlbmUuZ2V0KCdodWQnKS5kZWJ1Z1RleHQudGV4dCA9IFwiXCJcclxuXHJcbiAgICBpZiBAbXMuZ2FtZW92ZXJcclxuICAgICAgY29uc29sZS5sb2cgXCJnYW1lIGlzIG92ZXIsIGRvaW5nIG5vdGhpbmdcIlxyXG4gICAgICByZXR1cm5cclxuXHJcbiAgICBpZiAod29ybGRYID49IDApIGFuZCAod29ybGRYIDwgKEBncmlkQ29scyAqIDE2KSkgYW5kICh3b3JsZFkgPj0gMCkgYW5kICh3b3JsZFkgPCAoQGdyaWRSb3dzICogMTYpKVxyXG4gICAgICB4ID0gTWF0aC5mbG9vcih3b3JsZFggLyAxNilcclxuICAgICAgeSA9IE1hdGguZmxvb3Iod29ybGRZIC8gMTYpXHJcbiAgICAgIGlmIEBtb2RlID09ICdmbGFnJ1xyXG4gICAgICAgIEBtcy5mbGFnKHgsIHkpXHJcbiAgICAgIGVsc2VcclxuICAgICAgICBAbXMucG9rZSh4LCB5KVxyXG4gICAgICBAbXMudXBkYXRlQWxsKClcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gQkdNR2FtZVNjZW5lXHJcbiIsImNsYXNzIEJHTUh1ZFNjZW5lIGV4dGVuZHMgUGhhc2VyLlNjZW5lXHJcbiAgY29uc3RydWN0b3I6IC0+XHJcbiAgICBzdXBlcigpXHJcbiAgICBQaGFzZXIuU2NlbmUuY2FsbCh0aGlzLCB7IGtleTogJ2h1ZCcsIGFjdGl2ZTogdHJ1ZSB9KTtcclxuXHJcbiAgcHJlbG9hZDogLT5cclxuICAgIEBsb2FkLmltYWdlKCdnbGFzcycsICdpbWFnZXMvZ2xhc3MuZ2lmJylcclxuXHJcbiAgICBAbG9hZC5pbWFnZSgnYnRuX2JvbWInLCAnaW1hZ2VzL2J0bl9ib21iLnBuZycpXHJcbiAgICBAbG9hZC5pbWFnZSgnYnRuX2ZsYWcnLCAnaW1hZ2VzL2J0bl9mbGFnLnBuZycpXHJcblxyXG4gIGNyZWF0ZTogLT5cclxuICAgIEBwYW5lbFggPSBNYXRoLmZsb29yKEBjYW1lcmFzLm1haW4ud2lkdGggKiAwLjkpXHJcbiAgICBAcGFuZWxZID0gMFxyXG4gICAgQHBhbmVsVyA9IEBjYW1lcmFzLm1haW4ud2lkdGggLSBAcGFuZWxYXHJcbiAgICBAcGFuZWxIID0gQGNhbWVyYXMubWFpbi5oZWlnaHRcclxuXHJcbiAgICBAcGFuZWxCYWNrZ3JvdW5kID0gQGFkZC5ncmFwaGljcygpXHJcbiAgICBAcGFuZWxCYWNrZ3JvdW5kLmZpbGxTdHlsZSgweDMzMzMzMywgMSlcclxuICAgIEBwYW5lbEJhY2tncm91bmQuZmlsbFJlY3QoQHBhbmVsWCwgQHBhbmVsWSwgQHBhbmVsVywgQHBhbmVsSClcclxuICAgIEBwYW5lbEJhY2tncm91bmQubGluZVN0eWxlKDEsIDB4MDAwMDAwLCAxLjApXHJcbiAgICBAcGFuZWxCYWNrZ3JvdW5kLnN0cm9rZVJlY3QoQHBhbmVsWCwgQHBhbmVsWSwgQHBhbmVsVywgQHBhbmVsSClcclxuXHJcbiAgICBAYnV0dG9uID0gQGFkZC5pbWFnZShAcGFuZWxYICsgKEBwYW5lbFcgLyAyKSwgQHBhbmVsWSArIChAcGFuZWxIIC8gMiksICdidG5fYm9tYicpXHJcbiAgICBAYnV0dG9uLnNldERpc3BsYXlTaXplKEBwYW5lbFcgKiAwLjgsIEBwYW5lbFcgKiAwLjgpXHJcbiAgICBAYnV0dG9uLnNldEludGVyYWN0aXZlKClcclxuICAgIEBidXR0b24ub24gJ3BvaW50ZXJkb3duJywgPT5cclxuICAgICAgQHRvZ2dsZU1vZGUoKVxyXG4gICAgQHRvZ2dsZU1vZGUoKVxyXG5cclxuICAgIEBkZWJ1Z1RleHQgPSBAYWRkLnRleHQoMCwgMCwgJycpXHJcbiAgICBAZ2xhc3MgPSBAYWRkLmltYWdlKDUwLCA1MCwgJ2dsYXNzJylcclxuICAgIEBnbGFzcy5zZXRPcmlnaW4oMC42LCAwLjMpICMgcm91Z2hseSB0aGUgbWlkZGxlIG9mIHRoZSBtYWduaWZ5aW5nIGdsYXNzXHJcbiAgICBAZ2xhc3MuYWxwaGEgPSAwXHJcblxyXG4gIHRvZ2dsZU1vZGU6IC0+XHJcbiAgICBpZiBAbW9kZSA9PSAnYm9tYidcclxuICAgICAgQG1vZGUgPSAnZmxhZydcclxuICAgIGVsc2VcclxuICAgICAgQG1vZGUgPSAnYm9tYidcclxuXHJcbiAgICBAYnV0dG9uLnNldFRleHR1cmUoXCJidG5fI3tAbW9kZX1cIilcclxuICAgIEBzY2VuZS5nZXQoJ2dhbWUnKS5zZXRNb2RlKEBtb2RlKVxyXG5cclxuICB1cGRhdGU6IC0+XHJcblxyXG4gIHNldE1hZ25pZnlpbmdHbGFzczogKHgsIHksIGFscGhhKSAtPlxyXG4gICAgQGdsYXNzLnggPSB4XHJcbiAgICBAZ2xhc3MueSA9IHlcclxuICAgIEBnbGFzcy5hbHBoYSA9IGFscGhhXHJcblxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBCR01IdWRTY2VuZVxyXG4iLCJjbGFzcyBNaW5lU3dlZXBlclxyXG4gIGNvbnN0cnVjdG9yOiAtPlxyXG4gICAgQGxpc3RlbmVycyA9IFtdXHJcbiAgICBAbmV3R2FtZSgpXHJcblxyXG4gIGFkZEV2ZW50TGlzdGVuZXI6IChldmwpIC0+XHJcbiAgICBAbGlzdGVuZXJzLnB1c2goZXZsKVxyXG5cclxuICByYW5kOiAoeCkgLT5cclxuICAgIHJldHVybiBNYXRoLmZsb29yKE1hdGguYmdtcmFuZG9tKCkgKiB4KVxyXG5cclxuICBuZWlnaGJvcnM6IChpLCBqLCB1bmZsYWdnZWRPbmx5KSAtPlxyXG4gICAgbiA9IDBcclxuICAgIHgxID0gTWF0aC5tYXgoaSAtIDEsIDApXHJcbiAgICB4MiA9IE1hdGgubWluKEB3aWR0aCAtIDEsIGkgKyAxKVxyXG4gICAgeTEgPSBNYXRoLm1heChqIC0gMSwgMClcclxuICAgIHkyID0gTWF0aC5taW4oQGhlaWdodCAtIDEsIGogKyAxKVxyXG4gICAgeCA9IHgxXHJcbiAgICB3aGlsZSB4IDw9IHgyXHJcbiAgICAgIHkgPSB5MVxyXG4gICAgICB3aGlsZSB5IDw9IHkyXHJcbiAgICAgICAgaWYgeCAhPSBpIG9yIHkgIT0galxyXG4gICAgICAgICAgaWYgIXVuZmxhZ2dlZE9ubHkgb3IgKEB2aXNpYmxlW3ggKyB5ICogQHdpZHRoXSA9PSAwKVxyXG4gICAgICAgICAgICBpZiBAYm9tYlt4ICsgeSAqIEB3aWR0aF0gPT0gMVxyXG4gICAgICAgICAgICAgICsrblxyXG4gICAgICAgICsreVxyXG4gICAgICArK3hcclxuICAgIHJldHVybiBuXHJcblxyXG4gIGhhc1Zpc2libGVaZXJvTmVpZ2hib3I6IChpLCBqKSAtPlxyXG4gICAgeDEgPSBNYXRoLm1heChpIC0gMSwgMClcclxuICAgIHgyID0gTWF0aC5taW4oQHdpZHRoIC0gMSwgaSArIDEpXHJcbiAgICB5MSA9IE1hdGgubWF4KGogLSAxLCAwKVxyXG4gICAgeTIgPSBNYXRoLm1pbihAaGVpZ2h0IC0gMSwgaiArIDEpXHJcbiAgICB4ID0geDFcclxuICAgIHdoaWxlIHggPD0geDJcclxuICAgICAgeSA9IHkxXHJcbiAgICAgIHdoaWxlIHkgPD0geTJcclxuICAgICAgICBpZiB4ICE9IGkgb3IgeSAhPSBqXHJcbiAgICAgICAgICBpZiBAdmlzaWJsZVt4ICsgeSAqIEB3aWR0aF0gIT0gMFxyXG4gICAgICAgICAgICBuID0gQG5laWdoYm9ycyh4LCB5LCBmYWxzZSlcclxuICAgICAgICAgICAgaWYgbiA9PSAwXHJcbiAgICAgICAgICAgICAgcmV0dXJuIHRydWVcclxuICAgICAgICArK3lcclxuICAgICAgKyt4XHJcbiAgICByZXR1cm4gZmFsc2VcclxuXHJcbiAgbG9zZUxpZmU6IC0+XHJcbiAgICBAbGl2ZXMgLT0gMVxyXG4gICAgaWYgQGxpdmVzID4gMFxyXG4gICAgICBmb3IgZXZsIGluIEBsaXN0ZW5lcnNcclxuICAgICAgICBldmwoJ2xpZmUnLCBbQGxpdmVzXSlcclxuICAgICAgcmV0dXJuIGZhbHNlXHJcbiAgICByZXR1cm4gdHJ1ZVxyXG5cclxuICB1cGRhdGVDZWxsOiAoaSwgaiwgcmV2ZWFsKSAtPlxyXG4gICAgaW1hZ2UgPSAnYmxhbmsnXHJcbiAgICBpbmRleCA9IGkgKyBqICogQHdpZHRoXHJcbiAgICBpc0JvbWIgPSBAYm9tYltpbmRleF1cclxuICAgIGlzVmlzaWJsZSA9IEB2aXNpYmxlW2luZGV4XVxyXG4gICAgbiA9IEBuZWlnaGJvcnMoaSwgaiwgZmFsc2UpXHJcbiAgICBpZiBpc1Zpc2libGUgPT0gMFxyXG4gICAgICBpZiByZXZlYWxcclxuICAgICAgICBpZiBpc0JvbWIgPT0gMVxyXG4gICAgICAgICAgaW1hZ2UgPSAnYm9tYnJldmVhbGVkJ1xyXG4gICAgICAgIGVsc2VcclxuICAgICAgICAgIGltYWdlID0gJ3NoYWRvdycgKyBuXHJcbiAgICAgIGVsc2VcclxuICAgICAgICBpbWFnZSA9ICdibGFuaydcclxuICAgIGVsc2VcclxuICAgICAgaWYgaXNCb21iID09IDFcclxuICAgICAgICBpZiBpc1Zpc2libGUgPT0gMlxyXG4gICAgICAgICAgaW1hZ2UgPSAnYm9tYmRlYXRoJ1xyXG4gICAgICAgIGVsc2VcclxuICAgICAgICAgIHVuZmxhZ2dlZCA9IEBuZWlnaGJvcnMoaSwgaiwgdHJ1ZSlcclxuICAgICAgICAgIGlmIHVuZmxhZ2dlZCA9PSAwXHJcbiAgICAgICAgICAgIG4gPSAwXHJcbiAgICAgICAgICBpbWFnZSA9ICdib21iJyArIG5cclxuICAgICAgZWxzZVxyXG4gICAgICAgIGlmIGlzVmlzaWJsZSA9PSAyXHJcbiAgICAgICAgICBpbWFnZSA9ICdib21ibWlzZmxhZ2dlZCdcclxuICAgICAgICBlbHNlXHJcbiAgICAgICAgICBpbWFnZSA9ICdvcGVuJyArIG5cclxuICAgIGZvciBldmwgaW4gQGxpc3RlbmVyc1xyXG4gICAgICBldmwoJ2NlbGwnLCBbaSwgaiwgaW1hZ2VdKVxyXG4gICAgcmV0dXJuXHJcblxyXG4gIHVwZGF0ZUFsbDogKHJldmVhbCA9IGZhbHNlKSAtPlxyXG4gICAgaWYgQGxpc3RlbmVycy5sZW5ndGggPT0gMFxyXG4gICAgICByZXR1cm5cclxuXHJcbiAgICBrZWVwR29pbmcgPSB0cnVlXHJcbiAgICB3aGlsZSBrZWVwR29pbmdcclxuICAgICAga2VlcEdvaW5nID0gZmFsc2VcclxuICAgICAgaiA9IDBcclxuICAgICAgd2hpbGUgaiA8IEBoZWlnaHRcclxuICAgICAgICBpID0gMFxyXG4gICAgICAgIHdoaWxlIGkgPCBAd2lkdGhcclxuICAgICAgICAgIGlmIChAYm9tYltpICsgaiAqIEB3aWR0aF0gPT0gMCkgYW5kIEBoYXNWaXNpYmxlWmVyb05laWdoYm9yKGksIGopXHJcbiAgICAgICAgICAgIGlmIEBwb2tlKGksIGopXHJcbiAgICAgICAgICAgICAga2VlcEdvaW5nID0gdHJ1ZVxyXG4gICAgICAgICAgKytpXHJcbiAgICAgICAgKytqXHJcbiAgICBqID0gMFxyXG4gICAgd2hpbGUgaiA8IEBoZWlnaHRcclxuICAgICAgaSA9IDBcclxuICAgICAgd2hpbGUgaSA8IEB3aWR0aFxyXG4gICAgICAgIEB1cGRhdGVDZWxsKGksIGosIHJldmVhbClcclxuICAgICAgICArK2lcclxuICAgICAgKytqXHJcbiAgICByZXR1cm5cclxuXHJcbiAgZmxhZzogKGksIGopIC0+XHJcbiAgICBpbmRleCA9IGkgKyBqICogQHdpZHRoXHJcbiAgICBpZiBAdmlzaWJsZVtpbmRleF0gPT0gMFxyXG4gICAgICBpZiBAYm9tYltpbmRleF0gPT0gMVxyXG4gICAgICAgICNib21iW2luZGV4XSA9IDA7XHJcbiAgICAgICAgI3Bva2UoaSwgaik7XHJcbiAgICAgICAgQHZpc2libGVbaW5kZXhdID0gMVxyXG4gICAgICBlbHNlXHJcbiAgICAgICAgIyBCYWQgZmxhZzsgbG9zZSB0aGUgZ2FtZVxyXG4gICAgICAgIGlmIEBsb3NlTGlmZSgpXHJcbiAgICAgICAgICBAdmlzaWJsZVtpbmRleF0gPSAyXHJcbiAgICAgICAgICBAdXBkYXRlQWxsKHRydWUpXHJcbiAgICAgICAgICBAZ2FtZW92ZXIgPSB0cnVlXHJcbiAgICAgICAgICAjICQoJyN3aW5sb3NlJykuaHRtbCAnQkFEIEZMQUchIFlvdSBsb3NlISdcclxuICAgICAgICAgIHJldHVyblxyXG4gICAgcmV0dXJuXHJcblxyXG4gIHBva2U6IChpLCBqKSAtPlxyXG4gICAgcmV0ID0gZmFsc2VcclxuICAgIGluZGV4ID0gaSArIGogKiBAd2lkdGhcclxuICAgIGlmIEB2aXNpYmxlW2luZGV4XSA9PSAwXHJcbiAgICAgIGlmIEBib21iW2luZGV4XSA9PSAxXHJcbiAgICAgICAgIyBCYWQgc3BvdDsgbG9zZSB0aGUgZ2FtZVxyXG4gICAgICAgIGlmIEBsb3NlTGlmZSgpXHJcbiAgICAgICAgICBAdmlzaWJsZVtpbmRleF0gPSAyXHJcbiAgICAgICAgICBAZ2FtZW92ZXIgPSB0cnVlXHJcbiAgICAgICAgICAjICQoJyN3aW5sb3NlJykuaHRtbCAnQk9NQiEgWW91IGxvc2UhJ1xyXG4gICAgICAgICAgQHVwZGF0ZUFsbCh0cnVlKVxyXG4gICAgICAgICAgcmV0dXJuIGZhbHNlXHJcbiAgICAgICAgZWxzZVxyXG4gICAgICAgICAgcmV0dXJuIGZhbHNlXHJcbiAgICAgIEB2aXNpYmxlW2luZGV4XSA9IDFcclxuICAgICAgcmV0ID0gdHJ1ZVxyXG4gICAgcmV0dXJuIHJldFxyXG5cclxuICBmaXJzdENsaWNrSXNGcmVlOiAtPlxyXG4gICAgY2VsbENvdW50ID0gQHdpZHRoICogQGhlaWdodFxyXG4gICAgc3RhcnRJbmRleCA9IEByYW5kKGNlbGxDb3VudClcclxuICAgIGluZGV4ID0gc3RhcnRJbmRleFxyXG4gICAgbG9vcFxyXG4gICAgICBpID0gTWF0aC5mbG9vcihpbmRleCAlIEB3aWR0aClcclxuICAgICAgaiA9XHJcbiAgICAgICAgTWF0aC5mbG9vcihpbmRleCAvIEB3aWR0aClcclxuICAgICAgbiA9IEBuZWlnaGJvcnMoaSwgaiwgZmFsc2UpXHJcbiAgICAgIGlmIEBib21iW2luZGV4XSA9PSAwIGFuZCBuID09IDBcclxuICAgICAgICBAcG9rZShpLCBqKVxyXG4gICAgICAgIHJldHVyblxyXG4gICAgICBpbmRleCA9IChpbmRleCArIDEpICUgY2VsbENvdW50XHJcbiAgICAgIGlmIGluZGV4ID09IHN0YXJ0SW5kZXhcclxuICAgICAgICBicmVha1xyXG4gICAgbG9vcFxyXG4gICAgICBpID0gTWF0aC5mbG9vcihpbmRleCAlIEB3aWR0aClcclxuICAgICAgaiA9IE1hdGguZmxvb3IoaW5kZXggLyBAd2lkdGgpXHJcbiAgICAgIG4gPSBuZWlnaGJvcnMoaSwgaiwgZmFsc2UpXHJcbiAgICAgIGlmIEBib21iW2luZGV4XSA9PSAwXHJcbiAgICAgICAgQHBva2UoaSwgailcclxuICAgICAgICByZXR1cm5cclxuICAgICAgaW5kZXggPSAoaW5kZXggKyAxKSAlIGNlbGxDb3VudFxyXG4gICAgICBpZiBpbmRleCA9PSBzdGFydEluZGV4XHJcbiAgICAgICAgYnJlYWtcclxuICAgIHJldHVyblxyXG5cclxuICBuZXdHYW1lOiAoQHdpZHRoID0gMzAsIEBoZWlnaHQgPSAzMCwgQG1pbmVDb3VudCA9IDAsIEBzZWVkID0gU3RyaW5nKE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIDEwMDAwMDApKSkgLT5cclxuICAgIE1hdGguc2VlZGJnbXJhbmRvbShAc2VlZClcclxuXHJcbiAgICBAbGl2ZXMgPSAzXHJcblxyXG4gICAgY2VsbENvdW50ID0gQHdpZHRoICogQGhlaWdodFxyXG4gICAgaWYgQG1pbmVDb3VudCA9PSAwXHJcbiAgICAgIE1JTkVfREVOU0lUWSA9IDAuMTZcclxuICAgICAgQG1pbmVDb3VudCA9IE1hdGguZmxvb3IoY2VsbENvdW50ICogTUlORV9ERU5TSVRZKVxyXG5cclxuICAgIEBnYW1lb3ZlciA9IGZhbHNlXHJcblxyXG4gICAgIyBDcmVhdGUgZnJlc2ggYXJyYXlzXHJcbiAgICBAYm9tYiA9IG5ldyBBcnJheShjZWxsQ291bnQpLmZpbGwoMClcclxuICAgIEB2aXNpYmxlID0gbmV3IEFycmF5KGNlbGxDb3VudCkuZmlsbCgwKVxyXG5cclxuICAgICMgRHJvcCBpbiB0aGUgbWluZXMgcmFuZG9tbHlcclxuICAgIGluZGljZXMgPSBuZXcgQXJyYXkoY2VsbENvdW50KVxyXG4gICAgaW5kaWNlc1swXSA9IDBcclxuICAgIGkgPSAxXHJcbiAgICB3aGlsZSBpIDwgY2VsbENvdW50XHJcbiAgICAgIGogPSBAcmFuZChpKVxyXG4gICAgICBpbmRpY2VzW2ldID0gaW5kaWNlc1tqXVxyXG4gICAgICBpbmRpY2VzW2pdID0gaVxyXG4gICAgICArK2lcclxuICAgIG0gPSBAbWluZUNvdW50XHJcbiAgICBpZiBtID49IGNlbGxDb3VudFxyXG4gICAgICBtID0gY2VsbENvdW50IC0gMVxyXG4gICAgaSA9IDBcclxuICAgIHdoaWxlIGkgPCBtXHJcbiAgICAgIEBib21iW2luZGljZXNbaV1dID0gMVxyXG4gICAgICArK2lcclxuICAgIEBmaXJzdENsaWNrSXNGcmVlKClcclxuICAgIGZvciBldmwgaW4gQGxpc3RlbmVyc1xyXG4gICAgICBldmwoJ25ldycsIFtdKVxyXG4gICAgQHVwZGF0ZUFsbCgpXHJcbiAgICByZXR1cm5cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gbmV3IE1pbmVTd2VlcGVyICMgU2luZ2xldG9uXHJcbiIsIkVOR0FHRV9EUkFHX0RJU1RBTkNFID0gMTBcclxuRE9VQkxFX0NMSUNLX01TID0gNDAwXHJcblxyXG5jbGFzcyBUb3VjaEludGVycHJldGVyXHJcbiAgY29uc3RydWN0b3I6IC0+XHJcbiAgICBAdHJhY2tlZCA9IFtdXHJcbiAgICBAZHJhZ1ggPSAwXHJcbiAgICBAZHJhZ1kgPSAwXHJcbiAgICBAZHJhZ2dpbmcgPSBmYWxzZVxyXG4gICAgQGRvdWJsZUNsaWNrVGltZSA9IG51bGxcclxuICAgIEBwaW5jaEFuY2hvciA9IG51bGxcclxuICAgIEBwaW5jaEFuY2hvcldvcmxkID0gbnVsbFxyXG5cclxuICBjcmVhdGU6IChAc2NlbmUsIEBjYW1lcmEsIEB4LCBAeSwgQHcsIEBoKSAtPlxyXG4gICAgQGNhbWVyYS56b29tID0gMVxyXG4gICAgQHNjZW5lLmlucHV0LmFkZFBvaW50ZXIoMSlcclxuICAgIEBzY2VuZS5pbnB1dC5tb3VzZS5kaXNhYmxlQ29udGV4dE1lbnUoKVxyXG5cclxuICAgIEBzY2VuZS5pbnB1dC5vbiAncG9pbnRlcmRvd24nLCAocG9pbnRlcikgPT5cclxuICAgICAgY29uc29sZS5sb2cgXCJwb2ludGVyZG93blwiXHJcbiAgICAgIGlmIHBvaW50ZXIucmlnaHRCdXR0b25Eb3duKClcclxuICAgICAgICB3b3JsZFBvcyA9IEBjYW1lcmEuZ2V0V29ybGRQb2ludChwb2ludGVyLnBvc2l0aW9uLngsIHBvaW50ZXIucG9zaXRpb24ueSlcclxuICAgICAgICBAc2NlbmUucm1iKHdvcmxkUG9zLngsIHdvcmxkUG9zLnkpXHJcbiAgICAgICAgcmV0dXJuXHJcblxyXG4gICAgICBpZiBwb2ludGVyLnBvc2l0aW9uLnggPiAoQHggKyBAdylcclxuICAgICAgICByZXR1cm5cclxuXHJcbiAgICAgIGlmIEB0cmFja2VkLmxlbmd0aCA9PSAwXHJcbiAgICAgICAgQGRyYWdnaW5nID0gZmFsc2VcclxuXHJcbiAgICAgICMgY29uc29sZS5sb2cgXCJuZXcgcG9pbnRlciAje3BvaW50ZXIuaWR9XCJcclxuICAgICAgQHRyYWNrZWQucHVzaCB7XHJcbiAgICAgICAgaWQ6IHBvaW50ZXIuaWRcclxuICAgICAgICBwb3M6IHBvaW50ZXIucG9zaXRpb24uY2xvbmUoKVxyXG4gICAgICB9XHJcbiAgICAgIGlmIEB0cmFja2VkLmxlbmd0aCA9PSAxXHJcbiAgICAgICAgQHNldERyYWdQb2ludCgpXHJcbiAgICAgIGlmIEB0cmFja2VkLmxlbmd0aCA9PSAyXHJcbiAgICAgICAgIyBXZSBqdXN0IGFkZGVkIGEgc2Vjb25kIHRvdWNoIHNwb3QuIENhbGN1bGF0ZSB0aGUgYW5jaG9yIGZvciBwaW5jaGluZyBub3dcclxuICAgICAgICBAY2FsY1BpbmNoQW5jaG9yKClcclxuXHJcbiAgICAgIGlmIEB0cmFja2VkLmxlbmd0aCA+IDFcclxuICAgICAgICBAZHJhZ2dpbmcgPSB0cnVlXHJcbiAgICAgICAgQGRvdWJsZUNsaWNrVGltZSA9IG51bGxcclxuICAgICAgZWxzZSBpZiBub3QgQGRyYWdnaW5nXHJcbiAgICAgICAgbm93ID0gbmV3IERhdGUoKS5nZXRUaW1lKClcclxuICAgICAgICBpZiBAZG91YmxlQ2xpY2tUaW1lICE9IG51bGxcclxuICAgICAgICAgICMgc2Vjb25kIGNsaWNrXHJcbiAgICAgICAgICBjbGlja0RlbHRhID0gbm93IC0gQGRvdWJsZUNsaWNrVGltZVxyXG4gICAgICAgICAgaWYgY2xpY2tEZWx0YSA8IERPVUJMRV9DTElDS19NU1xyXG4gICAgICAgICAgICBAZG91YmxlQ2xpY2tUaW1lID0gbnVsbFxyXG4gICAgICAgICAgICAjIGNvbnNvbGUubG9nIFwiRE9VQkxFIFRBUCAje0B0cmFja2VkWzBdLnBvcy54fSAje0B0cmFja2VkWzBdLnBvcy55fVwiXHJcbiAgICAgICAgICAgIHJldHVyblxyXG4gICAgICAgIEBkb3VibGVDbGlja1RpbWUgPSBub3dcclxuXHJcbiAgICBAc2NlbmUuaW5wdXQub24gJ3BvaW50ZXJtb3ZlJywgKHBvaW50ZXIpID0+XHJcbiAgICAgIHByZXZEaXN0YW5jZSA9IDBcclxuICAgICAgaWYgQHRyYWNrZWQubGVuZ3RoID49IDJcclxuICAgICAgICBwcmV2RGlzdGFuY2UgPSBAY2FsY0Rpc3RhbmNlKEB0cmFja2VkWzBdLnBvcy54LCBAdHJhY2tlZFswXS5wb3MueSwgQHRyYWNrZWRbMV0ucG9zLngsIEB0cmFja2VkWzFdLnBvcy55KVxyXG4gICAgICBpZiBAdHJhY2tlZC5sZW5ndGggPT0gMVxyXG4gICAgICAgIHByZXZYID0gQHRyYWNrZWRbMF0ucG9zLnhcclxuICAgICAgICBwcmV2WSA9IEB0cmFja2VkWzBdLnBvcy55XHJcblxyXG4gICAgICBpbmRleCA9IC0xXHJcbiAgICAgIGZvciBpIGluIFswLi4uQHRyYWNrZWQubGVuZ3RoXVxyXG4gICAgICAgIGlmIEB0cmFja2VkW2ldLmlkID09IHBvaW50ZXIuaWRcclxuICAgICAgICAgIGluZGV4ID0gaVxyXG4gICAgICAgICAgYnJlYWtcclxuICAgICAgaWYgaW5kZXggPT0gLTFcclxuICAgICAgICByZXR1cm5cclxuXHJcbiAgICAgIEB0cmFja2VkW2luZGV4XS5wb3MgPSBwb2ludGVyLnBvc2l0aW9uLmNsb25lKClcclxuXHJcbiAgICAgIGlmIEB0cmFja2VkLmxlbmd0aCA9PSAxXHJcbiAgICAgICAgIyBzaW5nbGUgdG91Y2gsIGNvbnNpZGVyIGRyYWdnaW5nXHJcbiAgICAgICAgZHJhZ0Rpc3RhbmNlID0gQGNhbGNEaXN0YW5jZSBAZHJhZ1gsIEBkcmFnWSwgQHRyYWNrZWRbMF0ucG9zLngsIEB0cmFja2VkWzBdLnBvcy55XHJcbiAgICAgICAgaWYgQGRyYWdnaW5nIG9yIChkcmFnRGlzdGFuY2UgPiBFTkdBR0VfRFJBR19ESVNUQU5DRSlcclxuICAgICAgICAgIEBkcmFnZ2luZyA9IHRydWVcclxuICAgICAgICAgIGlmIGRyYWdEaXN0YW5jZSA+IDAuNVxyXG4gICAgICAgICAgICBkeCA9IEB0cmFja2VkWzBdLnBvcy54IC0gQGRyYWdYXHJcbiAgICAgICAgICAgIGR5ID0gQHRyYWNrZWRbMF0ucG9zLnkgLSBAZHJhZ1lcclxuICAgICAgICAgICAgIyBjb25zb2xlLmxvZyBcInNpbmdsZSBkcmFnOiAje2R4fSwgI3tkeX1cIlxyXG4gICAgICAgICAgICBAY2FtZXJhLnNjcm9sbFggLT0gZHggLyBAY2FtZXJhLnpvb21cclxuICAgICAgICAgICAgQGNhbWVyYS5zY3JvbGxZIC09IGR5IC8gQGNhbWVyYS56b29tXHJcblxyXG4gICAgICAgICAgICAjIGNvbnNvbGUubG9nIFwic2Nyb2xsICN7QGNhbWVyYS5zY3JvbGxYfSAje0BjYW1lcmEuem9vbX0gI3tAY2FtZXJhLndpZHRofVwiXHJcbiAgICAgICAgICBAc2V0RHJhZ1BvaW50KClcclxuXHJcbiAgICAgIGVsc2UgaWYgQHRyYWNrZWQubGVuZ3RoID49IDJcclxuICAgICAgICAjIGF0IGxlYXN0IHR3byBmaW5nZXJzIHByZXNlbnQsIGNoZWNrIGZvciBwaW5jaC96b29tXHJcbiAgICAgICAgY3VyckRpc3RhbmNlID0gQGNhbGNEaXN0YW5jZShAdHJhY2tlZFswXS5wb3MueCwgQHRyYWNrZWRbMF0ucG9zLnksIEB0cmFja2VkWzFdLnBvcy54LCBAdHJhY2tlZFsxXS5wb3MueSlcclxuICAgICAgICBkZWx0YURpc3RhbmNlID0gY3VyckRpc3RhbmNlIC0gcHJldkRpc3RhbmNlXHJcbiAgICAgICAgaWYgZGVsdGFEaXN0YW5jZSAhPSAwXHJcbiAgICAgICAgICBuZXdab29tID0gQGNhbWVyYS56b29tICogKDEgKyAoZGVsdGFEaXN0YW5jZSAqIDQgLyBAY2FtZXJhLndpZHRoKSlcclxuICAgICAgICAgIEBhZGp1c3Rab29tKG5ld1pvb20pXHJcbiAgICAgIHJldHVyblxyXG5cclxuICAgIEBzY2VuZS5pbnB1dC5vbiAncG9pbnRlcnVwJywgKHBvaW50ZXIpID0+XHJcbiAgICAgIGluZGV4ID0gLTFcclxuICAgICAgZm9yIGkgaW4gWzAuLi5AdHJhY2tlZC5sZW5ndGhdXHJcbiAgICAgICAgaWYgQHRyYWNrZWRbaV0uaWQgPT0gcG9pbnRlci5pZFxyXG4gICAgICAgICAgaW5kZXggPSBpXHJcbiAgICAgICAgICBicmVha1xyXG4gICAgICBpZiBpbmRleCA9PSAtMVxyXG4gICAgICAgIHJldHVyblxyXG5cclxuICAgICAgaWYgQHRyYWNrZWQubGVuZ3RoID09IDFcclxuICAgICAgICBpZiBub3QgQGRyYWdnaW5nXHJcbiAgICAgICAgICB3b3JsZFBvcyA9IEBjYW1lcmEuZ2V0V29ybGRQb2ludChAdHJhY2tlZFswXS5wb3MueCwgQHRyYWNrZWRbMF0ucG9zLnkpXHJcbiAgICAgICAgICAjIGNvbnNvbGUubG9nIFwiVEFQICN7d29ybGRQb3MueH0gI3t3b3JsZFBvcy55fSAje0BjYW1lcmEuc2Nyb2xsWH0gI3tAY2FtZXJhLnNjcm9sbFl9ICN7QGNhbWVyYS56b29tfVwiXHJcbiAgICAgICAgICBAc2NlbmUudGFwKHdvcmxkUG9zLngsIHdvcmxkUG9zLnkpXHJcblxyXG4gICAgICBAdHJhY2tlZC5zcGxpY2UoaW5kZXgsIDEpXHJcbiAgICAgIGlmIEB0cmFja2VkLmxlbmd0aCA9PSAxXHJcbiAgICAgICAgQHNldERyYWdQb2ludCgpXHJcblxyXG4gICAgICBpZiBpbmRleCA8IDJcclxuICAgICAgICAjIFdlIGp1c3QgZm9yZ290IG9uZSBvZiBvdXIgcGluY2ggdG91Y2hlcy4gUGljayBhIG5ldyBhbmNob3Igc3BvdC5cclxuICAgICAgICBAY2FsY1BpbmNoQW5jaG9yKClcclxuXHJcbiAgICAgIEBzY2VuZS5zZXRNYWduaWZ5aW5nR2xhc3MoMCwgMCwgMClcclxuICAgICAgcmV0dXJuXHJcblxyXG4gICAgQHNjZW5lLmlucHV0Lm9uICd3aGVlbCcsIChwb2ludGVyLCBnYW1lT2JqZWN0cywgZGVsdGFYLCBkZWx0YVksIGRlbHRhWikgPT5cclxuICAgICAgQGNhbGNQaW5jaEFuY2hvcihwb2ludGVyLnBvc2l0aW9uLngsIHBvaW50ZXIucG9zaXRpb24ueSlcclxuICAgICAgbmV3Wm9vbSA9IEBjYW1lcmEuem9vbSAqICgxIC0gKGRlbHRhWSAvIDQ4MCkpXHJcbiAgICAgIEBhZGp1c3Rab29tKG5ld1pvb20pXHJcbiAgICAgIEBzY2VuZS5zZXRNYWduaWZ5aW5nR2xhc3MoMCwgMCwgMClcclxuICAgICAgcmV0dXJuXHJcblxyXG4gIGFkanVzdFpvb206IChuZXdab29tKSAtPlxyXG4gICAgaWYgbmV3Wm9vbSA8IDAuMVxyXG4gICAgICBuZXdab29tID0gMC4xXHJcbiAgICBpZiBuZXdab29tID4gNVxyXG4gICAgICBuZXdab29tID0gNVxyXG4gICAgQGNhbWVyYS56b29tID0gbmV3Wm9vbVxyXG5cclxuICAgIGhhbGZXID0gKEBjYW1lcmEud2lkdGggLyAyKVxyXG4gICAgaGFsZkggPSAoQGNhbWVyYS5oZWlnaHQgLyAyKVxyXG4gICAgb2Zmc2V0WCA9IChAcGluY2hBbmNob3IueCAtIGhhbGZXKSAvIG5ld1pvb21cclxuICAgIG9mZnNldFkgPSAoQHBpbmNoQW5jaG9yLnkgLSBoYWxmSCkgLyBuZXdab29tXHJcbiAgICBAY2FtZXJhLnNjcm9sbFggPSBAcGluY2hBbmNob3JXb3JsZC54IC0gaGFsZlcgLSBvZmZzZXRYXHJcbiAgICBAY2FtZXJhLnNjcm9sbFkgPSBAcGluY2hBbmNob3JXb3JsZC55IC0gaGFsZkggLSBvZmZzZXRZXHJcbiAgICByZXR1cm5cclxuXHJcbiAgc2V0RHJhZ1BvaW50OiAtPlxyXG4gICAgQGRyYWdYID0gQHRyYWNrZWRbMF0ucG9zLnhcclxuICAgIEBkcmFnWSA9IEB0cmFja2VkWzBdLnBvcy55XHJcblxyXG4gIGNhbGNQaW5jaEFuY2hvcjogKHBpbmNoWCA9IG51bGwsIHBpbmNoWSA9IG51bGwpIC0+XHJcbiAgICBpZiAocGluY2hYID09IG51bGwpIGFuZCAocGluY2hZID09IG51bGwpXHJcbiAgICAgIGlmIEB0cmFja2VkLmxlbmd0aCA8IDJcclxuICAgICAgICByZXR1cm5cclxuICAgICAgcGluY2hYID0gTWF0aC5mbG9vcigoQHRyYWNrZWRbMF0ucG9zLnggKyBAdHJhY2tlZFsxXS5wb3MueCkgLyAyKVxyXG4gICAgICBwaW5jaFkgPSBNYXRoLmZsb29yKChAdHJhY2tlZFswXS5wb3MueSArIEB0cmFja2VkWzFdLnBvcy55KSAvIDIpXHJcblxyXG4gICAgQHBpbmNoQW5jaG9yID0ge3g6IHBpbmNoWCwgeTogcGluY2hZIH1cclxuICAgIEBwaW5jaEFuY2hvcldvcmxkID0gQGNhbWVyYS5nZXRXb3JsZFBvaW50KHBpbmNoWCwgcGluY2hZKVxyXG5cclxuICAgIEBzY2VuZS5zZXRNYWduaWZ5aW5nR2xhc3MoQHBpbmNoQW5jaG9yLngsIEBwaW5jaEFuY2hvci55LCAxKVxyXG5cclxuICBjYWxjRGlzdGFuY2U6ICh4MSwgeTEsIHgyLCB5MikgLT5cclxuICAgIGR4ID0geDIgLSB4MVxyXG4gICAgZHkgPSB5MiAtIHkxXHJcbiAgICByZXR1cm4gTWF0aC5zcXJ0KGR4KmR4ICsgZHkqZHkpXHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IFRvdWNoSW50ZXJwcmV0ZXJcclxuIiwiQkdNR2FtZVNjZW5lID0gcmVxdWlyZSAnLi9CR01HYW1lU2NlbmUnXHJcbkJHTUh1ZFNjZW5lID0gcmVxdWlyZSAnLi9CR01IdWRTY2VuZSdcclxuXHJcbmluaXQgPSAtPlxyXG4gIGNvbnNvbGUubG9nIFwiQmFkIEd1eSBNaW5lc3dlZXBlcjogaW5pdCgpXCJcclxuXHJcbiAgY29uZmlnID1cclxuICAgIHR5cGU6IFBoYXNlci5BVVRPXHJcbiAgICB3aWR0aDogZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LmNsaWVudFdpZHRoXHJcbiAgICBoZWlnaHQ6IGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5jbGllbnRIZWlnaHRcclxuICAgIGJhY2tncm91bmRDb2xvcjogJyMwMDAwMDAnICMgJyMyZDJkMmQnXHJcbiAgICBwYXJlbnQ6ICdzY3JlZW4nXHJcbiAgICBpbnB1dDpcclxuICAgICAgYWN0aXZlUG9pbnRlcnM6IDJcclxuICAgIHNjZW5lOiBbXHJcbiAgICAgIEJHTUdhbWVTY2VuZVxyXG4gICAgICBCR01IdWRTY2VuZVxyXG4gICAgXVxyXG5cclxuICBnYW1lID0gbmV3IFBoYXNlci5HYW1lKGNvbmZpZylcclxuXHJcblxyXG53aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignbG9hZCcsIChlKSAtPlxyXG4gICAgaW5pdCgpXHJcbiwgZmFsc2UpXHJcbiJdfQ==
