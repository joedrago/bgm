class MineSweeper
  constructor: ->
    @listeners = []
    @newGame()

  addEventListener: (evl) ->
    @listeners.push(evl)

  rand: (x) ->
    return Math.floor(Math.bgmrandom() * x)

  neighbors: (i, j, unflaggedOnly) ->
    n = 0
    x1 = Math.max(i - 1, 0)
    x2 = Math.min(@width - 1, i + 1)
    y1 = Math.max(j - 1, 0)
    y2 = Math.min(@height - 1, j + 1)
    x = x1
    while x <= x2
      y = y1
      while y <= y2
        if x != i or y != j
          if !unflaggedOnly or (@visible[x + y * @width] == 0)
            if @bomb[x + y * @width] == 1
              ++n
        ++y
      ++x
    return n

  hasVisibleZeroNeighbor: (i, j) ->
    x1 = Math.max(i - 1, 0)
    x2 = Math.min(@width - 1, i + 1)
    y1 = Math.max(j - 1, 0)
    y2 = Math.min(@height - 1, j + 1)
    x = x1
    while x <= x2
      y = y1
      while y <= y2
        if x != i or y != j
          if @visible[x + y * @width] != 0
            n = @neighbors(x, y, false)
            if n == 0
              return true
        ++y
      ++x
    return false

  loseLife: ->
    @lives -= 1
    if @lives > 0
      for evl in @listeners
        evl('life', [@lives])
      return false
    return true

  updateCell: (i, j, reveal) ->
    image = 'blank'
    index = i + j * @width
    isBomb = @bomb[index]
    isVisible = @visible[index]
    n = @neighbors(i, j, false)
    if isVisible == 0
      if reveal
        if isBomb == 1
          image = 'bombrevealed'
        else
          image = 'shadow' + n
      else
        image = 'blank'
    else
      if isBomb == 1
        if isVisible == 2
          image = 'bombdeath'
        else
          unflagged = @neighbors(i, j, true)
          if unflagged == 0
            n = 0
          image = 'bomb' + n
      else
        if isVisible == 2
          image = 'bombmisflagged'
        else
          image = 'open' + n
    for evl in @listeners
      evl('cell', [i, j, image])
    return

  updateAll: (reveal = false) ->
    if @listeners.length == 0
      return

    keepGoing = true
    while keepGoing
      keepGoing = false
      j = 0
      while j < @height
        i = 0
        while i < @width
          if (@bomb[i + j * @width] == 0) and @hasVisibleZeroNeighbor(i, j)
            if @poke(i, j)
              keepGoing = true
          ++i
        ++j
    j = 0
    while j < @height
      i = 0
      while i < @width
        @updateCell(i, j, reveal)
        ++i
      ++j
    return

  flag: (i, j) ->
    index = i + j * @width
    if @visible[index] == 0
      if @bomb[index] == 1
        #bomb[index] = 0;
        #poke(i, j);
        @visible[index] = 1
      else
        # Bad flag; lose the game
        if @loseLife()
          @visible[index] = 2
          @updateAll(true)
          @gameover = true
          # $('#winlose').html 'BAD FLAG! You lose!'
          return
    return

  poke: (i, j) ->
    ret = false
    index = i + j * @width
    if @visible[index] == 0
      if @bomb[index] == 1
        # Bad spot; lose the game
        if @loseLife()
          @visible[index] = 2
          @gameover = true
          # $('#winlose').html 'BOMB! You lose!'
          @updateAll(true)
          return false
        else
          return false
      @visible[index] = 1
      ret = true
    return ret

  firstClickIsFree: ->
    cellCount = @width * @height
    startIndex = @rand(cellCount)
    index = startIndex
    loop
      i = Math.floor(index % @width)
      j =
        Math.floor(index / @width)
      n = @neighbors(i, j, false)
      if @bomb[index] == 0 and n == 0
        @poke(i, j)
        return
      index = (index + 1) % cellCount
      if index == startIndex
        break
    loop
      i = Math.floor(index % @width)
      j = Math.floor(index / @width)
      n = neighbors(i, j, false)
      if @bomb[index] == 0
        @poke(i, j)
        return
      index = (index + 1) % cellCount
      if index == startIndex
        break
    return

  newGame: (@width = 30, @height = 30, @mineCount = 0, @seed = String(Math.floor(Math.random() * 1000000))) ->
    Math.seedbgmrandom(@seed)

    @lives = 3

    cellCount = @width * @height
    if @mineCount == 0
      MINE_DENSITY = 0.16
      @mineCount = Math.floor(cellCount * MINE_DENSITY)

    @gameover = false

    # Create fresh arrays
    @bomb = new Array(cellCount).fill(0)
    @visible = new Array(cellCount).fill(0)

    # Drop in the mines randomly
    indices = new Array(cellCount)
    indices[0] = 0
    i = 1
    while i < cellCount
      j = @rand(i)
      indices[i] = indices[j]
      indices[j] = i
      ++i
    m = @mineCount
    if m >= cellCount
      m = cellCount - 1
    i = 0
    while i < m
      @bomb[indices[i]] = 1
      ++i
    @firstClickIsFree()
    for evl in @listeners
      evl('new', [])
    @updateAll()
    return

module.exports = new MineSweeper # Singleton