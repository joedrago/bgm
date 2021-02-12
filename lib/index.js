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
    this.ms.addEventListener(this.msEvent.bind(this));
    this.recreateDisplayList();
    this.ms.updateAll();
    return this.touch.create(this, this.cameras.main, 0, 0, split, this.cameras.main.height);
  }

  msEvent(ev, args) {
    switch (ev) {
      case 'new':
        if ((this.ms.width !== this.gridCols) || (this.ms.height !== this.gridRows)) {
          return this.recreateDisplayList();
        }
        break;
      case 'cell':
        return this.grid[args[0]][args[1]].setTexture(args[2]);
      case 'life':
        this.scene.get('hud').debugText.text = `Are you suuuuuuure? (${args[0]})`;
        return this.cameras.main.shake(300, 0.001);
    }
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
    this.scene.get('hud').toggleMode();
    return this.ms.save();
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
      this.ms.updateAll();
    }
    return this.ms.save();
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
var MineSweeper, propsToSave;

propsToSave = ['seed', 'width', 'height', 'bomb', 'visible', 'lives', 'mineCount', 'gameover'];

MineSweeper = class MineSweeper {
  constructor() {
    this.listeners = [];
    if (!this.load()) {
      this.newGame();
    }
  }

  load() {
    var data, k, l, len, len1, p, rawData;
    rawData = localStorage.getItem("save");
    if (rawData == null) {
      return false;
    }
    try {
      data = JSON.parse(rawData);
    } catch (error) {
      data = null;
    }
    if (data == null) {
      return false;
    }
    for (k = 0, len = propsToSave.length; k < len; k++) {
      p = propsToSave[k];
      if (!data.hasOwnProperty(p)) {
        return false;
      }
    }
    for (l = 0, len1 = propsToSave.length; l < len1; l++) {
      p = propsToSave[l];
      this[p] = data[p];
    }
    return true;
  }

  save() {
    var data, k, len, p;
    data = {};
    for (k = 0, len = propsToSave.length; k < len; k++) {
      p = propsToSave[k];
      data[p] = this[p];
    }
    return localStorage.setItem("save", JSON.stringify(data));
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

  newGame(width = 16, height = 16, mineCount = 0, seed = String(Math.floor(Math.random() * 1000000))) {
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
    this.save();
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvQkdNR2FtZVNjZW5lLmNvZmZlZSIsInNyYy9CR01IdWRTY2VuZS5jb2ZmZWUiLCJzcmMvTWluZVN3ZWVwZXIuY29mZmVlIiwic3JjL1RvdWNoSW50ZXJwcmV0ZXIuY29mZmVlIiwic3JjL21haW4uY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUEsSUFBQSxZQUFBLEVBQUE7O0FBQUEsZ0JBQUEsR0FBbUIsT0FBQSxDQUFRLG9CQUFSOztBQUViLGVBQU4sTUFBQSxhQUFBLFFBQTJCLE1BQU0sQ0FBQyxNQUFsQztFQUNFLFdBQWEsQ0FBQSxDQUFBO1NBQ1gsQ0FBQTtJQUNBLE1BQU0sQ0FBQyxLQUFLLENBQUMsSUFBYixDQUFrQixJQUFsQixFQUF3QjtNQUFFLEdBQUEsRUFBSyxNQUFQO01BQWUsTUFBQSxFQUFRO0lBQXZCLENBQXhCO0lBRUEsSUFBQyxDQUFBLEVBQUQsR0FBTSxPQUFBLENBQVEsZUFBUjtJQUNOLElBQUMsQ0FBQSxLQUFELEdBQVMsSUFBSSxnQkFBSixDQUFBO0VBTEU7O0VBT2IsT0FBUyxDQUFBLENBQUE7SUFDUCxJQUFDLENBQUEsSUFBSSxDQUFDLEtBQU4sQ0FBWSxPQUFaLEVBQXFCLGtCQUFyQjtJQUNBLElBQUMsQ0FBQSxJQUFJLENBQUMsS0FBTixDQUFZLE1BQVosRUFBb0Isd0JBQXBCO0lBQ0EsSUFBQyxDQUFBLElBQUksQ0FBQyxLQUFOLENBQVksTUFBWixFQUFvQixrQkFBcEI7SUFDQSxJQUFDLENBQUEsSUFBSSxDQUFDLEtBQU4sQ0FBWSxXQUFaLEVBQXlCLHNCQUF6QjtJQUNBLElBQUMsQ0FBQSxJQUFJLENBQUMsS0FBTixDQUFZLGNBQVosRUFBNEIseUJBQTVCO0lBQ0EsSUFBQyxDQUFBLElBQUksQ0FBQyxLQUFOLENBQVksZ0JBQVosRUFBOEIsMkJBQTlCO0lBRUEsSUFBQyxDQUFBLElBQUksQ0FBQyxLQUFOLENBQVksU0FBWixFQUF1QixvQkFBdkI7SUFDQSxJQUFDLENBQUEsSUFBSSxDQUFDLEtBQU4sQ0FBWSxTQUFaLEVBQXVCLG9CQUF2QjtJQUNBLElBQUMsQ0FBQSxJQUFJLENBQUMsS0FBTixDQUFZLFNBQVosRUFBdUIsb0JBQXZCO0lBQ0EsSUFBQyxDQUFBLElBQUksQ0FBQyxLQUFOLENBQVksU0FBWixFQUF1QixvQkFBdkI7SUFDQSxJQUFDLENBQUEsSUFBSSxDQUFDLEtBQU4sQ0FBWSxTQUFaLEVBQXVCLG9CQUF2QjtJQUNBLElBQUMsQ0FBQSxJQUFJLENBQUMsS0FBTixDQUFZLFNBQVosRUFBdUIsb0JBQXZCO0lBQ0EsSUFBQyxDQUFBLElBQUksQ0FBQyxLQUFOLENBQVksU0FBWixFQUF1QixvQkFBdkI7SUFDQSxJQUFDLENBQUEsSUFBSSxDQUFDLEtBQU4sQ0FBWSxTQUFaLEVBQXVCLG9CQUF2QjtJQUNBLElBQUMsQ0FBQSxJQUFJLENBQUMsS0FBTixDQUFZLFNBQVosRUFBdUIsb0JBQXZCO0lBRUEsSUFBQyxDQUFBLElBQUksQ0FBQyxLQUFOLENBQVksT0FBWixFQUFxQixrQkFBckI7SUFDQSxJQUFDLENBQUEsSUFBSSxDQUFDLEtBQU4sQ0FBWSxPQUFaLEVBQXFCLGtCQUFyQjtJQUNBLElBQUMsQ0FBQSxJQUFJLENBQUMsS0FBTixDQUFZLE9BQVosRUFBcUIsa0JBQXJCO0lBQ0EsSUFBQyxDQUFBLElBQUksQ0FBQyxLQUFOLENBQVksT0FBWixFQUFxQixrQkFBckI7SUFDQSxJQUFDLENBQUEsSUFBSSxDQUFDLEtBQU4sQ0FBWSxPQUFaLEVBQXFCLGtCQUFyQjtJQUNBLElBQUMsQ0FBQSxJQUFJLENBQUMsS0FBTixDQUFZLE9BQVosRUFBcUIsa0JBQXJCO0lBQ0EsSUFBQyxDQUFBLElBQUksQ0FBQyxLQUFOLENBQVksT0FBWixFQUFxQixrQkFBckI7SUFDQSxJQUFDLENBQUEsSUFBSSxDQUFDLEtBQU4sQ0FBWSxPQUFaLEVBQXFCLGtCQUFyQjtJQUNBLElBQUMsQ0FBQSxJQUFJLENBQUMsS0FBTixDQUFZLE9BQVosRUFBcUIsa0JBQXJCO0lBRUEsSUFBQyxDQUFBLElBQUksQ0FBQyxLQUFOLENBQVksT0FBWixFQUFxQixrQkFBckI7SUFDQSxJQUFDLENBQUEsSUFBSSxDQUFDLEtBQU4sQ0FBWSxPQUFaLEVBQXFCLGtCQUFyQjtJQUNBLElBQUMsQ0FBQSxJQUFJLENBQUMsS0FBTixDQUFZLE9BQVosRUFBcUIsa0JBQXJCO0lBQ0EsSUFBQyxDQUFBLElBQUksQ0FBQyxLQUFOLENBQVksT0FBWixFQUFxQixrQkFBckI7SUFDQSxJQUFDLENBQUEsSUFBSSxDQUFDLEtBQU4sQ0FBWSxPQUFaLEVBQXFCLGtCQUFyQjtJQUNBLElBQUMsQ0FBQSxJQUFJLENBQUMsS0FBTixDQUFZLE9BQVosRUFBcUIsa0JBQXJCO0lBQ0EsSUFBQyxDQUFBLElBQUksQ0FBQyxLQUFOLENBQVksT0FBWixFQUFxQixrQkFBckI7SUFDQSxJQUFDLENBQUEsSUFBSSxDQUFDLEtBQU4sQ0FBWSxPQUFaLEVBQXFCLGtCQUFyQjtXQUNBLElBQUMsQ0FBQSxJQUFJLENBQUMsS0FBTixDQUFZLE9BQVosRUFBcUIsa0JBQXJCO0VBcENPOztFQXNDVCxNQUFRLENBQUEsQ0FBQTtBQUNWLFFBQUE7SUFBSSxLQUFBLEdBQVEsSUFBSSxDQUFDLEtBQUwsQ0FBVyxJQUFDLENBQUEsT0FBTyxDQUFDLElBQUksQ0FBQyxLQUFkLEdBQXNCLEdBQWpDO0lBQ1IsSUFBQyxDQUFBLE9BQU8sQ0FBQyxJQUFJLENBQUMsV0FBZCxDQUEwQixDQUExQixFQUE2QixDQUE3QixFQUFnQyxLQUFoQyxFQUF1QyxJQUFDLENBQUEsT0FBTyxDQUFDLElBQUksQ0FBQyxNQUFyRDtJQUVBLElBQUMsQ0FBQSxFQUFFLENBQUMsZ0JBQUosQ0FBcUIsSUFBQyxDQUFBLE9BQU8sQ0FBQyxJQUFULENBQWMsSUFBZCxDQUFyQjtJQUNBLElBQUMsQ0FBQSxtQkFBRCxDQUFBO0lBQ0EsSUFBQyxDQUFBLEVBQUUsQ0FBQyxTQUFKLENBQUE7V0FFQSxJQUFDLENBQUEsS0FBSyxDQUFDLE1BQVAsQ0FBYyxJQUFkLEVBQW9CLElBQUMsQ0FBQSxPQUFPLENBQUMsSUFBN0IsRUFBbUMsQ0FBbkMsRUFBc0MsQ0FBdEMsRUFBeUMsS0FBekMsRUFBZ0QsSUFBQyxDQUFBLE9BQU8sQ0FBQyxJQUFJLENBQUMsTUFBOUQ7RUFSTTs7RUFVUixPQUFTLENBQUMsRUFBRCxFQUFLLElBQUwsQ0FBQTtBQUNQLFlBQU8sRUFBUDtBQUFBLFdBQ08sS0FEUDtRQUVJLElBQUcsQ0FBQyxJQUFDLENBQUEsRUFBRSxDQUFDLEtBQUosS0FBYSxJQUFDLENBQUEsUUFBZixDQUFBLElBQTRCLENBQUMsSUFBQyxDQUFBLEVBQUUsQ0FBQyxNQUFKLEtBQWMsSUFBQyxDQUFBLFFBQWhCLENBQS9CO2lCQUNFLElBQUMsQ0FBQSxtQkFBRCxDQUFBLEVBREY7O0FBREc7QUFEUCxXQUlPLE1BSlA7ZUFLSSxJQUFDLENBQUEsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFELENBQUwsQ0FBUyxDQUFDLElBQUksQ0FBQyxDQUFELENBQUwsQ0FBUyxDQUFDLFVBQXhCLENBQW1DLElBQUksQ0FBQyxDQUFELENBQXZDO0FBTEosV0FNTyxNQU5QO1FBT0ksSUFBQyxDQUFBLEtBQUssQ0FBQyxHQUFQLENBQVcsS0FBWCxDQUFpQixDQUFDLFNBQVMsQ0FBQyxJQUE1QixHQUFtQyxDQUFBLHFCQUFBLENBQUEsQ0FBd0IsSUFBSSxDQUFDLENBQUQsQ0FBNUIsQ0FBQSxDQUFBO2VBQ25DLElBQUMsQ0FBQSxPQUFPLENBQUMsSUFBSSxDQUFDLEtBQWQsQ0FBb0IsR0FBcEIsRUFBeUIsS0FBekI7QUFSSjtFQURPOztFQVdULE1BQVEsQ0FBQSxDQUFBLEVBQUE7O0VBRVIsbUJBQXFCLENBQUEsQ0FBQTtBQUN2QixRQUFBLENBQUEsRUFBQSxDQUFBLEVBQUEsQ0FBQSxFQUFBLENBQUEsRUFBQSxHQUFBLEVBQUE7SUFBSSxPQUFPLENBQUMsR0FBUixDQUFZLHVCQUFaO0lBQ0EsSUFBQyxDQUFBLEdBQUcsQ0FBQyxXQUFXLENBQUMsU0FBakIsQ0FBQTtJQUVBLElBQUMsQ0FBQSxRQUFELEdBQVksSUFBQyxDQUFBLEVBQUUsQ0FBQztJQUNoQixJQUFDLENBQUEsUUFBRCxHQUFZLElBQUMsQ0FBQSxFQUFFLENBQUM7SUFDaEIsSUFBQyxDQUFBLElBQUQsR0FBUSxJQUFJLEtBQUosQ0FBVSxJQUFDLENBQUEsUUFBWDtJQUNSLEtBQVMsd0ZBQVQ7TUFDRSxJQUFDLENBQUEsSUFBSSxDQUFDLENBQUQsQ0FBTCxHQUFXLElBQUksS0FBSixDQUFVLElBQUMsQ0FBQSxRQUFYO01BQ1gsS0FBUyw2RkFBVDtRQUNFLElBQUMsQ0FBQSxJQUFJLENBQUMsQ0FBRCxDQUFHLENBQUMsQ0FBRCxDQUFSLEdBQWMsSUFBQyxDQUFBLEdBQUcsQ0FBQyxLQUFMLENBQVcsQ0FBQSxHQUFJLEVBQWYsRUFBbUIsQ0FBQSxHQUFJLEVBQXZCLEVBQTJCLE9BQTNCO1FBQ2QsSUFBQyxDQUFBLElBQUksQ0FBQyxDQUFELENBQUcsQ0FBQyxDQUFELENBQUcsQ0FBQyxTQUFaLENBQXNCLENBQXRCLEVBQXlCLENBQXpCO01BRkY7SUFGRjtXQUtBLElBQUMsQ0FBQSxTQUFELENBQUE7RUFabUI7O0VBY3JCLFVBQVksQ0FBQSxDQUFBO0FBQ2QsUUFBQSxNQUFBLEVBQUE7SUFBSSxNQUFBLEdBQVMsSUFBQyxDQUFBLFFBQUQsR0FBWTtJQUNyQixNQUFBLEdBQVMsSUFBQyxDQUFBLFFBQUQsR0FBWTtJQUNyQixJQUFDLENBQUEsT0FBTyxDQUFDLElBQUksQ0FBQyxPQUFkLEdBQXdCLENBQUMsTUFBQSxHQUFTLElBQUMsQ0FBQSxPQUFPLENBQUMsSUFBSSxDQUFDLEtBQXhCLENBQUEsR0FBaUM7V0FDekQsSUFBQyxDQUFBLE9BQU8sQ0FBQyxJQUFJLENBQUMsT0FBZCxHQUF3QixDQUFDLE1BQUEsR0FBUyxJQUFDLENBQUEsT0FBTyxDQUFDLElBQUksQ0FBQyxNQUF4QixDQUFBLEdBQWtDO0VBSmhEOztFQU1aLFNBQVcsQ0FBQSxDQUFBO0lBQ1QsSUFBQyxDQUFBLE9BQU8sQ0FBQyxJQUFJLENBQUMsSUFBZCxHQUFxQjtXQUNyQixJQUFDLENBQUEsVUFBRCxDQUFBO0VBRlM7O0VBSVgsT0FBUyxLQUFBLENBQUE7SUFBQyxJQUFDLENBQUEsWUFDYjs7SUFDSSxJQUFHLElBQUMsQ0FBQSxFQUFFLENBQUMsUUFBUDthQUNFLElBQUMsQ0FBQSxFQUFFLENBQUMsT0FBSixDQUFBLEVBREY7O0VBRk87O0VBS1Qsa0JBQW9CLENBQUMsQ0FBRCxFQUFJLENBQUosRUFBTyxLQUFQLENBQUE7V0FDbEIsSUFBQyxDQUFBLEtBQUssQ0FBQyxHQUFQLENBQVcsS0FBWCxDQUFpQixDQUFDLGtCQUFsQixDQUFxQyxDQUFyQyxFQUF3QyxDQUF4QyxFQUEyQyxLQUEzQztFQURrQjs7RUFHcEIsR0FBSyxDQUFDLE1BQUQsRUFBUyxNQUFULENBQUE7SUFDSCxJQUFDLENBQUEsS0FBSyxDQUFDLEdBQVAsQ0FBVyxLQUFYLENBQWlCLENBQUMsVUFBbEIsQ0FBQTtXQUNBLElBQUMsQ0FBQSxFQUFFLENBQUMsSUFBSixDQUFBO0VBRkc7O0VBSUwsR0FBSyxDQUFDLE1BQUQsRUFBUyxNQUFULENBQUE7QUFDUCxRQUFBLENBQUEsRUFBQTtJQUFJLElBQUMsQ0FBQSxLQUFLLENBQUMsR0FBUCxDQUFXLEtBQVgsQ0FBaUIsQ0FBQyxTQUFTLENBQUMsSUFBNUIsR0FBbUM7SUFFbkMsSUFBRyxJQUFDLENBQUEsRUFBRSxDQUFDLFFBQVA7TUFDRSxPQUFPLENBQUMsR0FBUixDQUFZLDZCQUFaO0FBQ0EsYUFGRjs7SUFJQSxJQUFHLENBQUMsTUFBQSxJQUFVLENBQVgsQ0FBQSxJQUFrQixDQUFDLE1BQUEsR0FBUyxDQUFDLElBQUMsQ0FBQSxRQUFELEdBQVksRUFBYixDQUFWLENBQWxCLElBQWtELENBQUMsTUFBQSxJQUFVLENBQVgsQ0FBbEQsSUFBb0UsQ0FBQyxNQUFBLEdBQVMsQ0FBQyxJQUFDLENBQUEsUUFBRCxHQUFZLEVBQWIsQ0FBVixDQUF2RTtNQUNFLENBQUEsR0FBSSxJQUFJLENBQUMsS0FBTCxDQUFXLE1BQUEsR0FBUyxFQUFwQjtNQUNKLENBQUEsR0FBSSxJQUFJLENBQUMsS0FBTCxDQUFXLE1BQUEsR0FBUyxFQUFwQjtNQUNKLElBQUcsSUFBQyxDQUFBLElBQUQsS0FBUyxNQUFaO1FBQ0UsSUFBQyxDQUFBLEVBQUUsQ0FBQyxJQUFKLENBQVMsQ0FBVCxFQUFZLENBQVosRUFERjtPQUFBLE1BQUE7UUFHRSxJQUFDLENBQUEsRUFBRSxDQUFDLElBQUosQ0FBUyxDQUFULEVBQVksQ0FBWixFQUhGOztNQUlBLElBQUMsQ0FBQSxFQUFFLENBQUMsU0FBSixDQUFBLEVBUEY7O1dBU0EsSUFBQyxDQUFBLEVBQUUsQ0FBQyxJQUFKLENBQUE7RUFoQkc7O0FBekdQOztBQTJIQSxNQUFNLENBQUMsT0FBUCxHQUFpQjs7OztBQzdIakIsSUFBQTs7QUFBTSxjQUFOLE1BQUEsWUFBQSxRQUEwQixNQUFNLENBQUMsTUFBakM7RUFDRSxXQUFhLENBQUEsQ0FBQTtTQUNYLENBQUE7SUFDQSxNQUFNLENBQUMsS0FBSyxDQUFDLElBQWIsQ0FBa0IsSUFBbEIsRUFBd0I7TUFBRSxHQUFBLEVBQUssS0FBUDtNQUFjLE1BQUEsRUFBUTtJQUF0QixDQUF4QjtFQUZXOztFQUliLE9BQVMsQ0FBQSxDQUFBO0lBQ1AsSUFBQyxDQUFBLElBQUksQ0FBQyxLQUFOLENBQVksT0FBWixFQUFxQixrQkFBckI7SUFFQSxJQUFDLENBQUEsSUFBSSxDQUFDLEtBQU4sQ0FBWSxVQUFaLEVBQXdCLHFCQUF4QjtXQUNBLElBQUMsQ0FBQSxJQUFJLENBQUMsS0FBTixDQUFZLFVBQVosRUFBd0IscUJBQXhCO0VBSk87O0VBTVQsTUFBUSxDQUFBLENBQUE7SUFDTixJQUFDLENBQUEsTUFBRCxHQUFVLElBQUksQ0FBQyxLQUFMLENBQVcsSUFBQyxDQUFBLE9BQU8sQ0FBQyxJQUFJLENBQUMsS0FBZCxHQUFzQixHQUFqQztJQUNWLElBQUMsQ0FBQSxNQUFELEdBQVU7SUFDVixJQUFDLENBQUEsTUFBRCxHQUFVLElBQUMsQ0FBQSxPQUFPLENBQUMsSUFBSSxDQUFDLEtBQWQsR0FBc0IsSUFBQyxDQUFBO0lBQ2pDLElBQUMsQ0FBQSxNQUFELEdBQVUsSUFBQyxDQUFBLE9BQU8sQ0FBQyxJQUFJLENBQUM7SUFFeEIsSUFBQyxDQUFBLGVBQUQsR0FBbUIsSUFBQyxDQUFBLEdBQUcsQ0FBQyxRQUFMLENBQUE7SUFDbkIsSUFBQyxDQUFBLGVBQWUsQ0FBQyxTQUFqQixDQUEyQixRQUEzQixFQUFxQyxDQUFyQztJQUNBLElBQUMsQ0FBQSxlQUFlLENBQUMsUUFBakIsQ0FBMEIsSUFBQyxDQUFBLE1BQTNCLEVBQW1DLElBQUMsQ0FBQSxNQUFwQyxFQUE0QyxJQUFDLENBQUEsTUFBN0MsRUFBcUQsSUFBQyxDQUFBLE1BQXREO0lBQ0EsSUFBQyxDQUFBLGVBQWUsQ0FBQyxTQUFqQixDQUEyQixDQUEzQixFQUE4QixRQUE5QixFQUF3QyxHQUF4QztJQUNBLElBQUMsQ0FBQSxlQUFlLENBQUMsVUFBakIsQ0FBNEIsSUFBQyxDQUFBLE1BQTdCLEVBQXFDLElBQUMsQ0FBQSxNQUF0QyxFQUE4QyxJQUFDLENBQUEsTUFBL0MsRUFBdUQsSUFBQyxDQUFBLE1BQXhEO0lBRUEsSUFBQyxDQUFBLE1BQUQsR0FBVSxJQUFDLENBQUEsR0FBRyxDQUFDLEtBQUwsQ0FBVyxJQUFDLENBQUEsTUFBRCxHQUFVLENBQUMsSUFBQyxDQUFBLE1BQUQsR0FBVSxDQUFYLENBQXJCLEVBQW9DLElBQUMsQ0FBQSxNQUFELEdBQVUsQ0FBQyxJQUFDLENBQUEsTUFBRCxHQUFVLENBQVgsQ0FBOUMsRUFBNkQsVUFBN0Q7SUFDVixJQUFDLENBQUEsTUFBTSxDQUFDLGNBQVIsQ0FBdUIsSUFBQyxDQUFBLE1BQUQsR0FBVSxHQUFqQyxFQUFzQyxJQUFDLENBQUEsTUFBRCxHQUFVLEdBQWhEO0lBQ0EsSUFBQyxDQUFBLE1BQU0sQ0FBQyxjQUFSLENBQUE7SUFDQSxJQUFDLENBQUEsTUFBTSxDQUFDLEVBQVIsQ0FBVyxhQUFYLEVBQTBCLENBQUEsQ0FBQSxHQUFBO2FBQ3hCLElBQUMsQ0FBQSxVQUFELENBQUE7SUFEd0IsQ0FBMUI7SUFFQSxJQUFDLENBQUEsVUFBRCxDQUFBO0lBRUEsSUFBQyxDQUFBLFNBQUQsR0FBYSxJQUFDLENBQUEsR0FBRyxDQUFDLElBQUwsQ0FBVSxDQUFWLEVBQWEsQ0FBYixFQUFnQixFQUFoQjtJQUNiLElBQUMsQ0FBQSxLQUFELEdBQVMsSUFBQyxDQUFBLEdBQUcsQ0FBQyxLQUFMLENBQVcsRUFBWCxFQUFlLEVBQWYsRUFBbUIsT0FBbkI7SUFDVCxJQUFDLENBQUEsS0FBSyxDQUFDLFNBQVAsQ0FBaUIsR0FBakIsRUFBc0IsR0FBdEIsRUFwQko7V0FxQkksSUFBQyxDQUFBLEtBQUssQ0FBQyxLQUFQLEdBQWU7RUF0QlQ7O0VBd0JSLFVBQVksQ0FBQSxDQUFBO0lBQ1YsSUFBRyxJQUFDLENBQUEsSUFBRCxLQUFTLE1BQVo7TUFDRSxJQUFDLENBQUEsSUFBRCxHQUFRLE9BRFY7S0FBQSxNQUFBO01BR0UsSUFBQyxDQUFBLElBQUQsR0FBUSxPQUhWOztJQUtBLElBQUMsQ0FBQSxNQUFNLENBQUMsVUFBUixDQUFtQixDQUFBLElBQUEsQ0FBQSxDQUFPLElBQUMsQ0FBQSxJQUFSLENBQUEsQ0FBbkI7V0FDQSxJQUFDLENBQUEsS0FBSyxDQUFDLEdBQVAsQ0FBVyxNQUFYLENBQWtCLENBQUMsT0FBbkIsQ0FBMkIsSUFBQyxDQUFBLElBQTVCO0VBUFU7O0VBU1osTUFBUSxDQUFBLENBQUEsRUFBQTs7RUFFUixrQkFBb0IsQ0FBQyxDQUFELEVBQUksQ0FBSixFQUFPLEtBQVAsQ0FBQTtJQUNsQixJQUFDLENBQUEsS0FBSyxDQUFDLENBQVAsR0FBVztJQUNYLElBQUMsQ0FBQSxLQUFLLENBQUMsQ0FBUCxHQUFXO1dBQ1gsSUFBQyxDQUFBLEtBQUssQ0FBQyxLQUFQLEdBQWU7RUFIRzs7QUE5Q3RCOztBQW9EQSxNQUFNLENBQUMsT0FBUCxHQUFpQjs7OztBQ3BEakIsSUFBQSxXQUFBLEVBQUE7O0FBQUEsV0FBQSxHQUFjLENBQ1osTUFEWSxFQUVaLE9BRlksRUFHWixRQUhZLEVBSVosTUFKWSxFQUtaLFNBTFksRUFNWixPQU5ZLEVBT1osV0FQWSxFQVFaLFVBUlk7O0FBV1IsY0FBTixNQUFBLFlBQUE7RUFDRSxXQUFhLENBQUEsQ0FBQTtJQUNYLElBQUMsQ0FBQSxTQUFELEdBQWE7SUFDYixJQUFHLENBQUksSUFBQyxDQUFBLElBQUQsQ0FBQSxDQUFQO01BQ0UsSUFBQyxDQUFBLE9BQUQsQ0FBQSxFQURGOztFQUZXOztFQUtiLElBQU0sQ0FBQSxDQUFBO0FBQ1IsUUFBQSxJQUFBLEVBQUEsQ0FBQSxFQUFBLENBQUEsRUFBQSxHQUFBLEVBQUEsSUFBQSxFQUFBLENBQUEsRUFBQTtJQUFJLE9BQUEsR0FBVSxZQUFZLENBQUMsT0FBYixDQUFxQixNQUFyQjtJQUNWLElBQU8sZUFBUDtBQUNFLGFBQU8sTUFEVDs7QUFFQTtNQUNFLElBQUEsR0FBTyxJQUFJLENBQUMsS0FBTCxDQUFXLE9BQVgsRUFEVDtLQUVBLGFBQUE7TUFDRSxJQUFBLEdBQU8sS0FEVDs7SUFHQSxJQUFPLFlBQVA7QUFDRSxhQUFPLE1BRFQ7O0lBR0EsS0FBQSw2Q0FBQTs7TUFDRSxJQUFHLENBQUksSUFBSSxDQUFDLGNBQUwsQ0FBb0IsQ0FBcEIsQ0FBUDtBQUNFLGVBQU8sTUFEVDs7SUFERjtJQUlBLEtBQUEsK0NBQUE7O01BQ0UsSUFBSSxDQUFDLENBQUQsQ0FBSixHQUFVLElBQUksQ0FBQyxDQUFEO0lBRGhCO0FBRUEsV0FBTztFQWxCSDs7RUFvQk4sSUFBTSxDQUFBLENBQUE7QUFDUixRQUFBLElBQUEsRUFBQSxDQUFBLEVBQUEsR0FBQSxFQUFBO0lBQUksSUFBQSxHQUFPLENBQUE7SUFDUCxLQUFBLDZDQUFBOztNQUNFLElBQUksQ0FBQyxDQUFELENBQUosR0FBVSxJQUFJLENBQUMsQ0FBRDtJQURoQjtXQUVBLFlBQVksQ0FBQyxPQUFiLENBQXFCLE1BQXJCLEVBQTZCLElBQUksQ0FBQyxTQUFMLENBQWUsSUFBZixDQUE3QjtFQUpJOztFQU1OLGdCQUFrQixDQUFDLEdBQUQsQ0FBQTtXQUNoQixJQUFDLENBQUEsU0FBUyxDQUFDLElBQVgsQ0FBZ0IsR0FBaEI7RUFEZ0I7O0VBR2xCLElBQU0sQ0FBQyxDQUFELENBQUE7QUFDSixXQUFPLElBQUksQ0FBQyxLQUFMLENBQVcsSUFBSSxDQUFDLFNBQUwsQ0FBQSxDQUFBLEdBQW1CLENBQTlCO0VBREg7O0VBR04sU0FBVyxDQUFDLENBQUQsRUFBSSxDQUFKLEVBQU8sYUFBUCxDQUFBO0FBQ2IsUUFBQSxDQUFBLEVBQUEsQ0FBQSxFQUFBLEVBQUEsRUFBQSxFQUFBLEVBQUEsQ0FBQSxFQUFBLEVBQUEsRUFBQTtJQUFJLENBQUEsR0FBSTtJQUNKLEVBQUEsR0FBSyxJQUFJLENBQUMsR0FBTCxDQUFTLENBQUEsR0FBSSxDQUFiLEVBQWdCLENBQWhCO0lBQ0wsRUFBQSxHQUFLLElBQUksQ0FBQyxHQUFMLENBQVMsSUFBQyxDQUFBLEtBQUQsR0FBUyxDQUFsQixFQUFxQixDQUFBLEdBQUksQ0FBekI7SUFDTCxFQUFBLEdBQUssSUFBSSxDQUFDLEdBQUwsQ0FBUyxDQUFBLEdBQUksQ0FBYixFQUFnQixDQUFoQjtJQUNMLEVBQUEsR0FBSyxJQUFJLENBQUMsR0FBTCxDQUFTLElBQUMsQ0FBQSxNQUFELEdBQVUsQ0FBbkIsRUFBc0IsQ0FBQSxHQUFJLENBQTFCO0lBQ0wsQ0FBQSxHQUFJO0FBQ0osV0FBTSxDQUFBLElBQUssRUFBWDtNQUNFLENBQUEsR0FBSTtBQUNKLGFBQU0sQ0FBQSxJQUFLLEVBQVg7UUFDRSxJQUFHLENBQUEsS0FBSyxDQUFMLElBQVUsQ0FBQSxLQUFLLENBQWxCO1VBQ0UsSUFBRyxDQUFDLGFBQUQsSUFBa0IsQ0FBQyxJQUFDLENBQUEsT0FBTyxDQUFDLENBQUEsR0FBSSxDQUFBLEdBQUksSUFBQyxDQUFBLEtBQVYsQ0FBUixLQUE0QixDQUE3QixDQUFyQjtZQUNFLElBQUcsSUFBQyxDQUFBLElBQUksQ0FBQyxDQUFBLEdBQUksQ0FBQSxHQUFJLElBQUMsQ0FBQSxLQUFWLENBQUwsS0FBeUIsQ0FBNUI7Y0FDRSxFQUFFLEVBREo7YUFERjtXQURGOztRQUlBLEVBQUU7TUFMSjtNQU1BLEVBQUU7SUFSSjtBQVNBLFdBQU87RUFoQkU7O0VBa0JYLHNCQUF3QixDQUFDLENBQUQsRUFBSSxDQUFKLENBQUE7QUFDMUIsUUFBQSxDQUFBLEVBQUEsQ0FBQSxFQUFBLEVBQUEsRUFBQSxFQUFBLEVBQUEsQ0FBQSxFQUFBLEVBQUEsRUFBQTtJQUFJLEVBQUEsR0FBSyxJQUFJLENBQUMsR0FBTCxDQUFTLENBQUEsR0FBSSxDQUFiLEVBQWdCLENBQWhCO0lBQ0wsRUFBQSxHQUFLLElBQUksQ0FBQyxHQUFMLENBQVMsSUFBQyxDQUFBLEtBQUQsR0FBUyxDQUFsQixFQUFxQixDQUFBLEdBQUksQ0FBekI7SUFDTCxFQUFBLEdBQUssSUFBSSxDQUFDLEdBQUwsQ0FBUyxDQUFBLEdBQUksQ0FBYixFQUFnQixDQUFoQjtJQUNMLEVBQUEsR0FBSyxJQUFJLENBQUMsR0FBTCxDQUFTLElBQUMsQ0FBQSxNQUFELEdBQVUsQ0FBbkIsRUFBc0IsQ0FBQSxHQUFJLENBQTFCO0lBQ0wsQ0FBQSxHQUFJO0FBQ0osV0FBTSxDQUFBLElBQUssRUFBWDtNQUNFLENBQUEsR0FBSTtBQUNKLGFBQU0sQ0FBQSxJQUFLLEVBQVg7UUFDRSxJQUFHLENBQUEsS0FBSyxDQUFMLElBQVUsQ0FBQSxLQUFLLENBQWxCO1VBQ0UsSUFBRyxJQUFDLENBQUEsT0FBTyxDQUFDLENBQUEsR0FBSSxDQUFBLEdBQUksSUFBQyxDQUFBLEtBQVYsQ0FBUixLQUE0QixDQUEvQjtZQUNFLENBQUEsR0FBSSxJQUFDLENBQUEsU0FBRCxDQUFXLENBQVgsRUFBYyxDQUFkLEVBQWlCLEtBQWpCO1lBQ0osSUFBRyxDQUFBLEtBQUssQ0FBUjtBQUNFLHFCQUFPLEtBRFQ7YUFGRjtXQURGOztRQUtBLEVBQUU7TUFOSjtNQU9BLEVBQUU7SUFUSjtBQVVBLFdBQU87RUFoQmU7O0VBa0J4QixRQUFVLENBQUEsQ0FBQTtBQUNaLFFBQUEsR0FBQSxFQUFBLENBQUEsRUFBQSxHQUFBLEVBQUE7SUFBSSxJQUFDLENBQUEsS0FBRCxJQUFVO0lBQ1YsSUFBRyxJQUFDLENBQUEsS0FBRCxHQUFTLENBQVo7QUFDRTtNQUFBLEtBQUEscUNBQUE7O1FBQ0UsR0FBQSxDQUFJLE1BQUosRUFBWSxDQUFDLElBQUMsQ0FBQSxLQUFGLENBQVo7TUFERjtBQUVBLGFBQU8sTUFIVDs7QUFJQSxXQUFPO0VBTkM7O0VBUVYsVUFBWSxDQUFDLENBQUQsRUFBSSxDQUFKLEVBQU8sTUFBUCxDQUFBO0FBQ2QsUUFBQSxHQUFBLEVBQUEsS0FBQSxFQUFBLEtBQUEsRUFBQSxNQUFBLEVBQUEsU0FBQSxFQUFBLENBQUEsRUFBQSxHQUFBLEVBQUEsQ0FBQSxFQUFBLEdBQUEsRUFBQTtJQUFJLEtBQUEsR0FBUTtJQUNSLEtBQUEsR0FBUSxDQUFBLEdBQUksQ0FBQSxHQUFJLElBQUMsQ0FBQTtJQUNqQixNQUFBLEdBQVMsSUFBQyxDQUFBLElBQUksQ0FBQyxLQUFEO0lBQ2QsU0FBQSxHQUFZLElBQUMsQ0FBQSxPQUFPLENBQUMsS0FBRDtJQUNwQixDQUFBLEdBQUksSUFBQyxDQUFBLFNBQUQsQ0FBVyxDQUFYLEVBQWMsQ0FBZCxFQUFpQixLQUFqQjtJQUNKLElBQUcsU0FBQSxLQUFhLENBQWhCO01BQ0UsSUFBRyxNQUFIO1FBQ0UsSUFBRyxNQUFBLEtBQVUsQ0FBYjtVQUNFLEtBQUEsR0FBUSxlQURWO1NBQUEsTUFBQTtVQUdFLEtBQUEsR0FBUSxRQUFBLEdBQVcsRUFIckI7U0FERjtPQUFBLE1BQUE7UUFNRSxLQUFBLEdBQVEsUUFOVjtPQURGO0tBQUEsTUFBQTtNQVNFLElBQUcsTUFBQSxLQUFVLENBQWI7UUFDRSxJQUFHLFNBQUEsS0FBYSxDQUFoQjtVQUNFLEtBQUEsR0FBUSxZQURWO1NBQUEsTUFBQTtVQUdFLFNBQUEsR0FBWSxJQUFDLENBQUEsU0FBRCxDQUFXLENBQVgsRUFBYyxDQUFkLEVBQWlCLElBQWpCO1VBQ1osSUFBRyxTQUFBLEtBQWEsQ0FBaEI7WUFDRSxDQUFBLEdBQUksRUFETjs7VUFFQSxLQUFBLEdBQVEsTUFBQSxHQUFTLEVBTm5CO1NBREY7T0FBQSxNQUFBO1FBU0UsSUFBRyxTQUFBLEtBQWEsQ0FBaEI7VUFDRSxLQUFBLEdBQVEsaUJBRFY7U0FBQSxNQUFBO1VBR0UsS0FBQSxHQUFRLE1BQUEsR0FBUyxFQUhuQjtTQVRGO09BVEY7O0FBc0JBO0lBQUEsS0FBQSxxQ0FBQTs7TUFDRSxHQUFBLENBQUksTUFBSixFQUFZLENBQUMsQ0FBRCxFQUFJLENBQUosRUFBTyxLQUFQLENBQVo7SUFERjtFQTVCVTs7RUFnQ1osU0FBVyxDQUFDLFNBQVMsS0FBVixDQUFBO0FBQ2IsUUFBQSxDQUFBLEVBQUEsQ0FBQSxFQUFBO0lBQUksSUFBRyxJQUFDLENBQUEsU0FBUyxDQUFDLE1BQVgsS0FBcUIsQ0FBeEI7QUFDRSxhQURGOztJQUdBLFNBQUEsR0FBWTtBQUNaLFdBQU0sU0FBTjtNQUNFLFNBQUEsR0FBWTtNQUNaLENBQUEsR0FBSTtBQUNKLGFBQU0sQ0FBQSxHQUFJLElBQUMsQ0FBQSxNQUFYO1FBQ0UsQ0FBQSxHQUFJO0FBQ0osZUFBTSxDQUFBLEdBQUksSUFBQyxDQUFBLEtBQVg7VUFDRSxJQUFHLENBQUMsSUFBQyxDQUFBLElBQUksQ0FBQyxDQUFBLEdBQUksQ0FBQSxHQUFJLElBQUMsQ0FBQSxLQUFWLENBQUwsS0FBeUIsQ0FBMUIsQ0FBQSxJQUFpQyxJQUFDLENBQUEsc0JBQUQsQ0FBd0IsQ0FBeEIsRUFBMkIsQ0FBM0IsQ0FBcEM7WUFDRSxJQUFHLElBQUMsQ0FBQSxJQUFELENBQU0sQ0FBTixFQUFTLENBQVQsQ0FBSDtjQUNFLFNBQUEsR0FBWSxLQURkO2FBREY7O1VBR0EsRUFBRTtRQUpKO1FBS0EsRUFBRTtNQVBKO0lBSEY7SUFXQSxDQUFBLEdBQUk7QUFDSixXQUFNLENBQUEsR0FBSSxJQUFDLENBQUEsTUFBWDtNQUNFLENBQUEsR0FBSTtBQUNKLGFBQU0sQ0FBQSxHQUFJLElBQUMsQ0FBQSxLQUFYO1FBQ0UsSUFBQyxDQUFBLFVBQUQsQ0FBWSxDQUFaLEVBQWUsQ0FBZixFQUFrQixNQUFsQjtRQUNBLEVBQUU7TUFGSjtNQUdBLEVBQUU7SUFMSjtFQWpCUzs7RUF5QlgsSUFBTSxDQUFDLENBQUQsRUFBSSxDQUFKLENBQUE7QUFDUixRQUFBO0lBQUksS0FBQSxHQUFRLENBQUEsR0FBSSxDQUFBLEdBQUksSUFBQyxDQUFBO0lBQ2pCLElBQUcsSUFBQyxDQUFBLE9BQU8sQ0FBQyxLQUFELENBQVIsS0FBbUIsQ0FBdEI7TUFDRSxJQUFHLElBQUMsQ0FBQSxJQUFJLENBQUMsS0FBRCxDQUFMLEtBQWdCLENBQW5COzs7UUFHRSxJQUFDLENBQUEsT0FBTyxDQUFDLEtBQUQsQ0FBUixHQUFrQixFQUhwQjtPQUFBLE1BQUE7O1FBTUUsSUFBRyxJQUFDLENBQUEsUUFBRCxDQUFBLENBQUg7VUFDRSxJQUFDLENBQUEsT0FBTyxDQUFDLEtBQUQsQ0FBUixHQUFrQjtVQUNsQixJQUFDLENBQUEsU0FBRCxDQUFXLElBQVg7VUFDQSxJQUFDLENBQUEsUUFBRCxHQUFZO0FBRVosaUJBTEY7U0FORjtPQURGOztFQUZJLENBMUlSOzs7RUEySkUsSUFBTSxDQUFDLENBQUQsRUFBSSxDQUFKLENBQUE7QUFDUixRQUFBLEtBQUEsRUFBQTtJQUFJLEdBQUEsR0FBTTtJQUNOLEtBQUEsR0FBUSxDQUFBLEdBQUksQ0FBQSxHQUFJLElBQUMsQ0FBQTtJQUNqQixJQUFHLElBQUMsQ0FBQSxPQUFPLENBQUMsS0FBRCxDQUFSLEtBQW1CLENBQXRCO01BQ0UsSUFBRyxJQUFDLENBQUEsSUFBSSxDQUFDLEtBQUQsQ0FBTCxLQUFnQixDQUFuQjs7UUFFRSxJQUFHLElBQUMsQ0FBQSxRQUFELENBQUEsQ0FBSDtVQUNFLElBQUMsQ0FBQSxPQUFPLENBQUMsS0FBRCxDQUFSLEdBQWtCO1VBQ2xCLElBQUMsQ0FBQSxRQUFELEdBQVksS0FEdEI7O1VBR1UsSUFBQyxDQUFBLFNBQUQsQ0FBVyxJQUFYO0FBQ0EsaUJBQU8sTUFMVDtTQUFBLE1BQUE7QUFPRSxpQkFBTyxNQVBUO1NBRkY7O01BVUEsSUFBQyxDQUFBLE9BQU8sQ0FBQyxLQUFELENBQVIsR0FBa0I7TUFDbEIsR0FBQSxHQUFNLEtBWlI7O0FBYUEsV0FBTztFQWhCSDs7RUFrQk4sZ0JBQWtCLENBQUEsQ0FBQTtBQUNwQixRQUFBLFNBQUEsRUFBQSxDQUFBLEVBQUEsS0FBQSxFQUFBLENBQUEsRUFBQSxDQUFBLEVBQUE7SUFBSSxTQUFBLEdBQVksSUFBQyxDQUFBLEtBQUQsR0FBUyxJQUFDLENBQUE7SUFDdEIsVUFBQSxHQUFhLElBQUMsQ0FBQSxJQUFELENBQU0sU0FBTjtJQUNiLEtBQUEsR0FBUTtBQUNSLFdBQUEsSUFBQTtNQUNFLENBQUEsR0FBSSxJQUFJLENBQUMsS0FBTCxDQUFXLEtBQUEsR0FBUSxJQUFDLENBQUEsS0FBcEI7TUFDSixDQUFBLEdBQ0UsSUFBSSxDQUFDLEtBQUwsQ0FBVyxLQUFBLEdBQVEsSUFBQyxDQUFBLEtBQXBCO01BQ0YsQ0FBQSxHQUFJLElBQUMsQ0FBQSxTQUFELENBQVcsQ0FBWCxFQUFjLENBQWQsRUFBaUIsS0FBakI7TUFDSixJQUFHLElBQUMsQ0FBQSxJQUFJLENBQUMsS0FBRCxDQUFMLEtBQWdCLENBQWhCLElBQXNCLENBQUEsS0FBSyxDQUE5QjtRQUNFLElBQUMsQ0FBQSxJQUFELENBQU0sQ0FBTixFQUFTLENBQVQ7QUFDQSxlQUZGOztNQUdBLEtBQUEsR0FBUSxDQUFDLEtBQUEsR0FBUSxDQUFULENBQUEsR0FBYztNQUN0QixJQUFHLEtBQUEsS0FBUyxVQUFaO0FBQ0UsY0FERjs7SUFURjtBQVdBLFdBQUEsSUFBQTtNQUNFLENBQUEsR0FBSSxJQUFJLENBQUMsS0FBTCxDQUFXLEtBQUEsR0FBUSxJQUFDLENBQUEsS0FBcEI7TUFDSixDQUFBLEdBQUksSUFBSSxDQUFDLEtBQUwsQ0FBVyxLQUFBLEdBQVEsSUFBQyxDQUFBLEtBQXBCO01BQ0osQ0FBQSxHQUFJLFNBQUEsQ0FBVSxDQUFWLEVBQWEsQ0FBYixFQUFnQixLQUFoQjtNQUNKLElBQUcsSUFBQyxDQUFBLElBQUksQ0FBQyxLQUFELENBQUwsS0FBZ0IsQ0FBbkI7UUFDRSxJQUFDLENBQUEsSUFBRCxDQUFNLENBQU4sRUFBUyxDQUFUO0FBQ0EsZUFGRjs7TUFHQSxLQUFBLEdBQVEsQ0FBQyxLQUFBLEdBQVEsQ0FBVCxDQUFBLEdBQWM7TUFDdEIsSUFBRyxLQUFBLEtBQVMsVUFBWjtBQUNFLGNBREY7O0lBUkY7RUFmZ0I7O0VBMkJsQixPQUFTLFNBQVUsRUFBVixXQUF3QixFQUF4QixjQUF5QyxDQUF6QyxTQUFvRCxNQUFBLENBQU8sSUFBSSxDQUFDLEtBQUwsQ0FBVyxJQUFJLENBQUMsTUFBTCxDQUFBLENBQUEsR0FBZ0IsT0FBM0IsQ0FBUCxDQUFwRCxDQUFBO0FBQ1gsUUFBQSxZQUFBLEVBQUEsU0FBQSxFQUFBLEdBQUEsRUFBQSxDQUFBLEVBQUEsT0FBQSxFQUFBLENBQUEsRUFBQSxDQUFBLEVBQUEsR0FBQSxFQUFBLENBQUEsRUFBQTtJQURZLElBQUMsQ0FBQTtJQUFZLElBQUMsQ0FBQTtJQUFhLElBQUMsQ0FBQTtJQUFlLElBQUMsQ0FBQTtJQUNwRCxJQUFJLENBQUMsYUFBTCxDQUFtQixJQUFDLENBQUEsSUFBcEI7SUFFQSxJQUFDLENBQUEsS0FBRCxHQUFTO0lBRVQsU0FBQSxHQUFZLElBQUMsQ0FBQSxLQUFELEdBQVMsSUFBQyxDQUFBO0lBQ3RCLElBQUcsSUFBQyxDQUFBLFNBQUQsS0FBYyxDQUFqQjtNQUNFLFlBQUEsR0FBZTtNQUNmLElBQUMsQ0FBQSxTQUFELEdBQWEsSUFBSSxDQUFDLEtBQUwsQ0FBVyxTQUFBLEdBQVksWUFBdkIsRUFGZjs7SUFJQSxJQUFDLENBQUEsUUFBRCxHQUFZLE1BVGhCOztJQVlJLElBQUMsQ0FBQSxJQUFELEdBQVEsSUFBSSxLQUFKLENBQVUsU0FBVixDQUFvQixDQUFDLElBQXJCLENBQTBCLENBQTFCO0lBQ1IsSUFBQyxDQUFBLE9BQUQsR0FBVyxJQUFJLEtBQUosQ0FBVSxTQUFWLENBQW9CLENBQUMsSUFBckIsQ0FBMEIsQ0FBMUIsRUFiZjs7SUFnQkksT0FBQSxHQUFVLElBQUksS0FBSixDQUFVLFNBQVY7SUFDVixPQUFPLENBQUMsQ0FBRCxDQUFQLEdBQWE7SUFDYixDQUFBLEdBQUk7QUFDSixXQUFNLENBQUEsR0FBSSxTQUFWO01BQ0UsQ0FBQSxHQUFJLElBQUMsQ0FBQSxJQUFELENBQU0sQ0FBTjtNQUNKLE9BQU8sQ0FBQyxDQUFELENBQVAsR0FBYSxPQUFPLENBQUMsQ0FBRDtNQUNwQixPQUFPLENBQUMsQ0FBRCxDQUFQLEdBQWE7TUFDYixFQUFFO0lBSko7SUFLQSxDQUFBLEdBQUksSUFBQyxDQUFBO0lBQ0wsSUFBRyxDQUFBLElBQUssU0FBUjtNQUNFLENBQUEsR0FBSSxTQUFBLEdBQVksRUFEbEI7O0lBRUEsQ0FBQSxHQUFJO0FBQ0osV0FBTSxDQUFBLEdBQUksQ0FBVjtNQUNFLElBQUMsQ0FBQSxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUQsQ0FBUixDQUFMLEdBQW9CO01BQ3BCLEVBQUU7SUFGSjtJQUdBLElBQUMsQ0FBQSxnQkFBRCxDQUFBO0FBQ0E7SUFBQSxLQUFBLHFDQUFBOztNQUNFLEdBQUEsQ0FBSSxLQUFKLEVBQVcsRUFBWDtJQURGO0lBRUEsSUFBQyxDQUFBLFNBQUQsQ0FBQTtJQUNBLElBQUMsQ0FBQSxJQUFELENBQUE7RUFwQ087O0FBek1YOztBQWdQQSxNQUFNLENBQUMsT0FBUCxHQUFpQixJQUFJLFdBQUosQ0FBQSxFQTNQakI7Ozs7QUNBQSxJQUFBLGVBQUEsRUFBQSxvQkFBQSxFQUFBOztBQUFBLG9CQUFBLEdBQXVCOztBQUN2QixlQUFBLEdBQWtCOztBQUVaLG1CQUFOLE1BQUEsaUJBQUE7RUFDRSxXQUFhLENBQUEsQ0FBQTtJQUNYLElBQUMsQ0FBQSxPQUFELEdBQVc7SUFDWCxJQUFDLENBQUEsS0FBRCxHQUFTO0lBQ1QsSUFBQyxDQUFBLEtBQUQsR0FBUztJQUNULElBQUMsQ0FBQSxRQUFELEdBQVk7SUFDWixJQUFDLENBQUEsZUFBRCxHQUFtQjtJQUNuQixJQUFDLENBQUEsV0FBRCxHQUFlO0lBQ2YsSUFBQyxDQUFBLGdCQUFELEdBQW9CO0VBUFQ7O0VBU2IsTUFBUSxNQUFBLFFBQUEsR0FBQSxHQUFBLEdBQUEsR0FBQSxDQUFBO0lBQUMsSUFBQyxDQUFBO0lBQU8sSUFBQyxDQUFBO0lBQVEsSUFBQyxDQUFBO0lBQUcsSUFBQyxDQUFBO0lBQUcsSUFBQyxDQUFBO0lBQUcsSUFBQyxDQUFBO0lBQ3JDLElBQUMsQ0FBQSxNQUFNLENBQUMsSUFBUixHQUFlO0lBQ2YsSUFBQyxDQUFBLEtBQUssQ0FBQyxLQUFLLENBQUMsVUFBYixDQUF3QixDQUF4QjtJQUNBLElBQUMsQ0FBQSxLQUFLLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxrQkFBbkIsQ0FBQTtJQUVBLElBQUMsQ0FBQSxLQUFLLENBQUMsS0FBSyxDQUFDLEVBQWIsQ0FBZ0IsYUFBaEIsRUFBK0IsQ0FBQyxPQUFELENBQUEsR0FBQTtBQUNuQyxVQUFBLFVBQUEsRUFBQSxHQUFBLEVBQUE7TUFBTSxJQUFHLE9BQU8sQ0FBQyxlQUFSLENBQUEsQ0FBSDtRQUNFLFFBQUEsR0FBVyxJQUFDLENBQUEsTUFBTSxDQUFDLGFBQVIsQ0FBc0IsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUF2QyxFQUEwQyxPQUFPLENBQUMsUUFBUSxDQUFDLENBQTNEO1FBQ1gsSUFBQyxDQUFBLEtBQUssQ0FBQyxHQUFQLENBQVcsUUFBUSxDQUFDLENBQXBCLEVBQXVCLFFBQVEsQ0FBQyxDQUFoQztBQUNBLGVBSEY7O01BS0EsSUFBRyxPQUFPLENBQUMsUUFBUSxDQUFDLENBQWpCLEdBQXFCLENBQUMsSUFBQyxDQUFBLENBQUQsR0FBSyxJQUFDLENBQUEsQ0FBUCxDQUF4QjtBQUNFLGVBREY7O01BR0EsSUFBRyxJQUFDLENBQUEsT0FBTyxDQUFDLE1BQVQsS0FBbUIsQ0FBdEI7UUFDRSxJQUFDLENBQUEsUUFBRCxHQUFZLE1BRGQ7T0FSTjs7TUFZTSxJQUFDLENBQUEsT0FBTyxDQUFDLElBQVQsQ0FBYztRQUNaLEVBQUEsRUFBSSxPQUFPLENBQUMsRUFEQTtRQUVaLEdBQUEsRUFBSyxPQUFPLENBQUMsUUFBUSxDQUFDLEtBQWpCLENBQUE7TUFGTyxDQUFkO01BSUEsSUFBRyxJQUFDLENBQUEsT0FBTyxDQUFDLE1BQVQsS0FBbUIsQ0FBdEI7UUFDRSxJQUFDLENBQUEsWUFBRCxDQUFBLEVBREY7O01BRUEsSUFBRyxJQUFDLENBQUEsT0FBTyxDQUFDLE1BQVQsS0FBbUIsQ0FBdEI7O1FBRUUsSUFBQyxDQUFBLGVBQUQsQ0FBQSxFQUZGOztNQUlBLElBQUcsSUFBQyxDQUFBLE9BQU8sQ0FBQyxNQUFULEdBQWtCLENBQXJCO1FBQ0UsSUFBQyxDQUFBLFFBQUQsR0FBWTtlQUNaLElBQUMsQ0FBQSxlQUFELEdBQW1CLEtBRnJCO09BQUEsTUFHSyxJQUFHLENBQUksSUFBQyxDQUFBLFFBQVI7UUFDSCxHQUFBLEdBQU0sSUFBSSxJQUFKLENBQUEsQ0FBVSxDQUFDLE9BQVgsQ0FBQTtRQUNOLElBQUcsSUFBQyxDQUFBLGVBQUQsS0FBb0IsSUFBdkI7O1VBRUUsVUFBQSxHQUFhLEdBQUEsR0FBTSxJQUFDLENBQUE7VUFDcEIsSUFBRyxVQUFBLEdBQWEsZUFBaEI7WUFDRSxJQUFDLENBQUEsZUFBRCxHQUFtQjtBQUVuQixtQkFIRjtXQUhGO1NBRFI7O2VBUVEsSUFBQyxDQUFBLGVBQUQsR0FBbUIsSUFUaEI7O0lBMUJ3QixDQUEvQjtJQXFDQSxJQUFDLENBQUEsS0FBSyxDQUFDLEtBQUssQ0FBQyxFQUFiLENBQWdCLGFBQWhCLEVBQStCLENBQUMsT0FBRCxDQUFBLEdBQUE7QUFDbkMsVUFBQSxZQUFBLEVBQUEsYUFBQSxFQUFBLFlBQUEsRUFBQSxFQUFBLEVBQUEsRUFBQSxFQUFBLENBQUEsRUFBQSxLQUFBLEVBQUEsQ0FBQSxFQUFBLE9BQUEsRUFBQSxZQUFBLEVBQUEsS0FBQSxFQUFBLEtBQUEsRUFBQTtNQUFNLFlBQUEsR0FBZTtNQUNmLElBQUcsSUFBQyxDQUFBLE9BQU8sQ0FBQyxNQUFULElBQW1CLENBQXRCO1FBQ0UsWUFBQSxHQUFlLElBQUMsQ0FBQSxZQUFELENBQWMsSUFBQyxDQUFBLE9BQU8sQ0FBQyxDQUFELENBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBOUIsRUFBaUMsSUFBQyxDQUFBLE9BQU8sQ0FBQyxDQUFELENBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBakQsRUFBb0QsSUFBQyxDQUFBLE9BQU8sQ0FBQyxDQUFELENBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBcEUsRUFBdUUsSUFBQyxDQUFBLE9BQU8sQ0FBQyxDQUFELENBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBdkYsRUFEakI7O01BRUEsSUFBRyxJQUFDLENBQUEsT0FBTyxDQUFDLE1BQVQsS0FBbUIsQ0FBdEI7UUFDRSxLQUFBLEdBQVEsSUFBQyxDQUFBLE9BQU8sQ0FBQyxDQUFELENBQUcsQ0FBQyxHQUFHLENBQUM7UUFDeEIsS0FBQSxHQUFRLElBQUMsQ0FBQSxPQUFPLENBQUMsQ0FBRCxDQUFHLENBQUMsR0FBRyxDQUFDLEVBRjFCOztNQUlBLEtBQUEsR0FBUSxDQUFDO01BQ1QsS0FBUyw4RkFBVDtRQUNFLElBQUcsSUFBQyxDQUFBLE9BQU8sQ0FBQyxDQUFELENBQUcsQ0FBQyxFQUFaLEtBQWtCLE9BQU8sQ0FBQyxFQUE3QjtVQUNFLEtBQUEsR0FBUTtBQUNSLGdCQUZGOztNQURGO01BSUEsSUFBRyxLQUFBLEtBQVMsQ0FBQyxDQUFiO0FBQ0UsZUFERjs7TUFHQSxJQUFDLENBQUEsT0FBTyxDQUFDLEtBQUQsQ0FBTyxDQUFDLEdBQWhCLEdBQXNCLE9BQU8sQ0FBQyxRQUFRLENBQUMsS0FBakIsQ0FBQTtNQUV0QixJQUFHLElBQUMsQ0FBQSxPQUFPLENBQUMsTUFBVCxLQUFtQixDQUF0Qjs7UUFFRSxZQUFBLEdBQWUsSUFBQyxDQUFBLFlBQUQsQ0FBYyxJQUFDLENBQUEsS0FBZixFQUFzQixJQUFDLENBQUEsS0FBdkIsRUFBOEIsSUFBQyxDQUFBLE9BQU8sQ0FBQyxDQUFELENBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBOUMsRUFBaUQsSUFBQyxDQUFBLE9BQU8sQ0FBQyxDQUFELENBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBakU7UUFDZixJQUFHLElBQUMsQ0FBQSxRQUFELElBQWEsQ0FBQyxZQUFBLEdBQWUsb0JBQWhCLENBQWhCO1VBQ0UsSUFBQyxDQUFBLFFBQUQsR0FBWTtVQUNaLElBQUcsWUFBQSxHQUFlLEdBQWxCO1lBQ0UsRUFBQSxHQUFLLElBQUMsQ0FBQSxPQUFPLENBQUMsQ0FBRCxDQUFHLENBQUMsR0FBRyxDQUFDLENBQWhCLEdBQW9CLElBQUMsQ0FBQTtZQUMxQixFQUFBLEdBQUssSUFBQyxDQUFBLE9BQU8sQ0FBQyxDQUFELENBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBaEIsR0FBb0IsSUFBQyxDQUFBLE1BRHRDOztZQUdZLElBQUMsQ0FBQSxNQUFNLENBQUMsT0FBUixJQUFtQixFQUFBLEdBQUssSUFBQyxDQUFBLE1BQU0sQ0FBQztZQUNoQyxJQUFDLENBQUEsTUFBTSxDQUFDLE9BQVIsSUFBbUIsRUFBQSxHQUFLLElBQUMsQ0FBQSxNQUFNLENBQUMsS0FMbEM7V0FEVjs7VUFTVSxJQUFDLENBQUEsWUFBRCxDQUFBLEVBVkY7U0FIRjtPQUFBLE1BZUssSUFBRyxJQUFDLENBQUEsT0FBTyxDQUFDLE1BQVQsSUFBbUIsQ0FBdEI7O1FBRUgsWUFBQSxHQUFlLElBQUMsQ0FBQSxZQUFELENBQWMsSUFBQyxDQUFBLE9BQU8sQ0FBQyxDQUFELENBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBOUIsRUFBaUMsSUFBQyxDQUFBLE9BQU8sQ0FBQyxDQUFELENBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBakQsRUFBb0QsSUFBQyxDQUFBLE9BQU8sQ0FBQyxDQUFELENBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBcEUsRUFBdUUsSUFBQyxDQUFBLE9BQU8sQ0FBQyxDQUFELENBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBdkY7UUFDZixhQUFBLEdBQWdCLFlBQUEsR0FBZTtRQUMvQixJQUFHLGFBQUEsS0FBaUIsQ0FBcEI7VUFDRSxPQUFBLEdBQVUsSUFBQyxDQUFBLE1BQU0sQ0FBQyxJQUFSLEdBQWUsQ0FBQyxDQUFBLEdBQUksQ0FBQyxhQUFBLEdBQWdCLENBQWhCLEdBQW9CLElBQUMsQ0FBQSxNQUFNLENBQUMsS0FBN0IsQ0FBTDtVQUN6QixJQUFDLENBQUEsVUFBRCxDQUFZLE9BQVosRUFGRjtTQUpHOztJQWpDd0IsQ0FBL0I7SUEwQ0EsSUFBQyxDQUFBLEtBQUssQ0FBQyxLQUFLLENBQUMsRUFBYixDQUFnQixXQUFoQixFQUE2QixDQUFDLE9BQUQsQ0FBQSxHQUFBO0FBQ2pDLFVBQUEsQ0FBQSxFQUFBLEtBQUEsRUFBQSxDQUFBLEVBQUEsR0FBQSxFQUFBO01BQU0sS0FBQSxHQUFRLENBQUM7TUFDVCxLQUFTLDhGQUFUO1FBQ0UsSUFBRyxJQUFDLENBQUEsT0FBTyxDQUFDLENBQUQsQ0FBRyxDQUFDLEVBQVosS0FBa0IsT0FBTyxDQUFDLEVBQTdCO1VBQ0UsS0FBQSxHQUFRO0FBQ1IsZ0JBRkY7O01BREY7TUFJQSxJQUFHLEtBQUEsS0FBUyxDQUFDLENBQWI7QUFDRSxlQURGOztNQUdBLElBQUcsSUFBQyxDQUFBLE9BQU8sQ0FBQyxNQUFULEtBQW1CLENBQXRCO1FBQ0UsSUFBRyxDQUFJLElBQUMsQ0FBQSxRQUFSO1VBQ0UsUUFBQSxHQUFXLElBQUMsQ0FBQSxNQUFNLENBQUMsYUFBUixDQUFzQixJQUFDLENBQUEsT0FBTyxDQUFDLENBQUQsQ0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUF0QyxFQUF5QyxJQUFDLENBQUEsT0FBTyxDQUFDLENBQUQsQ0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUF6RCxFQUFyQjs7VUFFVSxJQUFDLENBQUEsS0FBSyxDQUFDLEdBQVAsQ0FBVyxRQUFRLENBQUMsQ0FBcEIsRUFBdUIsUUFBUSxDQUFDLENBQWhDLEVBSEY7U0FERjs7TUFNQSxJQUFDLENBQUEsT0FBTyxDQUFDLE1BQVQsQ0FBZ0IsS0FBaEIsRUFBdUIsQ0FBdkI7TUFDQSxJQUFHLElBQUMsQ0FBQSxPQUFPLENBQUMsTUFBVCxLQUFtQixDQUF0QjtRQUNFLElBQUMsQ0FBQSxZQUFELENBQUEsRUFERjs7TUFHQSxJQUFHLEtBQUEsR0FBUSxDQUFYOztRQUVFLElBQUMsQ0FBQSxlQUFELENBQUEsRUFGRjs7TUFJQSxJQUFDLENBQUEsS0FBSyxDQUFDLGtCQUFQLENBQTBCLENBQTFCLEVBQTZCLENBQTdCLEVBQWdDLENBQWhDO0lBdkIyQixDQUE3QjtXQTBCQSxJQUFDLENBQUEsS0FBSyxDQUFDLEtBQUssQ0FBQyxFQUFiLENBQWdCLE9BQWhCLEVBQXlCLENBQUMsT0FBRCxFQUFVLFdBQVYsRUFBdUIsTUFBdkIsRUFBK0IsTUFBL0IsRUFBdUMsTUFBdkMsQ0FBQSxHQUFBO0FBQzdCLFVBQUE7TUFBTSxJQUFDLENBQUEsZUFBRCxDQUFpQixPQUFPLENBQUMsUUFBUSxDQUFDLENBQWxDLEVBQXFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBdEQ7TUFDQSxPQUFBLEdBQVUsSUFBQyxDQUFBLE1BQU0sQ0FBQyxJQUFSLEdBQWUsQ0FBQyxDQUFBLEdBQUksQ0FBQyxNQUFBLEdBQVMsR0FBVixDQUFMO01BQ3pCLElBQUMsQ0FBQSxVQUFELENBQVksT0FBWjtNQUNBLElBQUMsQ0FBQSxLQUFLLENBQUMsa0JBQVAsQ0FBMEIsQ0FBMUIsRUFBNkIsQ0FBN0IsRUFBZ0MsQ0FBaEM7SUFKdUIsQ0FBekI7RUE5R007O0VBcUhSLFVBQVksQ0FBQyxPQUFELENBQUE7QUFDZCxRQUFBLEtBQUEsRUFBQSxLQUFBLEVBQUEsT0FBQSxFQUFBO0lBQUksSUFBRyxPQUFBLEdBQVUsR0FBYjtNQUNFLE9BQUEsR0FBVSxJQURaOztJQUVBLElBQUcsT0FBQSxHQUFVLENBQWI7TUFDRSxPQUFBLEdBQVUsRUFEWjs7SUFFQSxJQUFDLENBQUEsTUFBTSxDQUFDLElBQVIsR0FBZTtJQUVmLEtBQUEsR0FBUyxJQUFDLENBQUEsTUFBTSxDQUFDLEtBQVIsR0FBZ0I7SUFDekIsS0FBQSxHQUFTLElBQUMsQ0FBQSxNQUFNLENBQUMsTUFBUixHQUFpQjtJQUMxQixPQUFBLEdBQVUsQ0FBQyxJQUFDLENBQUEsV0FBVyxDQUFDLENBQWIsR0FBaUIsS0FBbEIsQ0FBQSxHQUEyQjtJQUNyQyxPQUFBLEdBQVUsQ0FBQyxJQUFDLENBQUEsV0FBVyxDQUFDLENBQWIsR0FBaUIsS0FBbEIsQ0FBQSxHQUEyQjtJQUNyQyxJQUFDLENBQUEsTUFBTSxDQUFDLE9BQVIsR0FBa0IsSUFBQyxDQUFBLGdCQUFnQixDQUFDLENBQWxCLEdBQXNCLEtBQXRCLEdBQThCO0lBQ2hELElBQUMsQ0FBQSxNQUFNLENBQUMsT0FBUixHQUFrQixJQUFDLENBQUEsZ0JBQWdCLENBQUMsQ0FBbEIsR0FBc0IsS0FBdEIsR0FBOEI7RUFadEM7O0VBZVosWUFBYyxDQUFBLENBQUE7SUFDWixJQUFDLENBQUEsS0FBRCxHQUFTLElBQUMsQ0FBQSxPQUFPLENBQUMsQ0FBRCxDQUFHLENBQUMsR0FBRyxDQUFDO1dBQ3pCLElBQUMsQ0FBQSxLQUFELEdBQVMsSUFBQyxDQUFBLE9BQU8sQ0FBQyxDQUFELENBQUcsQ0FBQyxHQUFHLENBQUM7RUFGYjs7RUFJZCxlQUFpQixDQUFDLFNBQVMsSUFBVixFQUFnQixTQUFTLElBQXpCLENBQUE7SUFDZixJQUFHLENBQUMsTUFBQSxLQUFVLElBQVgsQ0FBQSxJQUFxQixDQUFDLE1BQUEsS0FBVSxJQUFYLENBQXhCO01BQ0UsSUFBRyxJQUFDLENBQUEsT0FBTyxDQUFDLE1BQVQsR0FBa0IsQ0FBckI7QUFDRSxlQURGOztNQUVBLE1BQUEsR0FBUyxJQUFJLENBQUMsS0FBTCxDQUFXLENBQUMsSUFBQyxDQUFBLE9BQU8sQ0FBQyxDQUFELENBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBaEIsR0FBb0IsSUFBQyxDQUFBLE9BQU8sQ0FBQyxDQUFELENBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBckMsQ0FBQSxHQUEwQyxDQUFyRDtNQUNULE1BQUEsR0FBUyxJQUFJLENBQUMsS0FBTCxDQUFXLENBQUMsSUFBQyxDQUFBLE9BQU8sQ0FBQyxDQUFELENBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBaEIsR0FBb0IsSUFBQyxDQUFBLE9BQU8sQ0FBQyxDQUFELENBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBckMsQ0FBQSxHQUEwQyxDQUFyRCxFQUpYOztJQU1BLElBQUMsQ0FBQSxXQUFELEdBQWU7TUFBQyxDQUFBLEVBQUcsTUFBSjtNQUFZLENBQUEsRUFBRztJQUFmO0lBQ2YsSUFBQyxDQUFBLGdCQUFELEdBQW9CLElBQUMsQ0FBQSxNQUFNLENBQUMsYUFBUixDQUFzQixNQUF0QixFQUE4QixNQUE5QjtXQUVwQixJQUFDLENBQUEsS0FBSyxDQUFDLGtCQUFQLENBQTBCLElBQUMsQ0FBQSxXQUFXLENBQUMsQ0FBdkMsRUFBMEMsSUFBQyxDQUFBLFdBQVcsQ0FBQyxDQUF2RCxFQUEwRCxDQUExRDtFQVZlOztFQVlqQixZQUFjLENBQUMsRUFBRCxFQUFLLEVBQUwsRUFBUyxFQUFULEVBQWEsRUFBYixDQUFBO0FBQ2hCLFFBQUEsRUFBQSxFQUFBO0lBQUksRUFBQSxHQUFLLEVBQUEsR0FBSztJQUNWLEVBQUEsR0FBSyxFQUFBLEdBQUs7QUFDVixXQUFPLElBQUksQ0FBQyxJQUFMLENBQVUsRUFBQSxHQUFHLEVBQUgsR0FBUSxFQUFBLEdBQUcsRUFBckI7RUFISzs7QUE5SmhCOztBQW1LQSxNQUFNLENBQUMsT0FBUCxHQUFpQjs7OztBQ3RLakIsSUFBQSxZQUFBLEVBQUEsV0FBQSxFQUFBOztBQUFBLFlBQUEsR0FBZSxPQUFBLENBQVEsZ0JBQVI7O0FBQ2YsV0FBQSxHQUFjLE9BQUEsQ0FBUSxlQUFSOztBQUVkLElBQUEsR0FBTyxRQUFBLENBQUEsQ0FBQTtBQUNQLE1BQUEsTUFBQSxFQUFBO0VBQUUsT0FBTyxDQUFDLEdBQVIsQ0FBWSw2QkFBWjtFQUVBLE1BQUEsR0FDRTtJQUFBLElBQUEsRUFBTSxNQUFNLENBQUMsSUFBYjtJQUNBLEtBQUEsRUFBTyxRQUFRLENBQUMsZUFBZSxDQUFDLFdBRGhDO0lBRUEsTUFBQSxFQUFRLFFBQVEsQ0FBQyxlQUFlLENBQUMsWUFGakM7SUFHQSxlQUFBLEVBQWlCLFNBSGpCO0lBSUEsTUFBQSxFQUFRLFFBSlI7SUFLQSxLQUFBLEVBQ0U7TUFBQSxjQUFBLEVBQWdCO0lBQWhCLENBTkY7SUFPQSxLQUFBLEVBQU8sQ0FDTCxZQURLLEVBRUwsV0FGSztFQVBQO1NBWUYsSUFBQSxHQUFPLElBQUksTUFBTSxDQUFDLElBQVgsQ0FBZ0IsTUFBaEI7QUFoQkY7O0FBbUJQLE1BQU0sQ0FBQyxnQkFBUCxDQUF3QixNQUF4QixFQUFnQyxRQUFBLENBQUMsQ0FBRCxDQUFBO1NBQzVCLElBQUEsQ0FBQTtBQUQ0QixDQUFoQyxFQUVFLEtBRkYiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbigpe2Z1bmN0aW9uIHIoZSxuLHQpe2Z1bmN0aW9uIG8oaSxmKXtpZighbltpXSl7aWYoIWVbaV0pe3ZhciBjPVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmU7aWYoIWYmJmMpcmV0dXJuIGMoaSwhMCk7aWYodSlyZXR1cm4gdShpLCEwKTt2YXIgYT1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK2krXCInXCIpO3Rocm93IGEuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixhfXZhciBwPW5baV09e2V4cG9ydHM6e319O2VbaV1bMF0uY2FsbChwLmV4cG9ydHMsZnVuY3Rpb24ocil7dmFyIG49ZVtpXVsxXVtyXTtyZXR1cm4gbyhufHxyKX0scCxwLmV4cG9ydHMscixlLG4sdCl9cmV0dXJuIG5baV0uZXhwb3J0c31mb3IodmFyIHU9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZSxpPTA7aTx0Lmxlbmd0aDtpKyspbyh0W2ldKTtyZXR1cm4gb31yZXR1cm4gcn0pKCkiLCJUb3VjaEludGVycHJldGVyID0gcmVxdWlyZSAnLi9Ub3VjaEludGVycHJldGVyJ1xyXG5cclxuY2xhc3MgQkdNR2FtZVNjZW5lIGV4dGVuZHMgUGhhc2VyLlNjZW5lXHJcbiAgY29uc3RydWN0b3I6IC0+XHJcbiAgICBzdXBlcigpXHJcbiAgICBQaGFzZXIuU2NlbmUuY2FsbCh0aGlzLCB7IGtleTogJ2dhbWUnLCBhY3RpdmU6IHRydWUgfSk7XHJcblxyXG4gICAgQG1zID0gcmVxdWlyZSAnLi9NaW5lU3dlZXBlcidcclxuICAgIEB0b3VjaCA9IG5ldyBUb3VjaEludGVycHJldGVyXHJcblxyXG4gIHByZWxvYWQ6IC0+XHJcbiAgICBAbG9hZC5pbWFnZSgnYmxhbmsnLCAnaW1hZ2VzL2JsYW5rLmdpZicpXHJcbiAgICBAbG9hZC5pbWFnZSgnZmxhZycsICdpbWFnZXMvYm9tYmZsYWdnZWQuZ2lmJylcclxuICAgIEBsb2FkLmltYWdlKCdib21iJywgJ2ltYWdlcy9ib21iMC5naWYnKVxyXG4gICAgQGxvYWQuaW1hZ2UoJ2JvbWJkZWF0aCcsICdpbWFnZXMvYm9tYmRlYXRoLmdpZicpXHJcbiAgICBAbG9hZC5pbWFnZSgnYm9tYnJldmVhbGVkJywgJ2ltYWdlcy9ib21icmV2ZWFsZWQuZ2lmJylcclxuICAgIEBsb2FkLmltYWdlKCdib21ibWlzZmxhZ2dlZCcsICdpbWFnZXMvYm9tYm1pc2ZsYWdnZWQuZ2lmJylcclxuXHJcbiAgICBAbG9hZC5pbWFnZSgnc2hhZG93MCcsICdpbWFnZXMvc2hhZG93MC5naWYnKVxyXG4gICAgQGxvYWQuaW1hZ2UoJ3NoYWRvdzEnLCAnaW1hZ2VzL3NoYWRvdzEuZ2lmJylcclxuICAgIEBsb2FkLmltYWdlKCdzaGFkb3cyJywgJ2ltYWdlcy9zaGFkb3cyLmdpZicpXHJcbiAgICBAbG9hZC5pbWFnZSgnc2hhZG93MycsICdpbWFnZXMvc2hhZG93My5naWYnKVxyXG4gICAgQGxvYWQuaW1hZ2UoJ3NoYWRvdzQnLCAnaW1hZ2VzL3NoYWRvdzQuZ2lmJylcclxuICAgIEBsb2FkLmltYWdlKCdzaGFkb3c1JywgJ2ltYWdlcy9zaGFkb3c1LmdpZicpXHJcbiAgICBAbG9hZC5pbWFnZSgnc2hhZG93NicsICdpbWFnZXMvc2hhZG93Ni5naWYnKVxyXG4gICAgQGxvYWQuaW1hZ2UoJ3NoYWRvdzcnLCAnaW1hZ2VzL3NoYWRvdzcuZ2lmJylcclxuICAgIEBsb2FkLmltYWdlKCdzaGFkb3c4JywgJ2ltYWdlcy9zaGFkb3c4LmdpZicpXHJcblxyXG4gICAgQGxvYWQuaW1hZ2UoJ2JvbWIwJywgJ2ltYWdlcy9ib21iMC5naWYnKVxyXG4gICAgQGxvYWQuaW1hZ2UoJ2JvbWIxJywgJ2ltYWdlcy9ib21iMS5naWYnKVxyXG4gICAgQGxvYWQuaW1hZ2UoJ2JvbWIyJywgJ2ltYWdlcy9ib21iMi5naWYnKVxyXG4gICAgQGxvYWQuaW1hZ2UoJ2JvbWIzJywgJ2ltYWdlcy9ib21iMy5naWYnKVxyXG4gICAgQGxvYWQuaW1hZ2UoJ2JvbWI0JywgJ2ltYWdlcy9ib21iNC5naWYnKVxyXG4gICAgQGxvYWQuaW1hZ2UoJ2JvbWI1JywgJ2ltYWdlcy9ib21iNS5naWYnKVxyXG4gICAgQGxvYWQuaW1hZ2UoJ2JvbWI2JywgJ2ltYWdlcy9ib21iNi5naWYnKVxyXG4gICAgQGxvYWQuaW1hZ2UoJ2JvbWI3JywgJ2ltYWdlcy9ib21iNy5naWYnKVxyXG4gICAgQGxvYWQuaW1hZ2UoJ2JvbWI4JywgJ2ltYWdlcy9ib21iOC5naWYnKVxyXG5cclxuICAgIEBsb2FkLmltYWdlKCdvcGVuMCcsICdpbWFnZXMvb3BlbjAuZ2lmJylcclxuICAgIEBsb2FkLmltYWdlKCdvcGVuMScsICdpbWFnZXMvb3BlbjEuZ2lmJylcclxuICAgIEBsb2FkLmltYWdlKCdvcGVuMicsICdpbWFnZXMvb3BlbjIuZ2lmJylcclxuICAgIEBsb2FkLmltYWdlKCdvcGVuMycsICdpbWFnZXMvb3BlbjMuZ2lmJylcclxuICAgIEBsb2FkLmltYWdlKCdvcGVuNCcsICdpbWFnZXMvb3BlbjQuZ2lmJylcclxuICAgIEBsb2FkLmltYWdlKCdvcGVuNScsICdpbWFnZXMvb3BlbjUuZ2lmJylcclxuICAgIEBsb2FkLmltYWdlKCdvcGVuNicsICdpbWFnZXMvb3BlbjYuZ2lmJylcclxuICAgIEBsb2FkLmltYWdlKCdvcGVuNycsICdpbWFnZXMvb3BlbjcuZ2lmJylcclxuICAgIEBsb2FkLmltYWdlKCdvcGVuOCcsICdpbWFnZXMvb3BlbjguZ2lmJylcclxuXHJcbiAgY3JlYXRlOiAtPlxyXG4gICAgc3BsaXQgPSBNYXRoLmZsb29yKEBjYW1lcmFzLm1haW4ud2lkdGggKiAwLjkpXHJcbiAgICBAY2FtZXJhcy5tYWluLnNldFZpZXdwb3J0KDAsIDAsIHNwbGl0LCBAY2FtZXJhcy5tYWluLmhlaWdodClcclxuXHJcbiAgICBAbXMuYWRkRXZlbnRMaXN0ZW5lcihAbXNFdmVudC5iaW5kKHRoaXMpKVxyXG4gICAgQHJlY3JlYXRlRGlzcGxheUxpc3QoKVxyXG4gICAgQG1zLnVwZGF0ZUFsbCgpXHJcblxyXG4gICAgQHRvdWNoLmNyZWF0ZSh0aGlzLCBAY2FtZXJhcy5tYWluLCAwLCAwLCBzcGxpdCwgQGNhbWVyYXMubWFpbi5oZWlnaHQpXHJcblxyXG4gIG1zRXZlbnQ6IChldiwgYXJncykgLT5cclxuICAgIHN3aXRjaCBldlxyXG4gICAgICB3aGVuICduZXcnXHJcbiAgICAgICAgaWYgKEBtcy53aWR0aCAhPSBAZ3JpZENvbHMpIG9yIChAbXMuaGVpZ2h0ICE9IEBncmlkUm93cylcclxuICAgICAgICAgIEByZWNyZWF0ZURpc3BsYXlMaXN0KClcclxuICAgICAgd2hlbiAnY2VsbCdcclxuICAgICAgICBAZ3JpZFthcmdzWzBdXVthcmdzWzFdXS5zZXRUZXh0dXJlKGFyZ3NbMl0pXHJcbiAgICAgIHdoZW4gJ2xpZmUnXHJcbiAgICAgICAgQHNjZW5lLmdldCgnaHVkJykuZGVidWdUZXh0LnRleHQgPSBcIkFyZSB5b3Ugc3V1dXV1dXVyZT8gKCN7YXJnc1swXX0pXCJcclxuICAgICAgICBAY2FtZXJhcy5tYWluLnNoYWtlKDMwMCwgMC4wMDEpXHJcblxyXG4gIHVwZGF0ZTogLT5cclxuXHJcbiAgcmVjcmVhdGVEaXNwbGF5TGlzdDogLT5cclxuICAgIGNvbnNvbGUubG9nIFwicmVjcmVhdGVEaXNwbGF5TGlzdCgpXCJcclxuICAgIEBhZGQuZGlzcGxheUxpc3QucmVtb3ZlQWxsKClcclxuXHJcbiAgICBAZ3JpZENvbHMgPSBAbXMud2lkdGhcclxuICAgIEBncmlkUm93cyA9IEBtcy5oZWlnaHRcclxuICAgIEBncmlkID0gbmV3IEFycmF5KEBncmlkQ29scylcclxuICAgIGZvciBpIGluIFswLi4uQGdyaWRDb2xzXVxyXG4gICAgICBAZ3JpZFtpXSA9IG5ldyBBcnJheShAZ3JpZFJvd3MpXHJcbiAgICAgIGZvciBqIGluIFswLi4uQGdyaWRSb3dzXVxyXG4gICAgICAgIEBncmlkW2ldW2pdID0gQGFkZC5pbWFnZShpICogMTYsIGogKiAxNiwgJ2JsYW5rJylcclxuICAgICAgICBAZ3JpZFtpXVtqXS5zZXRPcmlnaW4oMCwgMClcclxuICAgIEByZXNldFZpZXcoKVxyXG5cclxuICBjZW50ZXJHcmlkOiAtPlxyXG4gICAgdG90YWxXID0gQGdyaWRDb2xzICogMTZcclxuICAgIHRvdGFsSCA9IEBncmlkUm93cyAqIDE2XHJcbiAgICBAY2FtZXJhcy5tYWluLnNjcm9sbFggPSAodG90YWxXIC0gQGNhbWVyYXMubWFpbi53aWR0aCkgLyAyXHJcbiAgICBAY2FtZXJhcy5tYWluLnNjcm9sbFkgPSAodG90YWxIIC0gQGNhbWVyYXMubWFpbi5oZWlnaHQpIC8gMlxyXG5cclxuICByZXNldFZpZXc6IC0+XHJcbiAgICBAY2FtZXJhcy5tYWluLnpvb20gPSAxXHJcbiAgICBAY2VudGVyR3JpZCgpXHJcblxyXG4gIHNldE1vZGU6IChAbW9kZSkgLT5cclxuICAgICMgY29uc29sZS5sb2cgXCJHYW1lIE1vZGU6ICN7QG1vZGV9XCJcclxuICAgIGlmIEBtcy5nYW1lb3ZlclxyXG4gICAgICBAbXMubmV3R2FtZSgpXHJcblxyXG4gIHNldE1hZ25pZnlpbmdHbGFzczogKHgsIHksIGFscGhhKSAtPlxyXG4gICAgQHNjZW5lLmdldCgnaHVkJykuc2V0TWFnbmlmeWluZ0dsYXNzKHgsIHksIGFscGhhKVxyXG5cclxuICBybWI6ICh3b3JsZFgsIHdvcmxkWSkgLT5cclxuICAgIEBzY2VuZS5nZXQoJ2h1ZCcpLnRvZ2dsZU1vZGUoKVxyXG4gICAgQG1zLnNhdmUoKVxyXG5cclxuICB0YXA6ICh3b3JsZFgsIHdvcmxkWSkgLT5cclxuICAgIEBzY2VuZS5nZXQoJ2h1ZCcpLmRlYnVnVGV4dC50ZXh0ID0gXCJcIlxyXG5cclxuICAgIGlmIEBtcy5nYW1lb3ZlclxyXG4gICAgICBjb25zb2xlLmxvZyBcImdhbWUgaXMgb3ZlciwgZG9pbmcgbm90aGluZ1wiXHJcbiAgICAgIHJldHVyblxyXG5cclxuICAgIGlmICh3b3JsZFggPj0gMCkgYW5kICh3b3JsZFggPCAoQGdyaWRDb2xzICogMTYpKSBhbmQgKHdvcmxkWSA+PSAwKSBhbmQgKHdvcmxkWSA8IChAZ3JpZFJvd3MgKiAxNikpXHJcbiAgICAgIHggPSBNYXRoLmZsb29yKHdvcmxkWCAvIDE2KVxyXG4gICAgICB5ID0gTWF0aC5mbG9vcih3b3JsZFkgLyAxNilcclxuICAgICAgaWYgQG1vZGUgPT0gJ2ZsYWcnXHJcbiAgICAgICAgQG1zLmZsYWcoeCwgeSlcclxuICAgICAgZWxzZVxyXG4gICAgICAgIEBtcy5wb2tlKHgsIHkpXHJcbiAgICAgIEBtcy51cGRhdGVBbGwoKVxyXG5cclxuICAgIEBtcy5zYXZlKClcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gQkdNR2FtZVNjZW5lXHJcbiIsImNsYXNzIEJHTUh1ZFNjZW5lIGV4dGVuZHMgUGhhc2VyLlNjZW5lXHJcbiAgY29uc3RydWN0b3I6IC0+XHJcbiAgICBzdXBlcigpXHJcbiAgICBQaGFzZXIuU2NlbmUuY2FsbCh0aGlzLCB7IGtleTogJ2h1ZCcsIGFjdGl2ZTogdHJ1ZSB9KTtcclxuXHJcbiAgcHJlbG9hZDogLT5cclxuICAgIEBsb2FkLmltYWdlKCdnbGFzcycsICdpbWFnZXMvZ2xhc3MuZ2lmJylcclxuXHJcbiAgICBAbG9hZC5pbWFnZSgnYnRuX2JvbWInLCAnaW1hZ2VzL2J0bl9ib21iLnBuZycpXHJcbiAgICBAbG9hZC5pbWFnZSgnYnRuX2ZsYWcnLCAnaW1hZ2VzL2J0bl9mbGFnLnBuZycpXHJcblxyXG4gIGNyZWF0ZTogLT5cclxuICAgIEBwYW5lbFggPSBNYXRoLmZsb29yKEBjYW1lcmFzLm1haW4ud2lkdGggKiAwLjkpXHJcbiAgICBAcGFuZWxZID0gMFxyXG4gICAgQHBhbmVsVyA9IEBjYW1lcmFzLm1haW4ud2lkdGggLSBAcGFuZWxYXHJcbiAgICBAcGFuZWxIID0gQGNhbWVyYXMubWFpbi5oZWlnaHRcclxuXHJcbiAgICBAcGFuZWxCYWNrZ3JvdW5kID0gQGFkZC5ncmFwaGljcygpXHJcbiAgICBAcGFuZWxCYWNrZ3JvdW5kLmZpbGxTdHlsZSgweDMzMzMzMywgMSlcclxuICAgIEBwYW5lbEJhY2tncm91bmQuZmlsbFJlY3QoQHBhbmVsWCwgQHBhbmVsWSwgQHBhbmVsVywgQHBhbmVsSClcclxuICAgIEBwYW5lbEJhY2tncm91bmQubGluZVN0eWxlKDEsIDB4MDAwMDAwLCAxLjApXHJcbiAgICBAcGFuZWxCYWNrZ3JvdW5kLnN0cm9rZVJlY3QoQHBhbmVsWCwgQHBhbmVsWSwgQHBhbmVsVywgQHBhbmVsSClcclxuXHJcbiAgICBAYnV0dG9uID0gQGFkZC5pbWFnZShAcGFuZWxYICsgKEBwYW5lbFcgLyAyKSwgQHBhbmVsWSArIChAcGFuZWxIIC8gMiksICdidG5fYm9tYicpXHJcbiAgICBAYnV0dG9uLnNldERpc3BsYXlTaXplKEBwYW5lbFcgKiAwLjgsIEBwYW5lbFcgKiAwLjgpXHJcbiAgICBAYnV0dG9uLnNldEludGVyYWN0aXZlKClcclxuICAgIEBidXR0b24ub24gJ3BvaW50ZXJkb3duJywgPT5cclxuICAgICAgQHRvZ2dsZU1vZGUoKVxyXG4gICAgQHRvZ2dsZU1vZGUoKVxyXG5cclxuICAgIEBkZWJ1Z1RleHQgPSBAYWRkLnRleHQoMCwgMCwgJycpXHJcbiAgICBAZ2xhc3MgPSBAYWRkLmltYWdlKDUwLCA1MCwgJ2dsYXNzJylcclxuICAgIEBnbGFzcy5zZXRPcmlnaW4oMC42LCAwLjMpICMgcm91Z2hseSB0aGUgbWlkZGxlIG9mIHRoZSBtYWduaWZ5aW5nIGdsYXNzXHJcbiAgICBAZ2xhc3MuYWxwaGEgPSAwXHJcblxyXG4gIHRvZ2dsZU1vZGU6IC0+XHJcbiAgICBpZiBAbW9kZSA9PSAnYm9tYidcclxuICAgICAgQG1vZGUgPSAnZmxhZydcclxuICAgIGVsc2VcclxuICAgICAgQG1vZGUgPSAnYm9tYidcclxuXHJcbiAgICBAYnV0dG9uLnNldFRleHR1cmUoXCJidG5fI3tAbW9kZX1cIilcclxuICAgIEBzY2VuZS5nZXQoJ2dhbWUnKS5zZXRNb2RlKEBtb2RlKVxyXG5cclxuICB1cGRhdGU6IC0+XHJcblxyXG4gIHNldE1hZ25pZnlpbmdHbGFzczogKHgsIHksIGFscGhhKSAtPlxyXG4gICAgQGdsYXNzLnggPSB4XHJcbiAgICBAZ2xhc3MueSA9IHlcclxuICAgIEBnbGFzcy5hbHBoYSA9IGFscGhhXHJcblxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBCR01IdWRTY2VuZVxyXG4iLCJwcm9wc1RvU2F2ZSA9IFtcclxuICAnc2VlZCdcclxuICAnd2lkdGgnXHJcbiAgJ2hlaWdodCdcclxuICAnYm9tYidcclxuICAndmlzaWJsZSdcclxuICAnbGl2ZXMnXHJcbiAgJ21pbmVDb3VudCdcclxuICAnZ2FtZW92ZXInXHJcbl1cclxuXHJcbmNsYXNzIE1pbmVTd2VlcGVyXHJcbiAgY29uc3RydWN0b3I6IC0+XHJcbiAgICBAbGlzdGVuZXJzID0gW11cclxuICAgIGlmIG5vdCBAbG9hZCgpXHJcbiAgICAgIEBuZXdHYW1lKClcclxuXHJcbiAgbG9hZDogLT5cclxuICAgIHJhd0RhdGEgPSBsb2NhbFN0b3JhZ2UuZ2V0SXRlbShcInNhdmVcIilcclxuICAgIGlmIG5vdCByYXdEYXRhP1xyXG4gICAgICByZXR1cm4gZmFsc2VcclxuICAgIHRyeVxyXG4gICAgICBkYXRhID0gSlNPTi5wYXJzZShyYXdEYXRhKVxyXG4gICAgY2F0Y2hcclxuICAgICAgZGF0YSA9IG51bGxcclxuXHJcbiAgICBpZiBub3QgZGF0YT9cclxuICAgICAgcmV0dXJuIGZhbHNlXHJcblxyXG4gICAgZm9yIHAgaW4gcHJvcHNUb1NhdmVcclxuICAgICAgaWYgbm90IGRhdGEuaGFzT3duUHJvcGVydHkocClcclxuICAgICAgICByZXR1cm4gZmFsc2VcclxuXHJcbiAgICBmb3IgcCBpbiBwcm9wc1RvU2F2ZVxyXG4gICAgICB0aGlzW3BdID0gZGF0YVtwXVxyXG4gICAgcmV0dXJuIHRydWVcclxuXHJcbiAgc2F2ZTogLT5cclxuICAgIGRhdGEgPSB7fVxyXG4gICAgZm9yIHAgaW4gcHJvcHNUb1NhdmVcclxuICAgICAgZGF0YVtwXSA9IHRoaXNbcF1cclxuICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKFwic2F2ZVwiLCBKU09OLnN0cmluZ2lmeShkYXRhKSlcclxuXHJcbiAgYWRkRXZlbnRMaXN0ZW5lcjogKGV2bCkgLT5cclxuICAgIEBsaXN0ZW5lcnMucHVzaChldmwpXHJcblxyXG4gIHJhbmQ6ICh4KSAtPlxyXG4gICAgcmV0dXJuIE1hdGguZmxvb3IoTWF0aC5iZ21yYW5kb20oKSAqIHgpXHJcblxyXG4gIG5laWdoYm9yczogKGksIGosIHVuZmxhZ2dlZE9ubHkpIC0+XHJcbiAgICBuID0gMFxyXG4gICAgeDEgPSBNYXRoLm1heChpIC0gMSwgMClcclxuICAgIHgyID0gTWF0aC5taW4oQHdpZHRoIC0gMSwgaSArIDEpXHJcbiAgICB5MSA9IE1hdGgubWF4KGogLSAxLCAwKVxyXG4gICAgeTIgPSBNYXRoLm1pbihAaGVpZ2h0IC0gMSwgaiArIDEpXHJcbiAgICB4ID0geDFcclxuICAgIHdoaWxlIHggPD0geDJcclxuICAgICAgeSA9IHkxXHJcbiAgICAgIHdoaWxlIHkgPD0geTJcclxuICAgICAgICBpZiB4ICE9IGkgb3IgeSAhPSBqXHJcbiAgICAgICAgICBpZiAhdW5mbGFnZ2VkT25seSBvciAoQHZpc2libGVbeCArIHkgKiBAd2lkdGhdID09IDApXHJcbiAgICAgICAgICAgIGlmIEBib21iW3ggKyB5ICogQHdpZHRoXSA9PSAxXHJcbiAgICAgICAgICAgICAgKytuXHJcbiAgICAgICAgKyt5XHJcbiAgICAgICsreFxyXG4gICAgcmV0dXJuIG5cclxuXHJcbiAgaGFzVmlzaWJsZVplcm9OZWlnaGJvcjogKGksIGopIC0+XHJcbiAgICB4MSA9IE1hdGgubWF4KGkgLSAxLCAwKVxyXG4gICAgeDIgPSBNYXRoLm1pbihAd2lkdGggLSAxLCBpICsgMSlcclxuICAgIHkxID0gTWF0aC5tYXgoaiAtIDEsIDApXHJcbiAgICB5MiA9IE1hdGgubWluKEBoZWlnaHQgLSAxLCBqICsgMSlcclxuICAgIHggPSB4MVxyXG4gICAgd2hpbGUgeCA8PSB4MlxyXG4gICAgICB5ID0geTFcclxuICAgICAgd2hpbGUgeSA8PSB5MlxyXG4gICAgICAgIGlmIHggIT0gaSBvciB5ICE9IGpcclxuICAgICAgICAgIGlmIEB2aXNpYmxlW3ggKyB5ICogQHdpZHRoXSAhPSAwXHJcbiAgICAgICAgICAgIG4gPSBAbmVpZ2hib3JzKHgsIHksIGZhbHNlKVxyXG4gICAgICAgICAgICBpZiBuID09IDBcclxuICAgICAgICAgICAgICByZXR1cm4gdHJ1ZVxyXG4gICAgICAgICsreVxyXG4gICAgICArK3hcclxuICAgIHJldHVybiBmYWxzZVxyXG5cclxuICBsb3NlTGlmZTogLT5cclxuICAgIEBsaXZlcyAtPSAxXHJcbiAgICBpZiBAbGl2ZXMgPiAwXHJcbiAgICAgIGZvciBldmwgaW4gQGxpc3RlbmVyc1xyXG4gICAgICAgIGV2bCgnbGlmZScsIFtAbGl2ZXNdKVxyXG4gICAgICByZXR1cm4gZmFsc2VcclxuICAgIHJldHVybiB0cnVlXHJcblxyXG4gIHVwZGF0ZUNlbGw6IChpLCBqLCByZXZlYWwpIC0+XHJcbiAgICBpbWFnZSA9ICdibGFuaydcclxuICAgIGluZGV4ID0gaSArIGogKiBAd2lkdGhcclxuICAgIGlzQm9tYiA9IEBib21iW2luZGV4XVxyXG4gICAgaXNWaXNpYmxlID0gQHZpc2libGVbaW5kZXhdXHJcbiAgICBuID0gQG5laWdoYm9ycyhpLCBqLCBmYWxzZSlcclxuICAgIGlmIGlzVmlzaWJsZSA9PSAwXHJcbiAgICAgIGlmIHJldmVhbFxyXG4gICAgICAgIGlmIGlzQm9tYiA9PSAxXHJcbiAgICAgICAgICBpbWFnZSA9ICdib21icmV2ZWFsZWQnXHJcbiAgICAgICAgZWxzZVxyXG4gICAgICAgICAgaW1hZ2UgPSAnc2hhZG93JyArIG5cclxuICAgICAgZWxzZVxyXG4gICAgICAgIGltYWdlID0gJ2JsYW5rJ1xyXG4gICAgZWxzZVxyXG4gICAgICBpZiBpc0JvbWIgPT0gMVxyXG4gICAgICAgIGlmIGlzVmlzaWJsZSA9PSAyXHJcbiAgICAgICAgICBpbWFnZSA9ICdib21iZGVhdGgnXHJcbiAgICAgICAgZWxzZVxyXG4gICAgICAgICAgdW5mbGFnZ2VkID0gQG5laWdoYm9ycyhpLCBqLCB0cnVlKVxyXG4gICAgICAgICAgaWYgdW5mbGFnZ2VkID09IDBcclxuICAgICAgICAgICAgbiA9IDBcclxuICAgICAgICAgIGltYWdlID0gJ2JvbWInICsgblxyXG4gICAgICBlbHNlXHJcbiAgICAgICAgaWYgaXNWaXNpYmxlID09IDJcclxuICAgICAgICAgIGltYWdlID0gJ2JvbWJtaXNmbGFnZ2VkJ1xyXG4gICAgICAgIGVsc2VcclxuICAgICAgICAgIGltYWdlID0gJ29wZW4nICsgblxyXG4gICAgZm9yIGV2bCBpbiBAbGlzdGVuZXJzXHJcbiAgICAgIGV2bCgnY2VsbCcsIFtpLCBqLCBpbWFnZV0pXHJcbiAgICByZXR1cm5cclxuXHJcbiAgdXBkYXRlQWxsOiAocmV2ZWFsID0gZmFsc2UpIC0+XHJcbiAgICBpZiBAbGlzdGVuZXJzLmxlbmd0aCA9PSAwXHJcbiAgICAgIHJldHVyblxyXG5cclxuICAgIGtlZXBHb2luZyA9IHRydWVcclxuICAgIHdoaWxlIGtlZXBHb2luZ1xyXG4gICAgICBrZWVwR29pbmcgPSBmYWxzZVxyXG4gICAgICBqID0gMFxyXG4gICAgICB3aGlsZSBqIDwgQGhlaWdodFxyXG4gICAgICAgIGkgPSAwXHJcbiAgICAgICAgd2hpbGUgaSA8IEB3aWR0aFxyXG4gICAgICAgICAgaWYgKEBib21iW2kgKyBqICogQHdpZHRoXSA9PSAwKSBhbmQgQGhhc1Zpc2libGVaZXJvTmVpZ2hib3IoaSwgailcclxuICAgICAgICAgICAgaWYgQHBva2UoaSwgailcclxuICAgICAgICAgICAgICBrZWVwR29pbmcgPSB0cnVlXHJcbiAgICAgICAgICArK2lcclxuICAgICAgICArK2pcclxuICAgIGogPSAwXHJcbiAgICB3aGlsZSBqIDwgQGhlaWdodFxyXG4gICAgICBpID0gMFxyXG4gICAgICB3aGlsZSBpIDwgQHdpZHRoXHJcbiAgICAgICAgQHVwZGF0ZUNlbGwoaSwgaiwgcmV2ZWFsKVxyXG4gICAgICAgICsraVxyXG4gICAgICArK2pcclxuICAgIHJldHVyblxyXG5cclxuICBmbGFnOiAoaSwgaikgLT5cclxuICAgIGluZGV4ID0gaSArIGogKiBAd2lkdGhcclxuICAgIGlmIEB2aXNpYmxlW2luZGV4XSA9PSAwXHJcbiAgICAgIGlmIEBib21iW2luZGV4XSA9PSAxXHJcbiAgICAgICAgI2JvbWJbaW5kZXhdID0gMDtcclxuICAgICAgICAjcG9rZShpLCBqKTtcclxuICAgICAgICBAdmlzaWJsZVtpbmRleF0gPSAxXHJcbiAgICAgIGVsc2VcclxuICAgICAgICAjIEJhZCBmbGFnOyBsb3NlIHRoZSBnYW1lXHJcbiAgICAgICAgaWYgQGxvc2VMaWZlKClcclxuICAgICAgICAgIEB2aXNpYmxlW2luZGV4XSA9IDJcclxuICAgICAgICAgIEB1cGRhdGVBbGwodHJ1ZSlcclxuICAgICAgICAgIEBnYW1lb3ZlciA9IHRydWVcclxuICAgICAgICAgICMgJCgnI3dpbmxvc2UnKS5odG1sICdCQUQgRkxBRyEgWW91IGxvc2UhJ1xyXG4gICAgICAgICAgcmV0dXJuXHJcbiAgICByZXR1cm5cclxuXHJcbiAgcG9rZTogKGksIGopIC0+XHJcbiAgICByZXQgPSBmYWxzZVxyXG4gICAgaW5kZXggPSBpICsgaiAqIEB3aWR0aFxyXG4gICAgaWYgQHZpc2libGVbaW5kZXhdID09IDBcclxuICAgICAgaWYgQGJvbWJbaW5kZXhdID09IDFcclxuICAgICAgICAjIEJhZCBzcG90OyBsb3NlIHRoZSBnYW1lXHJcbiAgICAgICAgaWYgQGxvc2VMaWZlKClcclxuICAgICAgICAgIEB2aXNpYmxlW2luZGV4XSA9IDJcclxuICAgICAgICAgIEBnYW1lb3ZlciA9IHRydWVcclxuICAgICAgICAgICMgJCgnI3dpbmxvc2UnKS5odG1sICdCT01CISBZb3UgbG9zZSEnXHJcbiAgICAgICAgICBAdXBkYXRlQWxsKHRydWUpXHJcbiAgICAgICAgICByZXR1cm4gZmFsc2VcclxuICAgICAgICBlbHNlXHJcbiAgICAgICAgICByZXR1cm4gZmFsc2VcclxuICAgICAgQHZpc2libGVbaW5kZXhdID0gMVxyXG4gICAgICByZXQgPSB0cnVlXHJcbiAgICByZXR1cm4gcmV0XHJcblxyXG4gIGZpcnN0Q2xpY2tJc0ZyZWU6IC0+XHJcbiAgICBjZWxsQ291bnQgPSBAd2lkdGggKiBAaGVpZ2h0XHJcbiAgICBzdGFydEluZGV4ID0gQHJhbmQoY2VsbENvdW50KVxyXG4gICAgaW5kZXggPSBzdGFydEluZGV4XHJcbiAgICBsb29wXHJcbiAgICAgIGkgPSBNYXRoLmZsb29yKGluZGV4ICUgQHdpZHRoKVxyXG4gICAgICBqID1cclxuICAgICAgICBNYXRoLmZsb29yKGluZGV4IC8gQHdpZHRoKVxyXG4gICAgICBuID0gQG5laWdoYm9ycyhpLCBqLCBmYWxzZSlcclxuICAgICAgaWYgQGJvbWJbaW5kZXhdID09IDAgYW5kIG4gPT0gMFxyXG4gICAgICAgIEBwb2tlKGksIGopXHJcbiAgICAgICAgcmV0dXJuXHJcbiAgICAgIGluZGV4ID0gKGluZGV4ICsgMSkgJSBjZWxsQ291bnRcclxuICAgICAgaWYgaW5kZXggPT0gc3RhcnRJbmRleFxyXG4gICAgICAgIGJyZWFrXHJcbiAgICBsb29wXHJcbiAgICAgIGkgPSBNYXRoLmZsb29yKGluZGV4ICUgQHdpZHRoKVxyXG4gICAgICBqID0gTWF0aC5mbG9vcihpbmRleCAvIEB3aWR0aClcclxuICAgICAgbiA9IG5laWdoYm9ycyhpLCBqLCBmYWxzZSlcclxuICAgICAgaWYgQGJvbWJbaW5kZXhdID09IDBcclxuICAgICAgICBAcG9rZShpLCBqKVxyXG4gICAgICAgIHJldHVyblxyXG4gICAgICBpbmRleCA9IChpbmRleCArIDEpICUgY2VsbENvdW50XHJcbiAgICAgIGlmIGluZGV4ID09IHN0YXJ0SW5kZXhcclxuICAgICAgICBicmVha1xyXG4gICAgcmV0dXJuXHJcblxyXG4gIG5ld0dhbWU6IChAd2lkdGggPSAxNiwgQGhlaWdodCA9IDE2LCBAbWluZUNvdW50ID0gMCwgQHNlZWQgPSBTdHJpbmcoTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogMTAwMDAwMCkpKSAtPlxyXG4gICAgTWF0aC5zZWVkYmdtcmFuZG9tKEBzZWVkKVxyXG5cclxuICAgIEBsaXZlcyA9IDNcclxuXHJcbiAgICBjZWxsQ291bnQgPSBAd2lkdGggKiBAaGVpZ2h0XHJcbiAgICBpZiBAbWluZUNvdW50ID09IDBcclxuICAgICAgTUlORV9ERU5TSVRZID0gMC4xNlxyXG4gICAgICBAbWluZUNvdW50ID0gTWF0aC5mbG9vcihjZWxsQ291bnQgKiBNSU5FX0RFTlNJVFkpXHJcblxyXG4gICAgQGdhbWVvdmVyID0gZmFsc2VcclxuXHJcbiAgICAjIENyZWF0ZSBmcmVzaCBhcnJheXNcclxuICAgIEBib21iID0gbmV3IEFycmF5KGNlbGxDb3VudCkuZmlsbCgwKVxyXG4gICAgQHZpc2libGUgPSBuZXcgQXJyYXkoY2VsbENvdW50KS5maWxsKDApXHJcblxyXG4gICAgIyBEcm9wIGluIHRoZSBtaW5lcyByYW5kb21seVxyXG4gICAgaW5kaWNlcyA9IG5ldyBBcnJheShjZWxsQ291bnQpXHJcbiAgICBpbmRpY2VzWzBdID0gMFxyXG4gICAgaSA9IDFcclxuICAgIHdoaWxlIGkgPCBjZWxsQ291bnRcclxuICAgICAgaiA9IEByYW5kKGkpXHJcbiAgICAgIGluZGljZXNbaV0gPSBpbmRpY2VzW2pdXHJcbiAgICAgIGluZGljZXNbal0gPSBpXHJcbiAgICAgICsraVxyXG4gICAgbSA9IEBtaW5lQ291bnRcclxuICAgIGlmIG0gPj0gY2VsbENvdW50XHJcbiAgICAgIG0gPSBjZWxsQ291bnQgLSAxXHJcbiAgICBpID0gMFxyXG4gICAgd2hpbGUgaSA8IG1cclxuICAgICAgQGJvbWJbaW5kaWNlc1tpXV0gPSAxXHJcbiAgICAgICsraVxyXG4gICAgQGZpcnN0Q2xpY2tJc0ZyZWUoKVxyXG4gICAgZm9yIGV2bCBpbiBAbGlzdGVuZXJzXHJcbiAgICAgIGV2bCgnbmV3JywgW10pXHJcbiAgICBAdXBkYXRlQWxsKClcclxuICAgIEBzYXZlKClcclxuICAgIHJldHVyblxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBuZXcgTWluZVN3ZWVwZXIgIyBTaW5nbGV0b25cclxuIiwiRU5HQUdFX0RSQUdfRElTVEFOQ0UgPSAxMFxyXG5ET1VCTEVfQ0xJQ0tfTVMgPSA0MDBcclxuXHJcbmNsYXNzIFRvdWNoSW50ZXJwcmV0ZXJcclxuICBjb25zdHJ1Y3RvcjogLT5cclxuICAgIEB0cmFja2VkID0gW11cclxuICAgIEBkcmFnWCA9IDBcclxuICAgIEBkcmFnWSA9IDBcclxuICAgIEBkcmFnZ2luZyA9IGZhbHNlXHJcbiAgICBAZG91YmxlQ2xpY2tUaW1lID0gbnVsbFxyXG4gICAgQHBpbmNoQW5jaG9yID0gbnVsbFxyXG4gICAgQHBpbmNoQW5jaG9yV29ybGQgPSBudWxsXHJcblxyXG4gIGNyZWF0ZTogKEBzY2VuZSwgQGNhbWVyYSwgQHgsIEB5LCBAdywgQGgpIC0+XHJcbiAgICBAY2FtZXJhLnpvb20gPSAxXHJcbiAgICBAc2NlbmUuaW5wdXQuYWRkUG9pbnRlcigxKVxyXG4gICAgQHNjZW5lLmlucHV0Lm1vdXNlLmRpc2FibGVDb250ZXh0TWVudSgpXHJcblxyXG4gICAgQHNjZW5lLmlucHV0Lm9uICdwb2ludGVyZG93bicsIChwb2ludGVyKSA9PlxyXG4gICAgICBpZiBwb2ludGVyLnJpZ2h0QnV0dG9uRG93bigpXHJcbiAgICAgICAgd29ybGRQb3MgPSBAY2FtZXJhLmdldFdvcmxkUG9pbnQocG9pbnRlci5wb3NpdGlvbi54LCBwb2ludGVyLnBvc2l0aW9uLnkpXHJcbiAgICAgICAgQHNjZW5lLnJtYih3b3JsZFBvcy54LCB3b3JsZFBvcy55KVxyXG4gICAgICAgIHJldHVyblxyXG5cclxuICAgICAgaWYgcG9pbnRlci5wb3NpdGlvbi54ID4gKEB4ICsgQHcpXHJcbiAgICAgICAgcmV0dXJuXHJcblxyXG4gICAgICBpZiBAdHJhY2tlZC5sZW5ndGggPT0gMFxyXG4gICAgICAgIEBkcmFnZ2luZyA9IGZhbHNlXHJcblxyXG4gICAgICAjIGNvbnNvbGUubG9nIFwibmV3IHBvaW50ZXIgI3twb2ludGVyLmlkfVwiXHJcbiAgICAgIEB0cmFja2VkLnB1c2gge1xyXG4gICAgICAgIGlkOiBwb2ludGVyLmlkXHJcbiAgICAgICAgcG9zOiBwb2ludGVyLnBvc2l0aW9uLmNsb25lKClcclxuICAgICAgfVxyXG4gICAgICBpZiBAdHJhY2tlZC5sZW5ndGggPT0gMVxyXG4gICAgICAgIEBzZXREcmFnUG9pbnQoKVxyXG4gICAgICBpZiBAdHJhY2tlZC5sZW5ndGggPT0gMlxyXG4gICAgICAgICMgV2UganVzdCBhZGRlZCBhIHNlY29uZCB0b3VjaCBzcG90LiBDYWxjdWxhdGUgdGhlIGFuY2hvciBmb3IgcGluY2hpbmcgbm93XHJcbiAgICAgICAgQGNhbGNQaW5jaEFuY2hvcigpXHJcblxyXG4gICAgICBpZiBAdHJhY2tlZC5sZW5ndGggPiAxXHJcbiAgICAgICAgQGRyYWdnaW5nID0gdHJ1ZVxyXG4gICAgICAgIEBkb3VibGVDbGlja1RpbWUgPSBudWxsXHJcbiAgICAgIGVsc2UgaWYgbm90IEBkcmFnZ2luZ1xyXG4gICAgICAgIG5vdyA9IG5ldyBEYXRlKCkuZ2V0VGltZSgpXHJcbiAgICAgICAgaWYgQGRvdWJsZUNsaWNrVGltZSAhPSBudWxsXHJcbiAgICAgICAgICAjIHNlY29uZCBjbGlja1xyXG4gICAgICAgICAgY2xpY2tEZWx0YSA9IG5vdyAtIEBkb3VibGVDbGlja1RpbWVcclxuICAgICAgICAgIGlmIGNsaWNrRGVsdGEgPCBET1VCTEVfQ0xJQ0tfTVNcclxuICAgICAgICAgICAgQGRvdWJsZUNsaWNrVGltZSA9IG51bGxcclxuICAgICAgICAgICAgIyBjb25zb2xlLmxvZyBcIkRPVUJMRSBUQVAgI3tAdHJhY2tlZFswXS5wb3MueH0gI3tAdHJhY2tlZFswXS5wb3MueX1cIlxyXG4gICAgICAgICAgICByZXR1cm5cclxuICAgICAgICBAZG91YmxlQ2xpY2tUaW1lID0gbm93XHJcblxyXG4gICAgQHNjZW5lLmlucHV0Lm9uICdwb2ludGVybW92ZScsIChwb2ludGVyKSA9PlxyXG4gICAgICBwcmV2RGlzdGFuY2UgPSAwXHJcbiAgICAgIGlmIEB0cmFja2VkLmxlbmd0aCA+PSAyXHJcbiAgICAgICAgcHJldkRpc3RhbmNlID0gQGNhbGNEaXN0YW5jZShAdHJhY2tlZFswXS5wb3MueCwgQHRyYWNrZWRbMF0ucG9zLnksIEB0cmFja2VkWzFdLnBvcy54LCBAdHJhY2tlZFsxXS5wb3MueSlcclxuICAgICAgaWYgQHRyYWNrZWQubGVuZ3RoID09IDFcclxuICAgICAgICBwcmV2WCA9IEB0cmFja2VkWzBdLnBvcy54XHJcbiAgICAgICAgcHJldlkgPSBAdHJhY2tlZFswXS5wb3MueVxyXG5cclxuICAgICAgaW5kZXggPSAtMVxyXG4gICAgICBmb3IgaSBpbiBbMC4uLkB0cmFja2VkLmxlbmd0aF1cclxuICAgICAgICBpZiBAdHJhY2tlZFtpXS5pZCA9PSBwb2ludGVyLmlkXHJcbiAgICAgICAgICBpbmRleCA9IGlcclxuICAgICAgICAgIGJyZWFrXHJcbiAgICAgIGlmIGluZGV4ID09IC0xXHJcbiAgICAgICAgcmV0dXJuXHJcblxyXG4gICAgICBAdHJhY2tlZFtpbmRleF0ucG9zID0gcG9pbnRlci5wb3NpdGlvbi5jbG9uZSgpXHJcblxyXG4gICAgICBpZiBAdHJhY2tlZC5sZW5ndGggPT0gMVxyXG4gICAgICAgICMgc2luZ2xlIHRvdWNoLCBjb25zaWRlciBkcmFnZ2luZ1xyXG4gICAgICAgIGRyYWdEaXN0YW5jZSA9IEBjYWxjRGlzdGFuY2UgQGRyYWdYLCBAZHJhZ1ksIEB0cmFja2VkWzBdLnBvcy54LCBAdHJhY2tlZFswXS5wb3MueVxyXG4gICAgICAgIGlmIEBkcmFnZ2luZyBvciAoZHJhZ0Rpc3RhbmNlID4gRU5HQUdFX0RSQUdfRElTVEFOQ0UpXHJcbiAgICAgICAgICBAZHJhZ2dpbmcgPSB0cnVlXHJcbiAgICAgICAgICBpZiBkcmFnRGlzdGFuY2UgPiAwLjVcclxuICAgICAgICAgICAgZHggPSBAdHJhY2tlZFswXS5wb3MueCAtIEBkcmFnWFxyXG4gICAgICAgICAgICBkeSA9IEB0cmFja2VkWzBdLnBvcy55IC0gQGRyYWdZXHJcbiAgICAgICAgICAgICMgY29uc29sZS5sb2cgXCJzaW5nbGUgZHJhZzogI3tkeH0sICN7ZHl9XCJcclxuICAgICAgICAgICAgQGNhbWVyYS5zY3JvbGxYIC09IGR4IC8gQGNhbWVyYS56b29tXHJcbiAgICAgICAgICAgIEBjYW1lcmEuc2Nyb2xsWSAtPSBkeSAvIEBjYW1lcmEuem9vbVxyXG5cclxuICAgICAgICAgICAgIyBjb25zb2xlLmxvZyBcInNjcm9sbCAje0BjYW1lcmEuc2Nyb2xsWH0gI3tAY2FtZXJhLnpvb219ICN7QGNhbWVyYS53aWR0aH1cIlxyXG4gICAgICAgICAgQHNldERyYWdQb2ludCgpXHJcblxyXG4gICAgICBlbHNlIGlmIEB0cmFja2VkLmxlbmd0aCA+PSAyXHJcbiAgICAgICAgIyBhdCBsZWFzdCB0d28gZmluZ2VycyBwcmVzZW50LCBjaGVjayBmb3IgcGluY2gvem9vbVxyXG4gICAgICAgIGN1cnJEaXN0YW5jZSA9IEBjYWxjRGlzdGFuY2UoQHRyYWNrZWRbMF0ucG9zLngsIEB0cmFja2VkWzBdLnBvcy55LCBAdHJhY2tlZFsxXS5wb3MueCwgQHRyYWNrZWRbMV0ucG9zLnkpXHJcbiAgICAgICAgZGVsdGFEaXN0YW5jZSA9IGN1cnJEaXN0YW5jZSAtIHByZXZEaXN0YW5jZVxyXG4gICAgICAgIGlmIGRlbHRhRGlzdGFuY2UgIT0gMFxyXG4gICAgICAgICAgbmV3Wm9vbSA9IEBjYW1lcmEuem9vbSAqICgxICsgKGRlbHRhRGlzdGFuY2UgKiA0IC8gQGNhbWVyYS53aWR0aCkpXHJcbiAgICAgICAgICBAYWRqdXN0Wm9vbShuZXdab29tKVxyXG4gICAgICByZXR1cm5cclxuXHJcbiAgICBAc2NlbmUuaW5wdXQub24gJ3BvaW50ZXJ1cCcsIChwb2ludGVyKSA9PlxyXG4gICAgICBpbmRleCA9IC0xXHJcbiAgICAgIGZvciBpIGluIFswLi4uQHRyYWNrZWQubGVuZ3RoXVxyXG4gICAgICAgIGlmIEB0cmFja2VkW2ldLmlkID09IHBvaW50ZXIuaWRcclxuICAgICAgICAgIGluZGV4ID0gaVxyXG4gICAgICAgICAgYnJlYWtcclxuICAgICAgaWYgaW5kZXggPT0gLTFcclxuICAgICAgICByZXR1cm5cclxuXHJcbiAgICAgIGlmIEB0cmFja2VkLmxlbmd0aCA9PSAxXHJcbiAgICAgICAgaWYgbm90IEBkcmFnZ2luZ1xyXG4gICAgICAgICAgd29ybGRQb3MgPSBAY2FtZXJhLmdldFdvcmxkUG9pbnQoQHRyYWNrZWRbMF0ucG9zLngsIEB0cmFja2VkWzBdLnBvcy55KVxyXG4gICAgICAgICAgIyBjb25zb2xlLmxvZyBcIlRBUCAje3dvcmxkUG9zLnh9ICN7d29ybGRQb3MueX0gI3tAY2FtZXJhLnNjcm9sbFh9ICN7QGNhbWVyYS5zY3JvbGxZfSAje0BjYW1lcmEuem9vbX1cIlxyXG4gICAgICAgICAgQHNjZW5lLnRhcCh3b3JsZFBvcy54LCB3b3JsZFBvcy55KVxyXG5cclxuICAgICAgQHRyYWNrZWQuc3BsaWNlKGluZGV4LCAxKVxyXG4gICAgICBpZiBAdHJhY2tlZC5sZW5ndGggPT0gMVxyXG4gICAgICAgIEBzZXREcmFnUG9pbnQoKVxyXG5cclxuICAgICAgaWYgaW5kZXggPCAyXHJcbiAgICAgICAgIyBXZSBqdXN0IGZvcmdvdCBvbmUgb2Ygb3VyIHBpbmNoIHRvdWNoZXMuIFBpY2sgYSBuZXcgYW5jaG9yIHNwb3QuXHJcbiAgICAgICAgQGNhbGNQaW5jaEFuY2hvcigpXHJcblxyXG4gICAgICBAc2NlbmUuc2V0TWFnbmlmeWluZ0dsYXNzKDAsIDAsIDApXHJcbiAgICAgIHJldHVyblxyXG5cclxuICAgIEBzY2VuZS5pbnB1dC5vbiAnd2hlZWwnLCAocG9pbnRlciwgZ2FtZU9iamVjdHMsIGRlbHRhWCwgZGVsdGFZLCBkZWx0YVopID0+XHJcbiAgICAgIEBjYWxjUGluY2hBbmNob3IocG9pbnRlci5wb3NpdGlvbi54LCBwb2ludGVyLnBvc2l0aW9uLnkpXHJcbiAgICAgIG5ld1pvb20gPSBAY2FtZXJhLnpvb20gKiAoMSAtIChkZWx0YVkgLyA0ODApKVxyXG4gICAgICBAYWRqdXN0Wm9vbShuZXdab29tKVxyXG4gICAgICBAc2NlbmUuc2V0TWFnbmlmeWluZ0dsYXNzKDAsIDAsIDApXHJcbiAgICAgIHJldHVyblxyXG5cclxuICBhZGp1c3Rab29tOiAobmV3Wm9vbSkgLT5cclxuICAgIGlmIG5ld1pvb20gPCAwLjFcclxuICAgICAgbmV3Wm9vbSA9IDAuMVxyXG4gICAgaWYgbmV3Wm9vbSA+IDVcclxuICAgICAgbmV3Wm9vbSA9IDVcclxuICAgIEBjYW1lcmEuem9vbSA9IG5ld1pvb21cclxuXHJcbiAgICBoYWxmVyA9IChAY2FtZXJhLndpZHRoIC8gMilcclxuICAgIGhhbGZIID0gKEBjYW1lcmEuaGVpZ2h0IC8gMilcclxuICAgIG9mZnNldFggPSAoQHBpbmNoQW5jaG9yLnggLSBoYWxmVykgLyBuZXdab29tXHJcbiAgICBvZmZzZXRZID0gKEBwaW5jaEFuY2hvci55IC0gaGFsZkgpIC8gbmV3Wm9vbVxyXG4gICAgQGNhbWVyYS5zY3JvbGxYID0gQHBpbmNoQW5jaG9yV29ybGQueCAtIGhhbGZXIC0gb2Zmc2V0WFxyXG4gICAgQGNhbWVyYS5zY3JvbGxZID0gQHBpbmNoQW5jaG9yV29ybGQueSAtIGhhbGZIIC0gb2Zmc2V0WVxyXG4gICAgcmV0dXJuXHJcblxyXG4gIHNldERyYWdQb2ludDogLT5cclxuICAgIEBkcmFnWCA9IEB0cmFja2VkWzBdLnBvcy54XHJcbiAgICBAZHJhZ1kgPSBAdHJhY2tlZFswXS5wb3MueVxyXG5cclxuICBjYWxjUGluY2hBbmNob3I6IChwaW5jaFggPSBudWxsLCBwaW5jaFkgPSBudWxsKSAtPlxyXG4gICAgaWYgKHBpbmNoWCA9PSBudWxsKSBhbmQgKHBpbmNoWSA9PSBudWxsKVxyXG4gICAgICBpZiBAdHJhY2tlZC5sZW5ndGggPCAyXHJcbiAgICAgICAgcmV0dXJuXHJcbiAgICAgIHBpbmNoWCA9IE1hdGguZmxvb3IoKEB0cmFja2VkWzBdLnBvcy54ICsgQHRyYWNrZWRbMV0ucG9zLngpIC8gMilcclxuICAgICAgcGluY2hZID0gTWF0aC5mbG9vcigoQHRyYWNrZWRbMF0ucG9zLnkgKyBAdHJhY2tlZFsxXS5wb3MueSkgLyAyKVxyXG5cclxuICAgIEBwaW5jaEFuY2hvciA9IHt4OiBwaW5jaFgsIHk6IHBpbmNoWSB9XHJcbiAgICBAcGluY2hBbmNob3JXb3JsZCA9IEBjYW1lcmEuZ2V0V29ybGRQb2ludChwaW5jaFgsIHBpbmNoWSlcclxuXHJcbiAgICBAc2NlbmUuc2V0TWFnbmlmeWluZ0dsYXNzKEBwaW5jaEFuY2hvci54LCBAcGluY2hBbmNob3IueSwgMSlcclxuXHJcbiAgY2FsY0Rpc3RhbmNlOiAoeDEsIHkxLCB4MiwgeTIpIC0+XHJcbiAgICBkeCA9IHgyIC0geDFcclxuICAgIGR5ID0geTIgLSB5MVxyXG4gICAgcmV0dXJuIE1hdGguc3FydChkeCpkeCArIGR5KmR5KVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBUb3VjaEludGVycHJldGVyXHJcbiIsIkJHTUdhbWVTY2VuZSA9IHJlcXVpcmUgJy4vQkdNR2FtZVNjZW5lJ1xyXG5CR01IdWRTY2VuZSA9IHJlcXVpcmUgJy4vQkdNSHVkU2NlbmUnXHJcblxyXG5pbml0ID0gLT5cclxuICBjb25zb2xlLmxvZyBcIkJhZCBHdXkgTWluZXN3ZWVwZXI6IGluaXQoKVwiXHJcblxyXG4gIGNvbmZpZyA9XHJcbiAgICB0eXBlOiBQaGFzZXIuQVVUT1xyXG4gICAgd2lkdGg6IGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5jbGllbnRXaWR0aFxyXG4gICAgaGVpZ2h0OiBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuY2xpZW50SGVpZ2h0XHJcbiAgICBiYWNrZ3JvdW5kQ29sb3I6ICcjMDAwMDAwJyAjICcjMmQyZDJkJ1xyXG4gICAgcGFyZW50OiAnc2NyZWVuJ1xyXG4gICAgaW5wdXQ6XHJcbiAgICAgIGFjdGl2ZVBvaW50ZXJzOiAyXHJcbiAgICBzY2VuZTogW1xyXG4gICAgICBCR01HYW1lU2NlbmVcclxuICAgICAgQkdNSHVkU2NlbmVcclxuICAgIF1cclxuXHJcbiAgZ2FtZSA9IG5ldyBQaGFzZXIuR2FtZShjb25maWcpXHJcblxyXG5cclxud2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ2xvYWQnLCAoZSkgLT5cclxuICAgIGluaXQoKVxyXG4sIGZhbHNlKVxyXG4iXX0=
