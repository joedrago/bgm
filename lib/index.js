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
    return this.touch.create(this, this.cameras.main, 0, 0, split, this.cameras.main.height);
  }

  msEvent(ev, args) {
    var debugText, lives, mines;
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
        debugText = this.scene.get('hud').debugText;
        if (debugText != null) {
          debugText.text = `Are you suuuuuuure? (${args[0]})`;
        }
        return this.cameras.main.shake(300, 0.001);
      case 'mines':
        mines = this.scene.get('hud').mines;
        if (mines != null) {
          return mines.text = `${args[0]}/${args[1]}`;
        }
        break;
      case 'lives':
        lives = this.scene.get('hud').lives;
        if (lives != null) {
          return lives.text = String(args[0]);
        }
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
    this.ms = require('./MineSweeper');
  }

  preload() {
    this.load.image('glass', 'images/glass.gif');
    this.load.image('lives', 'images/lives.png');
    this.load.image('mines', 'images/mines.png');
    this.load.image('btn_bomb', 'images/btn_bomb.png');
    this.load.image('btn_flag', 'images/btn_flag.png');
    return this.load.image('btn_menu', 'images/btn_menu.png');
  }

  create() {
    this.w = this.cameras.main.width;
    this.h = this.cameras.main.height;
    this.fonts = {
      mines: {
        fontFamily: 'Eagle Lake',
        fontSize: `${Math.floor(this.h / 30)}px`,
        color: '#fff'
      },
      lives: {
        fontFamily: 'Eagle Lake',
        fontSize: `${Math.floor(this.h / 16)}px`,
        color: '#fff'
      }
    };
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
    this.minesBackground = this.add.image(this.panelX + (this.panelW / 2), this.panelY + (this.panelH * 0.7), 'mines');
    this.minesBackground.setDisplaySize(this.panelW, this.panelW);
    this.mines = this.add.text(this.panelX + (this.panelW / 2), this.panelY + (this.panelH * 0.73), 'mines', this.fonts.mines);
    this.mines.setOrigin(0.5);
    this.livesBackground = this.add.image(this.panelX + (this.panelW / 2), this.panelY + (this.panelH * 0.9), 'lives');
    this.livesBackground.setDisplaySize(this.panelW * 0.8, this.panelW * 0.8);
    this.lives = this.add.text(this.panelX + (this.panelW / 2), this.panelY + (this.panelH * 0.9), 'lives', this.fonts.lives);
    this.lives.setOrigin(0.5);
    this.debugText = this.add.text(0, 0, '');
    this.glass = this.add.image(50, 50, 'glass');
    this.glass.setOrigin(0.6, 0.3); // roughly the middle of the magnifying glass
    this.glass.alpha = 0;
    return this.ms.updateAll();
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


},{"./MineSweeper":4}],3:[function(require,module,exports){
var BGMMenuScene;

BGMMenuScene = class BGMMenuScene extends Phaser.Scene {
  constructor() {
    super({
      key: 'menu',
      active: false
    });
    this.ms = require('./MineSweeper');
  }

  preload() {}

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
    var evl, i, index, j, k, keepGoing, l, len, len1, o, q, r, ref, ref1, ref2, ref3, ref4, ref5, s, visibleMines, won;
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
    visibleMines = 0;
    for (j = o = 0, ref2 = this.height; (0 <= ref2 ? o < ref2 : o > ref2); j = 0 <= ref2 ? ++o : --o) {
      for (i = q = 0, ref3 = this.width; (0 <= ref3 ? q < ref3 : q > ref3); i = 0 <= ref3 ? ++q : --q) {
        index = i + j * this.width;
        if (this.visible[index] === 0) {
          won = false;
        } else if (this.bomb[index] === 1) {
          visibleMines += 1;
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
    ref5 = this.listeners;
    for (s = 0, len1 = ref5.length; s < len1; s++) {
      evl = ref5[s];
      evl('mines', [visibleMines, this.mineCount]);
      evl('lives', [this.lives]);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvQkdNR2FtZVNjZW5lLmNvZmZlZSIsInNyYy9CR01IdWRTY2VuZS5jb2ZmZWUiLCJzcmMvQkdNTWVudVNjZW5lLmNvZmZlZSIsInNyYy9NaW5lU3dlZXBlci5jb2ZmZWUiLCJzcmMvVG91Y2hJbnRlcnByZXRlci5jb2ZmZWUiLCJzcmMvbWFpbi5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQSxJQUFBLFlBQUEsRUFBQTs7QUFBQSxnQkFBQSxHQUFtQixPQUFBLENBQVEsb0JBQVI7O0FBRWIsZUFBTixNQUFBLGFBQUEsUUFBMkIsTUFBTSxDQUFDLE1BQWxDO0VBQ0UsV0FBYSxDQUFBLENBQUE7U0FDWCxDQUFNO01BQ0osR0FBQSxFQUFLLE1BREQ7TUFFSixNQUFBLEVBQVE7SUFGSixDQUFOO0lBS0EsSUFBQyxDQUFBLEVBQUQsR0FBTSxPQUFBLENBQVEsZUFBUjtJQUNOLElBQUMsQ0FBQSxLQUFELEdBQVMsSUFBSSxnQkFBSixDQUFBO0VBUEU7O0VBU2IsT0FBUyxDQUFBLENBQUE7SUFDUCxJQUFDLENBQUEsSUFBSSxDQUFDLEtBQU4sQ0FBWSxPQUFaLEVBQXFCLGtCQUFyQjtJQUNBLElBQUMsQ0FBQSxJQUFJLENBQUMsS0FBTixDQUFZLE1BQVosRUFBb0Isd0JBQXBCO0lBQ0EsSUFBQyxDQUFBLElBQUksQ0FBQyxLQUFOLENBQVksTUFBWixFQUFvQixrQkFBcEI7SUFDQSxJQUFDLENBQUEsSUFBSSxDQUFDLEtBQU4sQ0FBWSxXQUFaLEVBQXlCLHNCQUF6QjtJQUNBLElBQUMsQ0FBQSxJQUFJLENBQUMsS0FBTixDQUFZLGNBQVosRUFBNEIseUJBQTVCO0lBQ0EsSUFBQyxDQUFBLElBQUksQ0FBQyxLQUFOLENBQVksZ0JBQVosRUFBOEIsMkJBQTlCO0lBRUEsSUFBQyxDQUFBLElBQUksQ0FBQyxLQUFOLENBQVksU0FBWixFQUF1QixvQkFBdkI7SUFDQSxJ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Q0FBYyxDQUFDLElBQWYsQ0FBb0IsUUFBQSxDQUFDLE1BQUQsQ0FBQTtVQUNsQixJQUFHLE1BQUg7WUFDRSxRQUFRLENBQUMsS0FBSyxDQUFDLEdBQWYsQ0FBbUIsTUFBbkI7WUFDQSxPQUFPLENBQUMsR0FBUixDQUFZLENBQUEsYUFBQSxDQUFBLENBQWdCLElBQUksQ0FBQyxJQUFyQixDQUFBLENBQVo7bUJBQ0EsT0FBQSxDQUFBLEVBSEY7V0FBQSxNQUFBO21CQUtFLE1BQUEsQ0FBQSxFQUxGOztRQURrQixDQUFwQjtNQUZ3QixDQUFaLENBQWQ7SUFEQyxDQUFBLEVBQUM7aUJBV0osT0FBTyxDQUFDLEdBQVIsQ0FBWSxRQUFaLENBQXFCLENBQUMsSUFBdEIsQ0FBMkIsUUFBQSxDQUFDLE1BQUQsQ0FBQTthQUN6QixJQUFBLENBQUE7SUFEeUIsQ0FBM0IsQ0FFQyxDQUFDLEtBRkYsQ0FFUSxRQUFBLENBQUMsS0FBRCxDQUFBO2FBQ04sT0FBTyxDQUFDLEdBQVIsQ0FBWSxTQUFaLEVBQXVCLEtBQXZCO0lBRE0sQ0FGUjtFQVpGLENBQUE7O0FBUjhCLENBQWhDLEVBeUJFLEtBekJGIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24oKXtmdW5jdGlvbiByKGUsbix0KXtmdW5jdGlvbiBvKGksZil7aWYoIW5baV0pe2lmKCFlW2ldKXt2YXIgYz1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlO2lmKCFmJiZjKXJldHVybiBjKGksITApO2lmKHUpcmV0dXJuIHUoaSwhMCk7dmFyIGE9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitpK1wiJ1wiKTt0aHJvdyBhLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsYX12YXIgcD1uW2ldPXtleHBvcnRzOnt9fTtlW2ldWzBdLmNhbGwocC5leHBvcnRzLGZ1bmN0aW9uKHIpe3ZhciBuPWVbaV1bMV1bcl07cmV0dXJuIG8obnx8cil9LHAscC5leHBvcnRzLHIsZSxuLHQpfXJldHVybiBuW2ldLmV4cG9ydHN9Zm9yKHZhciB1PVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmUsaT0wO2k8dC5sZW5ndGg7aSsrKW8odFtpXSk7cmV0dXJuIG99cmV0dXJuIHJ9KSgpIiwiVG91Y2hJbnRlcnByZXRlciA9IHJlcXVpcmUgJy4vVG91Y2hJbnRlcnByZXRlcidcclxuXHJcbmNsYXNzIEJHTUdhbWVTY2VuZSBleHRlbmRzIFBoYXNlci5TY2VuZVxyXG4gIGNvbnN0cnVjdG9yOiAtPlxyXG4gICAgc3VwZXIge1xyXG4gICAgICBrZXk6ICdnYW1lJ1xyXG4gICAgICBhY3RpdmU6IHRydWVcclxuICAgIH1cclxuXHJcbiAgICBAbXMgPSByZXF1aXJlICcuL01pbmVTd2VlcGVyJ1xyXG4gICAgQHRvdWNoID0gbmV3IFRvdWNoSW50ZXJwcmV0ZXJcclxuXHJcbiAgcHJlbG9hZDogLT5cclxuICAgIEBsb2FkLmltYWdlKCdibGFuaycsICdpbWFnZXMvYmxhbmsuZ2lmJylcclxuICAgIEBsb2FkLmltYWdlKCdmbGFnJywgJ2ltYWdlcy9ib21iZmxhZ2dlZC5naWYnKVxyXG4gICAgQGxvYWQuaW1hZ2UoJ2JvbWInLCAnaW1hZ2VzL2JvbWIwLmdpZicpXHJcbiAgICBAbG9hZC5pbWFnZSgnYm9tYmRlYXRoJywgJ2ltYWdlcy9ib21iZGVhdGguZ2lmJylcclxuICAgIEBsb2FkLmltYWdlKCdib21icmV2ZWFsZWQnLCAnaW1hZ2VzL2JvbWJyZXZlYWxlZC5naWYnKVxyXG4gICAgQGxvYWQuaW1hZ2UoJ2JvbWJtaXNmbGFnZ2VkJywgJ2ltYWdlcy9ib21ibWlzZmxhZ2dlZC5naWYnKVxyXG5cclxuICAgIEBsb2FkLmltYWdlKCdzaGFkb3cwJywgJ2ltYWdlcy9zaGFkb3cwLmdpZicpXHJcbiAgICBAbG9hZC5pbWFnZSgnc2hhZG93MScsICdpbWFnZXMvc2hhZG93MS5naWYnKVxyXG4gICAgQGxvYWQuaW1hZ2UoJ3NoYWRvdzInLCAnaW1hZ2VzL3NoYWRvdzIuZ2lmJylcclxuICAgIEBsb2FkLmltYWdlKCdzaGFkb3czJywgJ2ltYWdlcy9zaGFkb3czLmdpZicpXHJcbiAgICBAbG9hZC5pbWFnZSgnc2hhZG93NCcsICdpbWFnZXMvc2hhZG93NC5naWYnKVxyXG4gICAgQGxvYWQuaW1hZ2UoJ3NoYWRvdzUnLCAnaW1hZ2VzL3NoYWRvdzUuZ2lmJylcclxuICAgIEBsb2FkLmltYWdlKCdzaGFkb3c2JywgJ2ltYWdlcy9zaGFkb3c2LmdpZicpXHJcbiAgICBAbG9hZC5pbWFnZSgnc2hhZG93NycsICdpbWFnZXMvc2hhZG93Ny5naWYnKVxyXG4gICAgQGxvYWQuaW1hZ2UoJ3NoYWRvdzgnLCAnaW1hZ2VzL3NoYWRvdzguZ2lmJylcclxuXHJcbiAgICBAbG9hZC5pbWFnZSgnYm9tYjAnLCAnaW1hZ2VzL2JvbWIwLmdpZicpXHJcbiAgICBAbG9hZC5pbWFnZSgnYm9tYjEnLCAnaW1hZ2VzL2JvbWIxLmdpZicpXHJcbiAgICBAbG9hZC5pbWFnZSgnYm9tYjInLCAnaW1hZ2VzL2JvbWIyLmdpZicpXHJcbiAgICBAbG9hZC5pbWFnZSgnYm9tYjMnLCAnaW1hZ2VzL2JvbWIzLmdpZicpXHJcbiAgICBAbG9hZC5pbWFnZSgnYm9tYjQnLCAnaW1hZ2VzL2JvbWI0LmdpZicpXHJcbiAgICBAbG9hZC5pbWFnZSgnYm9tYjUnLCAnaW1hZ2VzL2JvbWI1LmdpZicpXHJcbiAgICBAbG9hZC5pbWFnZSgnYm9tYjYnLCAnaW1hZ2VzL2JvbWI2LmdpZicpXHJcbiAgICBAbG9hZC5pbWFnZSgnYm9tYjcnLCAnaW1hZ2VzL2JvbWI3LmdpZicpXHJcbiAgICBAbG9hZC5pbWFnZSgnYm9tYjgnLCAnaW1hZ2VzL2JvbWI4LmdpZicpXHJcblxyXG4gICAgQGxvYWQuaW1hZ2UoJ29wZW4wJywgJ2ltYWdlcy9vcGVuMC5naWYnKVxyXG4gICAgQGxvYWQuaW1hZ2UoJ29wZW4xJywgJ2ltYWdlcy9vcGVuMS5naWYnKVxyXG4gICAgQGxvYWQuaW1hZ2UoJ29wZW4yJywgJ2ltYWdlcy9vcGVuMi5naWYnKVxyXG4gICAgQGxvYWQuaW1hZ2UoJ29wZW4zJywgJ2ltYWdlcy9vcGVuMy5naWYnKVxyXG4gICAgQGxvYWQuaW1hZ2UoJ29wZW40JywgJ2ltYWdlcy9vcGVuNC5naWYnKVxyXG4gICAgQGxvYWQuaW1hZ2UoJ29wZW41JywgJ2ltYWdlcy9vcGVuNS5naWYnKVxyXG4gICAgQGxvYWQuaW1hZ2UoJ29wZW42JywgJ2ltYWdlcy9vcGVuNi5naWYnKVxyXG4gICAgQGxvYWQuaW1hZ2UoJ29wZW43JywgJ2ltYWdlcy9vcGVuNy5naWYnKVxyXG4gICAgQGxvYWQuaW1hZ2UoJ29wZW44JywgJ2ltYWdlcy9vcGVuOC5naWYnKVxyXG5cclxuICBjcmVhdGU6IC0+XHJcbiAgICBzcGxpdCA9IE1hdGguZmxvb3IoQGNhbWVyYXMubWFpbi53aWR0aCAqIDAuOSlcclxuICAgIEBjYW1lcmFzLm1haW4uc2V0Vmlld3BvcnQoMCwgMCwgc3BsaXQsIEBjYW1lcmFzLm1haW4uaGVpZ2h0KVxyXG5cclxuICAgIEBtcy5hZGRFdmVudExpc3RlbmVyKEBtc0V2ZW50LmJpbmQodGhpcykpXHJcbiAgICBAcmVjcmVhdGVEaXNwbGF5TGlzdCgpXHJcbiAgICBAbXMudXBkYXRlQWxsKClcclxuXHJcbiAgICBAdG91Y2guY3JlYXRlKHRoaXMsIEBjYW1lcmFzLm1haW4sIDAsIDAsIHNwbGl0LCBAY2FtZXJhcy5tYWluLmhlaWdodClcclxuXHJcbiAgbXNFdmVudDogKGV2LCBhcmdzKSAtPlxyXG4gICAgaWYgZXYgIT0gJ2NlbGwnXHJcbiAgICAgIGNvbnNvbGUubG9nIFwibXNFdmVudDogI3tldn06ICN7SlNPTi5zdHJpbmdpZnkoYXJncyl9XCJcclxuICAgIHN3aXRjaCBldlxyXG4gICAgICB3aGVuICduZXcnXHJcbiAgICAgICAgaWYgKEBtcy53aWR0aCAhPSBAZ3JpZENvbHMpIG9yIChAbXMuaGVpZ2h0ICE9IEBncmlkUm93cylcclxuICAgICAgICAgIEByZWNyZWF0ZURpc3BsYXlMaXN0KClcclxuICAgICAgd2hlbiAnY2VsbCdcclxuICAgICAgICBAZ3JpZFthcmdzWzBdXVthcmdzWzFdXS5zZXRUZXh0dXJlKGFyZ3NbMl0pXHJcbiAgICAgIHdoZW4gJ2xpZmUnXHJcbiAgICAgICAgZGVidWdUZXh0ID0gQHNjZW5lLmdldCgnaHVkJykuZGVidWdUZXh0XHJcbiAgICAgICAgaWYgZGVidWdUZXh0P1xyXG4gICAgICAgICAgZGVidWdUZXh0LnRleHQgPSBcIkFyZSB5b3Ugc3V1dXV1dXVyZT8gKCN7YXJnc1swXX0pXCJcclxuICAgICAgICBAY2FtZXJhcy5tYWluLnNoYWtlKDMwMCwgMC4wMDEpXHJcbiAgICAgIHdoZW4gJ21pbmVzJ1xyXG4gICAgICAgIG1pbmVzID0gQHNjZW5lLmdldCgnaHVkJykubWluZXNcclxuICAgICAgICBpZiBtaW5lcz9cclxuICAgICAgICAgIG1pbmVzLnRleHQgPSBcIiN7YXJnc1swXX0vI3thcmdzWzFdfVwiXHJcbiAgICAgIHdoZW4gJ2xpdmVzJ1xyXG4gICAgICAgIGxpdmVzID0gQHNjZW5lLmdldCgnaHVkJykubGl2ZXNcclxuICAgICAgICBpZiBsaXZlcz9cclxuICAgICAgICAgIGxpdmVzLnRleHQgPSBTdHJpbmcoYXJnc1swXSlcclxuXHJcbiAgdXBkYXRlOiAtPlxyXG5cclxuICByZWNyZWF0ZURpc3BsYXlMaXN0OiAtPlxyXG4gICAgY29uc29sZS5sb2cgXCJyZWNyZWF0ZURpc3BsYXlMaXN0KClcIlxyXG4gICAgQGFkZC5kaXNwbGF5TGlzdC5yZW1vdmVBbGwoKVxyXG5cclxuICAgIEBncmlkQ29scyA9IEBtcy53aWR0aFxyXG4gICAgQGdyaWRSb3dzID0gQG1zLmhlaWdodFxyXG4gICAgQGdyaWQgPSBuZXcgQXJyYXkoQGdyaWRDb2xzKVxyXG4gICAgZm9yIGkgaW4gWzAuLi5AZ3JpZENvbHNdXHJcbiAgICAgIEBncmlkW2ldID0gbmV3IEFycmF5KEBncmlkUm93cylcclxuICAgICAgZm9yIGogaW4gWzAuLi5AZ3JpZFJvd3NdXHJcbiAgICAgICAgQGdyaWRbaV1bal0gPSBAYWRkLmltYWdlKGkgKiAxNiwgaiAqIDE2LCAnYmxhbmsnKVxyXG4gICAgICAgIEBncmlkW2ldW2pdLnNldE9yaWdpbigwLCAwKVxyXG4gICAgQHJlc2V0VmlldygpXHJcblxyXG4gIGNlbnRlckdyaWQ6IC0+XHJcbiAgICB0b3RhbFcgPSBAZ3JpZENvbHMgKiAxNlxyXG4gICAgdG90YWxIID0gQGdyaWRSb3dzICogMTZcclxuICAgIEBjYW1lcmFzLm1haW4uc2Nyb2xsWCA9ICh0b3RhbFcgLSBAY2FtZXJhcy5tYWluLndpZHRoKSAvIDJcclxuICAgIEBjYW1lcmFzLm1haW4uc2Nyb2xsWSA9ICh0b3RhbEggLSBAY2FtZXJhcy5tYWluLmhlaWdodCkgLyAyXHJcblxyXG4gIHJlc2V0VmlldzogLT5cclxuICAgIEBjYW1lcmFzLm1haW4uem9vbSA9IDFcclxuICAgIEBjZW50ZXJHcmlkKClcclxuXHJcbiAgc2V0TW9kZTogKEBtb2RlKSAtPlxyXG4gICAgIyBjb25zb2xlLmxvZyBcIkdhbWUgTW9kZTogI3tAbW9kZX1cIlxyXG4gICAgaWYgQG1zLmdhbWVvdmVyXHJcbiAgICAgIEBtcy5uZXdHYW1lKClcclxuXHJcbiAgc2V0TWFnbmlmeWluZ0dsYXNzOiAoeCwgeSwgYWxwaGEpIC0+XHJcbiAgICBAc2NlbmUuZ2V0KCdodWQnKS5zZXRNYWduaWZ5aW5nR2xhc3MoeCwgeSwgYWxwaGEpXHJcblxyXG4gIHJtYjogKHdvcmxkWCwgd29ybGRZKSAtPlxyXG4gICAgQHNjZW5lLmdldCgnaHVkJykudG9nZ2xlTW9kZSgpXHJcbiAgICBAbXMuc2F2ZSgpXHJcblxyXG4gIHRhcDogKHdvcmxkWCwgd29ybGRZKSAtPlxyXG4gICAgQHNjZW5lLmdldCgnaHVkJykuZGVidWdUZXh0LnRleHQgPSBcIlwiXHJcblxyXG4gICAgaWYgQG1zLmdhbWVvdmVyXHJcbiAgICAgIGNvbnNvbGUubG9nIFwiZ2FtZSBpcyBvdmVyLCBkb2luZyBub3RoaW5nXCJcclxuICAgICAgcmV0dXJuXHJcblxyXG4gICAgaWYgKHdvcmxkWCA+PSAwKSBhbmQgKHdvcmxkWCA8IChAZ3JpZENvbHMgKiAxNikpIGFuZCAod29ybGRZID49IDApIGFuZCAod29ybGRZIDwgKEBncmlkUm93cyAqIDE2KSlcclxuICAgICAgeCA9IE1hdGguZmxvb3Iod29ybGRYIC8gMTYpXHJcbiAgICAgIHkgPSBNYXRoLmZsb29yKHdvcmxkWSAvIDE2KVxyXG4gICAgICBpZiBAbW9kZSA9PSAnZmxhZydcclxuICAgICAgICBAbXMuZmxhZyh4LCB5KVxyXG4gICAgICBlbHNlXHJcbiAgICAgICAgQG1zLnBva2UoeCwgeSlcclxuICAgICAgQG1zLnVwZGF0ZUFsbCgpXHJcblxyXG4gICAgQG1zLnNhdmUoKVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBCR01HYW1lU2NlbmVcclxuIiwiY2xhc3MgQkdNSHVkU2NlbmUgZXh0ZW5kcyBQaGFzZXIuU2NlbmVcclxuICBjb25zdHJ1Y3RvcjogLT5cclxuICAgIHN1cGVyIHtcclxuICAgICAga2V5OiAnaHVkJ1xyXG4gICAgICBhY3RpdmU6IHRydWVcclxuICAgIH1cclxuXHJcbiAgICBAbXMgPSByZXF1aXJlICcuL01pbmVTd2VlcGVyJ1xyXG5cclxuICBwcmVsb2FkOiAtPlxyXG4gICAgQGxvYWQuaW1hZ2UoJ2dsYXNzJywgJ2ltYWdlcy9nbGFzcy5naWYnKVxyXG4gICAgQGxvYWQuaW1hZ2UoJ2xpdmVzJywgJ2ltYWdlcy9saXZlcy5wbmcnKVxyXG4gICAgQGxvYWQuaW1hZ2UoJ21pbmVzJywgJ2ltYWdlcy9taW5lcy5wbmcnKVxyXG5cclxuICAgIEBsb2FkLmltYWdlKCdidG5fYm9tYicsICdpbWFnZXMvYnRuX2JvbWIucG5nJylcclxuICAgIEBsb2FkLmltYWdlKCdidG5fZmxhZycsICdpbWFnZXMvYnRuX2ZsYWcucG5nJylcclxuICAgIEBsb2FkLmltYWdlKCdidG5fbWVudScsICdpbWFnZXMvYnRuX21lbnUucG5nJylcclxuXHJcbiAgY3JlYXRlOiAtPlxyXG4gICAgQHcgPSBAY2FtZXJhcy5tYWluLndpZHRoXHJcbiAgICBAaCA9IEBjYW1lcmFzLm1haW4uaGVpZ2h0XHJcbiAgICBAZm9udHMgPVxyXG4gICAgICBtaW5lczpcclxuICAgICAgICBmb250RmFtaWx5OiAnRWFnbGUgTGFrZSdcclxuICAgICAgICBmb250U2l6ZTogXCIje01hdGguZmxvb3IoQGggLyAzMCl9cHhcIlxyXG4gICAgICAgIGNvbG9yOiAnI2ZmZidcclxuICAgICAgbGl2ZXM6XHJcbiAgICAgICAgZm9udEZhbWlseTogJ0VhZ2xlIExha2UnXHJcbiAgICAgICAgZm9udFNpemU6IFwiI3tNYXRoLmZsb29yKEBoIC8gMTYpfXB4XCJcclxuICAgICAgICBjb2xvcjogJyNmZmYnXHJcblxyXG4gICAgQHBhbmVsWCA9IE1hdGguZmxvb3IoQGNhbWVyYXMubWFpbi53aWR0aCAqIDAuOSlcclxuICAgIEBwYW5lbFkgPSAwXHJcbiAgICBAcGFuZWxXID0gQGNhbWVyYXMubWFpbi53aWR0aCAtIEBwYW5lbFhcclxuICAgIEBwYW5lbEggPSBAY2FtZXJhcy5tYWluLmhlaWdodFxyXG5cclxuICAgIEBwYW5lbEJhY2tncm91bmQgPSBAYWRkLmdyYXBoaWNzKClcclxuICAgIEBwYW5lbEJhY2tncm91bmQuZmlsbFN0eWxlKDB4MzMzMzMzLCAxKVxyXG4gICAgQHBhbmVsQmFja2dyb3VuZC5maWxsUmVjdChAcGFuZWxYLCBAcGFuZWxZLCBAcGFuZWxXLCBAcGFuZWxIKVxyXG4gICAgQHBhbmVsQmFja2dyb3VuZC5saW5lU3R5bGUoMSwgMHgwMDAwMDAsIDEuMClcclxuICAgIEBwYW5lbEJhY2tncm91bmQuc3Ryb2tlUmVjdChAcGFuZWxYLCBAcGFuZWxZLCBAcGFuZWxXLCBAcGFuZWxIKVxyXG5cclxuICAgIEBidXR0b25zID0ge31cclxuXHJcbiAgICBAYnV0dG9ucy5tb2RlID0gQGFkZC5pbWFnZShAcGFuZWxYICsgKEBwYW5lbFcgLyAyKSwgQHBhbmVsWSArIChAcGFuZWxIIC8gMiksICdidG5fYm9tYicpXHJcbiAgICBAYnV0dG9ucy5tb2RlLnNldERpc3BsYXlTaXplKEBwYW5lbFcgKiAwLjgsIEBwYW5lbFcgKiAwLjgpXHJcbiAgICBAYnV0dG9ucy5tb2RlLnNldEludGVyYWN0aXZlKClcclxuICAgIEBidXR0b25zLm1vZGUub24gJ3BvaW50ZXJkb3duJywgPT5cclxuICAgICAgQHRvZ2dsZU1vZGUoKVxyXG4gICAgQHRvZ2dsZU1vZGUoKVxyXG5cclxuICAgIEBidXR0b25zLm1lbnUgPSBAYWRkLmltYWdlKEBwYW5lbFggKyAoQHBhbmVsVyAvIDIpLCBAcGFuZWxZICsgKEBwYW5lbFcgKiAwLjUpLCAnYnRuX21lbnUnKVxyXG4gICAgQGJ1dHRvbnMubWVudS5zZXREaXNwbGF5U2l6ZShAcGFuZWxXICogMC44LCBAcGFuZWxXICogMC44KVxyXG4gICAgQGJ1dHRvbnMubWVudS5zZXRJbnRlcmFjdGl2ZSgpXHJcbiAgICBAYnV0dG9ucy5tZW51Lm9uICdwb2ludGVyZG93bicsID0+XHJcbiAgICAgIEBzY2VuZS5sYXVuY2goJ21lbnUnKVxyXG5cclxuICAgIEBtaW5lc0JhY2tncm91bmQgPSBAYWRkLmltYWdlKEBwYW5lbFggKyAoQHBhbmVsVyAvIDIpLCBAcGFuZWxZICsgKEBwYW5lbEggKiAwLjcpLCAnbWluZXMnKVxyXG4gICAgQG1pbmVzQmFja2dyb3VuZC5zZXREaXNwbGF5U2l6ZShAcGFuZWxXLCBAcGFuZWxXKVxyXG4gICAgQG1pbmVzID0gQGFkZC50ZXh0KEBwYW5lbFggKyAoQHBhbmVsVyAvIDIpLCBAcGFuZWxZICsgKEBwYW5lbEggKiAwLjczKSwgJ21pbmVzJywgQGZvbnRzLm1pbmVzKVxyXG4gICAgQG1pbmVzLnNldE9yaWdpbigwLjUpXHJcblxyXG4gICAgQGxpdmVzQmFja2dyb3VuZCA9IEBhZGQuaW1hZ2UoQHBhbmVsWCArIChAcGFuZWxXIC8gMiksIEBwYW5lbFkgKyAoQHBhbmVsSCAqIDAuOSksICdsaXZlcycpXHJcbiAgICBAbGl2ZXNCYWNrZ3JvdW5kLnNldERpc3BsYXlTaXplKEBwYW5lbFcgKiAwLjgsIEBwYW5lbFcgKiAwLjgpXHJcbiAgICBAbGl2ZXMgPSBAYWRkLnRleHQoQHBhbmVsWCArIChAcGFuZWxXIC8gMiksIEBwYW5lbFkgKyAoQHBhbmVsSCAqIDAuOSksICdsaXZlcycsIEBmb250cy5saXZlcylcclxuICAgIEBsaXZlcy5zZXRPcmlnaW4oMC41KVxyXG5cclxuICAgIEBkZWJ1Z1RleHQgPSBAYWRkLnRleHQoMCwgMCwgJycpXHJcbiAgICBAZ2xhc3MgPSBAYWRkLmltYWdlKDUwLCA1MCwgJ2dsYXNzJylcclxuICAgIEBnbGFzcy5zZXRPcmlnaW4oMC42LCAwLjMpICMgcm91Z2hseSB0aGUgbWlkZGxlIG9mIHRoZSBtYWduaWZ5aW5nIGdsYXNzXHJcbiAgICBAZ2xhc3MuYWxwaGEgPSAwXHJcblxyXG4gICAgQG1zLnVwZGF0ZUFsbCgpXHJcblxyXG4gIHRvZ2dsZU1vZGU6IC0+XHJcbiAgICBpZiBAbW9kZSA9PSAnYm9tYidcclxuICAgICAgQG1vZGUgPSAnZmxhZydcclxuICAgIGVsc2VcclxuICAgICAgQG1vZGUgPSAnYm9tYidcclxuXHJcbiAgICBAYnV0dG9ucy5tb2RlLnNldFRleHR1cmUoXCJidG5fI3tAbW9kZX1cIilcclxuICAgIEBzY2VuZS5nZXQoJ2dhbWUnKS5zZXRNb2RlKEBtb2RlKVxyXG5cclxuICB1cGRhdGU6IC0+XHJcblxyXG4gIHNldE1hZ25pZnlpbmdHbGFzczogKHgsIHksIGFscGhhKSAtPlxyXG4gICAgQGdsYXNzLnggPSB4XHJcbiAgICBAZ2xhc3MueSA9IHlcclxuICAgIEBnbGFzcy5hbHBoYSA9IGFscGhhXHJcblxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBCR01IdWRTY2VuZVxyXG4iLCJjbGFzcyBCR01NZW51U2NlbmUgZXh0ZW5kcyBQaGFzZXIuU2NlbmVcclxuICBjb25zdHJ1Y3RvcjogLT5cclxuICAgIHN1cGVyIHtcclxuICAgICAga2V5OiAnbWVudSdcclxuICAgICAgYWN0aXZlOiBmYWxzZVxyXG4gICAgfVxyXG5cclxuICAgIEBtcyA9IHJlcXVpcmUgJy4vTWluZVN3ZWVwZXInXHJcblxyXG4gIHByZWxvYWQ6IC0+XHJcblxyXG4gIGNyZWF0ZTogLT5cclxuICAgIEB3ID0gQGNhbWVyYXMubWFpbi53aWR0aFxyXG4gICAgQGggPSBAY2FtZXJhcy5tYWluLmhlaWdodFxyXG5cclxuICAgIEBmb250cyA9XHJcbiAgICAgIHRpdGxlOlxyXG4gICAgICAgIGZvbnRGYW1pbHk6ICdFYWdsZSBMYWtlJ1xyXG4gICAgICAgIGZvbnRTaXplOiBcIiN7TWF0aC5mbG9vcihAaCAvIDgpfXB4XCJcclxuICAgICAgICBjb2xvcjogJyNmZmYnXHJcbiAgICAgIGJ1dHRvbjpcclxuICAgICAgICBmb250RmFtaWx5OiAnRWFnbGUgTGFrZSdcclxuICAgICAgICBmb250U2l6ZTogXCIje01hdGguZmxvb3IoQGggLyAxMil9cHhcIlxyXG4gICAgICAgIGNvbG9yOiAnI2ZmZidcclxuXHJcbiAgICBAcGFuZWxCYWNrZ3JvdW5kID0gQGFkZC5ncmFwaGljcygpXHJcbiAgICBAcGFuZWxCYWNrZ3JvdW5kLmZpbGxTdHlsZSgweDMzMDAzMywgMSlcclxuICAgIEBwYW5lbEJhY2tncm91bmQuZmlsbFJlY3QoMCwgMCwgQHcsIEBoKVxyXG4gICAgQHBhbmVsQmFja2dyb3VuZC5zZXRJbnRlcmFjdGl2ZShuZXcgUGhhc2VyLkdlb20uUmVjdGFuZ2xlKDAsIDAsIEB3LCBAaCksIFBoYXNlci5HZW9tLlJlY3RhbmdsZS5Db250YWlucyk7XHJcblxyXG4gICAgQHRpdGxlID0gQGFkZC50ZXh0KEB3IC8gMiwgQGggLyAyMCwgJ0JhZCBHdXkgTWluZXN3ZWVwZXInLCBAZm9udHMudGl0bGUpXHJcbiAgICBAdGl0bGUuc2V0T3JpZ2luKDAuNSwgMC4wKVxyXG5cclxuICAgIEBuZXh0QnV0dG9uSW5kZXggPSAwXHJcbiAgICBAYWRkQnV0dG9uIFwiQmVnaW5uZXJcIiwgPT5cclxuICAgICAgQG5ld0dhbWUoOCwgOCwgMTApXHJcbiAgICBAYWRkQnV0dG9uIFwiSW50ZXJtZWRpYXRlXCIsID0+XHJcbiAgICAgIEBuZXdHYW1lKDE2LCAxNiwgNDApXHJcbiAgICBAYWRkQnV0dG9uIFwiRXhwZXJ0XCIsID0+XHJcbiAgICAgIEBuZXdHYW1lKDMwLCAxNiwgOTkpXHJcbiAgICBAYWRkQnV0dG9uIFwiSHVnZVwiLCA9PlxyXG4gICAgICBAbmV3R2FtZSg1MCwgMzAsIDApXHJcblxyXG4gICAgQG5leHRCdXR0b25JbmRleCArPSAxXHJcbiAgICBAYWRkQnV0dG9uIFwiUmVzdW1lXCIsID0+XHJcbiAgICAgIEBzY2VuZS5zbGVlcCgnbWVudScpXHJcblxyXG4gIGFkZEJ1dHRvbjogKHRleHQsIGNiKSAtPlxyXG4gICAgYnV0dG9uSW5kZXggPSBAbmV4dEJ1dHRvbkluZGV4XHJcbiAgICBAbmV4dEJ1dHRvbkluZGV4ICs9IDFcclxuXHJcbiAgICBidXR0b25XID0gTWF0aC5mbG9vcihAdyAvIDIpXHJcbiAgICBidXR0b25IID0gTWF0aC5mbG9vcihAaCAvIDEwKVxyXG4gICAgYnV0dG9uTWFyZ2luID0gTWF0aC5mbG9vcihidXR0b25IIC8gNClcclxuICAgIGJ1dHRvblggPSAoQHcgLyAyKVxyXG4gICAgYnV0dG9uWSA9IChAaCAvIDMuNSkgKyAoYnV0dG9uSW5kZXggKiAoYnV0dG9uSCArIGJ1dHRvbk1hcmdpbikpXHJcbiAgICBjZW50ZXJPZmZzZXRYID0gKGJ1dHRvblcgLyAyKVxyXG4gICAgY2VudGVyT2Zmc2V0WSA9IChidXR0b25IIC8gMilcclxuXHJcbiAgICBidXR0b24gPSBAYWRkLmdyYXBoaWNzKClcclxuICAgIGJ1dHRvbi5maWxsU3R5bGUoMHgzMzAwMzMsIDEpXHJcbiAgICBidXR0b24uZmlsbFJlY3QoYnV0dG9uWCAtIGNlbnRlck9mZnNldFgsIGJ1dHRvblkgLSBjZW50ZXJPZmZzZXRZLCBidXR0b25XLCBidXR0b25IKVxyXG4gICAgYnV0dG9uLnNldEludGVyYWN0aXZlKG5ldyBQaGFzZXIuR2VvbS5SZWN0YW5nbGUoYnV0dG9uWCAtIGNlbnRlck9mZnNldFgsIGJ1dHRvblkgLSBjZW50ZXJPZmZzZXRZLCBidXR0b25XLCBidXR0b25IKSwgUGhhc2VyLkdlb20uUmVjdGFuZ2xlLkNvbnRhaW5zKTtcclxuICAgIHRleHQgPSBAYWRkLnRleHQoYnV0dG9uWCwgYnV0dG9uWSwgdGV4dCwgQGZvbnRzLmJ1dHRvbilcclxuICAgIHRleHQuc2V0T3JpZ2luKDAuNSlcclxuICAgIGJ1dHRvbi5vbiAncG9pbnRlcmRvd24nLCAtPlxyXG4gICAgICBjYigpXHJcblxyXG4gIG5ld0dhbWU6ICh3LCBoLCBtKSAtPlxyXG4gICAgQG1zLm5ld0dhbWUodywgaCwgbSlcclxuICAgIEBzY2VuZS5zbGVlcCgnbWVudScpXHJcblxyXG4gIHVwZGF0ZTogLT5cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gQkdNTWVudVNjZW5lXHJcbiIsInByb3BzVG9TYXZlID0gW1xyXG4gICdzZWVkJ1xyXG4gICd3aWR0aCdcclxuICAnaGVpZ2h0J1xyXG4gICdib21iJ1xyXG4gICd2aXNpYmxlJ1xyXG4gICdsaXZlcydcclxuICAnbWluZUNvdW50J1xyXG4gICdnYW1lb3ZlcidcclxuXVxyXG5cclxuY2xhc3MgTWluZVN3ZWVwZXJcclxuICBjb25zdHJ1Y3RvcjogLT5cclxuICAgIEBsaXN0ZW5lcnMgPSBbXVxyXG4gICAgaWYgbm90IEBsb2FkKClcclxuICAgICAgQG5ld0dhbWUoKVxyXG5cclxuICBsb2FkOiAtPlxyXG4gICAgcmF3RGF0YSA9IGxvY2FsU3RvcmFnZS5nZXRJdGVtKFwic2F2ZVwiKVxyXG4gICAgaWYgbm90IHJhd0RhdGE/XHJcbiAgICAgIHJldHVybiBmYWxzZVxyXG4gICAgdHJ5XHJcbiAgICAgIGRhdGEgPSBKU09OLnBhcnNlKHJhd0RhdGEpXHJcbiAgICBjYXRjaFxyXG4gICAgICBkYXRhID0gbnVsbFxyXG5cclxuICAgIGlmIG5vdCBkYXRhP1xyXG4gICAgICByZXR1cm4gZmFsc2VcclxuXHJcbiAgICBmb3IgcCBpbiBwcm9wc1RvU2F2ZVxyXG4gICAgICBpZiBub3QgZGF0YS5oYXNPd25Qcm9wZXJ0eShwKVxyXG4gICAgICAgIHJldHVybiBmYWxzZVxyXG5cclxuICAgIGZvciBwIGluIHByb3BzVG9TYXZlXHJcbiAgICAgIHRoaXNbcF0gPSBkYXRhW3BdXHJcbiAgICByZXR1cm4gdHJ1ZVxyXG5cclxuICBzYXZlOiAtPlxyXG4gICAgZGF0YSA9IHt9XHJcbiAgICBmb3IgcCBpbiBwcm9wc1RvU2F2ZVxyXG4gICAgICBkYXRhW3BdID0gdGhpc1twXVxyXG4gICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oXCJzYXZlXCIsIEpTT04uc3RyaW5naWZ5KGRhdGEpKVxyXG5cclxuICBhZGRFdmVudExpc3RlbmVyOiAoZXZsKSAtPlxyXG4gICAgQGxpc3RlbmVycy5wdXNoKGV2bClcclxuXHJcbiAgcmFuZDogKHgpIC0+XHJcbiAgICByZXR1cm4gTWF0aC5mbG9vcihNYXRoLmJnbXJhbmRvbSgpICogeClcclxuXHJcbiAgbmVpZ2hib3JzOiAoaSwgaiwgdW5mbGFnZ2VkT25seSkgLT5cclxuICAgIG4gPSAwXHJcbiAgICB4MSA9IE1hdGgubWF4KGkgLSAxLCAwKVxyXG4gICAgeDIgPSBNYXRoLm1pbihAd2lkdGggLSAxLCBpICsgMSlcclxuICAgIHkxID0gTWF0aC5tYXgoaiAtIDEsIDApXHJcbiAgICB5MiA9IE1hdGgubWluKEBoZWlnaHQgLSAxLCBqICsgMSlcclxuICAgIHggPSB4MVxyXG4gICAgd2hpbGUgeCA8PSB4MlxyXG4gICAgICB5ID0geTFcclxuICAgICAgd2hpbGUgeSA8PSB5MlxyXG4gICAgICAgIGlmIHggIT0gaSBvciB5ICE9IGpcclxuICAgICAgICAgIGlmICF1bmZsYWdnZWRPbmx5IG9yIChAdmlzaWJsZVt4ICsgeSAqIEB3aWR0aF0gPT0gMClcclxuICAgICAgICAgICAgaWYgQGJvbWJbeCArIHkgKiBAd2lkdGhdID09IDFcclxuICAgICAgICAgICAgICArK25cclxuICAgICAgICArK3lcclxuICAgICAgKyt4XHJcbiAgICByZXR1cm4gblxyXG5cclxuICBoYXNWaXNpYmxlWmVyb05laWdoYm9yOiAoaSwgaikgLT5cclxuICAgIHgxID0gTWF0aC5tYXgoaSAtIDEsIDApXHJcbiAgICB4MiA9IE1hdGgubWluKEB3aWR0aCAtIDEsIGkgKyAxKVxyXG4gICAgeTEgPSBNYXRoLm1heChqIC0gMSwgMClcclxuICAgIHkyID0gTWF0aC5taW4oQGhlaWdodCAtIDEsIGogKyAxKVxyXG4gICAgeCA9IHgxXHJcbiAgICB3aGlsZSB4IDw9IHgyXHJcbiAgICAgIHkgPSB5MVxyXG4gICAgICB3aGlsZSB5IDw9IHkyXHJcbiAgICAgICAgaWYgeCAhPSBpIG9yIHkgIT0galxyXG4gICAgICAgICAgaWYgQHZpc2libGVbeCArIHkgKiBAd2lkdGhdICE9IDBcclxuICAgICAgICAgICAgbiA9IEBuZWlnaGJvcnMoeCwgeSwgZmFsc2UpXHJcbiAgICAgICAgICAgIGlmIG4gPT0gMFxyXG4gICAgICAgICAgICAgIHJldHVybiB0cnVlXHJcbiAgICAgICAgKyt5XHJcbiAgICAgICsreFxyXG4gICAgcmV0dXJuIGZhbHNlXHJcblxyXG4gIGxvc2VMaWZlOiAtPlxyXG4gICAgQGxpdmVzIC09IDFcclxuICAgIGlmIEBsaXZlcyA+IDBcclxuICAgICAgZm9yIGV2bCBpbiBAbGlzdGVuZXJzXHJcbiAgICAgICAgZXZsKCdsaWZlJywgW0BsaXZlc10pXHJcbiAgICAgIHJldHVybiBmYWxzZVxyXG4gICAgcmV0dXJuIHRydWVcclxuXHJcbiAgdXBkYXRlQ2VsbDogKGksIGosIHJldmVhbCkgLT5cclxuICAgIGltYWdlID0gJ2JsYW5rJ1xyXG4gICAgaW5kZXggPSBpICsgaiAqIEB3aWR0aFxyXG4gICAgaXNCb21iID0gQGJvbWJbaW5kZXhdXHJcbiAgICBpc1Zpc2libGUgPSBAdmlzaWJsZVtpbmRleF1cclxuICAgIG4gPSBAbmVpZ2hib3JzKGksIGosIGZhbHNlKVxyXG4gICAgaWYgaXNWaXNpYmxlID09IDBcclxuICAgICAgaWYgcmV2ZWFsXHJcbiAgICAgICAgaWYgaXNCb21iID09IDFcclxuICAgICAgICAgIGltYWdlID0gJ2JvbWJyZXZlYWxlZCdcclxuICAgICAgICBlbHNlXHJcbiAgICAgICAgICBpbWFnZSA9ICdzaGFkb3cnICsgblxyXG4gICAgICBlbHNlXHJcbiAgICAgICAgaW1hZ2UgPSAnYmxhbmsnXHJcbiAgICBlbHNlXHJcbiAgICAgIGlmIGlzQm9tYiA9PSAxXHJcbiAgICAgICAgaWYgaXNWaXNpYmxlID09IDJcclxuICAgICAgICAgIGltYWdlID0gJ2JvbWJkZWF0aCdcclxuICAgICAgICBlbHNlXHJcbiAgICAgICAgICB1bmZsYWdnZWQgPSBAbmVpZ2hib3JzKGksIGosIHRydWUpXHJcbiAgICAgICAgICBpZiB1bmZsYWdnZWQgPT0gMFxyXG4gICAgICAgICAgICBuID0gMFxyXG4gICAgICAgICAgaW1hZ2UgPSAnYm9tYicgKyBuXHJcbiAgICAgIGVsc2VcclxuICAgICAgICBpZiBpc1Zpc2libGUgPT0gMlxyXG4gICAgICAgICAgaW1hZ2UgPSAnYm9tYm1pc2ZsYWdnZWQnXHJcbiAgICAgICAgZWxzZVxyXG4gICAgICAgICAgaW1hZ2UgPSAnb3BlbicgKyBuXHJcbiAgICBmb3IgZXZsIGluIEBsaXN0ZW5lcnNcclxuICAgICAgZXZsKCdjZWxsJywgW2ksIGosIGltYWdlXSlcclxuICAgIHJldHVyblxyXG5cclxuICB1cGRhdGVBbGw6IChyZXZlYWwgPSBmYWxzZSkgLT5cclxuICAgIGlmIEBsaXN0ZW5lcnMubGVuZ3RoID09IDBcclxuICAgICAgcmV0dXJuXHJcblxyXG4gICAga2VlcEdvaW5nID0gdHJ1ZVxyXG4gICAgd2hpbGUga2VlcEdvaW5nXHJcbiAgICAgIGtlZXBHb2luZyA9IGZhbHNlXHJcbiAgICAgIGZvciBqIGluIFswLi4uQGhlaWdodF1cclxuICAgICAgICBmb3IgaSBpbiBbMC4uLkB3aWR0aF1cclxuICAgICAgICAgIGlmIChAYm9tYltpICsgaiAqIEB3aWR0aF0gPT0gMCkgYW5kIEBoYXNWaXNpYmxlWmVyb05laWdoYm9yKGksIGopXHJcbiAgICAgICAgICAgIGlmIEBwb2tlKGksIGopXHJcbiAgICAgICAgICAgICAga2VlcEdvaW5nID0gdHJ1ZVxyXG5cclxuICAgIHdvbiA9IHRydWVcclxuICAgIGlmIEBnYW1lb3ZlclxyXG4gICAgICB3b24gPSBmYWxzZVxyXG5cclxuICAgIHZpc2libGVNaW5lcyA9IDBcclxuXHJcbiAgICBmb3IgaiBpbiBbMC4uLkBoZWlnaHRdXHJcbiAgICAgIGZvciBpIGluIFswLi4uQHdpZHRoXVxyXG4gICAgICAgIGluZGV4ID0gaSArIGogKiBAd2lkdGhcclxuICAgICAgICBpZiBAdmlzaWJsZVtpbmRleF0gPT0gMFxyXG4gICAgICAgICAgd29uID0gZmFsc2VcclxuICAgICAgICBlbHNlIGlmIEBib21iW2luZGV4XSA9PSAxXHJcbiAgICAgICAgICB2aXNpYmxlTWluZXMgKz0gMVxyXG4gICAgICAgIEB1cGRhdGVDZWxsKGksIGosIHJldmVhbClcclxuICAgIGlmIHdvblxyXG4gICAgICBAZ2FtZW92ZXIgPSB0cnVlXHJcbiAgICAgIGZvciBldmwgaW4gQGxpc3RlbmVyc1xyXG4gICAgICAgIGV2bCgnd2luJywgW10pXHJcbiAgICBmb3IgZXZsIGluIEBsaXN0ZW5lcnNcclxuICAgICAgZXZsKCdtaW5lcycsIFt2aXNpYmxlTWluZXMsIEBtaW5lQ291bnRdKVxyXG4gICAgICBldmwoJ2xpdmVzJywgW0BsaXZlc10pXHJcbiAgICByZXR1cm5cclxuXHJcbiAgZmxhZzogKGksIGopIC0+XHJcbiAgICBpbmRleCA9IGkgKyBqICogQHdpZHRoXHJcbiAgICBpZiBAdmlzaWJsZVtpbmRleF0gPT0gMFxyXG4gICAgICBpZiBAYm9tYltpbmRleF0gPT0gMVxyXG4gICAgICAgICNib21iW2luZGV4XSA9IDA7XHJcbiAgICAgICAgI3Bva2UoaSwgaik7XHJcbiAgICAgICAgQHZpc2libGVbaW5kZXhdID0gMVxyXG4gICAgICBlbHNlXHJcbiAgICAgICAgIyBCYWQgZmxhZzsgbG9zZSB0aGUgZ2FtZVxyXG4gICAgICAgIGlmIEBsb3NlTGlmZSgpXHJcbiAgICAgICAgICBAdmlzaWJsZVtpbmRleF0gPSAyXHJcbiAgICAgICAgICBAZ2FtZW92ZXIgPSB0cnVlXHJcbiAgICAgICAgICBAdXBkYXRlQWxsKHRydWUpXHJcbiAgICAgICAgICBmb3IgZXZsIGluIEBsaXN0ZW5lcnNcclxuICAgICAgICAgICAgZXZsKCdsb3NlJywgW10pXHJcbiAgICAgICAgICByZXR1cm5cclxuICAgIHJldHVyblxyXG5cclxuICBwb2tlOiAoaSwgaikgLT5cclxuICAgIHJldCA9IGZhbHNlXHJcbiAgICBpbmRleCA9IGkgKyBqICogQHdpZHRoXHJcbiAgICBpZiBAdmlzaWJsZVtpbmRleF0gPT0gMFxyXG4gICAgICBpZiBAYm9tYltpbmRleF0gPT0gMVxyXG4gICAgICAgICMgQmFkIHNwb3Q7IGxvc2UgdGhlIGdhbWVcclxuICAgICAgICBpZiBAbG9zZUxpZmUoKVxyXG4gICAgICAgICAgQHZpc2libGVbaW5kZXhdID0gMlxyXG4gICAgICAgICAgQGdhbWVvdmVyID0gdHJ1ZVxyXG4gICAgICAgICAgQHVwZGF0ZUFsbCh0cnVlKVxyXG4gICAgICAgICAgZm9yIGV2bCBpbiBAbGlzdGVuZXJzXHJcbiAgICAgICAgICAgIGV2bCgnbG9zZScsIFtdKVxyXG4gICAgICAgICAgcmV0dXJuIGZhbHNlXHJcbiAgICAgICAgZWxzZVxyXG4gICAgICAgICAgcmV0dXJuIGZhbHNlXHJcbiAgICAgIEB2aXNpYmxlW2luZGV4XSA9IDFcclxuICAgICAgcmV0ID0gdHJ1ZVxyXG4gICAgcmV0dXJuIHJldFxyXG5cclxuICBmaXJzdENsaWNrSXNGcmVlOiAtPlxyXG4gICAgY2VsbENvdW50ID0gQHdpZHRoICogQGhlaWdodFxyXG4gICAgc3RhcnRJbmRleCA9IEByYW5kKGNlbGxDb3VudClcclxuICAgIGluZGV4ID0gc3RhcnRJbmRleFxyXG4gICAgbG9vcFxyXG4gICAgICBpID0gTWF0aC5mbG9vcihpbmRleCAlIEB3aWR0aClcclxuICAgICAgaiA9XHJcbiAgICAgICAgTWF0aC5mbG9vcihpbmRleCAvIEB3aWR0aClcclxuICAgICAgbiA9IEBuZWlnaGJvcnMoaSwgaiwgZmFsc2UpXHJcbiAgICAgIGlmIEBib21iW2luZGV4XSA9PSAwIGFuZCBuID09IDBcclxuICAgICAgICBAcG9rZShpLCBqKVxyXG4gICAgICAgIHJldHVyblxyXG4gICAgICBpbmRleCA9IChpbmRleCArIDEpICUgY2VsbENvdW50XHJcbiAgICAgIGlmIGluZGV4ID09IHN0YXJ0SW5kZXhcclxuICAgICAgICBicmVha1xyXG4gICAgbG9vcFxyXG4gICAgICBpID0gTWF0aC5mbG9vcihpbmRleCAlIEB3aWR0aClcclxuICAgICAgaiA9IE1hdGguZmxvb3IoaW5kZXggLyBAd2lkdGgpXHJcbiAgICAgIG4gPSBuZWlnaGJvcnMoaSwgaiwgZmFsc2UpXHJcbiAgICAgIGlmIEBib21iW2luZGV4XSA9PSAwXHJcbiAgICAgICAgQHBva2UoaSwgailcclxuICAgICAgICByZXR1cm5cclxuICAgICAgaW5kZXggPSAoaW5kZXggKyAxKSAlIGNlbGxDb3VudFxyXG4gICAgICBpZiBpbmRleCA9PSBzdGFydEluZGV4XHJcbiAgICAgICAgYnJlYWtcclxuICAgIHJldHVyblxyXG5cclxuICBuZXdHYW1lOiAoQHdpZHRoID0gMTYsIEBoZWlnaHQgPSAxNiwgQG1pbmVDb3VudCA9IDAsIEBzZWVkID0gU3RyaW5nKE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIDEwMDAwMDApKSkgLT5cclxuICAgIE1hdGguc2VlZGJnbXJhbmRvbShAc2VlZClcclxuXHJcbiAgICBAbGl2ZXMgPSAzXHJcblxyXG4gICAgY2VsbENvdW50ID0gQHdpZHRoICogQGhlaWdodFxyXG4gICAgaWYgQG1pbmVDb3VudCA9PSAwXHJcbiAgICAgIE1JTkVfREVOU0lUWSA9IDAuMTZcclxuICAgICAgQG1pbmVDb3VudCA9IE1hdGguZmxvb3IoY2VsbENvdW50ICogTUlORV9ERU5TSVRZKVxyXG5cclxuICAgIEBnYW1lb3ZlciA9IGZhbHNlXHJcblxyXG4gICAgIyBDcmVhdGUgZnJlc2ggYXJyYXlzXHJcbiAgICBAYm9tYiA9IG5ldyBBcnJheShjZWxsQ291bnQpLmZpbGwoMClcclxuICAgIEB2aXNpYmxlID0gbmV3IEFycmF5KGNlbGxDb3VudCkuZmlsbCgwKVxyXG5cclxuICAgICMgRHJvcCBpbiB0aGUgbWluZXMgcmFuZG9tbHlcclxuICAgIGluZGljZXMgPSBuZXcgQXJyYXkoY2VsbENvdW50KVxyXG4gICAgaW5kaWNlc1swXSA9IDBcclxuICAgIGkgPSAxXHJcbiAgICB3aGlsZSBpIDwgY2VsbENvdW50XHJcbiAgICAgIGogPSBAcmFuZChpKVxyXG4gICAgICBpbmRpY2VzW2ldID0gaW5kaWNlc1tqXVxyXG4gICAgICBpbmRpY2VzW2pdID0gaVxyXG4gICAgICArK2lcclxuICAgIG0gPSBAbWluZUNvdW50XHJcbiAgICBpZiBtID49IGNlbGxDb3VudFxyXG4gICAgICBtID0gY2VsbENvdW50IC0gMVxyXG4gICAgaSA9IDBcclxuICAgIHdoaWxlIGkgPCBtXHJcbiAgICAgIEBib21iW2luZGljZXNbaV1dID0gMVxyXG4gICAgICArK2lcclxuICAgIEBmaXJzdENsaWNrSXNGcmVlKClcclxuICAgIGZvciBldmwgaW4gQGxpc3RlbmVyc1xyXG4gICAgICBldmwoJ25ldycsIFtdKVxyXG4gICAgQHVwZGF0ZUFsbCgpXHJcbiAgICBAc2F2ZSgpXHJcbiAgICByZXR1cm5cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gbmV3IE1pbmVTd2VlcGVyICMgU2luZ2xldG9uXHJcbiIsIkVOR0FHRV9EUkFHX0RJU1RBTkNFID0gMTBcclxuRE9VQkxFX0NMSUNLX01TID0gNDAwXHJcblxyXG5jbGFzcyBUb3VjaEludGVycHJldGVyXHJcbiAgY29uc3RydWN0b3I6IC0+XHJcbiAgICBAdHJhY2tlZCA9IFtdXHJcbiAgICBAZHJhZ1ggPSAwXHJcbiAgICBAZHJhZ1kgPSAwXHJcbiAgICBAZHJhZ2dpbmcgPSBmYWxzZVxyXG4gICAgQGRvdWJsZUNsaWNrVGltZSA9IG51bGxcclxuICAgIEBwaW5jaEFuY2hvciA9IG51bGxcclxuICAgIEBwaW5jaEFuY2hvcldvcmxkID0gbnVsbFxyXG5cclxuICBjcmVhdGU6IChAc2NlbmUsIEBjYW1lcmEsIEB4LCBAeSwgQHcsIEBoKSAtPlxyXG4gICAgQGNhbWVyYS56b29tID0gMVxyXG4gICAgQHNjZW5lLmlucHV0LmFkZFBvaW50ZXIoMSlcclxuICAgIEBzY2VuZS5pbnB1dC5tb3VzZS5kaXNhYmxlQ29udGV4dE1lbnUoKVxyXG5cclxuICAgIEBzY2VuZS5pbnB1dC5vbiAncG9pbnRlcmRvd24nLCAocG9pbnRlcikgPT5cclxuICAgICAgaWYgcG9pbnRlci5yaWdodEJ1dHRvbkRvd24oKVxyXG4gICAgICAgIHdvcmxkUG9zID0gQGNhbWVyYS5nZXRXb3JsZFBvaW50KHBvaW50ZXIucG9zaXRpb24ueCwgcG9pbnRlci5wb3NpdGlvbi55KVxyXG4gICAgICAgIEBzY2VuZS5ybWIod29ybGRQb3MueCwgd29ybGRQb3MueSlcclxuICAgICAgICByZXR1cm5cclxuXHJcbiAgICAgIGlmIHBvaW50ZXIucG9zaXRpb24ueCA+IChAeCArIEB3KVxyXG4gICAgICAgIHJldHVyblxyXG5cclxuICAgICAgaWYgQHRyYWNrZWQubGVuZ3RoID09IDBcclxuICAgICAgICBAZHJhZ2dpbmcgPSBmYWxzZVxyXG5cclxuICAgICAgIyBjb25zb2xlLmxvZyBcIm5ldyBwb2ludGVyICN7cG9pbnRlci5pZH1cIlxyXG4gICAgICBAdHJhY2tlZC5wdXNoIHtcclxuICAgICAgICBpZDogcG9pbnRlci5pZFxyXG4gICAgICAgIHBvczogcG9pbnRlci5wb3NpdGlvbi5jbG9uZSgpXHJcbiAgICAgIH1cclxuICAgICAgaWYgQHRyYWNrZWQubGVuZ3RoID09IDFcclxuICAgICAgICBAc2V0RHJhZ1BvaW50KClcclxuICAgICAgaWYgQHRyYWNrZWQubGVuZ3RoID09IDJcclxuICAgICAgICAjIFdlIGp1c3QgYWRkZWQgYSBzZWNvbmQgdG91Y2ggc3BvdC4gQ2FsY3VsYXRlIHRoZSBhbmNob3IgZm9yIHBpbmNoaW5nIG5vd1xyXG4gICAgICAgIEBjYWxjUGluY2hBbmNob3IoKVxyXG5cclxuICAgICAgaWYgQHRyYWNrZWQubGVuZ3RoID4gMVxyXG4gICAgICAgIEBkcmFnZ2luZyA9IHRydWVcclxuICAgICAgICBAZG91YmxlQ2xpY2tUaW1lID0gbnVsbFxyXG4gICAgICBlbHNlIGlmIG5vdCBAZHJhZ2dpbmdcclxuICAgICAgICBub3cgPSBuZXcgRGF0ZSgpLmdldFRpbWUoKVxyXG4gICAgICAgIGlmIEBkb3VibGVDbGlja1RpbWUgIT0gbnVsbFxyXG4gICAgICAgICAgIyBzZWNvbmQgY2xpY2tcclxuICAgICAgICAgIGNsaWNrRGVsdGEgPSBub3cgLSBAZG91YmxlQ2xpY2tUaW1lXHJcbiAgICAgICAgICBpZiBjbGlja0RlbHRhIDwgRE9VQkxFX0NMSUNLX01TXHJcbiAgICAgICAgICAgIEBkb3VibGVDbGlja1RpbWUgPSBudWxsXHJcbiAgICAgICAgICAgICMgY29uc29sZS5sb2cgXCJET1VCTEUgVEFQICN7QHRyYWNrZWRbMF0ucG9zLnh9ICN7QHRyYWNrZWRbMF0ucG9zLnl9XCJcclxuICAgICAgICAgICAgcmV0dXJuXHJcbiAgICAgICAgQGRvdWJsZUNsaWNrVGltZSA9IG5vd1xyXG5cclxuICAgIEBzY2VuZS5pbnB1dC5vbiAncG9pbnRlcm1vdmUnLCAocG9pbnRlcikgPT5cclxuICAgICAgcHJldkRpc3RhbmNlID0gMFxyXG4gICAgICBpZiBAdHJhY2tlZC5sZW5ndGggPj0gMlxyXG4gICAgICAgIHByZXZEaXN0YW5jZSA9IEBjYWxjRGlzdGFuY2UoQHRyYWNrZWRbMF0ucG9zLngsIEB0cmFja2VkWzBdLnBvcy55LCBAdHJhY2tlZFsxXS5wb3MueCwgQHRyYWNrZWRbMV0ucG9zLnkpXHJcbiAgICAgIGlmIEB0cmFja2VkLmxlbmd0aCA9PSAxXHJcbiAgICAgICAgcHJldlggPSBAdHJhY2tlZFswXS5wb3MueFxyXG4gICAgICAgIHByZXZZID0gQHRyYWNrZWRbMF0ucG9zLnlcclxuXHJcbiAgICAgIGluZGV4ID0gLTFcclxuICAgICAgZm9yIGkgaW4gWzAuLi5AdHJhY2tlZC5sZW5ndGhdXHJcbiAgICAgICAgaWYgQHRyYWNrZWRbaV0uaWQgPT0gcG9pbnRlci5pZFxyXG4gICAgICAgICAgaW5kZXggPSBpXHJcbiAgICAgICAgICBicmVha1xyXG4gICAgICBpZiBpbmRleCA9PSAtMVxyXG4gICAgICAgIHJldHVyblxyXG5cclxuICAgICAgQHRyYWNrZWRbaW5kZXhdLnBvcyA9IHBvaW50ZXIucG9zaXRpb24uY2xvbmUoKVxyXG5cclxuICAgICAgaWYgQHRyYWNrZWQubGVuZ3RoID09IDFcclxuICAgICAgICAjIHNpbmdsZSB0b3VjaCwgY29uc2lkZXIgZHJhZ2dpbmdcclxuICAgICAgICBkcmFnRGlzdGFuY2UgPSBAY2FsY0Rpc3RhbmNlIEBkcmFnWCwgQGRyYWdZLCBAdHJhY2tlZFswXS5wb3MueCwgQHRyYWNrZWRbMF0ucG9zLnlcclxuICAgICAgICBpZiBAZHJhZ2dpbmcgb3IgKGRyYWdEaXN0YW5jZSA+IEVOR0FHRV9EUkFHX0RJU1RBTkNFKVxyXG4gICAgICAgICAgQGRyYWdnaW5nID0gdHJ1ZVxyXG4gICAgICAgICAgaWYgZHJhZ0Rpc3RhbmNlID4gMC41XHJcbiAgICAgICAgICAgIGR4ID0gQHRyYWNrZWRbMF0ucG9zLnggLSBAZHJhZ1hcclxuICAgICAgICAgICAgZHkgPSBAdHJhY2tlZFswXS5wb3MueSAtIEBkcmFnWVxyXG4gICAgICAgICAgICAjIGNvbnNvbGUubG9nIFwic2luZ2xlIGRyYWc6ICN7ZHh9LCAje2R5fVwiXHJcbiAgICAgICAgICAgIEBjYW1lcmEuc2Nyb2xsWCAtPSBkeCAvIEBjYW1lcmEuem9vbVxyXG4gICAgICAgICAgICBAY2FtZXJhLnNjcm9sbFkgLT0gZHkgLyBAY2FtZXJhLnpvb21cclxuXHJcbiAgICAgICAgICAgICMgY29uc29sZS5sb2cgXCJzY3JvbGwgI3tAY2FtZXJhLnNjcm9sbFh9ICN7QGNhbWVyYS56b29tfSAje0BjYW1lcmEud2lkdGh9XCJcclxuICAgICAgICAgIEBzZXREcmFnUG9pbnQoKVxyXG5cclxuICAgICAgZWxzZSBpZiBAdHJhY2tlZC5sZW5ndGggPj0gMlxyXG4gICAgICAgICMgYXQgbGVhc3QgdHdvIGZpbmdlcnMgcHJlc2VudCwgY2hlY2sgZm9yIHBpbmNoL3pvb21cclxuICAgICAgICBjdXJyRGlzdGFuY2UgPSBAY2FsY0Rpc3RhbmNlKEB0cmFja2VkWzBdLnBvcy54LCBAdHJhY2tlZFswXS5wb3MueSwgQHRyYWNrZWRbMV0ucG9zLngsIEB0cmFja2VkWzFdLnBvcy55KVxyXG4gICAgICAgIGRlbHRhRGlzdGFuY2UgPSBjdXJyRGlzdGFuY2UgLSBwcmV2RGlzdGFuY2VcclxuICAgICAgICBpZiBkZWx0YURpc3RhbmNlICE9IDBcclxuICAgICAgICAgIG5ld1pvb20gPSBAY2FtZXJhLnpvb20gKiAoMSArIChkZWx0YURpc3RhbmNlICogNCAvIEBjYW1lcmEud2lkdGgpKVxyXG4gICAgICAgICAgQGFkanVzdFpvb20obmV3Wm9vbSlcclxuICAgICAgcmV0dXJuXHJcblxyXG4gICAgQHNjZW5lLmlucHV0Lm9uICdwb2ludGVydXAnLCAocG9pbnRlcikgPT5cclxuICAgICAgaW5kZXggPSAtMVxyXG4gICAgICBmb3IgaSBpbiBbMC4uLkB0cmFja2VkLmxlbmd0aF1cclxuICAgICAgICBpZiBAdHJhY2tlZFtpXS5pZCA9PSBwb2ludGVyLmlkXHJcbiAgICAgICAgICBpbmRleCA9IGlcclxuICAgICAgICAgIGJyZWFrXHJcbiAgICAgIGlmIGluZGV4ID09IC0xXHJcbiAgICAgICAgcmV0dXJuXHJcblxyXG4gICAgICBpZiBAdHJhY2tlZC5sZW5ndGggPT0gMVxyXG4gICAgICAgIGlmIG5vdCBAZHJhZ2dpbmdcclxuICAgICAgICAgIHdvcmxkUG9zID0gQGNhbWVyYS5nZXRXb3JsZFBvaW50KEB0cmFja2VkWzBdLnBvcy54LCBAdHJhY2tlZFswXS5wb3MueSlcclxuICAgICAgICAgICMgY29uc29sZS5sb2cgXCJUQVAgI3t3b3JsZFBvcy54fSAje3dvcmxkUG9zLnl9ICN7QGNhbWVyYS5zY3JvbGxYfSAje0BjYW1lcmEuc2Nyb2xsWX0gI3tAY2FtZXJhLnpvb219XCJcclxuICAgICAgICAgIEBzY2VuZS50YXAod29ybGRQb3MueCwgd29ybGRQb3MueSlcclxuXHJcbiAgICAgIEB0cmFja2VkLnNwbGljZShpbmRleCwgMSlcclxuICAgICAgaWYgQHRyYWNrZWQubGVuZ3RoID09IDFcclxuICAgICAgICBAc2V0RHJhZ1BvaW50KClcclxuXHJcbiAgICAgIGlmIGluZGV4IDwgMlxyXG4gICAgICAgICMgV2UganVzdCBmb3Jnb3Qgb25lIG9mIG91ciBwaW5jaCB0b3VjaGVzLiBQaWNrIGEgbmV3IGFuY2hvciBzcG90LlxyXG4gICAgICAgIEBjYWxjUGluY2hBbmNob3IoKVxyXG5cclxuICAgICAgQHNjZW5lLnNldE1hZ25pZnlpbmdHbGFzcygwLCAwLCAwKVxyXG4gICAgICByZXR1cm5cclxuXHJcbiAgICBAc2NlbmUuaW5wdXQub24gJ3doZWVsJywgKHBvaW50ZXIsIGdhbWVPYmplY3RzLCBkZWx0YVgsIGRlbHRhWSwgZGVsdGFaKSA9PlxyXG4gICAgICBAY2FsY1BpbmNoQW5jaG9yKHBvaW50ZXIucG9zaXRpb24ueCwgcG9pbnRlci5wb3NpdGlvbi55KVxyXG4gICAgICBuZXdab29tID0gQGNhbWVyYS56b29tICogKDEgLSAoZGVsdGFZIC8gNDgwKSlcclxuICAgICAgQGFkanVzdFpvb20obmV3Wm9vbSlcclxuICAgICAgQHNjZW5lLnNldE1hZ25pZnlpbmdHbGFzcygwLCAwLCAwKVxyXG4gICAgICByZXR1cm5cclxuXHJcbiAgYWRqdXN0Wm9vbTogKG5ld1pvb20pIC0+XHJcbiAgICBpZiBuZXdab29tIDwgMC4xXHJcbiAgICAgIG5ld1pvb20gPSAwLjFcclxuICAgIGlmIG5ld1pvb20gPiA1XHJcbiAgICAgIG5ld1pvb20gPSA1XHJcbiAgICBAY2FtZXJhLnpvb20gPSBuZXdab29tXHJcblxyXG4gICAgaGFsZlcgPSAoQGNhbWVyYS53aWR0aCAvIDIpXHJcbiAgICBoYWxmSCA9IChAY2FtZXJhLmhlaWdodCAvIDIpXHJcbiAgICBvZmZzZXRYID0gKEBwaW5jaEFuY2hvci54IC0gaGFsZlcpIC8gbmV3Wm9vbVxyXG4gICAgb2Zmc2V0WSA9IChAcGluY2hBbmNob3IueSAtIGhhbGZIKSAvIG5ld1pvb21cclxuICAgIEBjYW1lcmEuc2Nyb2xsWCA9IEBwaW5jaEFuY2hvcldvcmxkLnggLSBoYWxmVyAtIG9mZnNldFhcclxuICAgIEBjYW1lcmEuc2Nyb2xsWSA9IEBwaW5jaEFuY2hvcldvcmxkLnkgLSBoYWxmSCAtIG9mZnNldFlcclxuICAgIHJldHVyblxyXG5cclxuICBzZXREcmFnUG9pbnQ6IC0+XHJcbiAgICBAZHJhZ1ggPSBAdHJhY2tlZFswXS5wb3MueFxyXG4gICAgQGRyYWdZID0gQHRyYWNrZWRbMF0ucG9zLnlcclxuXHJcbiAgY2FsY1BpbmNoQW5jaG9yOiAocGluY2hYID0gbnVsbCwgcGluY2hZID0gbnVsbCkgLT5cclxuICAgIGlmIChwaW5jaFggPT0gbnVsbCkgYW5kIChwaW5jaFkgPT0gbnVsbClcclxuICAgICAgaWYgQHRyYWNrZWQubGVuZ3RoIDwgMlxyXG4gICAgICAgIHJldHVyblxyXG4gICAgICBwaW5jaFggPSBNYXRoLmZsb29yKChAdHJhY2tlZFswXS5wb3MueCArIEB0cmFja2VkWzFdLnBvcy54KSAvIDIpXHJcbiAgICAgIHBpbmNoWSA9IE1hdGguZmxvb3IoKEB0cmFja2VkWzBdLnBvcy55ICsgQHRyYWNrZWRbMV0ucG9zLnkpIC8gMilcclxuXHJcbiAgICBAcGluY2hBbmNob3IgPSB7eDogcGluY2hYLCB5OiBwaW5jaFkgfVxyXG4gICAgQHBpbmNoQW5jaG9yV29ybGQgPSBAY2FtZXJhLmdldFdvcmxkUG9pbnQocGluY2hYLCBwaW5jaFkpXHJcblxyXG4gICAgQHNjZW5lLnNldE1hZ25pZnlpbmdHbGFzcyhAcGluY2hBbmNob3IueCwgQHBpbmNoQW5jaG9yLnksIDEpXHJcblxyXG4gIGNhbGNEaXN0YW5jZTogKHgxLCB5MSwgeDIsIHkyKSAtPlxyXG4gICAgZHggPSB4MiAtIHgxXHJcbiAgICBkeSA9IHkyIC0geTFcclxuICAgIHJldHVybiBNYXRoLnNxcnQoZHgqZHggKyBkeSpkeSlcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gVG91Y2hJbnRlcnByZXRlclxyXG4iLCJCR01HYW1lU2NlbmUgPSByZXF1aXJlICcuL0JHTUdhbWVTY2VuZSdcclxuQkdNSHVkU2NlbmUgPSByZXF1aXJlICcuL0JHTUh1ZFNjZW5lJ1xyXG5CR01NZW51U2NlbmUgPSByZXF1aXJlICcuL0JHTU1lbnVTY2VuZSdcclxuXHJcbmluaXQgPSAtPlxyXG4gIGNvbnNvbGUubG9nIFwiQmFkIEd1eSBNaW5lc3dlZXBlcjogaW5pdCgpXCJcclxuXHJcbiAgY29uZmlnID1cclxuICAgIHR5cGU6IFBoYXNlci5BVVRPXHJcbiAgICB3aWR0aDogZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LmNsaWVudFdpZHRoXHJcbiAgICBoZWlnaHQ6IGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5jbGllbnRIZWlnaHRcclxuICAgIGJhY2tncm91bmRDb2xvcjogJyMwMDAwMDAnICMgJyMyZDJkMmQnXHJcbiAgICBwYXJlbnQ6ICdzY3JlZW4nXHJcbiAgICBpbnB1dDpcclxuICAgICAgYWN0aXZlUG9pbnRlcnM6IDJcclxuICAgIHNjZW5lOiBbXHJcbiAgICAgIEJHTUdhbWVTY2VuZVxyXG4gICAgICBCR01IdWRTY2VuZVxyXG4gICAgICBCR01NZW51U2NlbmVcclxuICAgIF1cclxuXHJcbiAgZ2FtZSA9IG5ldyBQaGFzZXIuR2FtZShjb25maWcpXHJcblxyXG5cclxud2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ2xvYWQnLCAoZSkgLT5cclxuICBmb250cyA9IFtcclxuICAgIHtcclxuICAgICAgbmFtZTogJ0VhZ2xlIExha2UnXHJcbiAgICAgIHVybDogICdmb250cy9lYWdsZWxha2UudHRmJ1xyXG4gICAgfVxyXG4gIF1cclxuICBwcm9taXNlcyA9IFtdXHJcbiAgZm9yIGZvbnQgaW4gZm9udHNcclxuICAgIGRvIChmb250KSAtPlxyXG4gICAgICBwcm9taXNlcy5wdXNoIG5ldyBQcm9taXNlIChyZXNvbHZlLCByZWplY3QpIC0+XHJcbiAgICAgICAgbmV3Rm9udCA9IG5ldyBGb250RmFjZShmb250Lm5hbWUsIFwidXJsKCN7Zm9udC51cmx9KVwiKVxyXG4gICAgICAgIG5ld0ZvbnQubG9hZCgpLnRoZW4gKGxvYWRlZCkgLT5cclxuICAgICAgICAgIGlmIGxvYWRlZFxyXG4gICAgICAgICAgICBkb2N1bWVudC5mb250cy5hZGQobG9hZGVkKVxyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyBcIkxvYWRlZCBGb250OiAje2ZvbnQubmFtZX1cIlxyXG4gICAgICAgICAgICByZXNvbHZlKClcclxuICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAgcmVqZWN0KClcclxuXHJcbiAgICBQcm9taXNlLmFsbChwcm9taXNlcykudGhlbigobG9hZGVkKSAtPlxyXG4gICAgICBpbml0KClcclxuICAgICkuY2F0Y2ggKGVycm9yKSAtPlxyXG4gICAgICBjb25zb2xlLmxvZyBcIkVycm9yOiBcIiwgZXJyb3JcclxuXHJcbiwgZmFsc2UpXHJcbiJdfQ==
