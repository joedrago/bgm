(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
var BGMGameScene, TouchInterpreter;

TouchInterpreter = require('./TouchInterpreter');

BGMGameScene = class BGMGameScene extends Phaser.Scene {
  constructor() {
    super({
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
    this.touch.create(this, this.cameras.main, 0, 0, split, this.cameras.main.height);
    return this.scene.launch('hud');
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


},{"./MineSweeper":4,"./TouchInterpreter":5}],2:[function(require,module,exports){
var BGMHudScene;

BGMHudScene = class BGMHudScene extends Phaser.Scene {
  constructor() {
    super({
      key: 'hud',
      active: true
    });
  }

  preload() {
    this.load.image('glass', 'images/glass.gif');
    this.load.image('btn_bomb', 'images/btn_bomb.png');
    this.load.image('btn_flag', 'images/btn_flag.png');
    return this.load.image('btn_menu', 'images/btn_menu.png');
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
    this.buttons = {};
    this.buttons.mode = this.add.image(this.panelX + (this.panelW / 2), this.panelY + (this.panelH / 2), 'btn_bomb');
    this.buttons.mode.setDisplaySize(this.panelW * 0.8, this.panelW * 0.8);
    this.buttons.mode.setInteractive();
    this.buttons.mode.on('pointerdown', () => {
      return this.toggleMode();
    });
    this.toggleMode();
    this.buttons.menu = this.add.image(this.panelX + (this.panelW / 2), this.panelY + (this.panelW * 0.5), 'btn_menu');
    this.buttons.menu.setDisplaySize(this.panelW * 0.8, this.panelW * 0.8);
    this.buttons.menu.setInteractive();
    this.buttons.menu.on('pointerdown', () => {
      return this.scene.launch('menu');
    });
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
    this.buttons.mode.setTexture(`btn_${this.mode}`);
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
var BGMMenuScene;

BGMMenuScene = class BGMMenuScene extends Phaser.Scene {
  constructor() {
    super({
      key: 'menu',
      active: false
    });
    this.ms = require('./MineSweeper');
  }

  preload() {
    return this.load.image('menu_thing', 'images/btn_menu.png');
  }

  create() {
    this.w = this.cameras.main.width;
    this.h = this.cameras.main.height;
    this.fonts = {
      title: {
        fontFamily: 'Eagle Lake',
        fontSize: `${Math.floor(this.h / 8)}px`,
        color: '#fff'
      },
      button: {
        fontFamily: 'Eagle Lake',
        fontSize: `${Math.floor(this.h / 12)}px`,
        color: '#fff'
      }
    };
    this.panelBackground = this.add.graphics();
    this.panelBackground.fillStyle(0x330033, 1);
    this.panelBackground.fillRect(0, 0, this.w, this.h);
    this.panelBackground.setInteractive(new Phaser.Geom.Rectangle(0, 0, this.w, this.h), Phaser.Geom.Rectangle.Contains);
    this.title = this.add.text(this.w / 2, this.h / 20, 'Bad Guy Minesweeper', this.fonts.title);
    this.title.setOrigin(0.5, 0.0);
    this.nextButtonIndex = 0;
    this.addButton("Beginner", () => {
      return this.newGame(8, 8, 10);
    });
    this.addButton("Intermediate", () => {
      return this.newGame(16, 16, 40);
    });
    this.addButton("Expert", () => {
      return this.newGame(30, 16, 99);
    });
    this.addButton("Huge", () => {
      return this.newGame(50, 30, 0);
    });
    this.nextButtonIndex += 1;
    return this.addButton("Resume", () => {
      return this.scene.sleep('menu');
    });
  }

  addButton(text, cb) {
    var button, buttonH, buttonIndex, buttonMargin, buttonW, buttonX, buttonY, centerOffsetX, centerOffsetY;
    buttonIndex = this.nextButtonIndex;
    this.nextButtonIndex += 1;
    buttonW = Math.floor(this.w / 2);
    buttonH = Math.floor(this.h / 10);
    buttonMargin = Math.floor(buttonH / 4);
    buttonX = this.w / 2;
    buttonY = (this.h / 3.5) + (buttonIndex * (buttonH + buttonMargin));
    centerOffsetX = buttonW / 2;
    centerOffsetY = buttonH / 2;
    button = this.add.graphics();
    button.fillStyle(0x330033, 1);
    button.fillRect(buttonX - centerOffsetX, buttonY - centerOffsetY, buttonW, buttonH);
    button.setInteractive(new Phaser.Geom.Rectangle(buttonX - centerOffsetX, buttonY - centerOffsetY, buttonW, buttonH), Phaser.Geom.Rectangle.Contains);
    text = this.add.text(buttonX, buttonY, text, this.fonts.button);
    text.setOrigin(0.5);
    return button.on('pointerdown', function() {
      return cb();
    });
  }

  newGame(w, h, m) {
    this.ms.newGame(w, h, m);
    return this.scene.sleep('menu');
  }

  update() {}

};

module.exports = BGMMenuScene;


},{"./MineSweeper":4}],4:[function(require,module,exports){
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


},{}],5:[function(require,module,exports){
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


},{}],6:[function(require,module,exports){
var BGMGameScene, BGMHudScene, BGMMenuScene, init;

BGMGameScene = require('./BGMGameScene');

BGMHudScene = require('./BGMHudScene');

BGMMenuScene = require('./BGMMenuScene');

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
    scene: [BGMGameScene, BGMHudScene, BGMMenuScene]
  };
  return game = new Phaser.Game(config);
};

window.addEventListener('load', function(e) {
  var font, fonts, i, len, promises, results;
  fonts = [
    {
      name: 'Eagle Lake',
      url: 'fonts/eaglelake.ttf'
    }
  ];
  promises = [];
  results = [];
  for (i = 0, len = fonts.length; i < len; i++) {
    font = fonts[i];
    (function(font) {
      return promises.push(new Promise(function(resolve, reject) {
        var newFont;
        newFont = new FontFace(font.name, `url(${font.url})`);
        return newFont.load().then(function(loaded) {
          if (loaded) {
            document.fonts.add(loaded);
            console.log(`Loaded Font: ${font.name}`);
            return resolve();
          } else {
            return reject();
          }
        });
      }));
    })(font);
    results.push(Promise.all(promises).then(function(loaded) {
      return init();
    }).catch(function(error) {
      return console.log("Error: ", error);
    }));
  }
  return results;
}, false);


},{"./BGMGameScene":1,"./BGMHudScene":2,"./BGMMenuScene":3}]},{},[6])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvQkdNR2FtZVNjZW5lLmNvZmZlZSIsInNyYy9CR01IdWRTY2VuZS5jb2ZmZWUiLCJzcmMvQkdNTWVudVNjZW5lLmNvZmZlZSIsInNyYy9NaW5lU3dlZXBlci5jb2ZmZWUiLCJzcmMvVG91Y2hJbnRlcnByZXRlci5jb2ZmZWUiLCJzcmMvbWFpbi5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQSxJQUFBLFlBQUEsRUFBQTs7QUFBQSxnQkFBQSxHQUFtQixPQUFBLENBQVEsb0JBQVI7O0FBRWIsZUFBTixNQUFBLGFBQUEsUUFBMkIsTUFBTSxDQUFDLE1BQWxDO0VBQ0UsV0FBYSxDQUFBLENBQUE7U0FDWCxDQUFNO01BQ0osR0FBQSxFQUFLLE1BREQ7TUFFSixNQUFBLEVBQVE7SUFGSixDQUFOO0lBS0EsSUFBQyxDQUFBLEVBQUQsR0FBTSxPQUFBLENBQVEsZUFBUjtJQUNOLElBQUMsQ0FBQSxLQUFELEdBQVMsSUFBSSxnQkFBSixDQUFBO0VBUEU7O0VBU2IsT0FBUyxDQUFBLENBQUE7SUFDUCxJQUFDLENBQUEsSUFBSSxDQUFDLEtBQU4sQ0FBWSxPQUFaLEVBQXFCLGtCQUFyQjtJQUNBLElBQUMsQ0FBQSxJQUFJLENBQUMsS0FBTixDQUFZLE1BQVosRUFBb0Isd0JBQXBCO0lBQ0EsSUFBQyxDQUFBLElBQUksQ0FBQyxLQUFOLENBQVksTUFBWixFQUFvQixrQkFBcEI7SUFDQSxJQUFDLENBQUEsSUFBSSxDQUFDLEtBQU4sQ0FBWSxXQUFaLEVBQXlCLHNCQUF6QjtJQUNBLElBQUMsQ0FBQSxJQUFJLENBQUMsS0FBTixDQUFZLGNBQVosRUFBNEIseUJBQTVCO0lBQ0EsSUFBQyxDQUFBLElBQUksQ0FBQyxLQUFOLENBQVksZ0JBQVosRUFBOEIsMkJBQTlCO0lBRUEsSUFBQyxDQUFBLElBQUksQ0FBQyxLQUFOLENBQVksU0FBWixFQUF1QixvQkFBdkI7SUFDQSxJ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IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uKCl7ZnVuY3Rpb24gcihlLG4sdCl7ZnVuY3Rpb24gbyhpLGYpe2lmKCFuW2ldKXtpZighZVtpXSl7dmFyIGM9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZTtpZighZiYmYylyZXR1cm4gYyhpLCEwKTtpZih1KXJldHVybiB1KGksITApO3ZhciBhPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIraStcIidcIik7dGhyb3cgYS5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGF9dmFyIHA9bltpXT17ZXhwb3J0czp7fX07ZVtpXVswXS5jYWxsKHAuZXhwb3J0cyxmdW5jdGlvbihyKXt2YXIgbj1lW2ldWzFdW3JdO3JldHVybiBvKG58fHIpfSxwLHAuZXhwb3J0cyxyLGUsbix0KX1yZXR1cm4gbltpXS5leHBvcnRzfWZvcih2YXIgdT1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlLGk9MDtpPHQubGVuZ3RoO2krKylvKHRbaV0pO3JldHVybiBvfXJldHVybiByfSkoKSIsIlRvdWNoSW50ZXJwcmV0ZXIgPSByZXF1aXJlICcuL1RvdWNoSW50ZXJwcmV0ZXInXHJcblxyXG5jbGFzcyBCR01HYW1lU2NlbmUgZXh0ZW5kcyBQaGFzZXIuU2NlbmVcclxuICBjb25zdHJ1Y3RvcjogLT5cclxuICAgIHN1cGVyIHtcclxuICAgICAga2V5OiAnZ2FtZSdcclxuICAgICAgYWN0aXZlOiB0cnVlXHJcbiAgICB9XHJcblxyXG4gICAgQG1zID0gcmVxdWlyZSAnLi9NaW5lU3dlZXBlcidcclxuICAgIEB0b3VjaCA9IG5ldyBUb3VjaEludGVycHJldGVyXHJcblxyXG4gIHByZWxvYWQ6IC0+XHJcbiAgICBAbG9hZC5pbWFnZSgnYmxhbmsnLCAnaW1hZ2VzL2JsYW5rLmdpZicpXHJcbiAgICBAbG9hZC5pbWFnZSgnZmxhZycsICdpbWFnZXMvYm9tYmZsYWdnZWQuZ2lmJylcclxuICAgIEBsb2FkLmltYWdlKCdib21iJywgJ2ltYWdlcy9ib21iMC5naWYnKVxyXG4gICAgQGxvYWQuaW1hZ2UoJ2JvbWJkZWF0aCcsICdpbWFnZXMvYm9tYmRlYXRoLmdpZicpXHJcbiAgICBAbG9hZC5pbWFnZSgnYm9tYnJldmVhbGVkJywgJ2ltYWdlcy9ib21icmV2ZWFsZWQuZ2lmJylcclxuICAgIEBsb2FkLmltYWdlKCdib21ibWlzZmxhZ2dlZCcsICdpbWFnZXMvYm9tYm1pc2ZsYWdnZWQuZ2lmJylcclxuXHJcbiAgICBAbG9hZC5pbWFnZSgnc2hhZG93MCcsICdpbWFnZXMvc2hhZG93MC5naWYnKVxyXG4gICAgQGxvYWQuaW1hZ2UoJ3NoYWRvdzEnLCAnaW1hZ2VzL3NoYWRvdzEuZ2lmJylcclxuICAgIEBsb2FkLmltYWdlKCdzaGFkb3cyJywgJ2ltYWdlcy9zaGFkb3cyLmdpZicpXHJcbiAgICBAbG9hZC5pbWFnZSgnc2hhZG93MycsICdpbWFnZXMvc2hhZG93My5naWYnKVxyXG4gICAgQGxvYWQuaW1hZ2UoJ3NoYWRvdzQnLCAnaW1hZ2VzL3NoYWRvdzQuZ2lmJylcclxuICAgIEBsb2FkLmltYWdlKCdzaGFkb3c1JywgJ2ltYWdlcy9zaGFkb3c1LmdpZicpXHJcbiAgICBAbG9hZC5pbWFnZSgnc2hhZG93NicsICdpbWFnZXMvc2hhZG93Ni5naWYnKVxyXG4gICAgQGxvYWQuaW1hZ2UoJ3NoYWRvdzcnLCAnaW1hZ2VzL3NoYWRvdzcuZ2lmJylcclxuICAgIEBsb2FkLmltYWdlKCdzaGFkb3c4JywgJ2ltYWdlcy9zaGFkb3c4LmdpZicpXHJcblxyXG4gICAgQGxvYWQuaW1hZ2UoJ2JvbWIwJywgJ2ltYWdlcy9ib21iMC5naWYnKVxyXG4gICAgQGxvYWQuaW1hZ2UoJ2JvbWIxJywgJ2ltYWdlcy9ib21iMS5naWYnKVxyXG4gICAgQGxvYWQuaW1hZ2UoJ2JvbWIyJywgJ2ltYWdlcy9ib21iMi5naWYnKVxyXG4gICAgQGxvYWQuaW1hZ2UoJ2JvbWIzJywgJ2ltYWdlcy9ib21iMy5naWYnKVxyXG4gICAgQGxvYWQuaW1hZ2UoJ2JvbWI0JywgJ2ltYWdlcy9ib21iNC5naWYnKVxyXG4gICAgQGxvYWQuaW1hZ2UoJ2JvbWI1JywgJ2ltYWdlcy9ib21iNS5naWYnKVxyXG4gICAgQGxvYWQuaW1hZ2UoJ2JvbWI2JywgJ2ltYWdlcy9ib21iNi5naWYnKVxyXG4gICAgQGxvYWQuaW1hZ2UoJ2JvbWI3JywgJ2ltYWdlcy9ib21iNy5naWYnKVxyXG4gICAgQGxvYWQuaW1hZ2UoJ2JvbWI4JywgJ2ltYWdlcy9ib21iOC5naWYnKVxyXG5cclxuICAgIEBsb2FkLmltYWdlKCdvcGVuMCcsICdpbWFnZXMvb3BlbjAuZ2lmJylcclxuICAgIEBsb2FkLmltYWdlKCdvcGVuMScsICdpbWFnZXMvb3BlbjEuZ2lmJylcclxuICAgIEBsb2FkLmltYWdlKCdvcGVuMicsICdpbWFnZXMvb3BlbjIuZ2lmJylcclxuICAgIEBsb2FkLmltYWdlKCdvcGVuMycsICdpbWFnZXMvb3BlbjMuZ2lmJylcclxuICAgIEBsb2FkLmltYWdlKCdvcGVuNCcsICdpbWFnZXMvb3BlbjQuZ2lmJylcclxuICAgIEBsb2FkLmltYWdlKCdvcGVuNScsICdpbWFnZXMvb3BlbjUuZ2lmJylcclxuICAgIEBsb2FkLmltYWdlKCdvcGVuNicsICdpbWFnZXMvb3BlbjYuZ2lmJylcclxuICAgIEBsb2FkLmltYWdlKCdvcGVuNycsICdpbWFnZXMvb3BlbjcuZ2lmJylcclxuICAgIEBsb2FkLmltYWdlKCdvcGVuOCcsICdpbWFnZXMvb3BlbjguZ2lmJylcclxuXHJcbiAgY3JlYXRlOiAtPlxyXG4gICAgc3BsaXQgPSBNYXRoLmZsb29yKEBjYW1lcmFzLm1haW4ud2lkdGggKiAwLjkpXHJcbiAgICBAY2FtZXJhcy5tYWluLnNldFZpZXdwb3J0KDAsIDAsIHNwbGl0LCBAY2FtZXJhcy5tYWluLmhlaWdodClcclxuXHJcbiAgICBAbXMuYWRkRXZlbnRMaXN0ZW5lcihAbXNFdmVudC5iaW5kKHRoaXMpKVxyXG4gICAgQHJlY3JlYXRlRGlzcGxheUxpc3QoKVxyXG4gICAgQG1zLnVwZGF0ZUFsbCgpXHJcblxyXG4gICAgQHRvdWNoLmNyZWF0ZSh0aGlzLCBAY2FtZXJhcy5tYWluLCAwLCAwLCBzcGxpdCwgQGNhbWVyYXMubWFpbi5oZWlnaHQpXHJcblxyXG4gICAgQHNjZW5lLmxhdW5jaCgnaHVkJylcclxuXHJcbiAgbXNFdmVudDogKGV2LCBhcmdzKSAtPlxyXG4gICAgaWYgZXYgIT0gJ2NlbGwnXHJcbiAgICAgIGNvbnNvbGUubG9nIFwibXNFdmVudDogI3tldn06ICN7SlNPTi5zdHJpbmdpZnkoYXJncyl9XCJcclxuICAgIHN3aXRjaCBldlxyXG4gICAgICB3aGVuICduZXcnXHJcbiAgICAgICAgaWYgKEBtcy53aWR0aCAhPSBAZ3JpZENvbHMpIG9yIChAbXMuaGVpZ2h0ICE9IEBncmlkUm93cylcclxuICAgICAgICAgIEByZWNyZWF0ZURpc3BsYXlMaXN0KClcclxuICAgICAgd2hlbiAnY2VsbCdcclxuICAgICAgICBAZ3JpZFthcmdzWzBdXVthcmdzWzFdXS5zZXRUZXh0dXJlKGFyZ3NbMl0pXHJcbiAgICAgIHdoZW4gJ2xpZmUnXHJcbiAgICAgICAgQHNjZW5lLmdldCgnaHVkJykuZGVidWdUZXh0LnRleHQgPSBcIkFyZSB5b3Ugc3V1dXV1dXVyZT8gKCN7YXJnc1swXX0pXCJcclxuICAgICAgICBAY2FtZXJhcy5tYWluLnNoYWtlKDMwMCwgMC4wMDEpXHJcblxyXG4gIHVwZGF0ZTogLT5cclxuXHJcbiAgcmVjcmVhdGVEaXNwbGF5TGlzdDogLT5cclxuICAgIGNvbnNvbGUubG9nIFwicmVjcmVhdGVEaXNwbGF5TGlzdCgpXCJcclxuICAgIEBhZGQuZGlzcGxheUxpc3QucmVtb3ZlQWxsKClcclxuXHJcbiAgICBAZ3JpZENvbHMgPSBAbXMud2lkdGhcclxuICAgIEBncmlkUm93cyA9IEBtcy5oZWlnaHRcclxuICAgIEBncmlkID0gbmV3IEFycmF5KEBncmlkQ29scylcclxuICAgIGZvciBpIGluIFswLi4uQGdyaWRDb2xzXVxyXG4gICAgICBAZ3JpZFtpXSA9IG5ldyBBcnJheShAZ3JpZFJvd3MpXHJcbiAgICAgIGZvciBqIGluIFswLi4uQGdyaWRSb3dzXVxyXG4gICAgICAgIEBncmlkW2ldW2pdID0gQGFkZC5pbWFnZShpICogMTYsIGogKiAxNiwgJ2JsYW5rJylcclxuICAgICAgICBAZ3JpZFtpXVtqXS5zZXRPcmlnaW4oMCwgMClcclxuICAgIEByZXNldFZpZXcoKVxyXG5cclxuICBjZW50ZXJHcmlkOiAtPlxyXG4gICAgdG90YWxXID0gQGdyaWRDb2xzICogMTZcclxuICAgIHRvdGFsSCA9IEBncmlkUm93cyAqIDE2XHJcbiAgICBAY2FtZXJhcy5tYWluLnNjcm9sbFggPSAodG90YWxXIC0gQGNhbWVyYXMubWFpbi53aWR0aCkgLyAyXHJcbiAgICBAY2FtZXJhcy5tYWluLnNjcm9sbFkgPSAodG90YWxIIC0gQGNhbWVyYXMubWFpbi5oZWlnaHQpIC8gMlxyXG5cclxuICByZXNldFZpZXc6IC0+XHJcbiAgICBAY2FtZXJhcy5tYWluLnpvb20gPSAxXHJcbiAgICBAY2VudGVyR3JpZCgpXHJcblxyXG4gIHNldE1vZGU6IChAbW9kZSkgLT5cclxuICAgICMgY29uc29sZS5sb2cgXCJHYW1lIE1vZGU6ICN7QG1vZGV9XCJcclxuICAgIGlmIEBtcy5nYW1lb3ZlclxyXG4gICAgICBAbXMubmV3R2FtZSgpXHJcblxyXG4gIHNldE1hZ25pZnlpbmdHbGFzczogKHgsIHksIGFscGhhKSAtPlxyXG4gICAgQHNjZW5lLmdldCgnaHVkJykuc2V0TWFnbmlmeWluZ0dsYXNzKHgsIHksIGFscGhhKVxyXG5cclxuICBybWI6ICh3b3JsZFgsIHdvcmxkWSkgLT5cclxuICAgIEBzY2VuZS5nZXQoJ2h1ZCcpLnRvZ2dsZU1vZGUoKVxyXG4gICAgQG1zLnNhdmUoKVxyXG5cclxuICB0YXA6ICh3b3JsZFgsIHdvcmxkWSkgLT5cclxuICAgIEBzY2VuZS5nZXQoJ2h1ZCcpLmRlYnVnVGV4dC50ZXh0ID0gXCJcIlxyXG5cclxuICAgIGlmIEBtcy5nYW1lb3ZlclxyXG4gICAgICBjb25zb2xlLmxvZyBcImdhbWUgaXMgb3ZlciwgZG9pbmcgbm90aGluZ1wiXHJcbiAgICAgIHJldHVyblxyXG5cclxuICAgIGlmICh3b3JsZFggPj0gMCkgYW5kICh3b3JsZFggPCAoQGdyaWRDb2xzICogMTYpKSBhbmQgKHdvcmxkWSA+PSAwKSBhbmQgKHdvcmxkWSA8IChAZ3JpZFJvd3MgKiAxNikpXHJcbiAgICAgIHggPSBNYXRoLmZsb29yKHdvcmxkWCAvIDE2KVxyXG4gICAgICB5ID0gTWF0aC5mbG9vcih3b3JsZFkgLyAxNilcclxuICAgICAgaWYgQG1vZGUgPT0gJ2ZsYWcnXHJcbiAgICAgICAgQG1zLmZsYWcoeCwgeSlcclxuICAgICAgZWxzZVxyXG4gICAgICAgIEBtcy5wb2tlKHgsIHkpXHJcbiAgICAgIEBtcy51cGRhdGVBbGwoKVxyXG5cclxuICAgIEBtcy5zYXZlKClcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gQkdNR2FtZVNjZW5lXHJcbiIsImNsYXNzIEJHTUh1ZFNjZW5lIGV4dGVuZHMgUGhhc2VyLlNjZW5lXHJcbiAgY29uc3RydWN0b3I6IC0+XHJcbiAgICBzdXBlciB7XHJcbiAgICAgIGtleTogJ2h1ZCdcclxuICAgICAgYWN0aXZlOiB0cnVlXHJcbiAgICB9XHJcblxyXG4gIHByZWxvYWQ6IC0+XHJcbiAgICBAbG9hZC5pbWFnZSgnZ2xhc3MnLCAnaW1hZ2VzL2dsYXNzLmdpZicpXHJcblxyXG4gICAgQGxvYWQuaW1hZ2UoJ2J0bl9ib21iJywgJ2ltYWdlcy9idG5fYm9tYi5wbmcnKVxyXG4gICAgQGxvYWQuaW1hZ2UoJ2J0bl9mbGFnJywgJ2ltYWdlcy9idG5fZmxhZy5wbmcnKVxyXG4gICAgQGxvYWQuaW1hZ2UoJ2J0bl9tZW51JywgJ2ltYWdlcy9idG5fbWVudS5wbmcnKVxyXG5cclxuICBjcmVhdGU6IC0+XHJcbiAgICBAcGFuZWxYID0gTWF0aC5mbG9vcihAY2FtZXJhcy5tYWluLndpZHRoICogMC45KVxyXG4gICAgQHBhbmVsWSA9IDBcclxuICAgIEBwYW5lbFcgPSBAY2FtZXJhcy5tYWluLndpZHRoIC0gQHBhbmVsWFxyXG4gICAgQHBhbmVsSCA9IEBjYW1lcmFzLm1haW4uaGVpZ2h0XHJcblxyXG4gICAgQHBhbmVsQmFja2dyb3VuZCA9IEBhZGQuZ3JhcGhpY3MoKVxyXG4gICAgQHBhbmVsQmFja2dyb3VuZC5maWxsU3R5bGUoMHgzMzMzMzMsIDEpXHJcbiAgICBAcGFuZWxCYWNrZ3JvdW5kLmZpbGxSZWN0KEBwYW5lbFgsIEBwYW5lbFksIEBwYW5lbFcsIEBwYW5lbEgpXHJcbiAgICBAcGFuZWxCYWNrZ3JvdW5kLmxpbmVTdHlsZSgxLCAweDAwMDAwMCwgMS4wKVxyXG4gICAgQHBhbmVsQmFja2dyb3VuZC5zdHJva2VSZWN0KEBwYW5lbFgsIEBwYW5lbFksIEBwYW5lbFcsIEBwYW5lbEgpXHJcblxyXG4gICAgQGJ1dHRvbnMgPSB7fVxyXG5cclxuICAgIEBidXR0b25zLm1vZGUgPSBAYWRkLmltYWdlKEBwYW5lbFggKyAoQHBhbmVsVyAvIDIpLCBAcGFuZWxZICsgKEBwYW5lbEggLyAyKSwgJ2J0bl9ib21iJylcclxuICAgIEBidXR0b25zLm1vZGUuc2V0RGlzcGxheVNpemUoQHBhbmVsVyAqIDAuOCwgQHBhbmVsVyAqIDAuOClcclxuICAgIEBidXR0b25zLm1vZGUuc2V0SW50ZXJhY3RpdmUoKVxyXG4gICAgQGJ1dHRvbnMubW9kZS5vbiAncG9pbnRlcmRvd24nLCA9PlxyXG4gICAgICBAdG9nZ2xlTW9kZSgpXHJcbiAgICBAdG9nZ2xlTW9kZSgpXHJcblxyXG4gICAgQGJ1dHRvbnMubWVudSA9IEBhZGQuaW1hZ2UoQHBhbmVsWCArIChAcGFuZWxXIC8gMiksIEBwYW5lbFkgKyAoQHBhbmVsVyAqIDAuNSkgLCAnYnRuX21lbnUnKVxyXG4gICAgQGJ1dHRvbnMubWVudS5zZXREaXNwbGF5U2l6ZShAcGFuZWxXICogMC44LCBAcGFuZWxXICogMC44KVxyXG4gICAgQGJ1dHRvbnMubWVudS5zZXRJbnRlcmFjdGl2ZSgpXHJcbiAgICBAYnV0dG9ucy5tZW51Lm9uICdwb2ludGVyZG93bicsID0+XHJcbiAgICAgIEBzY2VuZS5sYXVuY2goJ21lbnUnKVxyXG5cclxuICAgIEBkZWJ1Z1RleHQgPSBAYWRkLnRleHQoMCwgMCwgJycpXHJcbiAgICBAZ2xhc3MgPSBAYWRkLmltYWdlKDUwLCA1MCwgJ2dsYXNzJylcclxuICAgIEBnbGFzcy5zZXRPcmlnaW4oMC42LCAwLjMpICMgcm91Z2hseSB0aGUgbWlkZGxlIG9mIHRoZSBtYWduaWZ5aW5nIGdsYXNzXHJcbiAgICBAZ2xhc3MuYWxwaGEgPSAwXHJcblxyXG4gIHRvZ2dsZU1vZGU6IC0+XHJcbiAgICBpZiBAbW9kZSA9PSAnYm9tYidcclxuICAgICAgQG1vZGUgPSAnZmxhZydcclxuICAgIGVsc2VcclxuICAgICAgQG1vZGUgPSAnYm9tYidcclxuXHJcbiAgICBAYnV0dG9ucy5tb2RlLnNldFRleHR1cmUoXCJidG5fI3tAbW9kZX1cIilcclxuICAgIEBzY2VuZS5nZXQoJ2dhbWUnKS5zZXRNb2RlKEBtb2RlKVxyXG5cclxuICB1cGRhdGU6IC0+XHJcblxyXG4gIHNldE1hZ25pZnlpbmdHbGFzczogKHgsIHksIGFscGhhKSAtPlxyXG4gICAgQGdsYXNzLnggPSB4XHJcbiAgICBAZ2xhc3MueSA9IHlcclxuICAgIEBnbGFzcy5hbHBoYSA9IGFscGhhXHJcblxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBCR01IdWRTY2VuZVxyXG4iLCJjbGFzcyBCR01NZW51U2NlbmUgZXh0ZW5kcyBQaGFzZXIuU2NlbmVcclxuICBjb25zdHJ1Y3RvcjogLT5cclxuICAgIHN1cGVyIHtcclxuICAgICAga2V5OiAnbWVudSdcclxuICAgICAgYWN0aXZlOiBmYWxzZVxyXG4gICAgfVxyXG5cclxuICAgIEBtcyA9IHJlcXVpcmUgJy4vTWluZVN3ZWVwZXInXHJcblxyXG4gIHByZWxvYWQ6IC0+XHJcbiAgICBAbG9hZC5pbWFnZSgnbWVudV90aGluZycsICdpbWFnZXMvYnRuX21lbnUucG5nJylcclxuXHJcbiAgY3JlYXRlOiAtPlxyXG4gICAgQHcgPSBAY2FtZXJhcy5tYWluLndpZHRoXHJcbiAgICBAaCA9IEBjYW1lcmFzLm1haW4uaGVpZ2h0XHJcblxyXG4gICAgQGZvbnRzID1cclxuICAgICAgdGl0bGU6XHJcbiAgICAgICAgZm9udEZhbWlseTogJ0VhZ2xlIExha2UnXHJcbiAgICAgICAgZm9udFNpemU6IFwiI3tNYXRoLmZsb29yKEBoIC8gOCl9cHhcIlxyXG4gICAgICAgIGNvbG9yOiAnI2ZmZidcclxuICAgICAgYnV0dG9uOlxyXG4gICAgICAgIGZvbnRGYW1pbHk6ICdFYWdsZSBMYWtlJ1xyXG4gICAgICAgIGZvbnRTaXplOiBcIiN7TWF0aC5mbG9vcihAaCAvIDEyKX1weFwiXHJcbiAgICAgICAgY29sb3I6ICcjZmZmJ1xyXG5cclxuICAgIEBwYW5lbEJhY2tncm91bmQgPSBAYWRkLmdyYXBoaWNzKClcclxuICAgIEBwYW5lbEJhY2tncm91bmQuZmlsbFN0eWxlKDB4MzMwMDMzLCAxKVxyXG4gICAgQHBhbmVsQmFja2dyb3VuZC5maWxsUmVjdCgwLCAwLCBAdywgQGgpXHJcbiAgICBAcGFuZWxCYWNrZ3JvdW5kLnNldEludGVyYWN0aXZlKG5ldyBQaGFzZXIuR2VvbS5SZWN0YW5nbGUoMCwgMCwgQHcsIEBoKSwgUGhhc2VyLkdlb20uUmVjdGFuZ2xlLkNvbnRhaW5zKTtcclxuXHJcbiAgICBAdGl0bGUgPSBAYWRkLnRleHQoQHcgLyAyLCBAaCAvIDIwLCAnQmFkIEd1eSBNaW5lc3dlZXBlcicsIEBmb250cy50aXRsZSlcclxuICAgIEB0aXRsZS5zZXRPcmlnaW4oMC41LCAwLjApXHJcblxyXG4gICAgQG5leHRCdXR0b25JbmRleCA9IDBcclxuICAgIEBhZGRCdXR0b24gXCJCZWdpbm5lclwiLCA9PlxyXG4gICAgICBAbmV3R2FtZSg4LCA4LCAxMClcclxuICAgIEBhZGRCdXR0b24gXCJJbnRlcm1lZGlhdGVcIiwgPT5cclxuICAgICAgQG5ld0dhbWUoMTYsIDE2LCA0MClcclxuICAgIEBhZGRCdXR0b24gXCJFeHBlcnRcIiwgPT5cclxuICAgICAgQG5ld0dhbWUoMzAsIDE2LCA5OSlcclxuICAgIEBhZGRCdXR0b24gXCJIdWdlXCIsID0+XHJcbiAgICAgIEBuZXdHYW1lKDUwLCAzMCwgMClcclxuXHJcbiAgICBAbmV4dEJ1dHRvbkluZGV4ICs9IDFcclxuICAgIEBhZGRCdXR0b24gXCJSZXN1bWVcIiwgPT5cclxuICAgICAgQHNjZW5lLnNsZWVwKCdtZW51JylcclxuXHJcbiAgYWRkQnV0dG9uOiAodGV4dCwgY2IpIC0+XHJcbiAgICBidXR0b25JbmRleCA9IEBuZXh0QnV0dG9uSW5kZXhcclxuICAgIEBuZXh0QnV0dG9uSW5kZXggKz0gMVxyXG5cclxuICAgIGJ1dHRvblcgPSBNYXRoLmZsb29yKEB3IC8gMilcclxuICAgIGJ1dHRvbkggPSBNYXRoLmZsb29yKEBoIC8gMTApXHJcbiAgICBidXR0b25NYXJnaW4gPSBNYXRoLmZsb29yKGJ1dHRvbkggLyA0KVxyXG4gICAgYnV0dG9uWCA9IChAdyAvIDIpXHJcbiAgICBidXR0b25ZID0gKEBoIC8gMy41KSArIChidXR0b25JbmRleCAqIChidXR0b25IICsgYnV0dG9uTWFyZ2luKSlcclxuICAgIGNlbnRlck9mZnNldFggPSAoYnV0dG9uVyAvIDIpXHJcbiAgICBjZW50ZXJPZmZzZXRZID0gKGJ1dHRvbkggLyAyKVxyXG5cclxuICAgIGJ1dHRvbiA9IEBhZGQuZ3JhcGhpY3MoKVxyXG4gICAgYnV0dG9uLmZpbGxTdHlsZSgweDMzMDAzMywgMSlcclxuICAgIGJ1dHRvbi5maWxsUmVjdChidXR0b25YIC0gY2VudGVyT2Zmc2V0WCwgYnV0dG9uWSAtIGNlbnRlck9mZnNldFksIGJ1dHRvblcsIGJ1dHRvbkgpXHJcbiAgICBidXR0b24uc2V0SW50ZXJhY3RpdmUobmV3IFBoYXNlci5HZW9tLlJlY3RhbmdsZShidXR0b25YIC0gY2VudGVyT2Zmc2V0WCwgYnV0dG9uWSAtIGNlbnRlck9mZnNldFksIGJ1dHRvblcsIGJ1dHRvbkgpLCBQaGFzZXIuR2VvbS5SZWN0YW5nbGUuQ29udGFpbnMpO1xyXG4gICAgdGV4dCA9IEBhZGQudGV4dChidXR0b25YLCBidXR0b25ZLCB0ZXh0LCBAZm9udHMuYnV0dG9uKVxyXG4gICAgdGV4dC5zZXRPcmlnaW4oMC41KVxyXG4gICAgYnV0dG9uLm9uICdwb2ludGVyZG93bicsIC0+XHJcbiAgICAgIGNiKClcclxuXHJcbiAgbmV3R2FtZTogKHcsIGgsIG0pIC0+XHJcbiAgICBAbXMubmV3R2FtZSh3LCBoLCBtKVxyXG4gICAgQHNjZW5lLnNsZWVwKCdtZW51JylcclxuXHJcbiAgdXBkYXRlOiAtPlxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBCR01NZW51U2NlbmVcclxuIiwicHJvcHNUb1NhdmUgPSBbXHJcbiAgJ3NlZWQnXHJcbiAgJ3dpZHRoJ1xyXG4gICdoZWlnaHQnXHJcbiAgJ2JvbWInXHJcbiAgJ3Zpc2libGUnXHJcbiAgJ2xpdmVzJ1xyXG4gICdtaW5lQ291bnQnXHJcbiAgJ2dhbWVvdmVyJ1xyXG5dXHJcblxyXG5jbGFzcyBNaW5lU3dlZXBlclxyXG4gIGNvbnN0cnVjdG9yOiAtPlxyXG4gICAgQGxpc3RlbmVycyA9IFtdXHJcbiAgICBpZiBub3QgQGxvYWQoKVxyXG4gICAgICBAbmV3R2FtZSgpXHJcblxyXG4gIGxvYWQ6IC0+XHJcbiAgICByYXdEYXRhID0gbG9jYWxTdG9yYWdlLmdldEl0ZW0oXCJzYXZlXCIpXHJcbiAgICBpZiBub3QgcmF3RGF0YT9cclxuICAgICAgcmV0dXJuIGZhbHNlXHJcbiAgICB0cnlcclxuICAgICAgZGF0YSA9IEpTT04ucGFyc2UocmF3RGF0YSlcclxuICAgIGNhdGNoXHJcbiAgICAgIGRhdGEgPSBudWxsXHJcblxyXG4gICAgaWYgbm90IGRhdGE/XHJcbiAgICAgIHJldHVybiBmYWxzZVxyXG5cclxuICAgIGZvciBwIGluIHByb3BzVG9TYXZlXHJcbiAgICAgIGlmIG5vdCBkYXRhLmhhc093blByb3BlcnR5KHApXHJcbiAgICAgICAgcmV0dXJuIGZhbHNlXHJcblxyXG4gICAgZm9yIHAgaW4gcHJvcHNUb1NhdmVcclxuICAgICAgdGhpc1twXSA9IGRhdGFbcF1cclxuICAgIHJldHVybiB0cnVlXHJcblxyXG4gIHNhdmU6IC0+XHJcbiAgICBkYXRhID0ge31cclxuICAgIGZvciBwIGluIHByb3BzVG9TYXZlXHJcbiAgICAgIGRhdGFbcF0gPSB0aGlzW3BdXHJcbiAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbShcInNhdmVcIiwgSlNPTi5zdHJpbmdpZnkoZGF0YSkpXHJcblxyXG4gIGFkZEV2ZW50TGlzdGVuZXI6IChldmwpIC0+XHJcbiAgICBAbGlzdGVuZXJzLnB1c2goZXZsKVxyXG5cclxuICByYW5kOiAoeCkgLT5cclxuICAgIHJldHVybiBNYXRoLmZsb29yKE1hdGguYmdtcmFuZG9tKCkgKiB4KVxyXG5cclxuICBuZWlnaGJvcnM6IChpLCBqLCB1bmZsYWdnZWRPbmx5KSAtPlxyXG4gICAgbiA9IDBcclxuICAgIHgxID0gTWF0aC5tYXgoaSAtIDEsIDApXHJcbiAgICB4MiA9IE1hdGgubWluKEB3aWR0aCAtIDEsIGkgKyAxKVxyXG4gICAgeTEgPSBNYXRoLm1heChqIC0gMSwgMClcclxuICAgIHkyID0gTWF0aC5taW4oQGhlaWdodCAtIDEsIGogKyAxKVxyXG4gICAgeCA9IHgxXHJcbiAgICB3aGlsZSB4IDw9IHgyXHJcbiAgICAgIHkgPSB5MVxyXG4gICAgICB3aGlsZSB5IDw9IHkyXHJcbiAgICAgICAgaWYgeCAhPSBpIG9yIHkgIT0galxyXG4gICAgICAgICAgaWYgIXVuZmxhZ2dlZE9ubHkgb3IgKEB2aXNpYmxlW3ggKyB5ICogQHdpZHRoXSA9PSAwKVxyXG4gICAgICAgICAgICBpZiBAYm9tYlt4ICsgeSAqIEB3aWR0aF0gPT0gMVxyXG4gICAgICAgICAgICAgICsrblxyXG4gICAgICAgICsreVxyXG4gICAgICArK3hcclxuICAgIHJldHVybiBuXHJcblxyXG4gIGhhc1Zpc2libGVaZXJvTmVpZ2hib3I6IChpLCBqKSAtPlxyXG4gICAgeDEgPSBNYXRoLm1heChpIC0gMSwgMClcclxuICAgIHgyID0gTWF0aC5taW4oQHdpZHRoIC0gMSwgaSArIDEpXHJcbiAgICB5MSA9IE1hdGgubWF4KGogLSAxLCAwKVxyXG4gICAgeTIgPSBNYXRoLm1pbihAaGVpZ2h0IC0gMSwgaiArIDEpXHJcbiAgICB4ID0geDFcclxuICAgIHdoaWxlIHggPD0geDJcclxuICAgICAgeSA9IHkxXHJcbiAgICAgIHdoaWxlIHkgPD0geTJcclxuICAgICAgICBpZiB4ICE9IGkgb3IgeSAhPSBqXHJcbiAgICAgICAgICBpZiBAdmlzaWJsZVt4ICsgeSAqIEB3aWR0aF0gIT0gMFxyXG4gICAgICAgICAgICBuID0gQG5laWdoYm9ycyh4LCB5LCBmYWxzZSlcclxuICAgICAgICAgICAgaWYgbiA9PSAwXHJcbiAgICAgICAgICAgICAgcmV0dXJuIHRydWVcclxuICAgICAgICArK3lcclxuICAgICAgKyt4XHJcbiAgICByZXR1cm4gZmFsc2VcclxuXHJcbiAgbG9zZUxpZmU6IC0+XHJcbiAgICBAbGl2ZXMgLT0gMVxyXG4gICAgaWYgQGxpdmVzID4gMFxyXG4gICAgICBmb3IgZXZsIGluIEBsaXN0ZW5lcnNcclxuICAgICAgICBldmwoJ2xpZmUnLCBbQGxpdmVzXSlcclxuICAgICAgcmV0dXJuIGZhbHNlXHJcbiAgICByZXR1cm4gdHJ1ZVxyXG5cclxuICB1cGRhdGVDZWxsOiAoaSwgaiwgcmV2ZWFsKSAtPlxyXG4gICAgaW1hZ2UgPSAnYmxhbmsnXHJcbiAgICBpbmRleCA9IGkgKyBqICogQHdpZHRoXHJcbiAgICBpc0JvbWIgPSBAYm9tYltpbmRleF1cclxuICAgIGlzVmlzaWJsZSA9IEB2aXNpYmxlW2luZGV4XVxyXG4gICAgbiA9IEBuZWlnaGJvcnMoaSwgaiwgZmFsc2UpXHJcbiAgICBpZiBpc1Zpc2libGUgPT0gMFxyXG4gICAgICBpZiByZXZlYWxcclxuICAgICAgICBpZiBpc0JvbWIgPT0gMVxyXG4gICAgICAgICAgaW1hZ2UgPSAnYm9tYnJldmVhbGVkJ1xyXG4gICAgICAgIGVsc2VcclxuICAgICAgICAgIGltYWdlID0gJ3NoYWRvdycgKyBuXHJcbiAgICAgIGVsc2VcclxuICAgICAgICBpbWFnZSA9ICdibGFuaydcclxuICAgIGVsc2VcclxuICAgICAgaWYgaXNCb21iID09IDFcclxuICAgICAgICBpZiBpc1Zpc2libGUgPT0gMlxyXG4gICAgICAgICAgaW1hZ2UgPSAnYm9tYmRlYXRoJ1xyXG4gICAgICAgIGVsc2VcclxuICAgICAgICAgIHVuZmxhZ2dlZCA9IEBuZWlnaGJvcnMoaSwgaiwgdHJ1ZSlcclxuICAgICAgICAgIGlmIHVuZmxhZ2dlZCA9PSAwXHJcbiAgICAgICAgICAgIG4gPSAwXHJcbiAgICAgICAgICBpbWFnZSA9ICdib21iJyArIG5cclxuICAgICAgZWxzZVxyXG4gICAgICAgIGlmIGlzVmlzaWJsZSA9PSAyXHJcbiAgICAgICAgICBpbWFnZSA9ICdib21ibWlzZmxhZ2dlZCdcclxuICAgICAgICBlbHNlXHJcbiAgICAgICAgICBpbWFnZSA9ICdvcGVuJyArIG5cclxuICAgIGZvciBldmwgaW4gQGxpc3RlbmVyc1xyXG4gICAgICBldmwoJ2NlbGwnLCBbaSwgaiwgaW1hZ2VdKVxyXG4gICAgcmV0dXJuXHJcblxyXG4gIHVwZGF0ZUFsbDogKHJldmVhbCA9IGZhbHNlKSAtPlxyXG4gICAgaWYgQGxpc3RlbmVycy5sZW5ndGggPT0gMFxyXG4gICAgICByZXR1cm5cclxuXHJcbiAgICBrZWVwR29pbmcgPSB0cnVlXHJcbiAgICB3aGlsZSBrZWVwR29pbmdcclxuICAgICAga2VlcEdvaW5nID0gZmFsc2VcclxuICAgICAgZm9yIGogaW4gWzAuLi5AaGVpZ2h0XVxyXG4gICAgICAgIGZvciBpIGluIFswLi4uQHdpZHRoXVxyXG4gICAgICAgICAgaWYgKEBib21iW2kgKyBqICogQHdpZHRoXSA9PSAwKSBhbmQgQGhhc1Zpc2libGVaZXJvTmVpZ2hib3IoaSwgailcclxuICAgICAgICAgICAgaWYgQHBva2UoaSwgailcclxuICAgICAgICAgICAgICBrZWVwR29pbmcgPSB0cnVlXHJcblxyXG4gICAgd29uID0gdHJ1ZVxyXG4gICAgaWYgQGdhbWVvdmVyXHJcbiAgICAgIHdvbiA9IGZhbHNlXHJcblxyXG4gICAgZm9yIGogaW4gWzAuLi5AaGVpZ2h0XVxyXG4gICAgICBmb3IgaSBpbiBbMC4uLkB3aWR0aF1cclxuICAgICAgICBpZiBAdmlzaWJsZVtpICsgaiAqIEB3aWR0aF0gPT0gMFxyXG4gICAgICAgICAgd29uID0gZmFsc2VcclxuICAgICAgICBAdXBkYXRlQ2VsbChpLCBqLCByZXZlYWwpXHJcbiAgICBpZiB3b25cclxuICAgICAgQGdhbWVvdmVyID0gdHJ1ZVxyXG4gICAgICBmb3IgZXZsIGluIEBsaXN0ZW5lcnNcclxuICAgICAgICBldmwoJ3dpbicsIFtdKVxyXG4gICAgcmV0dXJuXHJcblxyXG4gIGZsYWc6IChpLCBqKSAtPlxyXG4gICAgaW5kZXggPSBpICsgaiAqIEB3aWR0aFxyXG4gICAgaWYgQHZpc2libGVbaW5kZXhdID09IDBcclxuICAgICAgaWYgQGJvbWJbaW5kZXhdID09IDFcclxuICAgICAgICAjYm9tYltpbmRleF0gPSAwO1xyXG4gICAgICAgICNwb2tlKGksIGopO1xyXG4gICAgICAgIEB2aXNpYmxlW2luZGV4XSA9IDFcclxuICAgICAgZWxzZVxyXG4gICAgICAgICMgQmFkIGZsYWc7IGxvc2UgdGhlIGdhbWVcclxuICAgICAgICBpZiBAbG9zZUxpZmUoKVxyXG4gICAgICAgICAgQHZpc2libGVbaW5kZXhdID0gMlxyXG4gICAgICAgICAgQGdhbWVvdmVyID0gdHJ1ZVxyXG4gICAgICAgICAgQHVwZGF0ZUFsbCh0cnVlKVxyXG4gICAgICAgICAgZm9yIGV2bCBpbiBAbGlzdGVuZXJzXHJcbiAgICAgICAgICAgIGV2bCgnbG9zZScsIFtdKVxyXG4gICAgICAgICAgcmV0dXJuXHJcbiAgICByZXR1cm5cclxuXHJcbiAgcG9rZTogKGksIGopIC0+XHJcbiAgICByZXQgPSBmYWxzZVxyXG4gICAgaW5kZXggPSBpICsgaiAqIEB3aWR0aFxyXG4gICAgaWYgQHZpc2libGVbaW5kZXhdID09IDBcclxuICAgICAgaWYgQGJvbWJbaW5kZXhdID09IDFcclxuICAgICAgICAjIEJhZCBzcG90OyBsb3NlIHRoZSBnYW1lXHJcbiAgICAgICAgaWYgQGxvc2VMaWZlKClcclxuICAgICAgICAgIEB2aXNpYmxlW2luZGV4XSA9IDJcclxuICAgICAgICAgIEBnYW1lb3ZlciA9IHRydWVcclxuICAgICAgICAgIEB1cGRhdGVBbGwodHJ1ZSlcclxuICAgICAgICAgIGZvciBldmwgaW4gQGxpc3RlbmVyc1xyXG4gICAgICAgICAgICBldmwoJ2xvc2UnLCBbXSlcclxuICAgICAgICAgIHJldHVybiBmYWxzZVxyXG4gICAgICAgIGVsc2VcclxuICAgICAgICAgIHJldHVybiBmYWxzZVxyXG4gICAgICBAdmlzaWJsZVtpbmRleF0gPSAxXHJcbiAgICAgIHJldCA9IHRydWVcclxuICAgIHJldHVybiByZXRcclxuXHJcbiAgZmlyc3RDbGlja0lzRnJlZTogLT5cclxuICAgIGNlbGxDb3VudCA9IEB3aWR0aCAqIEBoZWlnaHRcclxuICAgIHN0YXJ0SW5kZXggPSBAcmFuZChjZWxsQ291bnQpXHJcbiAgICBpbmRleCA9IHN0YXJ0SW5kZXhcclxuICAgIGxvb3BcclxuICAgICAgaSA9IE1hdGguZmxvb3IoaW5kZXggJSBAd2lkdGgpXHJcbiAgICAgIGogPVxyXG4gICAgICAgIE1hdGguZmxvb3IoaW5kZXggLyBAd2lkdGgpXHJcbiAgICAgIG4gPSBAbmVpZ2hib3JzKGksIGosIGZhbHNlKVxyXG4gICAgICBpZiBAYm9tYltpbmRleF0gPT0gMCBhbmQgbiA9PSAwXHJcbiAgICAgICAgQHBva2UoaSwgailcclxuICAgICAgICByZXR1cm5cclxuICAgICAgaW5kZXggPSAoaW5kZXggKyAxKSAlIGNlbGxDb3VudFxyXG4gICAgICBpZiBpbmRleCA9PSBzdGFydEluZGV4XHJcbiAgICAgICAgYnJlYWtcclxuICAgIGxvb3BcclxuICAgICAgaSA9IE1hdGguZmxvb3IoaW5kZXggJSBAd2lkdGgpXHJcbiAgICAgIGogPSBNYXRoLmZsb29yKGluZGV4IC8gQHdpZHRoKVxyXG4gICAgICBuID0gbmVpZ2hib3JzKGksIGosIGZhbHNlKVxyXG4gICAgICBpZiBAYm9tYltpbmRleF0gPT0gMFxyXG4gICAgICAgIEBwb2tlKGksIGopXHJcbiAgICAgICAgcmV0dXJuXHJcbiAgICAgIGluZGV4ID0gKGluZGV4ICsgMSkgJSBjZWxsQ291bnRcclxuICAgICAgaWYgaW5kZXggPT0gc3RhcnRJbmRleFxyXG4gICAgICAgIGJyZWFrXHJcbiAgICByZXR1cm5cclxuXHJcbiAgbmV3R2FtZTogKEB3aWR0aCA9IDE2LCBAaGVpZ2h0ID0gMTYsIEBtaW5lQ291bnQgPSAwLCBAc2VlZCA9IFN0cmluZyhNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAxMDAwMDAwKSkpIC0+XHJcbiAgICBNYXRoLnNlZWRiZ21yYW5kb20oQHNlZWQpXHJcblxyXG4gICAgQGxpdmVzID0gM1xyXG5cclxuICAgIGNlbGxDb3VudCA9IEB3aWR0aCAqIEBoZWlnaHRcclxuICAgIGlmIEBtaW5lQ291bnQgPT0gMFxyXG4gICAgICBNSU5FX0RFTlNJVFkgPSAwLjE2XHJcbiAgICAgIEBtaW5lQ291bnQgPSBNYXRoLmZsb29yKGNlbGxDb3VudCAqIE1JTkVfREVOU0lUWSlcclxuXHJcbiAgICBAZ2FtZW92ZXIgPSBmYWxzZVxyXG5cclxuICAgICMgQ3JlYXRlIGZyZXNoIGFycmF5c1xyXG4gICAgQGJvbWIgPSBuZXcgQXJyYXkoY2VsbENvdW50KS5maWxsKDApXHJcbiAgICBAdmlzaWJsZSA9IG5ldyBBcnJheShjZWxsQ291bnQpLmZpbGwoMClcclxuXHJcbiAgICAjIERyb3AgaW4gdGhlIG1pbmVzIHJhbmRvbWx5XHJcbiAgICBpbmRpY2VzID0gbmV3IEFycmF5KGNlbGxDb3VudClcclxuICAgIGluZGljZXNbMF0gPSAwXHJcbiAgICBpID0gMVxyXG4gICAgd2hpbGUgaSA8IGNlbGxDb3VudFxyXG4gICAgICBqID0gQHJhbmQoaSlcclxuICAgICAgaW5kaWNlc1tpXSA9IGluZGljZXNbal1cclxuICAgICAgaW5kaWNlc1tqXSA9IGlcclxuICAgICAgKytpXHJcbiAgICBtID0gQG1pbmVDb3VudFxyXG4gICAgaWYgbSA+PSBjZWxsQ291bnRcclxuICAgICAgbSA9IGNlbGxDb3VudCAtIDFcclxuICAgIGkgPSAwXHJcbiAgICB3aGlsZSBpIDwgbVxyXG4gICAgICBAYm9tYltpbmRpY2VzW2ldXSA9IDFcclxuICAgICAgKytpXHJcbiAgICBAZmlyc3RDbGlja0lzRnJlZSgpXHJcbiAgICBmb3IgZXZsIGluIEBsaXN0ZW5lcnNcclxuICAgICAgZXZsKCduZXcnLCBbXSlcclxuICAgIEB1cGRhdGVBbGwoKVxyXG4gICAgQHNhdmUoKVxyXG4gICAgcmV0dXJuXHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IG5ldyBNaW5lU3dlZXBlciAjIFNpbmdsZXRvblxyXG4iLCJFTkdBR0VfRFJBR19ESVNUQU5DRSA9IDEwXHJcbkRPVUJMRV9DTElDS19NUyA9IDQwMFxyXG5cclxuY2xhc3MgVG91Y2hJbnRlcnByZXRlclxyXG4gIGNvbnN0cnVjdG9yOiAtPlxyXG4gICAgQHRyYWNrZWQgPSBbXVxyXG4gICAgQGRyYWdYID0gMFxyXG4gICAgQGRyYWdZID0gMFxyXG4gICAgQGRyYWdnaW5nID0gZmFsc2VcclxuICAgIEBkb3VibGVDbGlja1RpbWUgPSBudWxsXHJcbiAgICBAcGluY2hBbmNob3IgPSBudWxsXHJcbiAgICBAcGluY2hBbmNob3JXb3JsZCA9IG51bGxcclxuXHJcbiAgY3JlYXRlOiAoQHNjZW5lLCBAY2FtZXJhLCBAeCwgQHksIEB3LCBAaCkgLT5cclxuICAgIEBjYW1lcmEuem9vbSA9IDFcclxuICAgIEBzY2VuZS5pbnB1dC5hZGRQb2ludGVyKDEpXHJcbiAgICBAc2NlbmUuaW5wdXQubW91c2UuZGlzYWJsZUNvbnRleHRNZW51KClcclxuXHJcbiAgICBAc2NlbmUuaW5wdXQub24gJ3BvaW50ZXJkb3duJywgKHBvaW50ZXIpID0+XHJcbiAgICAgIGlmIHBvaW50ZXIucmlnaHRCdXR0b25Eb3duKClcclxuICAgICAgICB3b3JsZFBvcyA9IEBjYW1lcmEuZ2V0V29ybGRQb2ludChwb2ludGVyLnBvc2l0aW9uLngsIHBvaW50ZXIucG9zaXRpb24ueSlcclxuICAgICAgICBAc2NlbmUucm1iKHdvcmxkUG9zLngsIHdvcmxkUG9zLnkpXHJcbiAgICAgICAgcmV0dXJuXHJcblxyXG4gICAgICBpZiBwb2ludGVyLnBvc2l0aW9uLnggPiAoQHggKyBAdylcclxuICAgICAgICByZXR1cm5cclxuXHJcbiAgICAgIGlmIEB0cmFja2VkLmxlbmd0aCA9PSAwXHJcbiAgICAgICAgQGRyYWdnaW5nID0gZmFsc2VcclxuXHJcbiAgICAgICMgY29uc29sZS5sb2cgXCJuZXcgcG9pbnRlciAje3BvaW50ZXIuaWR9XCJcclxuICAgICAgQHRyYWNrZWQucHVzaCB7XHJcbiAgICAgICAgaWQ6IHBvaW50ZXIuaWRcclxuICAgICAgICBwb3M6IHBvaW50ZXIucG9zaXRpb24uY2xvbmUoKVxyXG4gICAgICB9XHJcbiAgICAgIGlmIEB0cmFja2VkLmxlbmd0aCA9PSAxXHJcbiAgICAgICAgQHNldERyYWdQb2ludCgpXHJcbiAgICAgIGlmIEB0cmFja2VkLmxlbmd0aCA9PSAyXHJcbiAgICAgICAgIyBXZSBqdXN0IGFkZGVkIGEgc2Vjb25kIHRvdWNoIHNwb3QuIENhbGN1bGF0ZSB0aGUgYW5jaG9yIGZvciBwaW5jaGluZyBub3dcclxuICAgICAgICBAY2FsY1BpbmNoQW5jaG9yKClcclxuXHJcbiAgICAgIGlmIEB0cmFja2VkLmxlbmd0aCA+IDFcclxuICAgICAgICBAZHJhZ2dpbmcgPSB0cnVlXHJcbiAgICAgICAgQGRvdWJsZUNsaWNrVGltZSA9IG51bGxcclxuICAgICAgZWxzZSBpZiBub3QgQGRyYWdnaW5nXHJcbiAgICAgICAgbm93ID0gbmV3IERhdGUoKS5nZXRUaW1lKClcclxuICAgICAgICBpZiBAZG91YmxlQ2xpY2tUaW1lICE9IG51bGxcclxuICAgICAgICAgICMgc2Vjb25kIGNsaWNrXHJcbiAgICAgICAgICBjbGlja0RlbHRhID0gbm93IC0gQGRvdWJsZUNsaWNrVGltZVxyXG4gICAgICAgICAgaWYgY2xpY2tEZWx0YSA8IERPVUJMRV9DTElDS19NU1xyXG4gICAgICAgICAgICBAZG91YmxlQ2xpY2tUaW1lID0gbnVsbFxyXG4gICAgICAgICAgICAjIGNvbnNvbGUubG9nIFwiRE9VQkxFIFRBUCAje0B0cmFja2VkWzBdLnBvcy54fSAje0B0cmFja2VkWzBdLnBvcy55fVwiXHJcbiAgICAgICAgICAgIHJldHVyblxyXG4gICAgICAgIEBkb3VibGVDbGlja1RpbWUgPSBub3dcclxuXHJcbiAgICBAc2NlbmUuaW5wdXQub24gJ3BvaW50ZXJtb3ZlJywgKHBvaW50ZXIpID0+XHJcbiAgICAgIHByZXZEaXN0YW5jZSA9IDBcclxuICAgICAgaWYgQHRyYWNrZWQubGVuZ3RoID49IDJcclxuICAgICAgICBwcmV2RGlzdGFuY2UgPSBAY2FsY0Rpc3RhbmNlKEB0cmFja2VkWzBdLnBvcy54LCBAdHJhY2tlZFswXS5wb3MueSwgQHRyYWNrZWRbMV0ucG9zLngsIEB0cmFja2VkWzFdLnBvcy55KVxyXG4gICAgICBpZiBAdHJhY2tlZC5sZW5ndGggPT0gMVxyXG4gICAgICAgIHByZXZYID0gQHRyYWNrZWRbMF0ucG9zLnhcclxuICAgICAgICBwcmV2WSA9IEB0cmFja2VkWzBdLnBvcy55XHJcblxyXG4gICAgICBpbmRleCA9IC0xXHJcbiAgICAgIGZvciBpIGluIFswLi4uQHRyYWNrZWQubGVuZ3RoXVxyXG4gICAgICAgIGlmIEB0cmFja2VkW2ldLmlkID09IHBvaW50ZXIuaWRcclxuICAgICAgICAgIGluZGV4ID0gaVxyXG4gICAgICAgICAgYnJlYWtcclxuICAgICAgaWYgaW5kZXggPT0gLTFcclxuICAgICAgICByZXR1cm5cclxuXHJcbiAgICAgIEB0cmFja2VkW2luZGV4XS5wb3MgPSBwb2ludGVyLnBvc2l0aW9uLmNsb25lKClcclxuXHJcbiAgICAgIGlmIEB0cmFja2VkLmxlbmd0aCA9PSAxXHJcbiAgICAgICAgIyBzaW5nbGUgdG91Y2gsIGNvbnNpZGVyIGRyYWdnaW5nXHJcbiAgICAgICAgZHJhZ0Rpc3RhbmNlID0gQGNhbGNEaXN0YW5jZSBAZHJhZ1gsIEBkcmFnWSwgQHRyYWNrZWRbMF0ucG9zLngsIEB0cmFja2VkWzBdLnBvcy55XHJcbiAgICAgICAgaWYgQGRyYWdnaW5nIG9yIChkcmFnRGlzdGFuY2UgPiBFTkdBR0VfRFJBR19ESVNUQU5DRSlcclxuICAgICAgICAgIEBkcmFnZ2luZyA9IHRydWVcclxuICAgICAgICAgIGlmIGRyYWdEaXN0YW5jZSA+IDAuNVxyXG4gICAgICAgICAgICBkeCA9IEB0cmFja2VkWzBdLnBvcy54IC0gQGRyYWdYXHJcbiAgICAgICAgICAgIGR5ID0gQHRyYWNrZWRbMF0ucG9zLnkgLSBAZHJhZ1lcclxuICAgICAgICAgICAgIyBjb25zb2xlLmxvZyBcInNpbmdsZSBkcmFnOiAje2R4fSwgI3tkeX1cIlxyXG4gICAgICAgICAgICBAY2FtZXJhLnNjcm9sbFggLT0gZHggLyBAY2FtZXJhLnpvb21cclxuICAgICAgICAgICAgQGNhbWVyYS5zY3JvbGxZIC09IGR5IC8gQGNhbWVyYS56b29tXHJcblxyXG4gICAgICAgICAgICAjIGNvbnNvbGUubG9nIFwic2Nyb2xsICN7QGNhbWVyYS5zY3JvbGxYfSAje0BjYW1lcmEuem9vbX0gI3tAY2FtZXJhLndpZHRofVwiXHJcbiAgICAgICAgICBAc2V0RHJhZ1BvaW50KClcclxuXHJcbiAgICAgIGVsc2UgaWYgQHRyYWNrZWQubGVuZ3RoID49IDJcclxuICAgICAgICAjIGF0IGxlYXN0IHR3byBmaW5nZXJzIHByZXNlbnQsIGNoZWNrIGZvciBwaW5jaC96b29tXHJcbiAgICAgICAgY3VyckRpc3RhbmNlID0gQGNhbGNEaXN0YW5jZShAdHJhY2tlZFswXS5wb3MueCwgQHRyYWNrZWRbMF0ucG9zLnksIEB0cmFja2VkWzFdLnBvcy54LCBAdHJhY2tlZFsxXS5wb3MueSlcclxuICAgICAgICBkZWx0YURpc3RhbmNlID0gY3VyckRpc3RhbmNlIC0gcHJldkRpc3RhbmNlXHJcbiAgICAgICAgaWYgZGVsdGFEaXN0YW5jZSAhPSAwXHJcbiAgICAgICAgICBuZXdab29tID0gQGNhbWVyYS56b29tICogKDEgKyAoZGVsdGFEaXN0YW5jZSAqIDQgLyBAY2FtZXJhLndpZHRoKSlcclxuICAgICAgICAgIEBhZGp1c3Rab29tKG5ld1pvb20pXHJcbiAgICAgIHJldHVyblxyXG5cclxuICAgIEBzY2VuZS5pbnB1dC5vbiAncG9pbnRlcnVwJywgKHBvaW50ZXIpID0+XHJcbiAgICAgIGluZGV4ID0gLTFcclxuICAgICAgZm9yIGkgaW4gWzAuLi5AdHJhY2tlZC5sZW5ndGhdXHJcbiAgICAgICAgaWYgQHRyYWNrZWRbaV0uaWQgPT0gcG9pbnRlci5pZFxyXG4gICAgICAgICAgaW5kZXggPSBpXHJcbiAgICAgICAgICBicmVha1xyXG4gICAgICBpZiBpbmRleCA9PSAtMVxyXG4gICAgICAgIHJldHVyblxyXG5cclxuICAgICAgaWYgQHRyYWNrZWQubGVuZ3RoID09IDFcclxuICAgICAgICBpZiBub3QgQGRyYWdnaW5nXHJcbiAgICAgICAgICB3b3JsZFBvcyA9IEBjYW1lcmEuZ2V0V29ybGRQb2ludChAdHJhY2tlZFswXS5wb3MueCwgQHRyYWNrZWRbMF0ucG9zLnkpXHJcbiAgICAgICAgICAjIGNvbnNvbGUubG9nIFwiVEFQICN7d29ybGRQb3MueH0gI3t3b3JsZFBvcy55fSAje0BjYW1lcmEuc2Nyb2xsWH0gI3tAY2FtZXJhLnNjcm9sbFl9ICN7QGNhbWVyYS56b29tfVwiXHJcbiAgICAgICAgICBAc2NlbmUudGFwKHdvcmxkUG9zLngsIHdvcmxkUG9zLnkpXHJcblxyXG4gICAgICBAdHJhY2tlZC5zcGxpY2UoaW5kZXgsIDEpXHJcbiAgICAgIGlmIEB0cmFja2VkLmxlbmd0aCA9PSAxXHJcbiAgICAgICAgQHNldERyYWdQb2ludCgpXHJcblxyXG4gICAgICBpZiBpbmRleCA8IDJcclxuICAgICAgICAjIFdlIGp1c3QgZm9yZ290IG9uZSBvZiBvdXIgcGluY2ggdG91Y2hlcy4gUGljayBhIG5ldyBhbmNob3Igc3BvdC5cclxuICAgICAgICBAY2FsY1BpbmNoQW5jaG9yKClcclxuXHJcbiAgICAgIEBzY2VuZS5zZXRNYWduaWZ5aW5nR2xhc3MoMCwgMCwgMClcclxuICAgICAgcmV0dXJuXHJcblxyXG4gICAgQHNjZW5lLmlucHV0Lm9uICd3aGVlbCcsIChwb2ludGVyLCBnYW1lT2JqZWN0cywgZGVsdGFYLCBkZWx0YVksIGRlbHRhWikgPT5cclxuICAgICAgQGNhbGNQaW5jaEFuY2hvcihwb2ludGVyLnBvc2l0aW9uLngsIHBvaW50ZXIucG9zaXRpb24ueSlcclxuICAgICAgbmV3Wm9vbSA9IEBjYW1lcmEuem9vbSAqICgxIC0gKGRlbHRhWSAvIDQ4MCkpXHJcbiAgICAgIEBhZGp1c3Rab29tKG5ld1pvb20pXHJcbiAgICAgIEBzY2VuZS5zZXRNYWduaWZ5aW5nR2xhc3MoMCwgMCwgMClcclxuICAgICAgcmV0dXJuXHJcblxyXG4gIGFkanVzdFpvb206IChuZXdab29tKSAtPlxyXG4gICAgaWYgbmV3Wm9vbSA8IDAuMVxyXG4gICAgICBuZXdab29tID0gMC4xXHJcbiAgICBpZiBuZXdab29tID4gNVxyXG4gICAgICBuZXdab29tID0gNVxyXG4gICAgQGNhbWVyYS56b29tID0gbmV3Wm9vbVxyXG5cclxuICAgIGhhbGZXID0gKEBjYW1lcmEud2lkdGggLyAyKVxyXG4gICAgaGFsZkggPSAoQGNhbWVyYS5oZWlnaHQgLyAyKVxyXG4gICAgb2Zmc2V0WCA9IChAcGluY2hBbmNob3IueCAtIGhhbGZXKSAvIG5ld1pvb21cclxuICAgIG9mZnNldFkgPSAoQHBpbmNoQW5jaG9yLnkgLSBoYWxmSCkgLyBuZXdab29tXHJcbiAgICBAY2FtZXJhLnNjcm9sbFggPSBAcGluY2hBbmNob3JXb3JsZC54IC0gaGFsZlcgLSBvZmZzZXRYXHJcbiAgICBAY2FtZXJhLnNjcm9sbFkgPSBAcGluY2hBbmNob3JXb3JsZC55IC0gaGFsZkggLSBvZmZzZXRZXHJcbiAgICByZXR1cm5cclxuXHJcbiAgc2V0RHJhZ1BvaW50OiAtPlxyXG4gICAgQGRyYWdYID0gQHRyYWNrZWRbMF0ucG9zLnhcclxuICAgIEBkcmFnWSA9IEB0cmFja2VkWzBdLnBvcy55XHJcblxyXG4gIGNhbGNQaW5jaEFuY2hvcjogKHBpbmNoWCA9IG51bGwsIHBpbmNoWSA9IG51bGwpIC0+XHJcbiAgICBpZiAocGluY2hYID09IG51bGwpIGFuZCAocGluY2hZID09IG51bGwpXHJcbiAgICAgIGlmIEB0cmFja2VkLmxlbmd0aCA8IDJcclxuICAgICAgICByZXR1cm5cclxuICAgICAgcGluY2hYID0gTWF0aC5mbG9vcigoQHRyYWNrZWRbMF0ucG9zLnggKyBAdHJhY2tlZFsxXS5wb3MueCkgLyAyKVxyXG4gICAgICBwaW5jaFkgPSBNYXRoLmZsb29yKChAdHJhY2tlZFswXS5wb3MueSArIEB0cmFja2VkWzFdLnBvcy55KSAvIDIpXHJcblxyXG4gICAgQHBpbmNoQW5jaG9yID0ge3g6IHBpbmNoWCwgeTogcGluY2hZIH1cclxuICAgIEBwaW5jaEFuY2hvcldvcmxkID0gQGNhbWVyYS5nZXRXb3JsZFBvaW50KHBpbmNoWCwgcGluY2hZKVxyXG5cclxuICAgIEBzY2VuZS5zZXRNYWduaWZ5aW5nR2xhc3MoQHBpbmNoQW5jaG9yLngsIEBwaW5jaEFuY2hvci55LCAxKVxyXG5cclxuICBjYWxjRGlzdGFuY2U6ICh4MSwgeTEsIHgyLCB5MikgLT5cclxuICAgIGR4ID0geDIgLSB4MVxyXG4gICAgZHkgPSB5MiAtIHkxXHJcbiAgICByZXR1cm4gTWF0aC5zcXJ0KGR4KmR4ICsgZHkqZHkpXHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IFRvdWNoSW50ZXJwcmV0ZXJcclxuIiwiQkdNR2FtZVNjZW5lID0gcmVxdWlyZSAnLi9CR01HYW1lU2NlbmUnXHJcbkJHTUh1ZFNjZW5lID0gcmVxdWlyZSAnLi9CR01IdWRTY2VuZSdcclxuQkdNTWVudVNjZW5lID0gcmVxdWlyZSAnLi9CR01NZW51U2NlbmUnXHJcblxyXG5pbml0ID0gLT5cclxuICBjb25zb2xlLmxvZyBcIkJhZCBHdXkgTWluZXN3ZWVwZXI6IGluaXQoKVwiXHJcblxyXG4gIGNvbmZpZyA9XHJcbiAgICB0eXBlOiBQaGFzZXIuQVVUT1xyXG4gICAgd2lkdGg6IGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5jbGllbnRXaWR0aFxyXG4gICAgaGVpZ2h0OiBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuY2xpZW50SGVpZ2h0XHJcbiAgICBiYWNrZ3JvdW5kQ29sb3I6ICcjMDAwMDAwJyAjICcjMmQyZDJkJ1xyXG4gICAgcGFyZW50OiAnc2NyZWVuJ1xyXG4gICAgaW5wdXQ6XHJcbiAgICAgIGFjdGl2ZVBvaW50ZXJzOiAyXHJcbiAgICBzY2VuZTogW1xyXG4gICAgICBCR01HYW1lU2NlbmVcclxuICAgICAgQkdNSHVkU2NlbmVcclxuICAgICAgQkdNTWVudVNjZW5lXHJcbiAgICBdXHJcblxyXG4gIGdhbWUgPSBuZXcgUGhhc2VyLkdhbWUoY29uZmlnKVxyXG5cclxuXHJcbndpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdsb2FkJywgKGUpIC0+XHJcbiAgZm9udHMgPSBbXHJcbiAgICB7XHJcbiAgICAgIG5hbWU6ICdFYWdsZSBMYWtlJ1xyXG4gICAgICB1cmw6ICAnZm9udHMvZWFnbGVsYWtlLnR0ZidcclxuICAgIH1cclxuICBdXHJcbiAgcHJvbWlzZXMgPSBbXVxyXG4gIGZvciBmb250IGluIGZvbnRzXHJcbiAgICBkbyAoZm9udCkgLT5cclxuICAgICAgcHJvbWlzZXMucHVzaCBuZXcgUHJvbWlzZSAocmVzb2x2ZSwgcmVqZWN0KSAtPlxyXG4gICAgICAgIG5ld0ZvbnQgPSBuZXcgRm9udEZhY2UoZm9udC5uYW1lLCBcInVybCgje2ZvbnQudXJsfSlcIilcclxuICAgICAgICBuZXdGb250LmxvYWQoKS50aGVuIChsb2FkZWQpIC0+XHJcbiAgICAgICAgICBpZiBsb2FkZWRcclxuICAgICAgICAgICAgZG9jdW1lbnQuZm9udHMuYWRkKGxvYWRlZClcclxuICAgICAgICAgICAgY29uc29sZS5sb2cgXCJMb2FkZWQgRm9udDogI3tmb250Lm5hbWV9XCJcclxuICAgICAgICAgICAgcmVzb2x2ZSgpXHJcbiAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgIHJlamVjdCgpXHJcblxyXG4gICAgUHJvbWlzZS5hbGwocHJvbWlzZXMpLnRoZW4oKGxvYWRlZCkgLT5cclxuICAgICAgaW5pdCgpXHJcbiAgICApLmNhdGNoIChlcnJvcikgLT5cclxuICAgICAgY29uc29sZS5sb2cgXCJFcnJvcjogXCIsIGVycm9yXHJcblxyXG4sIGZhbHNlKVxyXG4iXX0=
