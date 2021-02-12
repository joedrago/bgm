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
    if (ev !== 'cell') {
      console.log(`msEvent: ${ev}: ${JSON.stringify(args)}`);
    }
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
    var evl, i, j, k, keepGoing, l, len, o, q, r, ref, ref1, ref2, ref3, ref4, won;
    if (this.listeners.length === 0) {
      return;
    }
    keepGoing = true;
    while (keepGoing) {
      keepGoing = false;
      for (j = k = 0, ref = this.height; (0 <= ref ? k < ref : k > ref); j = 0 <= ref ? ++k : --k) {
        for (i = l = 0, ref1 = this.width; (0 <= ref1 ? l < ref1 : l > ref1); i = 0 <= ref1 ? ++l : --l) {
          if ((this.bomb[i + j * this.width] === 0) && this.hasVisibleZeroNeighbor(i, j)) {
            if (this.poke(i, j)) {
              keepGoing = true;
            }
          }
        }
      }
    }
    won = true;
    if (this.gameover) {
      won = false;
    }
    for (j = o = 0, ref2 = this.height; (0 <= ref2 ? o < ref2 : o > ref2); j = 0 <= ref2 ? ++o : --o) {
      for (i = q = 0, ref3 = this.width; (0 <= ref3 ? q < ref3 : q > ref3); i = 0 <= ref3 ? ++q : --q) {
        if (this.visible[i + j * this.width] === 0) {
          won = false;
        }
        this.updateCell(i, j, reveal);
      }
    }
    if (won) {
      this.gameover = true;
      ref4 = this.listeners;
      for (r = 0, len = ref4.length; r < len; r++) {
        evl = ref4[r];
        evl('win', []);
      }
    }
  }

  flag(i, j) {
    var evl, index, k, len, ref;
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
          this.gameover = true;
          this.updateAll(true);
          ref = this.listeners;
          for (k = 0, len = ref.length; k < len; k++) {
            evl = ref[k];
            evl('lose', []);
          }
          return;
        }
      }
    }
  }

  poke(i, j) {
    var evl, index, k, len, ref, ret;
    ret = false;
    index = i + j * this.width;
    if (this.visible[index] === 0) {
      if (this.bomb[index] === 1) {
        // Bad spot; lose the game
        if (this.loseLife()) {
          this.visible[index] = 2;
          this.gameover = true;
          this.updateAll(true);
          ref = this.listeners;
          for (k = 0, len = ref.length; k < len; k++) {
            evl = ref[k];
            evl('lose', []);
          }
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvQkdNR2FtZVNjZW5lLmNvZmZlZSIsInNyYy9CR01IdWRTY2VuZS5jb2ZmZWUiLCJzcmMvTWluZVN3ZWVwZXIuY29mZmVlIiwic3JjL1RvdWNoSW50ZXJwcmV0ZXIuY29mZmVlIiwic3JjL21haW4uY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUEsSUFBQSxZQUFBLEVBQUE7O0FBQUEsZ0JBQUEsR0FBbUIsT0FBQSxDQUFRLG9CQUFSOztBQUViLGVBQU4sTUFBQSxhQUFBLFFBQTJCLE1BQU0sQ0FBQyxNQUFsQztFQUNFLFdBQWEsQ0FBQSxDQUFBO1NBQ1gsQ0FBQTtJQUNBLE1BQU0sQ0FBQyxLQUFLLENBQUMsSUFBYixDQUFrQixJQUFsQixFQUF3QjtNQUFFLEdBQUEsRUFBSyxNQUFQO01BQWUsTUFBQSxFQUFRO0lBQXZCLENBQXhCO0lBRUEsSUFBQyxDQUFBLEVBQUQsR0FBTSxPQUFBLENBQVEsZUFBUjtJQUNOLElBQUMsQ0FBQSxLQUFELEdBQVMsSUFBSSxnQkFBSixDQUFBO0VBTEU7O0VBT2IsT0FBUyxDQUFBLENBQUE7SUFDUCxJQUFDLENBQUEsSUFBSSxDQUFDLEtBQU4sQ0FBWSxPQUFaLEVBQXFCLGtCQUFyQjtJQUNBLElBQUMsQ0FBQSxJQUFJLENBQUMsS0FBTixDQUFZLE1BQVosRUFBb0Isd0JBQXBCO0lBQ0EsSUFBQyxDQUFBLElBQUksQ0FBQyxLQUFOLENBQVksTUFBWixFQUFvQixrQkFBcEI7SUFDQSxJQUFDLENBQUEsSUFBSSxDQUFDLEtBQU4sQ0FBWSxXQUFaLEVBQXlCLHNCQUF6QjtJQUNBLElBQUMsQ0FBQSxJQUFJLENBQUMsS0FBTixDQUFZLGNBQVosRUFBNEIseUJBQTVCO0lBQ0EsSUFBQyxDQUFBLElBQUksQ0FBQyxLQUFOLENBQVksZ0JBQVosRUFBOEIsMkJBQTlCO0lBRUEsSUFBQyxDQUFBLElBQUksQ0FBQyxLQUFOLENBQVks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LE9BQVAsR0FBaUI7Ozs7QUN0S2pCLElBQUEsWUFBQSxFQUFBLFdBQUEsRUFBQTs7QUFBQSxZQUFBLEdBQWUsT0FBQSxDQUFRLGdCQUFSOztBQUNmLFdBQUEsR0FBYyxPQUFBLENBQVEsZUFBUjs7QUFFZCxJQUFBLEdBQU8sUUFBQSxDQUFBLENBQUE7QUFDUCxNQUFBLE1BQUEsRUFBQTtFQUFFLE9BQU8sQ0FBQyxHQUFSLENBQVksNkJBQVo7RUFFQSxNQUFBLEdBQ0U7SUFBQSxJQUFBLEVBQU0sTUFBTSxDQUFDLElBQWI7SUFDQSxLQUFBLEVBQU8sUUFBUSxDQUFDLGVBQWUsQ0FBQyxXQURoQztJQUVBLE1BQUEsRUFBUSxRQUFRLENBQUMsZUFBZSxDQUFDLFlBRmpDO0lBR0EsZUFBQSxFQUFpQixTQUhqQjtJQUlBLE1BQUEsRUFBUSxRQUpSO0lBS0EsS0FBQSxFQUNFO01BQUEsY0FBQSxFQUFnQjtJQUFoQixDQU5GO0lBT0EsS0FBQSxFQUFPLENBQ0wsWUFESyxFQUVMLFdBRks7RUFQUDtTQVlGLElBQUEsR0FBTyxJQUFJLE1BQU0sQ0FBQyxJQUFYLENBQWdCLE1BQWhCO0FBaEJGOztBQW1CUCxNQUFNLENBQUMsZ0JBQVAsQ0FBd0IsTUFBeEIsRUFBZ0MsUUFBQSxDQUFDLENBQUQsQ0FBQTtTQUM1QixJQUFBLENBQUE7QUFENEIsQ0FBaEMsRUFFRSxLQUZGIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24oKXtmdW5jdGlvbiByKGUsbix0KXtmdW5jdGlvbiBvKGksZil7aWYoIW5baV0pe2lmKCFlW2ldKXt2YXIgYz1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlO2lmKCFmJiZjKXJldHVybiBjKGksITApO2lmKHUpcmV0dXJuIHUoaSwhMCk7dmFyIGE9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitpK1wiJ1wiKTt0aHJvdyBhLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsYX12YXIgcD1uW2ldPXtleHBvcnRzOnt9fTtlW2ldWzBdLmNhbGwocC5leHBvcnRzLGZ1bmN0aW9uKHIpe3ZhciBuPWVbaV1bMV1bcl07cmV0dXJuIG8obnx8cil9LHAscC5leHBvcnRzLHIsZSxuLHQpfXJldHVybiBuW2ldLmV4cG9ydHN9Zm9yKHZhciB1PVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmUsaT0wO2k8dC5sZW5ndGg7aSsrKW8odFtpXSk7cmV0dXJuIG99cmV0dXJuIHJ9KSgpIiwiVG91Y2hJbnRlcnByZXRlciA9IHJlcXVpcmUgJy4vVG91Y2hJbnRlcnByZXRlcidcclxuXHJcbmNsYXNzIEJHTUdhbWVTY2VuZSBleHRlbmRzIFBoYXNlci5TY2VuZVxyXG4gIGNvbnN0cnVjdG9yOiAtPlxyXG4gICAgc3VwZXIoKVxyXG4gICAgUGhhc2VyLlNjZW5lLmNhbGwodGhpcywgeyBrZXk6ICdnYW1lJywgYWN0aXZlOiB0cnVlIH0pO1xyXG5cclxuICAgIEBtcyA9IHJlcXVpcmUgJy4vTWluZVN3ZWVwZXInXHJcbiAgICBAdG91Y2ggPSBuZXcgVG91Y2hJbnRlcnByZXRlclxyXG5cclxuICBwcmVsb2FkOiAtPlxyXG4gICAgQGxvYWQuaW1hZ2UoJ2JsYW5rJywgJ2ltYWdlcy9ibGFuay5naWYnKVxyXG4gICAgQGxvYWQuaW1hZ2UoJ2ZsYWcnLCAnaW1hZ2VzL2JvbWJmbGFnZ2VkLmdpZicpXHJcbiAgICBAbG9hZC5pbWFnZSgnYm9tYicsICdpbWFnZXMvYm9tYjAuZ2lmJylcclxuICAgIEBsb2FkLmltYWdlKCdib21iZGVhdGgnLCAnaW1hZ2VzL2JvbWJkZWF0aC5naWYnKVxyXG4gICAgQGxvYWQuaW1hZ2UoJ2JvbWJyZXZlYWxlZCcsICdpbWFnZXMvYm9tYnJldmVhbGVkLmdpZicpXHJcbiAgICBAbG9hZC5pbWFnZSgnYm9tYm1pc2ZsYWdnZWQnLCAnaW1hZ2VzL2JvbWJtaXNmbGFnZ2VkLmdpZicpXHJcblxyXG4gICAgQGxvYWQuaW1hZ2UoJ3NoYWRvdzAnLCAnaW1hZ2VzL3NoYWRvdzAuZ2lmJylcclxuICAgIEBsb2FkLmltYWdlKCdzaGFkb3cxJywgJ2ltYWdlcy9zaGFkb3cxLmdpZicpXHJcbiAgICBAbG9hZC5pbWFnZSgnc2hhZG93MicsICdpbWFnZXMvc2hhZG93Mi5naWYnKVxyXG4gICAgQGxvYWQuaW1hZ2UoJ3NoYWRvdzMnLCAnaW1hZ2VzL3NoYWRvdzMuZ2lmJylcclxuICAgIEBsb2FkLmltYWdlKCdzaGFkb3c0JywgJ2ltYWdlcy9zaGFkb3c0LmdpZicpXHJcbiAgICBAbG9hZC5pbWFnZSgnc2hhZG93NScsICdpbWFnZXMvc2hhZG93NS5naWYnKVxyXG4gICAgQGxvYWQuaW1hZ2UoJ3NoYWRvdzYnLCAnaW1hZ2VzL3NoYWRvdzYuZ2lmJylcclxuICAgIEBsb2FkLmltYWdlKCdzaGFkb3c3JywgJ2ltYWdlcy9zaGFkb3c3LmdpZicpXHJcbiAgICBAbG9hZC5pbWFnZSgnc2hhZG93OCcsICdpbWFnZXMvc2hhZG93OC5naWYnKVxyXG5cclxuICAgIEBsb2FkLmltYWdlKCdib21iMCcsICdpbWFnZXMvYm9tYjAuZ2lmJylcclxuICAgIEBsb2FkLmltYWdlKCdib21iMScsICdpbWFnZXMvYm9tYjEuZ2lmJylcclxuICAgIEBsb2FkLmltYWdlKCdib21iMicsICdpbWFnZXMvYm9tYjIuZ2lmJylcclxuICAgIEBsb2FkLmltYWdlKCdib21iMycsICdpbWFnZXMvYm9tYjMuZ2lmJylcclxuICAgIEBsb2FkLmltYWdlKCdib21iNCcsICdpbWFnZXMvYm9tYjQuZ2lmJylcclxuICAgIEBsb2FkLmltYWdlKCdib21iNScsICdpbWFnZXMvYm9tYjUuZ2lmJylcclxuICAgIEBsb2FkLmltYWdlKCdib21iNicsICdpbWFnZXMvYm9tYjYuZ2lmJylcclxuICAgIEBsb2FkLmltYWdlKCdib21iNycsICdpbWFnZXMvYm9tYjcuZ2lmJylcclxuICAgIEBsb2FkLmltYWdlKCdib21iOCcsICdpbWFnZXMvYm9tYjguZ2lmJylcclxuXHJcbiAgICBAbG9hZC5pbWFnZSgnb3BlbjAnLCAnaW1hZ2VzL29wZW4wLmdpZicpXHJcbiAgICBAbG9hZC5pbWFnZSgnb3BlbjEnLCAnaW1hZ2VzL29wZW4xLmdpZicpXHJcbiAgICBAbG9hZC5pbWFnZSgnb3BlbjInLCAnaW1hZ2VzL29wZW4yLmdpZicpXHJcbiAgICBAbG9hZC5pbWFnZSgnb3BlbjMnLCAnaW1hZ2VzL29wZW4zLmdpZicpXHJcbiAgICBAbG9hZC5pbWFnZSgnb3BlbjQnLCAnaW1hZ2VzL29wZW40LmdpZicpXHJcbiAgICBAbG9hZC5pbWFnZSgnb3BlbjUnLCAnaW1hZ2VzL29wZW41LmdpZicpXHJcbiAgICBAbG9hZC5pbWFnZSgnb3BlbjYnLCAnaW1hZ2VzL29wZW42LmdpZicpXHJcbiAgICBAbG9hZC5pbWFnZSgnb3BlbjcnLCAnaW1hZ2VzL29wZW43LmdpZicpXHJcbiAgICBAbG9hZC5pbWFnZSgnb3BlbjgnLCAnaW1hZ2VzL29wZW44LmdpZicpXHJcblxyXG4gIGNyZWF0ZTogLT5cclxuICAgIHNwbGl0ID0gTWF0aC5mbG9vcihAY2FtZXJhcy5tYWluLndpZHRoICogMC45KVxyXG4gICAgQGNhbWVyYXMubWFpbi5zZXRWaWV3cG9ydCgwLCAwLCBzcGxpdCwgQGNhbWVyYXMubWFpbi5oZWlnaHQpXHJcblxyXG4gICAgQG1zLmFkZEV2ZW50TGlzdGVuZXIoQG1zRXZlbnQuYmluZCh0aGlzKSlcclxuICAgIEByZWNyZWF0ZURpc3BsYXlMaXN0KClcclxuICAgIEBtcy51cGRhdGVBbGwoKVxyXG5cclxuICAgIEB0b3VjaC5jcmVhdGUodGhpcywgQGNhbWVyYXMubWFpbiwgMCwgMCwgc3BsaXQsIEBjYW1lcmFzLm1haW4uaGVpZ2h0KVxyXG5cclxuICBtc0V2ZW50OiAoZXYsIGFyZ3MpIC0+XHJcbiAgICBpZiBldiAhPSAnY2VsbCdcclxuICAgICAgY29uc29sZS5sb2cgXCJtc0V2ZW50OiAje2V2fTogI3tKU09OLnN0cmluZ2lmeShhcmdzKX1cIlxyXG4gICAgc3dpdGNoIGV2XHJcbiAgICAgIHdoZW4gJ25ldydcclxuICAgICAgICBpZiAoQG1zLndpZHRoICE9IEBncmlkQ29scykgb3IgKEBtcy5oZWlnaHQgIT0gQGdyaWRSb3dzKVxyXG4gICAgICAgICAgQHJlY3JlYXRlRGlzcGxheUxpc3QoKVxyXG4gICAgICB3aGVuICdjZWxsJ1xyXG4gICAgICAgIEBncmlkW2FyZ3NbMF1dW2FyZ3NbMV1dLnNldFRleHR1cmUoYXJnc1syXSlcclxuICAgICAgd2hlbiAnbGlmZSdcclxuICAgICAgICBAc2NlbmUuZ2V0KCdodWQnKS5kZWJ1Z1RleHQudGV4dCA9IFwiQXJlIHlvdSBzdXV1dXV1dXJlPyAoI3thcmdzWzBdfSlcIlxyXG4gICAgICAgIEBjYW1lcmFzLm1haW4uc2hha2UoMzAwLCAwLjAwMSlcclxuXHJcbiAgdXBkYXRlOiAtPlxyXG5cclxuICByZWNyZWF0ZURpc3BsYXlMaXN0OiAtPlxyXG4gICAgY29uc29sZS5sb2cgXCJyZWNyZWF0ZURpc3BsYXlMaXN0KClcIlxyXG4gICAgQGFkZC5kaXNwbGF5TGlzdC5yZW1vdmVBbGwoKVxyXG5cclxuICAgIEBncmlkQ29scyA9IEBtcy53aWR0aFxyXG4gICAgQGdyaWRSb3dzID0gQG1zLmhlaWdodFxyXG4gICAgQGdyaWQgPSBuZXcgQXJyYXkoQGdyaWRDb2xzKVxyXG4gICAgZm9yIGkgaW4gWzAuLi5AZ3JpZENvbHNdXHJcbiAgICAgIEBncmlkW2ldID0gbmV3IEFycmF5KEBncmlkUm93cylcclxuICAgICAgZm9yIGogaW4gWzAuLi5AZ3JpZFJvd3NdXHJcbiAgICAgICAgQGdyaWRbaV1bal0gPSBAYWRkLmltYWdlKGkgKiAxNiwgaiAqIDE2LCAnYmxhbmsnKVxyXG4gICAgICAgIEBncmlkW2ldW2pdLnNldE9yaWdpbigwLCAwKVxyXG4gICAgQHJlc2V0VmlldygpXHJcblxyXG4gIGNlbnRlckdyaWQ6IC0+XHJcbiAgICB0b3RhbFcgPSBAZ3JpZENvbHMgKiAxNlxyXG4gICAgdG90YWxIID0gQGdyaWRSb3dzICogMTZcclxuICAgIEBjYW1lcmFzLm1haW4uc2Nyb2xsWCA9ICh0b3RhbFcgLSBAY2FtZXJhcy5tYWluLndpZHRoKSAvIDJcclxuICAgIEBjYW1lcmFzLm1haW4uc2Nyb2xsWSA9ICh0b3RhbEggLSBAY2FtZXJhcy5tYWluLmhlaWdodCkgLyAyXHJcblxyXG4gIHJlc2V0VmlldzogLT5cclxuICAgIEBjYW1lcmFzLm1haW4uem9vbSA9IDFcclxuICAgIEBjZW50ZXJHcmlkKClcclxuXHJcbiAgc2V0TW9kZTogKEBtb2RlKSAtPlxyXG4gICAgIyBjb25zb2xlLmxvZyBcIkdhbWUgTW9kZTogI3tAbW9kZX1cIlxyXG4gICAgaWYgQG1zLmdhbWVvdmVyXHJcbiAgICAgIEBtcy5uZXdHYW1lKClcclxuXHJcbiAgc2V0TWFnbmlmeWluZ0dsYXNzOiAoeCwgeSwgYWxwaGEpIC0+XHJcbiAgICBAc2NlbmUuZ2V0KCdodWQnKS5zZXRNYWduaWZ5aW5nR2xhc3MoeCwgeSwgYWxwaGEpXHJcblxyXG4gIHJtYjogKHdvcmxkWCwgd29ybGRZKSAtPlxyXG4gICAgQHNjZW5lLmdldCgnaHVkJykudG9nZ2xlTW9kZSgpXHJcbiAgICBAbXMuc2F2ZSgpXHJcblxyXG4gIHRhcDogKHdvcmxkWCwgd29ybGRZKSAtPlxyXG4gICAgQHNjZW5lLmdldCgnaHVkJykuZGVidWdUZXh0LnRleHQgPSBcIlwiXHJcblxyXG4gICAgaWYgQG1zLmdhbWVvdmVyXHJcbiAgICAgIGNvbnNvbGUubG9nIFwiZ2FtZSBpcyBvdmVyLCBkb2luZyBub3RoaW5nXCJcclxuICAgICAgcmV0dXJuXHJcblxyXG4gICAgaWYgKHdvcmxkWCA+PSAwKSBhbmQgKHdvcmxkWCA8IChAZ3JpZENvbHMgKiAxNikpIGFuZCAod29ybGRZID49IDApIGFuZCAod29ybGRZIDwgKEBncmlkUm93cyAqIDE2KSlcclxuICAgICAgeCA9IE1hdGguZmxvb3Iod29ybGRYIC8gMTYpXHJcbiAgICAgIHkgPSBNYXRoLmZsb29yKHdvcmxkWSAvIDE2KVxyXG4gICAgICBpZiBAbW9kZSA9PSAnZmxhZydcclxuICAgICAgICBAbXMuZmxhZyh4LCB5KVxyXG4gICAgICBlbHNlXHJcbiAgICAgICAgQG1zLnBva2UoeCwgeSlcclxuICAgICAgQG1zLnVwZGF0ZUFsbCgpXHJcblxyXG4gICAgQG1zLnNhdmUoKVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBCR01HYW1lU2NlbmVcclxuIiwiY2xhc3MgQkdNSHVkU2NlbmUgZXh0ZW5kcyBQaGFzZXIuU2NlbmVcclxuICBjb25zdHJ1Y3RvcjogLT5cclxuICAgIHN1cGVyKClcclxuICAgIFBoYXNlci5TY2VuZS5jYWxsKHRoaXMsIHsga2V5OiAnaHVkJywgYWN0aXZlOiB0cnVlIH0pO1xyXG5cclxuICBwcmVsb2FkOiAtPlxyXG4gICAgQGxvYWQuaW1hZ2UoJ2dsYXNzJywgJ2ltYWdlcy9nbGFzcy5naWYnKVxyXG5cclxuICAgIEBsb2FkLmltYWdlKCdidG5fYm9tYicsICdpbWFnZXMvYnRuX2JvbWIucG5nJylcclxuICAgIEBsb2FkLmltYWdlKCdidG5fZmxhZycsICdpbWFnZXMvYnRuX2ZsYWcucG5nJylcclxuXHJcbiAgY3JlYXRlOiAtPlxyXG4gICAgQHBhbmVsWCA9IE1hdGguZmxvb3IoQGNhbWVyYXMubWFpbi53aWR0aCAqIDAuOSlcclxuICAgIEBwYW5lbFkgPSAwXHJcbiAgICBAcGFuZWxXID0gQGNhbWVyYXMubWFpbi53aWR0aCAtIEBwYW5lbFhcclxuICAgIEBwYW5lbEggPSBAY2FtZXJhcy5tYWluLmhlaWdodFxyXG5cclxuICAgIEBwYW5lbEJhY2tncm91bmQgPSBAYWRkLmdyYXBoaWNzKClcclxuICAgIEBwYW5lbEJhY2tncm91bmQuZmlsbFN0eWxlKDB4MzMzMzMzLCAxKVxyXG4gICAgQHBhbmVsQmFja2dyb3VuZC5maWxsUmVjdChAcGFuZWxYLCBAcGFuZWxZLCBAcGFuZWxXLCBAcGFuZWxIKVxyXG4gICAgQHBhbmVsQmFja2dyb3VuZC5saW5lU3R5bGUoMSwgMHgwMDAwMDAsIDEuMClcclxuICAgIEBwYW5lbEJhY2tncm91bmQuc3Ryb2tlUmVjdChAcGFuZWxYLCBAcGFuZWxZLCBAcGFuZWxXLCBAcGFuZWxIKVxyXG5cclxuICAgIEBidXR0b24gPSBAYWRkLmltYWdlKEBwYW5lbFggKyAoQHBhbmVsVyAvIDIpLCBAcGFuZWxZICsgKEBwYW5lbEggLyAyKSwgJ2J0bl9ib21iJylcclxuICAgIEBidXR0b24uc2V0RGlzcGxheVNpemUoQHBhbmVsVyAqIDAuOCwgQHBhbmVsVyAqIDAuOClcclxuICAgIEBidXR0b24uc2V0SW50ZXJhY3RpdmUoKVxyXG4gICAgQGJ1dHRvbi5vbiAncG9pbnRlcmRvd24nLCA9PlxyXG4gICAgICBAdG9nZ2xlTW9kZSgpXHJcbiAgICBAdG9nZ2xlTW9kZSgpXHJcblxyXG4gICAgQGRlYnVnVGV4dCA9IEBhZGQudGV4dCgwLCAwLCAnJylcclxuICAgIEBnbGFzcyA9IEBhZGQuaW1hZ2UoNTAsIDUwLCAnZ2xhc3MnKVxyXG4gICAgQGdsYXNzLnNldE9yaWdpbigwLjYsIDAuMykgIyByb3VnaGx5IHRoZSBtaWRkbGUgb2YgdGhlIG1hZ25pZnlpbmcgZ2xhc3NcclxuICAgIEBnbGFzcy5hbHBoYSA9IDBcclxuXHJcbiAgdG9nZ2xlTW9kZTogLT5cclxuICAgIGlmIEBtb2RlID09ICdib21iJ1xyXG4gICAgICBAbW9kZSA9ICdmbGFnJ1xyXG4gICAgZWxzZVxyXG4gICAgICBAbW9kZSA9ICdib21iJ1xyXG5cclxuICAgIEBidXR0b24uc2V0VGV4dHVyZShcImJ0bl8je0Btb2RlfVwiKVxyXG4gICAgQHNjZW5lLmdldCgnZ2FtZScpLnNldE1vZGUoQG1vZGUpXHJcblxyXG4gIHVwZGF0ZTogLT5cclxuXHJcbiAgc2V0TWFnbmlmeWluZ0dsYXNzOiAoeCwgeSwgYWxwaGEpIC0+XHJcbiAgICBAZ2xhc3MueCA9IHhcclxuICAgIEBnbGFzcy55ID0geVxyXG4gICAgQGdsYXNzLmFscGhhID0gYWxwaGFcclxuXHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IEJHTUh1ZFNjZW5lXHJcbiIsInByb3BzVG9TYXZlID0gW1xyXG4gICdzZWVkJ1xyXG4gICd3aWR0aCdcclxuICAnaGVpZ2h0J1xyXG4gICdib21iJ1xyXG4gICd2aXNpYmxlJ1xyXG4gICdsaXZlcydcclxuICAnbWluZUNvdW50J1xyXG4gICdnYW1lb3ZlcidcclxuXVxyXG5cclxuY2xhc3MgTWluZVN3ZWVwZXJcclxuICBjb25zdHJ1Y3RvcjogLT5cclxuICAgIEBsaXN0ZW5lcnMgPSBbXVxyXG4gICAgaWYgbm90IEBsb2FkKClcclxuICAgICAgQG5ld0dhbWUoKVxyXG5cclxuICBsb2FkOiAtPlxyXG4gICAgcmF3RGF0YSA9IGxvY2FsU3RvcmFnZS5nZXRJdGVtKFwic2F2ZVwiKVxyXG4gICAgaWYgbm90IHJhd0RhdGE/XHJcbiAgICAgIHJldHVybiBmYWxzZVxyXG4gICAgdHJ5XHJcbiAgICAgIGRhdGEgPSBKU09OLnBhcnNlKHJhd0RhdGEpXHJcbiAgICBjYXRjaFxyXG4gICAgICBkYXRhID0gbnVsbFxyXG5cclxuICAgIGlmIG5vdCBkYXRhP1xyXG4gICAgICByZXR1cm4gZmFsc2VcclxuXHJcbiAgICBmb3IgcCBpbiBwcm9wc1RvU2F2ZVxyXG4gICAgICBpZiBub3QgZGF0YS5oYXNPd25Qcm9wZXJ0eShwKVxyXG4gICAgICAgIHJldHVybiBmYWxzZVxyXG5cclxuICAgIGZvciBwIGluIHByb3BzVG9TYXZlXHJcbiAgICAgIHRoaXNbcF0gPSBkYXRhW3BdXHJcbiAgICByZXR1cm4gdHJ1ZVxyXG5cclxuICBzYXZlOiAtPlxyXG4gICAgZGF0YSA9IHt9XHJcbiAgICBmb3IgcCBpbiBwcm9wc1RvU2F2ZVxyXG4gICAgICBkYXRhW3BdID0gdGhpc1twXVxyXG4gICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oXCJzYXZlXCIsIEpTT04uc3RyaW5naWZ5KGRhdGEpKVxyXG5cclxuICBhZGRFdmVudExpc3RlbmVyOiAoZXZsKSAtPlxyXG4gICAgQGxpc3RlbmVycy5wdXNoKGV2bClcclxuXHJcbiAgcmFuZDogKHgpIC0+XHJcbiAgICByZXR1cm4gTWF0aC5mbG9vcihNYXRoLmJnbXJhbmRvbSgpICogeClcclxuXHJcbiAgbmVpZ2hib3JzOiAoaSwgaiwgdW5mbGFnZ2VkT25seSkgLT5cclxuICAgIG4gPSAwXHJcbiAgICB4MSA9IE1hdGgubWF4KGkgLSAxLCAwKVxyXG4gICAgeDIgPSBNYXRoLm1pbihAd2lkdGggLSAxLCBpICsgMSlcclxuICAgIHkxID0gTWF0aC5tYXgoaiAtIDEsIDApXHJcbiAgICB5MiA9IE1hdGgubWluKEBoZWlnaHQgLSAxLCBqICsgMSlcclxuICAgIHggPSB4MVxyXG4gICAgd2hpbGUgeCA8PSB4MlxyXG4gICAgICB5ID0geTFcclxuICAgICAgd2hpbGUgeSA8PSB5MlxyXG4gICAgICAgIGlmIHggIT0gaSBvciB5ICE9IGpcclxuICAgICAgICAgIGlmICF1bmZsYWdnZWRPbmx5IG9yIChAdmlzaWJsZVt4ICsgeSAqIEB3aWR0aF0gPT0gMClcclxuICAgICAgICAgICAgaWYgQGJvbWJbeCArIHkgKiBAd2lkdGhdID09IDFcclxuICAgICAgICAgICAgICArK25cclxuICAgICAgICArK3lcclxuICAgICAgKyt4XHJcbiAgICByZXR1cm4gblxyXG5cclxuICBoYXNWaXNpYmxlWmVyb05laWdoYm9yOiAoaSwgaikgLT5cclxuICAgIHgxID0gTWF0aC5tYXgoaSAtIDEsIDApXHJcbiAgICB4MiA9IE1hdGgubWluKEB3aWR0aCAtIDEsIGkgKyAxKVxyXG4gICAgeTEgPSBNYXRoLm1heChqIC0gMSwgMClcclxuICAgIHkyID0gTWF0aC5taW4oQGhlaWdodCAtIDEsIGogKyAxKVxyXG4gICAgeCA9IHgxXHJcbiAgICB3aGlsZSB4IDw9IHgyXHJcbiAgICAgIHkgPSB5MVxyXG4gICAgICB3aGlsZSB5IDw9IHkyXHJcbiAgICAgICAgaWYgeCAhPSBpIG9yIHkgIT0galxyXG4gICAgICAgICAgaWYgQHZpc2libGVbeCArIHkgKiBAd2lkdGhdICE9IDBcclxuICAgICAgICAgICAgbiA9IEBuZWlnaGJvcnMoeCwgeSwgZmFsc2UpXHJcbiAgICAgICAgICAgIGlmIG4gPT0gMFxyXG4gICAgICAgICAgICAgIHJldHVybiB0cnVlXHJcbiAgICAgICAgKyt5XHJcbiAgICAgICsreFxyXG4gICAgcmV0dXJuIGZhbHNlXHJcblxyXG4gIGxvc2VMaWZlOiAtPlxyXG4gICAgQGxpdmVzIC09IDFcclxuICAgIGlmIEBsaXZlcyA+IDBcclxuICAgICAgZm9yIGV2bCBpbiBAbGlzdGVuZXJzXHJcbiAgICAgICAgZXZsKCdsaWZlJywgW0BsaXZlc10pXHJcbiAgICAgIHJldHVybiBmYWxzZVxyXG4gICAgcmV0dXJuIHRydWVcclxuXHJcbiAgdXBkYXRlQ2VsbDogKGksIGosIHJldmVhbCkgLT5cclxuICAgIGltYWdlID0gJ2JsYW5rJ1xyXG4gICAgaW5kZXggPSBpICsgaiAqIEB3aWR0aFxyXG4gICAgaXNCb21iID0gQGJvbWJbaW5kZXhdXHJcbiAgICBpc1Zpc2libGUgPSBAdmlzaWJsZVtpbmRleF1cclxuICAgIG4gPSBAbmVpZ2hib3JzKGksIGosIGZhbHNlKVxyXG4gICAgaWYgaXNWaXNpYmxlID09IDBcclxuICAgICAgaWYgcmV2ZWFsXHJcbiAgICAgICAgaWYgaXNCb21iID09IDFcclxuICAgICAgICAgIGltYWdlID0gJ2JvbWJyZXZlYWxlZCdcclxuICAgICAgICBlbHNlXHJcbiAgICAgICAgICBpbWFnZSA9ICdzaGFkb3cnICsgblxyXG4gICAgICBlbHNlXHJcbiAgICAgICAgaW1hZ2UgPSAnYmxhbmsnXHJcbiAgICBlbHNlXHJcbiAgICAgIGlmIGlzQm9tYiA9PSAxXHJcbiAgICAgICAgaWYgaXNWaXNpYmxlID09IDJcclxuICAgICAgICAgIGltYWdlID0gJ2JvbWJkZWF0aCdcclxuICAgICAgICBlbHNlXHJcbiAgICAgICAgICB1bmZsYWdnZWQgPSBAbmVpZ2hib3JzKGksIGosIHRydWUpXHJcbiAgICAgICAgICBpZiB1bmZsYWdnZWQgPT0gMFxyXG4gICAgICAgICAgICBuID0gMFxyXG4gICAgICAgICAgaW1hZ2UgPSAnYm9tYicgKyBuXHJcbiAgICAgIGVsc2VcclxuICAgICAgICBpZiBpc1Zpc2libGUgPT0gMlxyXG4gICAgICAgICAgaW1hZ2UgPSAnYm9tYm1pc2ZsYWdnZWQnXHJcbiAgICAgICAgZWxzZVxyXG4gICAgICAgICAgaW1hZ2UgPSAnb3BlbicgKyBuXHJcbiAgICBmb3IgZXZsIGluIEBsaXN0ZW5lcnNcclxuICAgICAgZXZsKCdjZWxsJywgW2ksIGosIGltYWdlXSlcclxuICAgIHJldHVyblxyXG5cclxuICB1cGRhdGVBbGw6IChyZXZlYWwgPSBmYWxzZSkgLT5cclxuICAgIGlmIEBsaXN0ZW5lcnMubGVuZ3RoID09IDBcclxuICAgICAgcmV0dXJuXHJcblxyXG4gICAga2VlcEdvaW5nID0gdHJ1ZVxyXG4gICAgd2hpbGUga2VlcEdvaW5nXHJcbiAgICAgIGtlZXBHb2luZyA9IGZhbHNlXHJcbiAgICAgIGZvciBqIGluIFswLi4uQGhlaWdodF1cclxuICAgICAgICBmb3IgaSBpbiBbMC4uLkB3aWR0aF1cclxuICAgICAgICAgIGlmIChAYm9tYltpICsgaiAqIEB3aWR0aF0gPT0gMCkgYW5kIEBoYXNWaXNpYmxlWmVyb05laWdoYm9yKGksIGopXHJcbiAgICAgICAgICAgIGlmIEBwb2tlKGksIGopXHJcbiAgICAgICAgICAgICAga2VlcEdvaW5nID0gdHJ1ZVxyXG5cclxuICAgIHdvbiA9IHRydWVcclxuICAgIGlmIEBnYW1lb3ZlclxyXG4gICAgICB3b24gPSBmYWxzZVxyXG5cclxuICAgIGZvciBqIGluIFswLi4uQGhlaWdodF1cclxuICAgICAgZm9yIGkgaW4gWzAuLi5Ad2lkdGhdXHJcbiAgICAgICAgaWYgQHZpc2libGVbaSArIGogKiBAd2lkdGhdID09IDBcclxuICAgICAgICAgIHdvbiA9IGZhbHNlXHJcbiAgICAgICAgQHVwZGF0ZUNlbGwoaSwgaiwgcmV2ZWFsKVxyXG4gICAgaWYgd29uXHJcbiAgICAgIEBnYW1lb3ZlciA9IHRydWVcclxuICAgICAgZm9yIGV2bCBpbiBAbGlzdGVuZXJzXHJcbiAgICAgICAgZXZsKCd3aW4nLCBbXSlcclxuICAgIHJldHVyblxyXG5cclxuICBmbGFnOiAoaSwgaikgLT5cclxuICAgIGluZGV4ID0gaSArIGogKiBAd2lkdGhcclxuICAgIGlmIEB2aXNpYmxlW2luZGV4XSA9PSAwXHJcbiAgICAgIGlmIEBib21iW2luZGV4XSA9PSAxXHJcbiAgICAgICAgI2JvbWJbaW5kZXhdID0gMDtcclxuICAgICAgICAjcG9rZShpLCBqKTtcclxuICAgICAgICBAdmlzaWJsZVtpbmRleF0gPSAxXHJcbiAgICAgIGVsc2VcclxuICAgICAgICAjIEJhZCBmbGFnOyBsb3NlIHRoZSBnYW1lXHJcbiAgICAgICAgaWYgQGxvc2VMaWZlKClcclxuICAgICAgICAgIEB2aXNpYmxlW2luZGV4XSA9IDJcclxuICAgICAgICAgIEBnYW1lb3ZlciA9IHRydWVcclxuICAgICAgICAgIEB1cGRhdGVBbGwodHJ1ZSlcclxuICAgICAgICAgIGZvciBldmwgaW4gQGxpc3RlbmVyc1xyXG4gICAgICAgICAgICBldmwoJ2xvc2UnLCBbXSlcclxuICAgICAgICAgIHJldHVyblxyXG4gICAgcmV0dXJuXHJcblxyXG4gIHBva2U6IChpLCBqKSAtPlxyXG4gICAgcmV0ID0gZmFsc2VcclxuICAgIGluZGV4ID0gaSArIGogKiBAd2lkdGhcclxuICAgIGlmIEB2aXNpYmxlW2luZGV4XSA9PSAwXHJcbiAgICAgIGlmIEBib21iW2luZGV4XSA9PSAxXHJcbiAgICAgICAgIyBCYWQgc3BvdDsgbG9zZSB0aGUgZ2FtZVxyXG4gICAgICAgIGlmIEBsb3NlTGlmZSgpXHJcbiAgICAgICAgICBAdmlzaWJsZVtpbmRleF0gPSAyXHJcbiAgICAgICAgICBAZ2FtZW92ZXIgPSB0cnVlXHJcbiAgICAgICAgICBAdXBkYXRlQWxsKHRydWUpXHJcbiAgICAgICAgICBmb3IgZXZsIGluIEBsaXN0ZW5lcnNcclxuICAgICAgICAgICAgZXZsKCdsb3NlJywgW10pXHJcbiAgICAgICAgICByZXR1cm4gZmFsc2VcclxuICAgICAgICBlbHNlXHJcbiAgICAgICAgICByZXR1cm4gZmFsc2VcclxuICAgICAgQHZpc2libGVbaW5kZXhdID0gMVxyXG4gICAgICByZXQgPSB0cnVlXHJcbiAgICByZXR1cm4gcmV0XHJcblxyXG4gIGZpcnN0Q2xpY2tJc0ZyZWU6IC0+XHJcbiAgICBjZWxsQ291bnQgPSBAd2lkdGggKiBAaGVpZ2h0XHJcbiAgICBzdGFydEluZGV4ID0gQHJhbmQoY2VsbENvdW50KVxyXG4gICAgaW5kZXggPSBzdGFydEluZGV4XHJcbiAgICBsb29wXHJcbiAgICAgIGkgPSBNYXRoLmZsb29yKGluZGV4ICUgQHdpZHRoKVxyXG4gICAgICBqID1cclxuICAgICAgICBNYXRoLmZsb29yKGluZGV4IC8gQHdpZHRoKVxyXG4gICAgICBuID0gQG5laWdoYm9ycyhpLCBqLCBmYWxzZSlcclxuICAgICAgaWYgQGJvbWJbaW5kZXhdID09IDAgYW5kIG4gPT0gMFxyXG4gICAgICAgIEBwb2tlKGksIGopXHJcbiAgICAgICAgcmV0dXJuXHJcbiAgICAgIGluZGV4ID0gKGluZGV4ICsgMSkgJSBjZWxsQ291bnRcclxuICAgICAgaWYgaW5kZXggPT0gc3RhcnRJbmRleFxyXG4gICAgICAgIGJyZWFrXHJcbiAgICBsb29wXHJcbiAgICAgIGkgPSBNYXRoLmZsb29yKGluZGV4ICUgQHdpZHRoKVxyXG4gICAgICBqID0gTWF0aC5mbG9vcihpbmRleCAvIEB3aWR0aClcclxuICAgICAgbiA9IG5laWdoYm9ycyhpLCBqLCBmYWxzZSlcclxuICAgICAgaWYgQGJvbWJbaW5kZXhdID09IDBcclxuICAgICAgICBAcG9rZShpLCBqKVxyXG4gICAgICAgIHJldHVyblxyXG4gICAgICBpbmRleCA9IChpbmRleCArIDEpICUgY2VsbENvdW50XHJcbiAgICAgIGlmIGluZGV4ID09IHN0YXJ0SW5kZXhcclxuICAgICAgICBicmVha1xyXG4gICAgcmV0dXJuXHJcblxyXG4gIG5ld0dhbWU6IChAd2lkdGggPSAxNiwgQGhlaWdodCA9IDE2LCBAbWluZUNvdW50ID0gMCwgQHNlZWQgPSBTdHJpbmcoTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogMTAwMDAwMCkpKSAtPlxyXG4gICAgTWF0aC5zZWVkYmdtcmFuZG9tKEBzZWVkKVxyXG5cclxuICAgIEBsaXZlcyA9IDNcclxuXHJcbiAgICBjZWxsQ291bnQgPSBAd2lkdGggKiBAaGVpZ2h0XHJcbiAgICBpZiBAbWluZUNvdW50ID09IDBcclxuICAgICAgTUlORV9ERU5TSVRZID0gMC4xNlxyXG4gICAgICBAbWluZUNvdW50ID0gTWF0aC5mbG9vcihjZWxsQ291bnQgKiBNSU5FX0RFTlNJVFkpXHJcblxyXG4gICAgQGdhbWVvdmVyID0gZmFsc2VcclxuXHJcbiAgICAjIENyZWF0ZSBmcmVzaCBhcnJheXNcclxuICAgIEBib21iID0gbmV3IEFycmF5KGNlbGxDb3VudCkuZmlsbCgwKVxyXG4gICAgQHZpc2libGUgPSBuZXcgQXJyYXkoY2VsbENvdW50KS5maWxsKDApXHJcblxyXG4gICAgIyBEcm9wIGluIHRoZSBtaW5lcyByYW5kb21seVxyXG4gICAgaW5kaWNlcyA9IG5ldyBBcnJheShjZWxsQ291bnQpXHJcbiAgICBpbmRpY2VzWzBdID0gMFxyXG4gICAgaSA9IDFcclxuICAgIHdoaWxlIGkgPCBjZWxsQ291bnRcclxuICAgICAgaiA9IEByYW5kKGkpXHJcbiAgICAgIGluZGljZXNbaV0gPSBpbmRpY2VzW2pdXHJcbiAgICAgIGluZGljZXNbal0gPSBpXHJcbiAgICAgICsraVxyXG4gICAgbSA9IEBtaW5lQ291bnRcclxuICAgIGlmIG0gPj0gY2VsbENvdW50XHJcbiAgICAgIG0gPSBjZWxsQ291bnQgLSAxXHJcbiAgICBpID0gMFxyXG4gICAgd2hpbGUgaSA8IG1cclxuICAgICAgQGJvbWJbaW5kaWNlc1tpXV0gPSAxXHJcbiAgICAgICsraVxyXG4gICAgQGZpcnN0Q2xpY2tJc0ZyZWUoKVxyXG4gICAgZm9yIGV2bCBpbiBAbGlzdGVuZXJzXHJcbiAgICAgIGV2bCgnbmV3JywgW10pXHJcbiAgICBAdXBkYXRlQWxsKClcclxuICAgIEBzYXZlKClcclxuICAgIHJldHVyblxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBuZXcgTWluZVN3ZWVwZXIgIyBTaW5nbGV0b25cclxuIiwiRU5HQUdFX0RSQUdfRElTVEFOQ0UgPSAxMFxyXG5ET1VCTEVfQ0xJQ0tfTVMgPSA0MDBcclxuXHJcbmNsYXNzIFRvdWNoSW50ZXJwcmV0ZXJcclxuICBjb25zdHJ1Y3RvcjogLT5cclxuICAgIEB0cmFja2VkID0gW11cclxuICAgIEBkcmFnWCA9IDBcclxuICAgIEBkcmFnWSA9IDBcclxuICAgIEBkcmFnZ2luZyA9IGZhbHNlXHJcbiAgICBAZG91YmxlQ2xpY2tUaW1lID0gbnVsbFxyXG4gICAgQHBpbmNoQW5jaG9yID0gbnVsbFxyXG4gICAgQHBpbmNoQW5jaG9yV29ybGQgPSBudWxsXHJcblxyXG4gIGNyZWF0ZTogKEBzY2VuZSwgQGNhbWVyYSwgQHgsIEB5LCBAdywgQGgpIC0+XHJcbiAgICBAY2FtZXJhLnpvb20gPSAxXHJcbiAgICBAc2NlbmUuaW5wdXQuYWRkUG9pbnRlcigxKVxyXG4gICAgQHNjZW5lLmlucHV0Lm1vdXNlLmRpc2FibGVDb250ZXh0TWVudSgpXHJcblxyXG4gICAgQHNjZW5lLmlucHV0Lm9uICdwb2ludGVyZG93bicsIChwb2ludGVyKSA9PlxyXG4gICAgICBpZiBwb2ludGVyLnJpZ2h0QnV0dG9uRG93bigpXHJcbiAgICAgICAgd29ybGRQb3MgPSBAY2FtZXJhLmdldFdvcmxkUG9pbnQocG9pbnRlci5wb3NpdGlvbi54LCBwb2ludGVyLnBvc2l0aW9uLnkpXHJcbiAgICAgICAgQHNjZW5lLnJtYih3b3JsZFBvcy54LCB3b3JsZFBvcy55KVxyXG4gICAgICAgIHJldHVyblxyXG5cclxuICAgICAgaWYgcG9pbnRlci5wb3NpdGlvbi54ID4gKEB4ICsgQHcpXHJcbiAgICAgICAgcmV0dXJuXHJcblxyXG4gICAgICBpZiBAdHJhY2tlZC5sZW5ndGggPT0gMFxyXG4gICAgICAgIEBkcmFnZ2luZyA9IGZhbHNlXHJcblxyXG4gICAgICAjIGNvbnNvbGUubG9nIFwibmV3IHBvaW50ZXIgI3twb2ludGVyLmlkfVwiXHJcbiAgICAgIEB0cmFja2VkLnB1c2gge1xyXG4gICAgICAgIGlkOiBwb2ludGVyLmlkXHJcbiAgICAgICAgcG9zOiBwb2ludGVyLnBvc2l0aW9uLmNsb25lKClcclxuICAgICAgfVxyXG4gICAgICBpZiBAdHJhY2tlZC5sZW5ndGggPT0gMVxyXG4gICAgICAgIEBzZXREcmFnUG9pbnQoKVxyXG4gICAgICBpZiBAdHJhY2tlZC5sZW5ndGggPT0gMlxyXG4gICAgICAgICMgV2UganVzdCBhZGRlZCBhIHNlY29uZCB0b3VjaCBzcG90LiBDYWxjdWxhdGUgdGhlIGFuY2hvciBmb3IgcGluY2hpbmcgbm93XHJcbiAgICAgICAgQGNhbGNQaW5jaEFuY2hvcigpXHJcblxyXG4gICAgICBpZiBAdHJhY2tlZC5sZW5ndGggPiAxXHJcbiAgICAgICAgQGRyYWdnaW5nID0gdHJ1ZVxyXG4gICAgICAgIEBkb3VibGVDbGlja1RpbWUgPSBudWxsXHJcbiAgICAgIGVsc2UgaWYgbm90IEBkcmFnZ2luZ1xyXG4gICAgICAgIG5vdyA9IG5ldyBEYXRlKCkuZ2V0VGltZSgpXHJcbiAgICAgICAgaWYgQGRvdWJsZUNsaWNrVGltZSAhPSBudWxsXHJcbiAgICAgICAgICAjIHNlY29uZCBjbGlja1xyXG4gICAgICAgICAgY2xpY2tEZWx0YSA9IG5vdyAtIEBkb3VibGVDbGlja1RpbWVcclxuICAgICAgICAgIGlmIGNsaWNrRGVsdGEgPCBET1VCTEVfQ0xJQ0tfTVNcclxuICAgICAgICAgICAgQGRvdWJsZUNsaWNrVGltZSA9IG51bGxcclxuICAgICAgICAgICAgIyBjb25zb2xlLmxvZyBcIkRPVUJMRSBUQVAgI3tAdHJhY2tlZFswXS5wb3MueH0gI3tAdHJhY2tlZFswXS5wb3MueX1cIlxyXG4gICAgICAgICAgICByZXR1cm5cclxuICAgICAgICBAZG91YmxlQ2xpY2tUaW1lID0gbm93XHJcblxyXG4gICAgQHNjZW5lLmlucHV0Lm9uICdwb2ludGVybW92ZScsIChwb2ludGVyKSA9PlxyXG4gICAgICBwcmV2RGlzdGFuY2UgPSAwXHJcbiAgICAgIGlmIEB0cmFja2VkLmxlbmd0aCA+PSAyXHJcbiAgICAgICAgcHJldkRpc3RhbmNlID0gQGNhbGNEaXN0YW5jZShAdHJhY2tlZFswXS5wb3MueCwgQHRyYWNrZWRbMF0ucG9zLnksIEB0cmFja2VkWzFdLnBvcy54LCBAdHJhY2tlZFsxXS5wb3MueSlcclxuICAgICAgaWYgQHRyYWNrZWQubGVuZ3RoID09IDFcclxuICAgICAgICBwcmV2WCA9IEB0cmFja2VkWzBdLnBvcy54XHJcbiAgICAgICAgcHJldlkgPSBAdHJhY2tlZFswXS5wb3MueVxyXG5cclxuICAgICAgaW5kZXggPSAtMVxyXG4gICAgICBmb3IgaSBpbiBbMC4uLkB0cmFja2VkLmxlbmd0aF1cclxuICAgICAgICBpZiBAdHJhY2tlZFtpXS5pZCA9PSBwb2ludGVyLmlkXHJcbiAgICAgICAgICBpbmRleCA9IGlcclxuICAgICAgICAgIGJyZWFrXHJcbiAgICAgIGlmIGluZGV4ID09IC0xXHJcbiAgICAgICAgcmV0dXJuXHJcblxyXG4gICAgICBAdHJhY2tlZFtpbmRleF0ucG9zID0gcG9pbnRlci5wb3NpdGlvbi5jbG9uZSgpXHJcblxyXG4gICAgICBpZiBAdHJhY2tlZC5sZW5ndGggPT0gMVxyXG4gICAgICAgICMgc2luZ2xlIHRvdWNoLCBjb25zaWRlciBkcmFnZ2luZ1xyXG4gICAgICAgIGRyYWdEaXN0YW5jZSA9IEBjYWxjRGlzdGFuY2UgQGRyYWdYLCBAZHJhZ1ksIEB0cmFja2VkWzBdLnBvcy54LCBAdHJhY2tlZFswXS5wb3MueVxyXG4gICAgICAgIGlmIEBkcmFnZ2luZyBvciAoZHJhZ0Rpc3RhbmNlID4gRU5HQUdFX0RSQUdfRElTVEFOQ0UpXHJcbiAgICAgICAgICBAZHJhZ2dpbmcgPSB0cnVlXHJcbiAgICAgICAgICBpZiBkcmFnRGlzdGFuY2UgPiAwLjVcclxuICAgICAgICAgICAgZHggPSBAdHJhY2tlZFswXS5wb3MueCAtIEBkcmFnWFxyXG4gICAgICAgICAgICBkeSA9IEB0cmFja2VkWzBdLnBvcy55IC0gQGRyYWdZXHJcbiAgICAgICAgICAgICMgY29uc29sZS5sb2cgXCJzaW5nbGUgZHJhZzogI3tkeH0sICN7ZHl9XCJcclxuICAgICAgICAgICAgQGNhbWVyYS5zY3JvbGxYIC09IGR4IC8gQGNhbWVyYS56b29tXHJcbiAgICAgICAgICAgIEBjYW1lcmEuc2Nyb2xsWSAtPSBkeSAvIEBjYW1lcmEuem9vbVxyXG5cclxuICAgICAgICAgICAgIyBjb25zb2xlLmxvZyBcInNjcm9sbCAje0BjYW1lcmEuc2Nyb2xsWH0gI3tAY2FtZXJhLnpvb219ICN7QGNhbWVyYS53aWR0aH1cIlxyXG4gICAgICAgICAgQHNldERyYWdQb2ludCgpXHJcblxyXG4gICAgICBlbHNlIGlmIEB0cmFja2VkLmxlbmd0aCA+PSAyXHJcbiAgICAgICAgIyBhdCBsZWFzdCB0d28gZmluZ2VycyBwcmVzZW50LCBjaGVjayBmb3IgcGluY2gvem9vbVxyXG4gICAgICAgIGN1cnJEaXN0YW5jZSA9IEBjYWxjRGlzdGFuY2UoQHRyYWNrZWRbMF0ucG9zLngsIEB0cmFja2VkWzBdLnBvcy55LCBAdHJhY2tlZFsxXS5wb3MueCwgQHRyYWNrZWRbMV0ucG9zLnkpXHJcbiAgICAgICAgZGVsdGFEaXN0YW5jZSA9IGN1cnJEaXN0YW5jZSAtIHByZXZEaXN0YW5jZVxyXG4gICAgICAgIGlmIGRlbHRhRGlzdGFuY2UgIT0gMFxyXG4gICAgICAgICAgbmV3Wm9vbSA9IEBjYW1lcmEuem9vbSAqICgxICsgKGRlbHRhRGlzdGFuY2UgKiA0IC8gQGNhbWVyYS53aWR0aCkpXHJcbiAgICAgICAgICBAYWRqdXN0Wm9vbShuZXdab29tKVxyXG4gICAgICByZXR1cm5cclxuXHJcbiAgICBAc2NlbmUuaW5wdXQub24gJ3BvaW50ZXJ1cCcsIChwb2ludGVyKSA9PlxyXG4gICAgICBpbmRleCA9IC0xXHJcbiAgICAgIGZvciBpIGluIFswLi4uQHRyYWNrZWQubGVuZ3RoXVxyXG4gICAgICAgIGlmIEB0cmFja2VkW2ldLmlkID09IHBvaW50ZXIuaWRcclxuICAgICAgICAgIGluZGV4ID0gaVxyXG4gICAgICAgICAgYnJlYWtcclxuICAgICAgaWYgaW5kZXggPT0gLTFcclxuICAgICAgICByZXR1cm5cclxuXHJcbiAgICAgIGlmIEB0cmFja2VkLmxlbmd0aCA9PSAxXHJcbiAgICAgICAgaWYgbm90IEBkcmFnZ2luZ1xyXG4gICAgICAgICAgd29ybGRQb3MgPSBAY2FtZXJhLmdldFdvcmxkUG9pbnQoQHRyYWNrZWRbMF0ucG9zLngsIEB0cmFja2VkWzBdLnBvcy55KVxyXG4gICAgICAgICAgIyBjb25zb2xlLmxvZyBcIlRBUCAje3dvcmxkUG9zLnh9ICN7d29ybGRQb3MueX0gI3tAY2FtZXJhLnNjcm9sbFh9ICN7QGNhbWVyYS5zY3JvbGxZfSAje0BjYW1lcmEuem9vbX1cIlxyXG4gICAgICAgICAgQHNjZW5lLnRhcCh3b3JsZFBvcy54LCB3b3JsZFBvcy55KVxyXG5cclxuICAgICAgQHRyYWNrZWQuc3BsaWNlKGluZGV4LCAxKVxyXG4gICAgICBpZiBAdHJhY2tlZC5sZW5ndGggPT0gMVxyXG4gICAgICAgIEBzZXREcmFnUG9pbnQoKVxyXG5cclxuICAgICAgaWYgaW5kZXggPCAyXHJcbiAgICAgICAgIyBXZSBqdXN0IGZvcmdvdCBvbmUgb2Ygb3VyIHBpbmNoIHRvdWNoZXMuIFBpY2sgYSBuZXcgYW5jaG9yIHNwb3QuXHJcbiAgICAgICAgQGNhbGNQaW5jaEFuY2hvcigpXHJcblxyXG4gICAgICBAc2NlbmUuc2V0TWFnbmlmeWluZ0dsYXNzKDAsIDAsIDApXHJcbiAgICAgIHJldHVyblxyXG5cclxuICAgIEBzY2VuZS5pbnB1dC5vbiAnd2hlZWwnLCAocG9pbnRlciwgZ2FtZU9iamVjdHMsIGRlbHRhWCwgZGVsdGFZLCBkZWx0YVopID0+XHJcbiAgICAgIEBjYWxjUGluY2hBbmNob3IocG9pbnRlci5wb3NpdGlvbi54LCBwb2ludGVyLnBvc2l0aW9uLnkpXHJcbiAgICAgIG5ld1pvb20gPSBAY2FtZXJhLnpvb20gKiAoMSAtIChkZWx0YVkgLyA0ODApKVxyXG4gICAgICBAYWRqdXN0Wm9vbShuZXdab29tKVxyXG4gICAgICBAc2NlbmUuc2V0TWFnbmlmeWluZ0dsYXNzKDAsIDAsIDApXHJcbiAgICAgIHJldHVyblxyXG5cclxuICBhZGp1c3Rab29tOiAobmV3Wm9vbSkgLT5cclxuICAgIGlmIG5ld1pvb20gPCAwLjFcclxuICAgICAgbmV3Wm9vbSA9IDAuMVxyXG4gICAgaWYgbmV3Wm9vbSA+IDVcclxuICAgICAgbmV3Wm9vbSA9IDVcclxuICAgIEBjYW1lcmEuem9vbSA9IG5ld1pvb21cclxuXHJcbiAgICBoYWxmVyA9IChAY2FtZXJhLndpZHRoIC8gMilcclxuICAgIGhhbGZIID0gKEBjYW1lcmEuaGVpZ2h0IC8gMilcclxuICAgIG9mZnNldFggPSAoQHBpbmNoQW5jaG9yLnggLSBoYWxmVykgLyBuZXdab29tXHJcbiAgICBvZmZzZXRZID0gKEBwaW5jaEFuY2hvci55IC0gaGFsZkgpIC8gbmV3Wm9vbVxyXG4gICAgQGNhbWVyYS5zY3JvbGxYID0gQHBpbmNoQW5jaG9yV29ybGQueCAtIGhhbGZXIC0gb2Zmc2V0WFxyXG4gICAgQGNhbWVyYS5zY3JvbGxZID0gQHBpbmNoQW5jaG9yV29ybGQueSAtIGhhbGZIIC0gb2Zmc2V0WVxyXG4gICAgcmV0dXJuXHJcblxyXG4gIHNldERyYWdQb2ludDogLT5cclxuICAgIEBkcmFnWCA9IEB0cmFja2VkWzBdLnBvcy54XHJcbiAgICBAZHJhZ1kgPSBAdHJhY2tlZFswXS5wb3MueVxyXG5cclxuICBjYWxjUGluY2hBbmNob3I6IChwaW5jaFggPSBudWxsLCBwaW5jaFkgPSBudWxsKSAtPlxyXG4gICAgaWYgKHBpbmNoWCA9PSBudWxsKSBhbmQgKHBpbmNoWSA9PSBudWxsKVxyXG4gICAgICBpZiBAdHJhY2tlZC5sZW5ndGggPCAyXHJcbiAgICAgICAgcmV0dXJuXHJcbiAgICAgIHBpbmNoWCA9IE1hdGguZmxvb3IoKEB0cmFja2VkWzBdLnBvcy54ICsgQHRyYWNrZWRbMV0ucG9zLngpIC8gMilcclxuICAgICAgcGluY2hZID0gTWF0aC5mbG9vcigoQHRyYWNrZWRbMF0ucG9zLnkgKyBAdHJhY2tlZFsxXS5wb3MueSkgLyAyKVxyXG5cclxuICAgIEBwaW5jaEFuY2hvciA9IHt4OiBwaW5jaFgsIHk6IHBpbmNoWSB9XHJcbiAgICBAcGluY2hBbmNob3JXb3JsZCA9IEBjYW1lcmEuZ2V0V29ybGRQb2ludChwaW5jaFgsIHBpbmNoWSlcclxuXHJcbiAgICBAc2NlbmUuc2V0TWFnbmlmeWluZ0dsYXNzKEBwaW5jaEFuY2hvci54LCBAcGluY2hBbmNob3IueSwgMSlcclxuXHJcbiAgY2FsY0Rpc3RhbmNlOiAoeDEsIHkxLCB4MiwgeTIpIC0+XHJcbiAgICBkeCA9IHgyIC0geDFcclxuICAgIGR5ID0geTIgLSB5MVxyXG4gICAgcmV0dXJuIE1hdGguc3FydChkeCpkeCArIGR5KmR5KVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBUb3VjaEludGVycHJldGVyXHJcbiIsIkJHTUdhbWVTY2VuZSA9IHJlcXVpcmUgJy4vQkdNR2FtZVNjZW5lJ1xyXG5CR01IdWRTY2VuZSA9IHJlcXVpcmUgJy4vQkdNSHVkU2NlbmUnXHJcblxyXG5pbml0ID0gLT5cclxuICBjb25zb2xlLmxvZyBcIkJhZCBHdXkgTWluZXN3ZWVwZXI6IGluaXQoKVwiXHJcblxyXG4gIGNvbmZpZyA9XHJcbiAgICB0eXBlOiBQaGFzZXIuQVVUT1xyXG4gICAgd2lkdGg6IGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5jbGllbnRXaWR0aFxyXG4gICAgaGVpZ2h0OiBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuY2xpZW50SGVpZ2h0XHJcbiAgICBiYWNrZ3JvdW5kQ29sb3I6ICcjMDAwMDAwJyAjICcjMmQyZDJkJ1xyXG4gICAgcGFyZW50OiAnc2NyZWVuJ1xyXG4gICAgaW5wdXQ6XHJcbiAgICAgIGFjdGl2ZVBvaW50ZXJzOiAyXHJcbiAgICBzY2VuZTogW1xyXG4gICAgICBCR01HYW1lU2NlbmVcclxuICAgICAgQkdNSHVkU2NlbmVcclxuICAgIF1cclxuXHJcbiAgZ2FtZSA9IG5ldyBQaGFzZXIuR2FtZShjb25maWcpXHJcblxyXG5cclxud2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ2xvYWQnLCAoZSkgLT5cclxuICAgIGluaXQoKVxyXG4sIGZhbHNlKVxyXG4iXX0=
