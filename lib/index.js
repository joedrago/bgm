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
    var lives, mines;
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
      },
      life: {
        fontFamily: 'Colored Crayons',
        fontSize: `${Math.floor(this.h / 5)}px`,
        color: '#ff3'
      },
      lose: {
        fontFamily: 'Colored Crayons',
        fontSize: `${Math.floor(this.h / 5)}px`,
        color: '#f33'
      },
      win: {
        fontFamily: 'Colored Crayons',
        fontSize: `${Math.floor(this.h / 5)}px`,
        color: '#3f3'
      }
    };
    this.panelW = Math.floor(this.cameras.main.height * 0.17);
    this.panelH = this.cameras.main.height;
    this.panelX = this.cameras.main.width - this.panelW;
    this.panelY = 0;
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
    this.glass = this.add.image(50, 50, 'glass');
    this.glass.setOrigin(0.6, 0.3); // roughly the middle of the magnifying glass
    this.glass.alpha = 0;
    this.lifeText = this.add.text(this.w / 2, this.h / 2, 'Are you sure?', this.fonts.life);
    this.lifeText.setOrigin(0.5);
    this.lifeText.setShadow(8, 8);
    this.lifeText.alpha = 0;
    this.lifeTween = this.tweens.add({
      targets: this.lifeText,
      alpha: {
        value: 1,
        duration: 400
      },
      hold: 1000,
      yoyo: true,
      loop: 0,
      paused: true
    });
    this.winText = this.add.text(this.w / 2, this.h / 2, 'You win!', this.fonts.win);
    this.winText.setOrigin(0.5);
    this.winText.setShadow(8, 8);
    this.winText.alpha = 0;
    this.winTween = this.tweens.add({
      targets: this.winText,
      alpha: {
        value: 1,
        duration: 400
      },
      yoyo: false,
      loop: 0,
      paused: true
    });
    this.loseText = this.add.text(this.w / 2, this.h / 2, 'You lose!', this.fonts.lose);
    this.loseText.setOrigin(0.5);
    this.loseText.setShadow(8, 8);
    this.loseText.alpha = 0;
    this.loseTween = this.tweens.add({
      targets: this.loseText,
      alpha: {
        value: 1,
        duration: 400
      },
      yoyo: false,
      loop: 0,
      paused: true
    });
    this.ms.addEventListener(this.msEvent.bind(this));
    return this.ms.updateAll();
  }

  msEvent(ev, args) {
    if (ev !== 'cell') {
      console.log(`HUD msEvent: ${ev}: ${JSON.stringify(args)}`);
    }
    switch (ev) {
      case 'new':
        this.winText.alpha = 0;
        return this.loseText.alpha = 0;
      case 'life':
        this.lifeTween.resume();
        return this.lifeTween.restart();
      case 'win':
        this.winText.alpha = 0;
        this.winTween.resume();
        return this.winTween.restart();
      case 'lose':
        this.loseTween.resume();
        return this.loseTween.restart();
    }
  }

  toggleMode() {
    if (this.ms.gameover) {
      this.ms.newGame();
    } else if (this.mode === 'bomb') {
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
      return this.newGame(50, 30, 240);
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
    this.width = 0;
    this.height = 0;
    this.mineCount = 0;
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
    var evl, i, index, j, k, keepGoing, l, len, len1, m, o, q, r, ref, ref1, ref2, ref3, ref4, ref5, visibleMines, won;
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
    for (j = m = 0, ref2 = this.height; (0 <= ref2 ? m < ref2 : m > ref2); j = 0 <= ref2 ? ++m : --m) {
      for (i = o = 0, ref3 = this.width; (0 <= ref3 ? o < ref3 : o > ref3); i = 0 <= ref3 ? ++o : --o) {
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
      for (q = 0, len = ref4.length; q < len; q++) {
        evl = ref4[q];
        evl('win', []);
      }
    }
    ref5 = this.listeners;
    for (r = 0, len1 = ref5.length; r < len1; r++) {
      evl = ref5[r];
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

  newGame(width = 0, height = 0, mineCount = 0, seed = String(Math.floor(Math.random() * 1000000))) {
    var MINE_DENSITY, cellCount, evl, i, indices, j, k, l, len, m, ref, ref1, ref2;
    this.seed = seed;
    Math.seedbgmrandom(this.seed);
    if (this.width === 0) {
      this.width = 8;
    }
    if (this.height === 0) {
      this.height = 8;
    }
    // By default, let newGame() re-play whatever the last setting was
    if (width !== 0) {
      this.width = width;
    }
    if (height !== 0) {
      this.height = height;
    }
    if (mineCount !== 0) {
      this.mineCount = mineCount;
    }
    this.lives = 3;
    cellCount = this.width * this.height;
    if (this.mineCount === 0) {
      MINE_DENSITY = 0.16;
      this.mineCount = Math.floor(cellCount * MINE_DENSITY);
    }
    this.mineCount = Math.min(this.mineCount, cellCount - 1);
    this.gameover = false;
    // Create fresh arrays
    this.bomb = new Array(cellCount).fill(0);
    this.visible = new Array(cellCount).fill(0);
    // Drop in the mines randomly
    indices = new Array(cellCount);
    indices[0] = 0;
    for (i = k = 1, ref = cellCount; (1 <= ref ? k < ref : k > ref); i = 1 <= ref ? ++k : --k) {
      j = this.rand(i);
      indices[i] = indices[j];
      indices[j] = i;
    }
    for (i = l = 0, ref1 = this.mineCount; (0 <= ref1 ? l < ref1 : l > ref1); i = 0 <= ref1 ? ++l : --l) {
      this.bomb[indices[i]] = 1;
    }
    this.firstClickIsFree();
    ref2 = this.listeners;
    for (m = 0, len = ref2.length; m < len; m++) {
      evl = ref2[m];
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
    },
    {
      name: 'Colored Crayons',
      url: 'fonts/crayons.ttf'
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvQkdNR2FtZVNjZW5lLmNvZmZlZSIsInNyYy9CR01IdWRTY2VuZS5jb2ZmZWUiLCJzcmMvQkdNTWVudVNjZW5lLmNvZmZlZSIsInNyYy9NaW5lU3dlZXBlci5jb2ZmZWUiLCJzcmMvVG91Y2hJbnRlcnByZXRlci5jb2ZmZWUiLCJzcmMvbWFpbi5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQSxJQUFBLFlBQUEsRUFBQTs7QUFBQSxnQkFBQSxHQUFtQixPQUFBLENBQVEsb0JBQVI7O0FBRWIsZUFBTixNQUFBLGFBQUEsUUFBMkIsTUFBTSxDQUFDLE1BQWxDO0VBQ0UsV0FBYSxDQUFBLENBQUE7U0FDWCxDQUFNO01BQ0osR0FBQSxFQUFLLE1BREQ7TUFFSixNQUFBLEVBQVE7SUFGSixDQUFOO0lBS0EsSUFBQyxDQUFBLEVBQUQsR0FBTSxPQUFBLENBQVEsZUFBUjtJQUNOLElBQUMsQ0FBQSxLQUFELEdBQVMsSUFBSSxnQkFBSixDQUFBO0VBUEU7O0VBU2IsT0FBUyxDQUFBLENBQUE7SUFDUCxJQUFDLENBQUEsSUFBSSxDQUFDLEtBQU4sQ0FBWSxPQUFaLEVBQXFCLGtCQUFyQjtJQUNBLElBQUMsQ0FBQSxJQUFJLENBQUMsS0FBTixDQUFZLE1BQVosRUFBb0Isd0JBQXBCO0lBQ0EsSUFBQyxDQUFBLElBQUksQ0FBQyxLQUFOLENBQVksTUFBWixFQUFvQixrQkFBcEI7SUFDQSxJQUFDLENBQUEsSUFBSSxDQUFDLEtBQU4sQ0FBWSxXQUFaLEVBQXlCLHNCQUF6QjtJQUNBLElBQUMsQ0FBQSxJQUFJLENBQUMsS0FBTixDQUFZLGNBQVosRUFBNEIseUJBQTVCO0lBQ0EsSUFBQyxDQUFBLElBQUksQ0FBQyxLQUFOLENBQVksZ0JBQVosRUFBOEIsMkJBQTlCO0lBRUEsSUFBQyxDQUFBLElBQUksQ0FBQyxLQUFOLENBQVksU0FBWixFQUF1QixvQkFBdkI7SUFDQSxJ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TyxDQUFDLElBQVIsQ0FBQSxDQUFjLENBQUMsSUFBZixDQUFvQixRQUFBLENBQUMsTUFBRCxDQUFBO1VBQ2xCLElBQUcsTUFBSDtZQUNFLFFBQVEsQ0FBQyxLQUFLLENBQUMsR0FBZixDQUFtQixNQUFuQjtZQUNBLE9BQU8sQ0FBQyxHQUFSLENBQVksQ0FBQSxhQUFBLENBQUEsQ0FBZ0IsSUFBSSxDQUFDLElBQXJCLENBQUEsQ0FBWjttQkFDQSxPQUFBLENBQUEsRUFIRjtXQUFBLE1BQUE7bUJBS0UsTUFBQSxDQUFBLEVBTEY7O1FBRGtCLENBQXBCO01BRndCLENBQVosQ0FBZDtJQURDLENBQUEsRUFBQztpQkFXSixPQUFPLENBQUMsR0FBUixDQUFZLFFBQVosQ0FBcUIsQ0FBQyxJQUF0QixDQUEyQixRQUFBLENBQUMsTUFBRCxDQUFBO2FBQ3pCLElBQUEsQ0FBQTtJQUR5QixDQUEzQixDQUVDLENBQUMsS0FGRixDQUVRLFFBQUEsQ0FBQyxLQUFELENBQUE7YUFDTixPQUFPLENBQUMsR0FBUixDQUFZLFNBQVosRUFBdUIsS0FBdkI7SUFETSxDQUZSO0VBWkYsQ0FBQTs7QUFaOEIsQ0FBaEMsRUE2QkUsS0E3QkYiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbigpe2Z1bmN0aW9uIHIoZSxuLHQpe2Z1bmN0aW9uIG8oaSxmKXtpZighbltpXSl7aWYoIWVbaV0pe3ZhciBjPVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmU7aWYoIWYmJmMpcmV0dXJuIGMoaSwhMCk7aWYodSlyZXR1cm4gdShpLCEwKTt2YXIgYT1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK2krXCInXCIpO3Rocm93IGEuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixhfXZhciBwPW5baV09e2V4cG9ydHM6e319O2VbaV1bMF0uY2FsbChwLmV4cG9ydHMsZnVuY3Rpb24ocil7dmFyIG49ZVtpXVsxXVtyXTtyZXR1cm4gbyhufHxyKX0scCxwLmV4cG9ydHMscixlLG4sdCl9cmV0dXJuIG5baV0uZXhwb3J0c31mb3IodmFyIHU9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZSxpPTA7aTx0Lmxlbmd0aDtpKyspbyh0W2ldKTtyZXR1cm4gb31yZXR1cm4gcn0pKCkiLCJUb3VjaEludGVycHJldGVyID0gcmVxdWlyZSAnLi9Ub3VjaEludGVycHJldGVyJ1xyXG5cclxuY2xhc3MgQkdNR2FtZVNjZW5lIGV4dGVuZHMgUGhhc2VyLlNjZW5lXHJcbiAgY29uc3RydWN0b3I6IC0+XHJcbiAgICBzdXBlciB7XHJcbiAgICAgIGtleTogJ2dhbWUnXHJcbiAgICAgIGFjdGl2ZTogdHJ1ZVxyXG4gICAgfVxyXG5cclxuICAgIEBtcyA9IHJlcXVpcmUgJy4vTWluZVN3ZWVwZXInXHJcbiAgICBAdG91Y2ggPSBuZXcgVG91Y2hJbnRlcnByZXRlclxyXG5cclxuICBwcmVsb2FkOiAtPlxyXG4gICAgQGxvYWQuaW1hZ2UoJ2JsYW5rJywgJ2ltYWdlcy9ibGFuay5naWYnKVxyXG4gICAgQGxvYWQuaW1hZ2UoJ2ZsYWcnLCAnaW1hZ2VzL2JvbWJmbGFnZ2VkLmdpZicpXHJcbiAgICBAbG9hZC5pbWFnZSgnYm9tYicsICdpbWFnZXMvYm9tYjAuZ2lmJylcclxuICAgIEBsb2FkLmltYWdlKCdib21iZGVhdGgnLCAnaW1hZ2VzL2JvbWJkZWF0aC5naWYnKVxyXG4gICAgQGxvYWQuaW1hZ2UoJ2JvbWJyZXZlYWxlZCcsICdpbWFnZXMvYm9tYnJldmVhbGVkLmdpZicpXHJcbiAgICBAbG9hZC5pbWFnZSgnYm9tYm1pc2ZsYWdnZWQnLCAnaW1hZ2VzL2JvbWJtaXNmbGFnZ2VkLmdpZicpXHJcblxyXG4gICAgQGxvYWQuaW1hZ2UoJ3NoYWRvdzAnLCAnaW1hZ2VzL3NoYWRvdzAuZ2lmJylcclxuICAgIEBsb2FkLmltYWdlKCdzaGFkb3cxJywgJ2ltYWdlcy9zaGFkb3cxLmdpZicpXHJcbiAgICBAbG9hZC5pbWFnZSgnc2hhZG93MicsICdpbWFnZXMvc2hhZG93Mi5naWYnKVxyXG4gICAgQGxvYWQuaW1hZ2UoJ3NoYWRvdzMnLCAnaW1hZ2VzL3NoYWRvdzMuZ2lmJylcclxuICAgIEBsb2FkLmltYWdlKCdzaGFkb3c0JywgJ2ltYWdlcy9zaGFkb3c0LmdpZicpXHJcbiAgICBAbG9hZC5pbWFnZSgnc2hhZG93NScsICdpbWFnZXMvc2hhZG93NS5naWYnKVxyXG4gICAgQGxvYWQuaW1hZ2UoJ3NoYWRvdzYnLCAnaW1hZ2VzL3NoYWRvdzYuZ2lmJylcclxuICAgIEBsb2FkLmltYWdlKCdzaGFkb3c3JywgJ2ltYWdlcy9zaGFkb3c3LmdpZicpXHJcbiAgICBAbG9hZC5pbWFnZSgnc2hhZG93OCcsICdpbWFnZXMvc2hhZG93OC5naWYnKVxyXG5cclxuICAgIEBsb2FkLmltYWdlKCdib21iMCcsICdpbWFnZXMvYm9tYjAuZ2lmJylcclxuICAgIEBsb2FkLmltYWdlKCdib21iMScsICdpbWFnZXMvYm9tYjEuZ2lmJylcclxuICAgIEBsb2FkLmltYWdlKCdib21iMicsICdpbWFnZXMvYm9tYjIuZ2lmJylcclxuICAgIEBsb2FkLmltYWdlKCdib21iMycsICdpbWFnZXMvYm9tYjMuZ2lmJylcclxuICAgIEBsb2FkLmltYWdlKCdib21iNCcsICdpbWFnZXMvYm9tYjQuZ2lmJylcclxuICAgIEBsb2FkLmltYWdlKCdib21iNScsICdpbWFnZXMvYm9tYjUuZ2lmJylcclxuICAgIEBsb2FkLmltYWdlKCdib21iNicsICdpbWFnZXMvYm9tYjYuZ2lmJylcclxuICAgIEBsb2FkLmltYWdlKCdib21iNycsICdpbWFnZXMvYm9tYjcuZ2lmJylcclxuICAgIEBsb2FkLmltYWdlKCdib21iOCcsICdpbWFnZXMvYm9tYjguZ2lmJylcclxuXHJcbiAgICBAbG9hZC5pbWFnZSgnb3BlbjAnLCAnaW1hZ2VzL29wZW4wLmdpZicpXHJcbiAgICBAbG9hZC5pbWFnZSgnb3BlbjEnLCAnaW1hZ2VzL29wZW4xLmdpZicpXHJcbiAgICBAbG9hZC5pbWFnZSgnb3BlbjInLCAnaW1hZ2VzL29wZW4yLmdpZicpXHJcbiAgICBAbG9hZC5pbWFnZSgnb3BlbjMnLCAnaW1hZ2VzL29wZW4zLmdpZicpXHJcbiAgICBAbG9hZC5pbWFnZSgnb3BlbjQnLCAnaW1hZ2VzL29wZW40LmdpZicpXHJcbiAgICBAbG9hZC5pbWFnZSgnb3BlbjUnLCAnaW1hZ2VzL29wZW41LmdpZicpXHJcbiAgICBAbG9hZC5pbWFnZSgnb3BlbjYnLCAnaW1hZ2VzL29wZW42LmdpZicpXHJcbiAgICBAbG9hZC5pbWFnZSgnb3BlbjcnLCAnaW1hZ2VzL29wZW43LmdpZicpXHJcbiAgICBAbG9hZC5pbWFnZSgnb3BlbjgnLCAnaW1hZ2VzL29wZW44LmdpZicpXHJcblxyXG4gIGNyZWF0ZTogLT5cclxuICAgIHNwbGl0ID0gTWF0aC5mbG9vcihAY2FtZXJhcy5tYWluLndpZHRoICogMC45KVxyXG4gICAgQGNhbWVyYXMubWFpbi5zZXRWaWV3cG9ydCgwLCAwLCBzcGxpdCwgQGNhbWVyYXMubWFpbi5oZWlnaHQpXHJcblxyXG4gICAgQG1zLmFkZEV2ZW50TGlzdGVuZXIoQG1zRXZlbnQuYmluZCh0aGlzKSlcclxuICAgIEByZWNyZWF0ZURpc3BsYXlMaXN0KClcclxuICAgIEBtcy51cGRhdGVBbGwoKVxyXG5cclxuICAgIEB0b3VjaC5jcmVhdGUodGhpcywgQGNhbWVyYXMubWFpbiwgMCwgMCwgc3BsaXQsIEBjYW1lcmFzLm1haW4uaGVpZ2h0KVxyXG5cclxuICBtc0V2ZW50OiAoZXYsIGFyZ3MpIC0+XHJcbiAgICBpZiBldiAhPSAnY2VsbCdcclxuICAgICAgY29uc29sZS5sb2cgXCJtc0V2ZW50OiAje2V2fTogI3tKU09OLnN0cmluZ2lmeShhcmdzKX1cIlxyXG4gICAgc3dpdGNoIGV2XHJcbiAgICAgIHdoZW4gJ25ldydcclxuICAgICAgICBpZiAoQG1zLndpZHRoICE9IEBncmlkQ29scykgb3IgKEBtcy5oZWlnaHQgIT0gQGdyaWRSb3dzKVxyXG4gICAgICAgICAgQHJlY3JlYXRlRGlzcGxheUxpc3QoKVxyXG4gICAgICB3aGVuICdjZWxsJ1xyXG4gICAgICAgIEBncmlkW2FyZ3NbMF1dW2FyZ3NbMV1dLnNldFRleHR1cmUoYXJnc1syXSlcclxuICAgICAgd2hlbiAnbGlmZSdcclxuICAgICAgICBAY2FtZXJhcy5tYWluLnNoYWtlKDMwMCwgMC4wMDEpXHJcbiAgICAgIHdoZW4gJ21pbmVzJ1xyXG4gICAgICAgIG1pbmVzID0gQHNjZW5lLmdldCgnaHVkJykubWluZXNcclxuICAgICAgICBpZiBtaW5lcz9cclxuICAgICAgICAgIG1pbmVzLnRleHQgPSBcIiN7YXJnc1swXX0vI3thcmdzWzFdfVwiXHJcbiAgICAgIHdoZW4gJ2xpdmVzJ1xyXG4gICAgICAgIGxpdmVzID0gQHNjZW5lLmdldCgnaHVkJykubGl2ZXNcclxuICAgICAgICBpZiBsaXZlcz9cclxuICAgICAgICAgIGxpdmVzLnRleHQgPSBTdHJpbmcoYXJnc1swXSlcclxuXHJcbiAgdXBkYXRlOiAtPlxyXG5cclxuICByZWNyZWF0ZURpc3BsYXlMaXN0OiAtPlxyXG4gICAgY29uc29sZS5sb2cgXCJyZWNyZWF0ZURpc3BsYXlMaXN0KClcIlxyXG4gICAgQGFkZC5kaXNwbGF5TGlzdC5yZW1vdmVBbGwoKVxyXG5cclxuICAgIEBncmlkQ29scyA9IEBtcy53aWR0aFxyXG4gICAgQGdyaWRSb3dzID0gQG1zLmhlaWdodFxyXG4gICAgQGdyaWQgPSBuZXcgQXJyYXkoQGdyaWRDb2xzKVxyXG4gICAgZm9yIGkgaW4gWzAuLi5AZ3JpZENvbHNdXHJcbiAgICAgIEBncmlkW2ldID0gbmV3IEFycmF5KEBncmlkUm93cylcclxuICAgICAgZm9yIGogaW4gWzAuLi5AZ3JpZFJvd3NdXHJcbiAgICAgICAgQGdyaWRbaV1bal0gPSBAYWRkLmltYWdlKGkgKiAxNiwgaiAqIDE2LCAnYmxhbmsnKVxyXG4gICAgICAgIEBncmlkW2ldW2pdLnNldE9yaWdpbigwLCAwKVxyXG4gICAgQHJlc2V0VmlldygpXHJcblxyXG4gIGNlbnRlckdyaWQ6IC0+XHJcbiAgICB0b3RhbFcgPSBAZ3JpZENvbHMgKiAxNlxyXG4gICAgdG90YWxIID0gQGdyaWRSb3dzICogMTZcclxuICAgIEBjYW1lcmFzLm1haW4uc2Nyb2xsWCA9ICh0b3RhbFcgLSBAY2FtZXJhcy5tYWluLndpZHRoKSAvIDJcclxuICAgIEBjYW1lcmFzLm1haW4uc2Nyb2xsWSA9ICh0b3RhbEggLSBAY2FtZXJhcy5tYWluLmhlaWdodCkgLyAyXHJcblxyXG4gIHJlc2V0VmlldzogLT5cclxuICAgIEBjYW1lcmFzLm1haW4uem9vbSA9IDFcclxuICAgIEBjZW50ZXJHcmlkKClcclxuXHJcbiAgc2V0TW9kZTogKEBtb2RlKSAtPlxyXG5cclxuICBzZXRNYWduaWZ5aW5nR2xhc3M6ICh4LCB5LCBhbHBoYSkgLT5cclxuICAgIEBzY2VuZS5nZXQoJ2h1ZCcpLnNldE1hZ25pZnlpbmdHbGFzcyh4LCB5LCBhbHBoYSlcclxuXHJcbiAgcm1iOiAod29ybGRYLCB3b3JsZFkpIC0+XHJcbiAgICBAc2NlbmUuZ2V0KCdodWQnKS50b2dnbGVNb2RlKClcclxuICAgIEBtcy5zYXZlKClcclxuXHJcbiAgdGFwOiAod29ybGRYLCB3b3JsZFkpIC0+XHJcbiAgICBpZiBAbXMuZ2FtZW92ZXJcclxuICAgICAgY29uc29sZS5sb2cgXCJnYW1lIGlzIG92ZXIsIGRvaW5nIG5vdGhpbmdcIlxyXG4gICAgICByZXR1cm5cclxuXHJcbiAgICBpZiAod29ybGRYID49IDApIGFuZCAod29ybGRYIDwgKEBncmlkQ29scyAqIDE2KSkgYW5kICh3b3JsZFkgPj0gMCkgYW5kICh3b3JsZFkgPCAoQGdyaWRSb3dzICogMTYpKVxyXG4gICAgICB4ID0gTWF0aC5mbG9vcih3b3JsZFggLyAxNilcclxuICAgICAgeSA9IE1hdGguZmxvb3Iod29ybGRZIC8gMTYpXHJcbiAgICAgIGlmIEBtb2RlID09ICdmbGFnJ1xyXG4gICAgICAgIEBtcy5mbGFnKHgsIHkpXHJcbiAgICAgIGVsc2VcclxuICAgICAgICBAbXMucG9rZSh4LCB5KVxyXG4gICAgICBAbXMudXBkYXRlQWxsKClcclxuXHJcbiAgICBAbXMuc2F2ZSgpXHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IEJHTUdhbWVTY2VuZVxyXG4iLCJjbGFzcyBCR01IdWRTY2VuZSBleHRlbmRzIFBoYXNlci5TY2VuZVxyXG4gIGNvbnN0cnVjdG9yOiAtPlxyXG4gICAgc3VwZXIge1xyXG4gICAgICBrZXk6ICdodWQnXHJcbiAgICAgIGFjdGl2ZTogdHJ1ZVxyXG4gICAgfVxyXG5cclxuICAgIEBtcyA9IHJlcXVpcmUgJy4vTWluZVN3ZWVwZXInXHJcblxyXG4gIHByZWxvYWQ6IC0+XHJcbiAgICBAbG9hZC5pbWFnZSgnZ2xhc3MnLCAnaW1hZ2VzL2dsYXNzLmdpZicpXHJcbiAgICBAbG9hZC5pbWFnZSgnbGl2ZXMnLCAnaW1hZ2VzL2xpdmVzLnBuZycpXHJcbiAgICBAbG9hZC5pbWFnZSgnbWluZXMnLCAnaW1hZ2VzL21pbmVzLnBuZycpXHJcblxyXG4gICAgQGxvYWQuaW1hZ2UoJ2J0bl9ib21iJywgJ2ltYWdlcy9idG5fYm9tYi5wbmcnKVxyXG4gICAgQGxvYWQuaW1hZ2UoJ2J0bl9mbGFnJywgJ2ltYWdlcy9idG5fZmxhZy5wbmcnKVxyXG4gICAgQGxvYWQuaW1hZ2UoJ2J0bl9tZW51JywgJ2ltYWdlcy9idG5fbWVudS5wbmcnKVxyXG5cclxuICBjcmVhdGU6IC0+XHJcbiAgICBAdyA9IEBjYW1lcmFzLm1haW4ud2lkdGhcclxuICAgIEBoID0gQGNhbWVyYXMubWFpbi5oZWlnaHRcclxuICAgIEBmb250cyA9XHJcbiAgICAgIG1pbmVzOlxyXG4gICAgICAgIGZvbnRGYW1pbHk6ICdFYWdsZSBMYWtlJ1xyXG4gICAgICAgIGZvbnRTaXplOiBcIiN7TWF0aC5mbG9vcihAaCAvIDMwKX1weFwiXHJcbiAgICAgICAgY29sb3I6ICcjZmZmJ1xyXG4gICAgICBsaXZlczpcclxuICAgICAgICBmb250RmFtaWx5OiAnRWFnbGUgTGFrZSdcclxuICAgICAgICBmb250U2l6ZTogXCIje01hdGguZmxvb3IoQGggLyAxNil9cHhcIlxyXG4gICAgICAgIGNvbG9yOiAnI2ZmZidcclxuICAgICAgbGlmZTpcclxuICAgICAgICBmb250RmFtaWx5OiAnQ29sb3JlZCBDcmF5b25zJ1xyXG4gICAgICAgIGZvbnRTaXplOiBcIiN7TWF0aC5mbG9vcihAaCAvIDUpfXB4XCJcclxuICAgICAgICBjb2xvcjogJyNmZjMnXHJcbiAgICAgIGxvc2U6XHJcbiAgICAgICAgZm9udEZhbWlseTogJ0NvbG9yZWQgQ3JheW9ucydcclxuICAgICAgICBmb250U2l6ZTogXCIje01hdGguZmxvb3IoQGggLyA1KX1weFwiXHJcbiAgICAgICAgY29sb3I6ICcjZjMzJ1xyXG4gICAgICB3aW46XHJcbiAgICAgICAgZm9udEZhbWlseTogJ0NvbG9yZWQgQ3JheW9ucydcclxuICAgICAgICBmb250U2l6ZTogXCIje01hdGguZmxvb3IoQGggLyA1KX1weFwiXHJcbiAgICAgICAgY29sb3I6ICcjM2YzJ1xyXG5cclxuICAgIEBwYW5lbFcgPSBNYXRoLmZsb29yKEBjYW1lcmFzLm1haW4uaGVpZ2h0ICogMC4xNylcclxuICAgIEBwYW5lbEggPSBAY2FtZXJhcy5tYWluLmhlaWdodFxyXG4gICAgQHBhbmVsWCA9IEBjYW1lcmFzLm1haW4ud2lkdGggLSBAcGFuZWxXXHJcbiAgICBAcGFuZWxZID0gMFxyXG5cclxuICAgIEBwYW5lbEJhY2tncm91bmQgPSBAYWRkLmdyYXBoaWNzKClcclxuICAgIEBwYW5lbEJhY2tncm91bmQuZmlsbFN0eWxlKDB4MzMzMzMzLCAxKVxyXG4gICAgQHBhbmVsQmFja2dyb3VuZC5maWxsUmVjdChAcGFuZWxYLCBAcGFuZWxZLCBAcGFuZWxXLCBAcGFuZWxIKVxyXG4gICAgQHBhbmVsQmFja2dyb3VuZC5saW5lU3R5bGUoMSwgMHgwMDAwMDAsIDEuMClcclxuICAgIEBwYW5lbEJhY2tncm91bmQuc3Ryb2tlUmVjdChAcGFuZWxYLCBAcGFuZWxZLCBAcGFuZWxXLCBAcGFuZWxIKVxyXG5cclxuICAgIEBidXR0b25zID0ge31cclxuXHJcbiAgICBAYnV0dG9ucy5tb2RlID0gQGFkZC5pbWFnZShAcGFuZWxYICsgKEBwYW5lbFcgLyAyKSwgQHBhbmVsWSArIChAcGFuZWxIIC8gMiksICdidG5fYm9tYicpXHJcbiAgICBAYnV0dG9ucy5tb2RlLnNldERpc3BsYXlTaXplKEBwYW5lbFcgKiAwLjgsIEBwYW5lbFcgKiAwLjgpXHJcbiAgICBAYnV0dG9ucy5tb2RlLnNldEludGVyYWN0aXZlKClcclxuICAgIEBidXR0b25zLm1vZGUub24gJ3BvaW50ZXJkb3duJywgPT5cclxuICAgICAgQHRvZ2dsZU1vZGUoKVxyXG4gICAgQHRvZ2dsZU1vZGUoKVxyXG5cclxuICAgIEBidXR0b25zLm1lbnUgPSBAYWRkLmltYWdlKEBwYW5lbFggKyAoQHBhbmVsVyAvIDIpLCBAcGFuZWxZICsgKEBwYW5lbFcgKiAwLjUpLCAnYnRuX21lbnUnKVxyXG4gICAgQGJ1dHRvbnMubWVudS5zZXREaXNwbGF5U2l6ZShAcGFuZWxXICogMC44LCBAcGFuZWxXICogMC44KVxyXG4gICAgQGJ1dHRvbnMubWVudS5zZXRJbnRlcmFjdGl2ZSgpXHJcbiAgICBAYnV0dG9ucy5tZW51Lm9uICdwb2ludGVyZG93bicsID0+XHJcbiAgICAgIEBzY2VuZS5sYXVuY2goJ21lbnUnKVxyXG5cclxuICAgIEBtaW5lc0JhY2tncm91bmQgPSBAYWRkLmltYWdlKEBwYW5lbFggKyAoQHBhbmVsVyAvIDIpLCBAcGFuZWxZICsgKEBwYW5lbEggKiAwLjcpLCAnbWluZXMnKVxyXG4gICAgQG1pbmVzQmFja2dyb3VuZC5zZXREaXNwbGF5U2l6ZShAcGFuZWxXLCBAcGFuZWxXKVxyXG4gICAgQG1pbmVzID0gQGFkZC50ZXh0KEBwYW5lbFggKyAoQHBhbmVsVyAvIDIpLCBAcGFuZWxZICsgKEBwYW5lbEggKiAwLjczKSwgJ21pbmVzJywgQGZvbnRzLm1pbmVzKVxyXG4gICAgQG1pbmVzLnNldE9yaWdpbigwLjUpXHJcblxyXG4gICAgQGxpdmVzQmFja2dyb3VuZCA9IEBhZGQuaW1hZ2UoQHBhbmVsWCArIChAcGFuZWxXIC8gMiksIEBwYW5lbFkgKyAoQHBhbmVsSCAqIDAuOSksICdsaXZlcycpXHJcbiAgICBAbGl2ZXNCYWNrZ3JvdW5kLnNldERpc3BsYXlTaXplKEBwYW5lbFcgKiAwLjgsIEBwYW5lbFcgKiAwLjgpXHJcbiAgICBAbGl2ZXMgPSBAYWRkLnRleHQoQHBhbmVsWCArIChAcGFuZWxXIC8gMiksIEBwYW5lbFkgKyAoQHBhbmVsSCAqIDAuOSksICdsaXZlcycsIEBmb250cy5saXZlcylcclxuICAgIEBsaXZlcy5zZXRPcmlnaW4oMC41KVxyXG5cclxuICAgIEBnbGFzcyA9IEBhZGQuaW1hZ2UoNTAsIDUwLCAnZ2xhc3MnKVxyXG4gICAgQGdsYXNzLnNldE9yaWdpbigwLjYsIDAuMykgIyByb3VnaGx5IHRoZSBtaWRkbGUgb2YgdGhlIG1hZ25pZnlpbmcgZ2xhc3NcclxuICAgIEBnbGFzcy5hbHBoYSA9IDBcclxuXHJcbiAgICBAbGlmZVRleHQgPSBAYWRkLnRleHQoQHcgLyAyLCBAaCAvIDIsICdBcmUgeW91IHN1cmU/JywgQGZvbnRzLmxpZmUpXHJcbiAgICBAbGlmZVRleHQuc2V0T3JpZ2luKDAuNSlcclxuICAgIEBsaWZlVGV4dC5zZXRTaGFkb3coOCwgOClcclxuICAgIEBsaWZlVGV4dC5hbHBoYSA9IDBcclxuICAgIEBsaWZlVHdlZW4gPSBAdHdlZW5zLmFkZCB7XHJcbiAgICAgIHRhcmdldHM6IEBsaWZlVGV4dFxyXG4gICAgICBhbHBoYTpcclxuICAgICAgICB2YWx1ZTogMVxyXG4gICAgICAgIGR1cmF0aW9uOiA0MDBcclxuICAgICAgaG9sZDogMTAwMFxyXG4gICAgICB5b3lvOiB0cnVlXHJcbiAgICAgIGxvb3A6IDBcclxuICAgICAgcGF1c2VkOiB0cnVlXHJcbiAgICB9XHJcblxyXG4gICAgQHdpblRleHQgPSBAYWRkLnRleHQoQHcgLyAyLCBAaCAvIDIsICdZb3Ugd2luIScsIEBmb250cy53aW4pXHJcbiAgICBAd2luVGV4dC5zZXRPcmlnaW4oMC41KVxyXG4gICAgQHdpblRleHQuc2V0U2hhZG93KDgsIDgpXHJcbiAgICBAd2luVGV4dC5hbHBoYSA9IDBcclxuICAgIEB3aW5Ud2VlbiA9IEB0d2VlbnMuYWRkIHtcclxuICAgICAgdGFyZ2V0czogQHdpblRleHRcclxuICAgICAgYWxwaGE6XHJcbiAgICAgICAgdmFsdWU6IDFcclxuICAgICAgICBkdXJhdGlvbjogNDAwXHJcbiAgICAgIHlveW86IGZhbHNlXHJcbiAgICAgIGxvb3A6IDBcclxuICAgICAgcGF1c2VkOiB0cnVlXHJcbiAgICB9XHJcblxyXG4gICAgQGxvc2VUZXh0ID0gQGFkZC50ZXh0KEB3IC8gMiwgQGggLyAyLCAnWW91IGxvc2UhJywgQGZvbnRzLmxvc2UpXHJcbiAgICBAbG9zZVRleHQuc2V0T3JpZ2luKDAuNSlcclxuICAgIEBsb3NlVGV4dC5zZXRTaGFkb3coOCwgOClcclxuICAgIEBsb3NlVGV4dC5hbHBoYSA9IDBcclxuICAgIEBsb3NlVHdlZW4gPSBAdHdlZW5zLmFkZCB7XHJcbiAgICAgIHRhcmdldHM6IEBsb3NlVGV4dFxyXG4gICAgICBhbHBoYTpcclxuICAgICAgICB2YWx1ZTogMVxyXG4gICAgICAgIGR1cmF0aW9uOiA0MDBcclxuICAgICAgeW95bzogZmFsc2VcclxuICAgICAgbG9vcDogMFxyXG4gICAgICBwYXVzZWQ6IHRydWVcclxuICAgIH1cclxuXHJcbiAgICBAbXMuYWRkRXZlbnRMaXN0ZW5lcihAbXNFdmVudC5iaW5kKHRoaXMpKVxyXG4gICAgQG1zLnVwZGF0ZUFsbCgpXHJcblxyXG4gIG1zRXZlbnQ6IChldiwgYXJncykgLT5cclxuICAgIGlmIGV2ICE9ICdjZWxsJ1xyXG4gICAgICBjb25zb2xlLmxvZyBcIkhVRCBtc0V2ZW50OiAje2V2fTogI3tKU09OLnN0cmluZ2lmeShhcmdzKX1cIlxyXG4gICAgc3dpdGNoIGV2XHJcbiAgICAgIHdoZW4gJ25ldydcclxuICAgICAgICBAd2luVGV4dC5hbHBoYSA9IDBcclxuICAgICAgICBAbG9zZVRleHQuYWxwaGEgPSAwXHJcbiAgICAgIHdoZW4gJ2xpZmUnXHJcbiAgICAgICAgQGxpZmVUd2Vlbi5yZXN1bWUoKVxyXG4gICAgICAgIEBsaWZlVHdlZW4ucmVzdGFydCgpXHJcbiAgICAgIHdoZW4gJ3dpbidcclxuICAgICAgICBAd2luVGV4dC5hbHBoYSA9IDBcclxuICAgICAgICBAd2luVHdlZW4ucmVzdW1lKClcclxuICAgICAgICBAd2luVHdlZW4ucmVzdGFydCgpXHJcbiAgICAgIHdoZW4gJ2xvc2UnXHJcbiAgICAgICAgQGxvc2VUd2Vlbi5yZXN1bWUoKVxyXG4gICAgICAgIEBsb3NlVHdlZW4ucmVzdGFydCgpXHJcblxyXG4gIHRvZ2dsZU1vZGU6IC0+XHJcbiAgICBpZiBAbXMuZ2FtZW92ZXJcclxuICAgICAgQG1zLm5ld0dhbWUoKVxyXG4gICAgZWxzZSBpZiBAbW9kZSA9PSAnYm9tYidcclxuICAgICAgQG1vZGUgPSAnZmxhZydcclxuICAgIGVsc2VcclxuICAgICAgQG1vZGUgPSAnYm9tYidcclxuXHJcbiAgICBAYnV0dG9ucy5tb2RlLnNldFRleHR1cmUoXCJidG5fI3tAbW9kZX1cIilcclxuICAgIEBzY2VuZS5nZXQoJ2dhbWUnKS5zZXRNb2RlKEBtb2RlKVxyXG5cclxuICB1cGRhdGU6IC0+XHJcblxyXG4gIHNldE1hZ25pZnlpbmdHbGFzczogKHgsIHksIGFscGhhKSAtPlxyXG4gICAgQGdsYXNzLnggPSB4XHJcbiAgICBAZ2xhc3MueSA9IHlcclxuICAgIEBnbGFzcy5hbHBoYSA9IGFscGhhXHJcblxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBCR01IdWRTY2VuZVxyXG4iLCJjbGFzcyBCR01NZW51U2NlbmUgZXh0ZW5kcyBQaGFzZXIuU2NlbmVcclxuICBjb25zdHJ1Y3RvcjogLT5cclxuICAgIHN1cGVyIHtcclxuICAgICAga2V5OiAnbWVudSdcclxuICAgICAgYWN0aXZlOiBmYWxzZVxyXG4gICAgfVxyXG5cclxuICAgIEBtcyA9IHJlcXVpcmUgJy4vTWluZVN3ZWVwZXInXHJcblxyXG4gIHByZWxvYWQ6IC0+XHJcblxyXG4gIGNyZWF0ZTogLT5cclxuICAgIEB3ID0gQGNhbWVyYXMubWFpbi53aWR0aFxyXG4gICAgQGggPSBAY2FtZXJhcy5tYWluLmhlaWdodFxyXG5cclxuICAgIEBmb250cyA9XHJcbiAgICAgIHRpdGxlOlxyXG4gICAgICAgIGZvbnRGYW1pbHk6ICdFYWdsZSBMYWtlJ1xyXG4gICAgICAgIGZvbnRTaXplOiBcIiN7TWF0aC5mbG9vcihAaCAvIDgpfXB4XCJcclxuICAgICAgICBjb2xvcjogJyNmZmYnXHJcbiAgICAgIGJ1dHRvbjpcclxuICAgICAgICBmb250RmFtaWx5OiAnRWFnbGUgTGFrZSdcclxuICAgICAgICBmb250U2l6ZTogXCIje01hdGguZmxvb3IoQGggLyAxMil9cHhcIlxyXG4gICAgICAgIGNvbG9yOiAnI2ZmZidcclxuXHJcbiAgICBAcGFuZWxCYWNrZ3JvdW5kID0gQGFkZC5ncmFwaGljcygpXHJcbiAgICBAcGFuZWxCYWNrZ3JvdW5kLmZpbGxTdHlsZSgweDMzMDAzMywgMSlcclxuICAgIEBwYW5lbEJhY2tncm91bmQuZmlsbFJlY3QoMCwgMCwgQHcsIEBoKVxyXG4gICAgQHBhbmVsQmFja2dyb3VuZC5zZXRJbnRlcmFjdGl2ZShuZXcgUGhhc2VyLkdlb20uUmVjdGFuZ2xlKDAsIDAsIEB3LCBAaCksIFBoYXNlci5HZW9tLlJlY3RhbmdsZS5Db250YWlucyk7XHJcblxyXG4gICAgQHRpdGxlID0gQGFkZC50ZXh0KEB3IC8gMiwgQGggLyAyMCwgJ0JhZCBHdXkgTWluZXN3ZWVwZXInLCBAZm9udHMudGl0bGUpXHJcbiAgICBAdGl0bGUuc2V0T3JpZ2luKDAuNSwgMC4wKVxyXG5cclxuICAgIEBuZXh0QnV0dG9uSW5kZXggPSAwXHJcbiAgICBAYWRkQnV0dG9uIFwiQmVnaW5uZXJcIiwgPT5cclxuICAgICAgQG5ld0dhbWUoOCwgOCwgMTApXHJcbiAgICBAYWRkQnV0dG9uIFwiSW50ZXJtZWRpYXRlXCIsID0+XHJcbiAgICAgIEBuZXdHYW1lKDE2LCAxNiwgNDApXHJcbiAgICBAYWRkQnV0dG9uIFwiRXhwZXJ0XCIsID0+XHJcbiAgICAgIEBuZXdHYW1lKDMwLCAxNiwgOTkpXHJcbiAgICBAYWRkQnV0dG9uIFwiSHVnZVwiLCA9PlxyXG4gICAgICBAbmV3R2FtZSg1MCwgMzAsIDI0MClcclxuXHJcbiAgICBAbmV4dEJ1dHRvbkluZGV4ICs9IDFcclxuICAgIEBhZGRCdXR0b24gXCJSZXN1bWVcIiwgPT5cclxuICAgICAgQHNjZW5lLnNsZWVwKCdtZW51JylcclxuXHJcbiAgYWRkQnV0dG9uOiAodGV4dCwgY2IpIC0+XHJcbiAgICBidXR0b25JbmRleCA9IEBuZXh0QnV0dG9uSW5kZXhcclxuICAgIEBuZXh0QnV0dG9uSW5kZXggKz0gMVxyXG5cclxuICAgIGJ1dHRvblcgPSBNYXRoLmZsb29yKEB3IC8gMilcclxuICAgIGJ1dHRvbkggPSBNYXRoLmZsb29yKEBoIC8gMTApXHJcbiAgICBidXR0b25NYXJnaW4gPSBNYXRoLmZsb29yKGJ1dHRvbkggLyA0KVxyXG4gICAgYnV0dG9uWCA9IChAdyAvIDIpXHJcbiAgICBidXR0b25ZID0gKEBoIC8gMy41KSArIChidXR0b25JbmRleCAqIChidXR0b25IICsgYnV0dG9uTWFyZ2luKSlcclxuICAgIGNlbnRlck9mZnNldFggPSAoYnV0dG9uVyAvIDIpXHJcbiAgICBjZW50ZXJPZmZzZXRZID0gKGJ1dHRvbkggLyAyKVxyXG5cclxuICAgIGJ1dHRvbiA9IEBhZGQuZ3JhcGhpY3MoKVxyXG4gICAgYnV0dG9uLmZpbGxTdHlsZSgweDMzMDAzMywgMSlcclxuICAgIGJ1dHRvbi5maWxsUmVjdChidXR0b25YIC0gY2VudGVyT2Zmc2V0WCwgYnV0dG9uWSAtIGNlbnRlck9mZnNldFksIGJ1dHRvblcsIGJ1dHRvbkgpXHJcbiAgICBidXR0b24uc2V0SW50ZXJhY3RpdmUobmV3IFBoYXNlci5HZW9tLlJlY3RhbmdsZShidXR0b25YIC0gY2VudGVyT2Zmc2V0WCwgYnV0dG9uWSAtIGNlbnRlck9mZnNldFksIGJ1dHRvblcsIGJ1dHRvbkgpLCBQaGFzZXIuR2VvbS5SZWN0YW5nbGUuQ29udGFpbnMpO1xyXG4gICAgdGV4dCA9IEBhZGQudGV4dChidXR0b25YLCBidXR0b25ZLCB0ZXh0LCBAZm9udHMuYnV0dG9uKVxyXG4gICAgdGV4dC5zZXRPcmlnaW4oMC41KVxyXG4gICAgYnV0dG9uLm9uICdwb2ludGVyZG93bicsIC0+XHJcbiAgICAgIGNiKClcclxuXHJcbiAgbmV3R2FtZTogKHcsIGgsIG0pIC0+XHJcbiAgICBAbXMubmV3R2FtZSh3LCBoLCBtKVxyXG4gICAgQHNjZW5lLnNsZWVwKCdtZW51JylcclxuXHJcbiAgdXBkYXRlOiAtPlxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBCR01NZW51U2NlbmVcclxuIiwicHJvcHNUb1NhdmUgPSBbXHJcbiAgJ3NlZWQnXHJcbiAgJ3dpZHRoJ1xyXG4gICdoZWlnaHQnXHJcbiAgJ2JvbWInXHJcbiAgJ3Zpc2libGUnXHJcbiAgJ2xpdmVzJ1xyXG4gICdtaW5lQ291bnQnXHJcbiAgJ2dhbWVvdmVyJ1xyXG5dXHJcblxyXG5jbGFzcyBNaW5lU3dlZXBlclxyXG4gIGNvbnN0cnVjdG9yOiAtPlxyXG4gICAgQGxpc3RlbmVycyA9IFtdXHJcbiAgICBAd2lkdGggPSAwXHJcbiAgICBAaGVpZ2h0ID0gMFxyXG4gICAgQG1pbmVDb3VudCA9IDBcclxuICAgIGlmIG5vdCBAbG9hZCgpXHJcbiAgICAgIEBuZXdHYW1lKClcclxuXHJcbiAgbG9hZDogLT5cclxuICAgIHJhd0RhdGEgPSBsb2NhbFN0b3JhZ2UuZ2V0SXRlbShcInNhdmVcIilcclxuICAgIGlmIG5vdCByYXdEYXRhP1xyXG4gICAgICByZXR1cm4gZmFsc2VcclxuICAgIHRyeVxyXG4gICAgICBkYXRhID0gSlNPTi5wYXJzZShyYXdEYXRhKVxyXG4gICAgY2F0Y2hcclxuICAgICAgZGF0YSA9IG51bGxcclxuXHJcbiAgICBpZiBub3QgZGF0YT9cclxuICAgICAgcmV0dXJuIGZhbHNlXHJcblxyXG4gICAgZm9yIHAgaW4gcHJvcHNUb1NhdmVcclxuICAgICAgaWYgbm90IGRhdGEuaGFzT3duUHJvcGVydHkocClcclxuICAgICAgICByZXR1cm4gZmFsc2VcclxuXHJcbiAgICBmb3IgcCBpbiBwcm9wc1RvU2F2ZVxyXG4gICAgICB0aGlzW3BdID0gZGF0YVtwXVxyXG4gICAgcmV0dXJuIHRydWVcclxuXHJcbiAgc2F2ZTogLT5cclxuICAgIGRhdGEgPSB7fVxyXG4gICAgZm9yIHAgaW4gcHJvcHNUb1NhdmVcclxuICAgICAgZGF0YVtwXSA9IHRoaXNbcF1cclxuICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKFwic2F2ZVwiLCBKU09OLnN0cmluZ2lmeShkYXRhKSlcclxuXHJcbiAgYWRkRXZlbnRMaXN0ZW5lcjogKGV2bCkgLT5cclxuICAgIEBsaXN0ZW5lcnMucHVzaChldmwpXHJcblxyXG4gIHJhbmQ6ICh4KSAtPlxyXG4gICAgcmV0dXJuIE1hdGguZmxvb3IoTWF0aC5iZ21yYW5kb20oKSAqIHgpXHJcblxyXG4gIG5laWdoYm9yczogKGksIGosIHVuZmxhZ2dlZE9ubHkpIC0+XHJcbiAgICBuID0gMFxyXG4gICAgeDEgPSBNYXRoLm1heChpIC0gMSwgMClcclxuICAgIHgyID0gTWF0aC5taW4oQHdpZHRoIC0gMSwgaSArIDEpXHJcbiAgICB5MSA9IE1hdGgubWF4KGogLSAxLCAwKVxyXG4gICAgeTIgPSBNYXRoLm1pbihAaGVpZ2h0IC0gMSwgaiArIDEpXHJcbiAgICB4ID0geDFcclxuICAgIHdoaWxlIHggPD0geDJcclxuICAgICAgeSA9IHkxXHJcbiAgICAgIHdoaWxlIHkgPD0geTJcclxuICAgICAgICBpZiB4ICE9IGkgb3IgeSAhPSBqXHJcbiAgICAgICAgICBpZiAhdW5mbGFnZ2VkT25seSBvciAoQHZpc2libGVbeCArIHkgKiBAd2lkdGhdID09IDApXHJcbiAgICAgICAgICAgIGlmIEBib21iW3ggKyB5ICogQHdpZHRoXSA9PSAxXHJcbiAgICAgICAgICAgICAgKytuXHJcbiAgICAgICAgKyt5XHJcbiAgICAgICsreFxyXG4gICAgcmV0dXJuIG5cclxuXHJcbiAgaGFzVmlzaWJsZVplcm9OZWlnaGJvcjogKGksIGopIC0+XHJcbiAgICB4MSA9IE1hdGgubWF4KGkgLSAxLCAwKVxyXG4gICAgeDIgPSBNYXRoLm1pbihAd2lkdGggLSAxLCBpICsgMSlcclxuICAgIHkxID0gTWF0aC5tYXgoaiAtIDEsIDApXHJcbiAgICB5MiA9IE1hdGgubWluKEBoZWlnaHQgLSAxLCBqICsgMSlcclxuICAgIHggPSB4MVxyXG4gICAgd2hpbGUgeCA8PSB4MlxyXG4gICAgICB5ID0geTFcclxuICAgICAgd2hpbGUgeSA8PSB5MlxyXG4gICAgICAgIGlmIHggIT0gaSBvciB5ICE9IGpcclxuICAgICAgICAgIGlmIEB2aXNpYmxlW3ggKyB5ICogQHdpZHRoXSAhPSAwXHJcbiAgICAgICAgICAgIG4gPSBAbmVpZ2hib3JzKHgsIHksIGZhbHNlKVxyXG4gICAgICAgICAgICBpZiBuID09IDBcclxuICAgICAgICAgICAgICByZXR1cm4gdHJ1ZVxyXG4gICAgICAgICsreVxyXG4gICAgICArK3hcclxuICAgIHJldHVybiBmYWxzZVxyXG5cclxuICBsb3NlTGlmZTogLT5cclxuICAgIEBsaXZlcyAtPSAxXHJcbiAgICBpZiBAbGl2ZXMgPiAwXHJcbiAgICAgIGZvciBldmwgaW4gQGxpc3RlbmVyc1xyXG4gICAgICAgIGV2bCgnbGlmZScsIFtAbGl2ZXNdKVxyXG4gICAgICByZXR1cm4gZmFsc2VcclxuICAgIHJldHVybiB0cnVlXHJcblxyXG4gIHVwZGF0ZUNlbGw6IChpLCBqLCByZXZlYWwpIC0+XHJcbiAgICBpbWFnZSA9ICdibGFuaydcclxuICAgIGluZGV4ID0gaSArIGogKiBAd2lkdGhcclxuICAgIGlzQm9tYiA9IEBib21iW2luZGV4XVxyXG4gICAgaXNWaXNpYmxlID0gQHZpc2libGVbaW5kZXhdXHJcbiAgICBuID0gQG5laWdoYm9ycyhpLCBqLCBmYWxzZSlcclxuICAgIGlmIGlzVmlzaWJsZSA9PSAwXHJcbiAgICAgIGlmIHJldmVhbFxyXG4gICAgICAgIGlmIGlzQm9tYiA9PSAxXHJcbiAgICAgICAgICBpbWFnZSA9ICdib21icmV2ZWFsZWQnXHJcbiAgICAgICAgZWxzZVxyXG4gICAgICAgICAgaW1hZ2UgPSAnc2hhZG93JyArIG5cclxuICAgICAgZWxzZVxyXG4gICAgICAgIGltYWdlID0gJ2JsYW5rJ1xyXG4gICAgZWxzZVxyXG4gICAgICBpZiBpc0JvbWIgPT0gMVxyXG4gICAgICAgIGlmIGlzVmlzaWJsZSA9PSAyXHJcbiAgICAgICAgICBpbWFnZSA9ICdib21iZGVhdGgnXHJcbiAgICAgICAgZWxzZVxyXG4gICAgICAgICAgdW5mbGFnZ2VkID0gQG5laWdoYm9ycyhpLCBqLCB0cnVlKVxyXG4gICAgICAgICAgaWYgdW5mbGFnZ2VkID09IDBcclxuICAgICAgICAgICAgbiA9IDBcclxuICAgICAgICAgIGltYWdlID0gJ2JvbWInICsgblxyXG4gICAgICBlbHNlXHJcbiAgICAgICAgaWYgaXNWaXNpYmxlID09IDJcclxuICAgICAgICAgIGltYWdlID0gJ2JvbWJtaXNmbGFnZ2VkJ1xyXG4gICAgICAgIGVsc2VcclxuICAgICAgICAgIGltYWdlID0gJ29wZW4nICsgblxyXG4gICAgZm9yIGV2bCBpbiBAbGlzdGVuZXJzXHJcbiAgICAgIGV2bCgnY2VsbCcsIFtpLCBqLCBpbWFnZV0pXHJcbiAgICByZXR1cm5cclxuXHJcbiAgdXBkYXRlQWxsOiAocmV2ZWFsID0gZmFsc2UpIC0+XHJcbiAgICBpZiBAbGlzdGVuZXJzLmxlbmd0aCA9PSAwXHJcbiAgICAgIHJldHVyblxyXG5cclxuICAgIGtlZXBHb2luZyA9IHRydWVcclxuICAgIHdoaWxlIGtlZXBHb2luZ1xyXG4gICAgICBrZWVwR29pbmcgPSBmYWxzZVxyXG4gICAgICBmb3IgaiBpbiBbMC4uLkBoZWlnaHRdXHJcbiAgICAgICAgZm9yIGkgaW4gWzAuLi5Ad2lkdGhdXHJcbiAgICAgICAgICBpZiAoQGJvbWJbaSArIGogKiBAd2lkdGhdID09IDApIGFuZCBAaGFzVmlzaWJsZVplcm9OZWlnaGJvcihpLCBqKVxyXG4gICAgICAgICAgICBpZiBAcG9rZShpLCBqKVxyXG4gICAgICAgICAgICAgIGtlZXBHb2luZyA9IHRydWVcclxuXHJcbiAgICB3b24gPSB0cnVlXHJcbiAgICBpZiBAZ2FtZW92ZXJcclxuICAgICAgd29uID0gZmFsc2VcclxuXHJcbiAgICB2aXNpYmxlTWluZXMgPSAwXHJcblxyXG4gICAgZm9yIGogaW4gWzAuLi5AaGVpZ2h0XVxyXG4gICAgICBmb3IgaSBpbiBbMC4uLkB3aWR0aF1cclxuICAgICAgICBpbmRleCA9IGkgKyBqICogQHdpZHRoXHJcbiAgICAgICAgaWYgQHZpc2libGVbaW5kZXhdID09IDBcclxuICAgICAgICAgIHdvbiA9IGZhbHNlXHJcbiAgICAgICAgZWxzZSBpZiBAYm9tYltpbmRleF0gPT0gMVxyXG4gICAgICAgICAgdmlzaWJsZU1pbmVzICs9IDFcclxuICAgICAgICBAdXBkYXRlQ2VsbChpLCBqLCByZXZlYWwpXHJcbiAgICBpZiB3b25cclxuICAgICAgQGdhbWVvdmVyID0gdHJ1ZVxyXG4gICAgICBmb3IgZXZsIGluIEBsaXN0ZW5lcnNcclxuICAgICAgICBldmwoJ3dpbicsIFtdKVxyXG4gICAgZm9yIGV2bCBpbiBAbGlzdGVuZXJzXHJcbiAgICAgIGV2bCgnbWluZXMnLCBbdmlzaWJsZU1pbmVzLCBAbWluZUNvdW50XSlcclxuICAgICAgZXZsKCdsaXZlcycsIFtAbGl2ZXNdKVxyXG4gICAgcmV0dXJuXHJcblxyXG4gIGZsYWc6IChpLCBqKSAtPlxyXG4gICAgaW5kZXggPSBpICsgaiAqIEB3aWR0aFxyXG4gICAgaWYgQHZpc2libGVbaW5kZXhdID09IDBcclxuICAgICAgaWYgQGJvbWJbaW5kZXhdID09IDFcclxuICAgICAgICAjYm9tYltpbmRleF0gPSAwO1xyXG4gICAgICAgICNwb2tlKGksIGopO1xyXG4gICAgICAgIEB2aXNpYmxlW2luZGV4XSA9IDFcclxuICAgICAgZWxzZVxyXG4gICAgICAgICMgQmFkIGZsYWc7IGxvc2UgdGhlIGdhbWVcclxuICAgICAgICBpZiBAbG9zZUxpZmUoKVxyXG4gICAgICAgICAgQHZpc2libGVbaW5kZXhdID0gMlxyXG4gICAgICAgICAgQGdhbWVvdmVyID0gdHJ1ZVxyXG4gICAgICAgICAgQHVwZGF0ZUFsbCh0cnVlKVxyXG4gICAgICAgICAgZm9yIGV2bCBpbiBAbGlzdGVuZXJzXHJcbiAgICAgICAgICAgIGV2bCgnbG9zZScsIFtdKVxyXG4gICAgICAgICAgcmV0dXJuXHJcbiAgICByZXR1cm5cclxuXHJcbiAgcG9rZTogKGksIGopIC0+XHJcbiAgICByZXQgPSBmYWxzZVxyXG4gICAgaW5kZXggPSBpICsgaiAqIEB3aWR0aFxyXG4gICAgaWYgQHZpc2libGVbaW5kZXhdID09IDBcclxuICAgICAgaWYgQGJvbWJbaW5kZXhdID09IDFcclxuICAgICAgICAjIEJhZCBzcG90OyBsb3NlIHRoZSBnYW1lXHJcbiAgICAgICAgaWYgQGxvc2VMaWZlKClcclxuICAgICAgICAgIEB2aXNpYmxlW2luZGV4XSA9IDJcclxuICAgICAgICAgIEBnYW1lb3ZlciA9IHRydWVcclxuICAgICAgICAgIEB1cGRhdGVBbGwodHJ1ZSlcclxuICAgICAgICAgIGZvciBldmwgaW4gQGxpc3RlbmVyc1xyXG4gICAgICAgICAgICBldmwoJ2xvc2UnLCBbXSlcclxuICAgICAgICAgIHJldHVybiBmYWxzZVxyXG4gICAgICAgIGVsc2VcclxuICAgICAgICAgIHJldHVybiBmYWxzZVxyXG4gICAgICBAdmlzaWJsZVtpbmRleF0gPSAxXHJcbiAgICAgIHJldCA9IHRydWVcclxuICAgIHJldHVybiByZXRcclxuXHJcbiAgZmlyc3RDbGlja0lzRnJlZTogLT5cclxuICAgIGNlbGxDb3VudCA9IEB3aWR0aCAqIEBoZWlnaHRcclxuICAgIHN0YXJ0SW5kZXggPSBAcmFuZChjZWxsQ291bnQpXHJcbiAgICBpbmRleCA9IHN0YXJ0SW5kZXhcclxuICAgIGxvb3BcclxuICAgICAgaSA9IE1hdGguZmxvb3IoaW5kZXggJSBAd2lkdGgpXHJcbiAgICAgIGogPVxyXG4gICAgICAgIE1hdGguZmxvb3IoaW5kZXggLyBAd2lkdGgpXHJcbiAgICAgIG4gPSBAbmVpZ2hib3JzKGksIGosIGZhbHNlKVxyXG4gICAgICBpZiBAYm9tYltpbmRleF0gPT0gMCBhbmQgbiA9PSAwXHJcbiAgICAgICAgQHBva2UoaSwgailcclxuICAgICAgICByZXR1cm5cclxuICAgICAgaW5kZXggPSAoaW5kZXggKyAxKSAlIGNlbGxDb3VudFxyXG4gICAgICBpZiBpbmRleCA9PSBzdGFydEluZGV4XHJcbiAgICAgICAgYnJlYWtcclxuICAgIGxvb3BcclxuICAgICAgaSA9IE1hdGguZmxvb3IoaW5kZXggJSBAd2lkdGgpXHJcbiAgICAgIGogPSBNYXRoLmZsb29yKGluZGV4IC8gQHdpZHRoKVxyXG4gICAgICBuID0gbmVpZ2hib3JzKGksIGosIGZhbHNlKVxyXG4gICAgICBpZiBAYm9tYltpbmRleF0gPT0gMFxyXG4gICAgICAgIEBwb2tlKGksIGopXHJcbiAgICAgICAgcmV0dXJuXHJcbiAgICAgIGluZGV4ID0gKGluZGV4ICsgMSkgJSBjZWxsQ291bnRcclxuICAgICAgaWYgaW5kZXggPT0gc3RhcnRJbmRleFxyXG4gICAgICAgIGJyZWFrXHJcbiAgICByZXR1cm5cclxuXHJcbiAgbmV3R2FtZTogKHdpZHRoID0gMCwgaGVpZ2h0ID0gMCwgbWluZUNvdW50ID0gMCwgQHNlZWQgPSBTdHJpbmcoTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogMTAwMDAwMCkpKSAtPlxyXG4gICAgTWF0aC5zZWVkYmdtcmFuZG9tKEBzZWVkKVxyXG5cclxuICAgIGlmIEB3aWR0aCA9PSAwXHJcbiAgICAgIEB3aWR0aCA9IDhcclxuICAgIGlmIEBoZWlnaHQgPT0gMFxyXG4gICAgICBAaGVpZ2h0ID0gOFxyXG5cclxuICAgICMgQnkgZGVmYXVsdCwgbGV0IG5ld0dhbWUoKSByZS1wbGF5IHdoYXRldmVyIHRoZSBsYXN0IHNldHRpbmcgd2FzXHJcbiAgICBpZiB3aWR0aCAhPSAwXHJcbiAgICAgIEB3aWR0aCA9IHdpZHRoXHJcbiAgICBpZiBoZWlnaHQgIT0gMFxyXG4gICAgICBAaGVpZ2h0ID0gaGVpZ2h0XHJcbiAgICBpZiBtaW5lQ291bnQgIT0gMFxyXG4gICAgICBAbWluZUNvdW50ID0gbWluZUNvdW50XHJcblxyXG4gICAgQGxpdmVzID0gM1xyXG5cclxuICAgIGNlbGxDb3VudCA9IEB3aWR0aCAqIEBoZWlnaHRcclxuICAgIGlmIEBtaW5lQ291bnQgPT0gMFxyXG4gICAgICBNSU5FX0RFTlNJVFkgPSAwLjE2XHJcbiAgICAgIEBtaW5lQ291bnQgPSBNYXRoLmZsb29yKGNlbGxDb3VudCAqIE1JTkVfREVOU0lUWSlcclxuXHJcbiAgICBAbWluZUNvdW50ID0gTWF0aC5taW4oQG1pbmVDb3VudCwgY2VsbENvdW50IC0gMSlcclxuXHJcbiAgICBAZ2FtZW92ZXIgPSBmYWxzZVxyXG5cclxuICAgICMgQ3JlYXRlIGZyZXNoIGFycmF5c1xyXG4gICAgQGJvbWIgPSBuZXcgQXJyYXkoY2VsbENvdW50KS5maWxsKDApXHJcbiAgICBAdmlzaWJsZSA9IG5ldyBBcnJheShjZWxsQ291bnQpLmZpbGwoMClcclxuXHJcbiAgICAjIERyb3AgaW4gdGhlIG1pbmVzIHJhbmRvbWx5XHJcbiAgICBpbmRpY2VzID0gbmV3IEFycmF5KGNlbGxDb3VudClcclxuICAgIGluZGljZXNbMF0gPSAwXHJcbiAgICBmb3IgaSBpbiBbMS4uLmNlbGxDb3VudF1cclxuICAgICAgaiA9IEByYW5kKGkpXHJcbiAgICAgIGluZGljZXNbaV0gPSBpbmRpY2VzW2pdXHJcbiAgICAgIGluZGljZXNbal0gPSBpXHJcbiAgICBAYm9tYltpbmRpY2VzW2ldXSA9IDEgZm9yIGkgaW4gWzAuLi5AbWluZUNvdW50XVxyXG4gICAgQGZpcnN0Q2xpY2tJc0ZyZWUoKVxyXG4gICAgZm9yIGV2bCBpbiBAbGlzdGVuZXJzXHJcbiAgICAgIGV2bCgnbmV3JywgW10pXHJcbiAgICBAdXBkYXRlQWxsKClcclxuICAgIEBzYXZlKClcclxuICAgIHJldHVyblxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBuZXcgTWluZVN3ZWVwZXIgIyBTaW5nbGV0b25cclxuIiwiRU5HQUdFX0RSQUdfRElTVEFOQ0UgPSAxMFxyXG5ET1VCTEVfQ0xJQ0tfTVMgPSA0MDBcclxuXHJcbmNsYXNzIFRvdWNoSW50ZXJwcmV0ZXJcclxuICBjb25zdHJ1Y3RvcjogLT5cclxuICAgIEB0cmFja2VkID0gW11cclxuICAgIEBkcmFnWCA9IDBcclxuICAgIEBkcmFnWSA9IDBcclxuICAgIEBkcmFnZ2luZyA9IGZhbHNlXHJcbiAgICBAZG91YmxlQ2xpY2tUaW1lID0gbnVsbFxyXG4gICAgQHBpbmNoQW5jaG9yID0gbnVsbFxyXG4gICAgQHBpbmNoQW5jaG9yV29ybGQgPSBudWxsXHJcblxyXG4gIGNyZWF0ZTogKEBzY2VuZSwgQGNhbWVyYSwgQHgsIEB5LCBAdywgQGgpIC0+XHJcbiAgICBAY2FtZXJhLnpvb20gPSAxXHJcbiAgICBAc2NlbmUuaW5wdXQuYWRkUG9pbnRlcigxKVxyXG4gICAgQHNjZW5lLmlucHV0Lm1vdXNlLmRpc2FibGVDb250ZXh0TWVudSgpXHJcblxyXG4gICAgQHNjZW5lLmlucHV0Lm9uICdwb2ludGVyZG93bicsIChwb2ludGVyKSA9PlxyXG4gICAgICBpZiBwb2ludGVyLnJpZ2h0QnV0dG9uRG93bigpXHJcbiAgICAgICAgd29ybGRQb3MgPSBAY2FtZXJhLmdldFdvcmxkUG9pbnQocG9pbnRlci5wb3NpdGlvbi54LCBwb2ludGVyLnBvc2l0aW9uLnkpXHJcbiAgICAgICAgQHNjZW5lLnJtYih3b3JsZFBvcy54LCB3b3JsZFBvcy55KVxyXG4gICAgICAgIHJldHVyblxyXG5cclxuICAgICAgaWYgcG9pbnRlci5wb3NpdGlvbi54ID4gKEB4ICsgQHcpXHJcbiAgICAgICAgcmV0dXJuXHJcblxyXG4gICAgICBpZiBAdHJhY2tlZC5sZW5ndGggPT0gMFxyXG4gICAgICAgIEBkcmFnZ2luZyA9IGZhbHNlXHJcblxyXG4gICAgICAjIGNvbnNvbGUubG9nIFwibmV3IHBvaW50ZXIgI3twb2ludGVyLmlkfVwiXHJcbiAgICAgIEB0cmFja2VkLnB1c2gge1xyXG4gICAgICAgIGlkOiBwb2ludGVyLmlkXHJcbiAgICAgICAgcG9zOiBwb2ludGVyLnBvc2l0aW9uLmNsb25lKClcclxuICAgICAgfVxyXG4gICAgICBpZiBAdHJhY2tlZC5sZW5ndGggPT0gMVxyXG4gICAgICAgIEBzZXREcmFnUG9pbnQoKVxyXG4gICAgICBpZiBAdHJhY2tlZC5sZW5ndGggPT0gMlxyXG4gICAgICAgICMgV2UganVzdCBhZGRlZCBhIHNlY29uZCB0b3VjaCBzcG90LiBDYWxjdWxhdGUgdGhlIGFuY2hvciBmb3IgcGluY2hpbmcgbm93XHJcbiAgICAgICAgQGNhbGNQaW5jaEFuY2hvcigpXHJcblxyXG4gICAgICBpZiBAdHJhY2tlZC5sZW5ndGggPiAxXHJcbiAgICAgICAgQGRyYWdnaW5nID0gdHJ1ZVxyXG4gICAgICAgIEBkb3VibGVDbGlja1RpbWUgPSBudWxsXHJcbiAgICAgIGVsc2UgaWYgbm90IEBkcmFnZ2luZ1xyXG4gICAgICAgIG5vdyA9IG5ldyBEYXRlKCkuZ2V0VGltZSgpXHJcbiAgICAgICAgaWYgQGRvdWJsZUNsaWNrVGltZSAhPSBudWxsXHJcbiAgICAgICAgICAjIHNlY29uZCBjbGlja1xyXG4gICAgICAgICAgY2xpY2tEZWx0YSA9IG5vdyAtIEBkb3VibGVDbGlja1RpbWVcclxuICAgICAgICAgIGlmIGNsaWNrRGVsdGEgPCBET1VCTEVfQ0xJQ0tfTVNcclxuICAgICAgICAgICAgQGRvdWJsZUNsaWNrVGltZSA9IG51bGxcclxuICAgICAgICAgICAgIyBjb25zb2xlLmxvZyBcIkRPVUJMRSBUQVAgI3tAdHJhY2tlZFswXS5wb3MueH0gI3tAdHJhY2tlZFswXS5wb3MueX1cIlxyXG4gICAgICAgICAgICByZXR1cm5cclxuICAgICAgICBAZG91YmxlQ2xpY2tUaW1lID0gbm93XHJcblxyXG4gICAgQHNjZW5lLmlucHV0Lm9uICdwb2ludGVybW92ZScsIChwb2ludGVyKSA9PlxyXG4gICAgICBwcmV2RGlzdGFuY2UgPSAwXHJcbiAgICAgIGlmIEB0cmFja2VkLmxlbmd0aCA+PSAyXHJcbiAgICAgICAgcHJldkRpc3RhbmNlID0gQGNhbGNEaXN0YW5jZShAdHJhY2tlZFswXS5wb3MueCwgQHRyYWNrZWRbMF0ucG9zLnksIEB0cmFja2VkWzFdLnBvcy54LCBAdHJhY2tlZFsxXS5wb3MueSlcclxuICAgICAgaWYgQHRyYWNrZWQubGVuZ3RoID09IDFcclxuICAgICAgICBwcmV2WCA9IEB0cmFja2VkWzBdLnBvcy54XHJcbiAgICAgICAgcHJldlkgPSBAdHJhY2tlZFswXS5wb3MueVxyXG5cclxuICAgICAgaW5kZXggPSAtMVxyXG4gICAgICBmb3IgaSBpbiBbMC4uLkB0cmFja2VkLmxlbmd0aF1cclxuICAgICAgICBpZiBAdHJhY2tlZFtpXS5pZCA9PSBwb2ludGVyLmlkXHJcbiAgICAgICAgICBpbmRleCA9IGlcclxuICAgICAgICAgIGJyZWFrXHJcbiAgICAgIGlmIGluZGV4ID09IC0xXHJcbiAgICAgICAgcmV0dXJuXHJcblxyXG4gICAgICBAdHJhY2tlZFtpbmRleF0ucG9zID0gcG9pbnRlci5wb3NpdGlvbi5jbG9uZSgpXHJcblxyXG4gICAgICBpZiBAdHJhY2tlZC5sZW5ndGggPT0gMVxyXG4gICAgICAgICMgc2luZ2xlIHRvdWNoLCBjb25zaWRlciBkcmFnZ2luZ1xyXG4gICAgICAgIGRyYWdEaXN0YW5jZSA9IEBjYWxjRGlzdGFuY2UgQGRyYWdYLCBAZHJhZ1ksIEB0cmFja2VkWzBdLnBvcy54LCBAdHJhY2tlZFswXS5wb3MueVxyXG4gICAgICAgIGlmIEBkcmFnZ2luZyBvciAoZHJhZ0Rpc3RhbmNlID4gRU5HQUdFX0RSQUdfRElTVEFOQ0UpXHJcbiAgICAgICAgICBAZHJhZ2dpbmcgPSB0cnVlXHJcbiAgICAgICAgICBpZiBkcmFnRGlzdGFuY2UgPiAwLjVcclxuICAgICAgICAgICAgZHggPSBAdHJhY2tlZFswXS5wb3MueCAtIEBkcmFnWFxyXG4gICAgICAgICAgICBkeSA9IEB0cmFja2VkWzBdLnBvcy55IC0gQGRyYWdZXHJcbiAgICAgICAgICAgICMgY29uc29sZS5sb2cgXCJzaW5nbGUgZHJhZzogI3tkeH0sICN7ZHl9XCJcclxuICAgICAgICAgICAgQGNhbWVyYS5zY3JvbGxYIC09IGR4IC8gQGNhbWVyYS56b29tXHJcbiAgICAgICAgICAgIEBjYW1lcmEuc2Nyb2xsWSAtPSBkeSAvIEBjYW1lcmEuem9vbVxyXG5cclxuICAgICAgICAgICAgIyBjb25zb2xlLmxvZyBcInNjcm9sbCAje0BjYW1lcmEuc2Nyb2xsWH0gI3tAY2FtZXJhLnpvb219ICN7QGNhbWVyYS53aWR0aH1cIlxyXG4gICAgICAgICAgQHNldERyYWdQb2ludCgpXHJcblxyXG4gICAgICBlbHNlIGlmIEB0cmFja2VkLmxlbmd0aCA+PSAyXHJcbiAgICAgICAgIyBhdCBsZWFzdCB0d28gZmluZ2VycyBwcmVzZW50LCBjaGVjayBmb3IgcGluY2gvem9vbVxyXG4gICAgICAgIGN1cnJEaXN0YW5jZSA9IEBjYWxjRGlzdGFuY2UoQHRyYWNrZWRbMF0ucG9zLngsIEB0cmFja2VkWzBdLnBvcy55LCBAdHJhY2tlZFsxXS5wb3MueCwgQHRyYWNrZWRbMV0ucG9zLnkpXHJcbiAgICAgICAgZGVsdGFEaXN0YW5jZSA9IGN1cnJEaXN0YW5jZSAtIHByZXZEaXN0YW5jZVxyXG4gICAgICAgIGlmIGRlbHRhRGlzdGFuY2UgIT0gMFxyXG4gICAgICAgICAgbmV3Wm9vbSA9IEBjYW1lcmEuem9vbSAqICgxICsgKGRlbHRhRGlzdGFuY2UgKiA0IC8gQGNhbWVyYS53aWR0aCkpXHJcbiAgICAgICAgICBAYWRqdXN0Wm9vbShuZXdab29tKVxyXG4gICAgICByZXR1cm5cclxuXHJcbiAgICBAc2NlbmUuaW5wdXQub24gJ3BvaW50ZXJ1cCcsIChwb2ludGVyKSA9PlxyXG4gICAgICBpbmRleCA9IC0xXHJcbiAgICAgIGZvciBpIGluIFswLi4uQHRyYWNrZWQubGVuZ3RoXVxyXG4gICAgICAgIGlmIEB0cmFja2VkW2ldLmlkID09IHBvaW50ZXIuaWRcclxuICAgICAgICAgIGluZGV4ID0gaVxyXG4gICAgICAgICAgYnJlYWtcclxuICAgICAgaWYgaW5kZXggPT0gLTFcclxuICAgICAgICByZXR1cm5cclxuXHJcbiAgICAgIGlmIEB0cmFja2VkLmxlbmd0aCA9PSAxXHJcbiAgICAgICAgaWYgbm90IEBkcmFnZ2luZ1xyXG4gICAgICAgICAgd29ybGRQb3MgPSBAY2FtZXJhLmdldFdvcmxkUG9pbnQoQHRyYWNrZWRbMF0ucG9zLngsIEB0cmFja2VkWzBdLnBvcy55KVxyXG4gICAgICAgICAgIyBjb25zb2xlLmxvZyBcIlRBUCAje3dvcmxkUG9zLnh9ICN7d29ybGRQb3MueX0gI3tAY2FtZXJhLnNjcm9sbFh9ICN7QGNhbWVyYS5zY3JvbGxZfSAje0BjYW1lcmEuem9vbX1cIlxyXG4gICAgICAgICAgQHNjZW5lLnRhcCh3b3JsZFBvcy54LCB3b3JsZFBvcy55KVxyXG5cclxuICAgICAgQHRyYWNrZWQuc3BsaWNlKGluZGV4LCAxKVxyXG4gICAgICBpZiBAdHJhY2tlZC5sZW5ndGggPT0gMVxyXG4gICAgICAgIEBzZXREcmFnUG9pbnQoKVxyXG5cclxuICAgICAgaWYgaW5kZXggPCAyXHJcbiAgICAgICAgIyBXZSBqdXN0IGZvcmdvdCBvbmUgb2Ygb3VyIHBpbmNoIHRvdWNoZXMuIFBpY2sgYSBuZXcgYW5jaG9yIHNwb3QuXHJcbiAgICAgICAgQGNhbGNQaW5jaEFuY2hvcigpXHJcblxyXG4gICAgICBAc2NlbmUuc2V0TWFnbmlmeWluZ0dsYXNzKDAsIDAsIDApXHJcbiAgICAgIHJldHVyblxyXG5cclxuICAgIEBzY2VuZS5pbnB1dC5vbiAnd2hlZWwnLCAocG9pbnRlciwgZ2FtZU9iamVjdHMsIGRlbHRhWCwgZGVsdGFZLCBkZWx0YVopID0+XHJcbiAgICAgIEBjYWxjUGluY2hBbmNob3IocG9pbnRlci5wb3NpdGlvbi54LCBwb2ludGVyLnBvc2l0aW9uLnkpXHJcbiAgICAgIG5ld1pvb20gPSBAY2FtZXJhLnpvb20gKiAoMSAtIChkZWx0YVkgLyA0ODApKVxyXG4gICAgICBAYWRqdXN0Wm9vbShuZXdab29tKVxyXG4gICAgICBAc2NlbmUuc2V0TWFnbmlmeWluZ0dsYXNzKDAsIDAsIDApXHJcbiAgICAgIHJldHVyblxyXG5cclxuICBhZGp1c3Rab29tOiAobmV3Wm9vbSkgLT5cclxuICAgIGlmIG5ld1pvb20gPCAwLjFcclxuICAgICAgbmV3Wm9vbSA9IDAuMVxyXG4gICAgaWYgbmV3Wm9vbSA+IDVcclxuICAgICAgbmV3Wm9vbSA9IDVcclxuICAgIEBjYW1lcmEuem9vbSA9IG5ld1pvb21cclxuXHJcbiAgICBoYWxmVyA9IChAY2FtZXJhLndpZHRoIC8gMilcclxuICAgIGhhbGZIID0gKEBjYW1lcmEuaGVpZ2h0IC8gMilcclxuICAgIG9mZnNldFggPSAoQHBpbmNoQW5jaG9yLnggLSBoYWxmVykgLyBuZXdab29tXHJcbiAgICBvZmZzZXRZID0gKEBwaW5jaEFuY2hvci55IC0gaGFsZkgpIC8gbmV3Wm9vbVxyXG4gICAgQGNhbWVyYS5zY3JvbGxYID0gQHBpbmNoQW5jaG9yV29ybGQueCAtIGhhbGZXIC0gb2Zmc2V0WFxyXG4gICAgQGNhbWVyYS5zY3JvbGxZID0gQHBpbmNoQW5jaG9yV29ybGQueSAtIGhhbGZIIC0gb2Zmc2V0WVxyXG4gICAgcmV0dXJuXHJcblxyXG4gIHNldERyYWdQb2ludDogLT5cclxuICAgIEBkcmFnWCA9IEB0cmFja2VkWzBdLnBvcy54XHJcbiAgICBAZHJhZ1kgPSBAdHJhY2tlZFswXS5wb3MueVxyXG5cclxuICBjYWxjUGluY2hBbmNob3I6IChwaW5jaFggPSBudWxsLCBwaW5jaFkgPSBudWxsKSAtPlxyXG4gICAgaWYgKHBpbmNoWCA9PSBudWxsKSBhbmQgKHBpbmNoWSA9PSBudWxsKVxyXG4gICAgICBpZiBAdHJhY2tlZC5sZW5ndGggPCAyXHJcbiAgICAgICAgcmV0dXJuXHJcbiAgICAgIHBpbmNoWCA9IE1hdGguZmxvb3IoKEB0cmFja2VkWzBdLnBvcy54ICsgQHRyYWNrZWRbMV0ucG9zLngpIC8gMilcclxuICAgICAgcGluY2hZID0gTWF0aC5mbG9vcigoQHRyYWNrZWRbMF0ucG9zLnkgKyBAdHJhY2tlZFsxXS5wb3MueSkgLyAyKVxyXG5cclxuICAgIEBwaW5jaEFuY2hvciA9IHt4OiBwaW5jaFgsIHk6IHBpbmNoWSB9XHJcbiAgICBAcGluY2hBbmNob3JXb3JsZCA9IEBjYW1lcmEuZ2V0V29ybGRQb2ludChwaW5jaFgsIHBpbmNoWSlcclxuXHJcbiAgICBAc2NlbmUuc2V0TWFnbmlmeWluZ0dsYXNzKEBwaW5jaEFuY2hvci54LCBAcGluY2hBbmNob3IueSwgMSlcclxuXHJcbiAgY2FsY0Rpc3RhbmNlOiAoeDEsIHkxLCB4MiwgeTIpIC0+XHJcbiAgICBkeCA9IHgyIC0geDFcclxuICAgIGR5ID0geTIgLSB5MVxyXG4gICAgcmV0dXJuIE1hdGguc3FydChkeCpkeCArIGR5KmR5KVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBUb3VjaEludGVycHJldGVyXHJcbiIsIkJHTUdhbWVTY2VuZSA9IHJlcXVpcmUgJy4vQkdNR2FtZVNjZW5lJ1xyXG5CR01IdWRTY2VuZSA9IHJlcXVpcmUgJy4vQkdNSHVkU2NlbmUnXHJcbkJHTU1lbnVTY2VuZSA9IHJlcXVpcmUgJy4vQkdNTWVudVNjZW5lJ1xyXG5cclxuaW5pdCA9IC0+XHJcbiAgY29uc29sZS5sb2cgXCJCYWQgR3V5IE1pbmVzd2VlcGVyOiBpbml0KClcIlxyXG5cclxuICBjb25maWcgPVxyXG4gICAgdHlwZTogUGhhc2VyLkFVVE9cclxuICAgIHdpZHRoOiBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuY2xpZW50V2lkdGhcclxuICAgIGhlaWdodDogZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LmNsaWVudEhlaWdodFxyXG4gICAgYmFja2dyb3VuZENvbG9yOiAnIzAwMDAwMCcgIyAnIzJkMmQyZCdcclxuICAgIHBhcmVudDogJ3NjcmVlbidcclxuICAgIGlucHV0OlxyXG4gICAgICBhY3RpdmVQb2ludGVyczogMlxyXG4gICAgc2NlbmU6IFtcclxuICAgICAgQkdNR2FtZVNjZW5lXHJcbiAgICAgIEJHTUh1ZFNjZW5lXHJcbiAgICAgIEJHTU1lbnVTY2VuZVxyXG4gICAgXVxyXG5cclxuICBnYW1lID0gbmV3IFBoYXNlci5HYW1lKGNvbmZpZylcclxuXHJcblxyXG53aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignbG9hZCcsIChlKSAtPlxyXG4gIGZvbnRzID0gW1xyXG4gICAge1xyXG4gICAgICBuYW1lOiAnRWFnbGUgTGFrZSdcclxuICAgICAgdXJsOiAgJ2ZvbnRzL2VhZ2xlbGFrZS50dGYnXHJcbiAgICB9XHJcbiAgICB7XHJcbiAgICAgIG5hbWU6ICdDb2xvcmVkIENyYXlvbnMnXHJcbiAgICAgIHVybDogICdmb250cy9jcmF5b25zLnR0ZidcclxuICAgIH1cclxuICBdXHJcbiAgcHJvbWlzZXMgPSBbXVxyXG4gIGZvciBmb250IGluIGZvbnRzXHJcbiAgICBkbyAoZm9udCkgLT5cclxuICAgICAgcHJvbWlzZXMucHVzaCBuZXcgUHJvbWlzZSAocmVzb2x2ZSwgcmVqZWN0KSAtPlxyXG4gICAgICAgIG5ld0ZvbnQgPSBuZXcgRm9udEZhY2UoZm9udC5uYW1lLCBcInVybCgje2ZvbnQudXJsfSlcIilcclxuICAgICAgICBuZXdGb250LmxvYWQoKS50aGVuIChsb2FkZWQpIC0+XHJcbiAgICAgICAgICBpZiBsb2FkZWRcclxuICAgICAgICAgICAgZG9jdW1lbnQuZm9udHMuYWRkKGxvYWRlZClcclxuICAgICAgICAgICAgY29uc29sZS5sb2cgXCJMb2FkZWQgRm9udDogI3tmb250Lm5hbWV9XCJcclxuICAgICAgICAgICAgcmVzb2x2ZSgpXHJcbiAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgIHJlamVjdCgpXHJcblxyXG4gICAgUHJvbWlzZS5hbGwocHJvbWlzZXMpLnRoZW4oKGxvYWRlZCkgLT5cclxuICAgICAgaW5pdCgpXHJcbiAgICApLmNhdGNoIChlcnJvcikgLT5cclxuICAgICAgY29uc29sZS5sb2cgXCJFcnJvcjogXCIsIGVycm9yXHJcblxyXG4sIGZhbHNlKVxyXG4iXX0=
