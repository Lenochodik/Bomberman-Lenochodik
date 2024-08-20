/*
@title: Bomberman
@author: Lenochodik
@tags: []
@addedOn: 2024-00-00
*/

// = Helper functions ==============================
// From: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
function getRandomInt(min, max) {
  const minCeiled = Math.ceil(min)
  const maxFloored = Math.floor(max)
  return Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled) // The maximum is exclusive and the minimum is inclusive
}

function getRandomItem(arr) {
  return arr[getRandomInt(0, arr.length)]
}
// =================================================

const player = "p"
const bomb1 = "1"
const bomb2 = "2"
const bomb3 = "3"
const block = "b"
const crate = "c"

const fireCross = "Q"
const fireHorizontal = "W"
const fireVertical = "E"
const fireL = "R"
const fireR = "T"
const fireT = "Z"
const fireB = "U"
const monster1 = "m"
const monster2 = "i"
const monster3 = "j"

const grassBackground = "*"

const bombsSprites = [bomb1, bomb2, bomb3]
const blocksSprites = [block]
const cratesSprites = [crate]

setLegend(
  [player, bitmap`
...CC.....CC....
6.CCCCCCCCCCC...
96CCCCCCCCCCC...
3..C0200020C....
00.CC20002CC....
00.CC22022CC....
C0..C00200C..9..
CC...CCCCC...F..
.CC.CCCCCCC.F...
.CCCCC222CC0FLL.
..CCC222220002LL
...CC2222200001L
...CCC222C00000L
....CCCCCC000000
....LC...CL0000.
...LLL...LLL....`],
  [bomb1, bitmap`
.......6........
.......66.......
......639.......
......939.......
.......F6.......
....000FL00.....
...0000L1L00....
..00000002100...
..00000000210...
..000000000L0...
..00000000000...
..00000000000...
..00000000000...
..00000000000...
...000000000....
....0000000.....`],
  [bomb2, bitmap`
  
.......6........
.......66.......
......639.......
......939.......
......939.......
.......F6.......
....000FL00.....
...0000L1L00....
..00000002100...
..00000000210...
..00000000LL0...
..000000000L0...
..00000000L00...
..00000000000...
...000000000....
....0000000.....`],
  [bomb3, bitmap`
.......6........
.......66.......
......639.......
......939.......
......939.......
......939.......
.......F6.......
....000FL00.....
...0000L1L00....
..00000012100...
..00000001210...
..000000002L0...
..000000001L0...
..0000000LL00...
...0000000L0....
....0000000.....`],
  [crate, bitmap`
FFFFFFFFFFFFFFFF
FF666666666666FF
F6F6666666666F6F
F66FFFFFFFFFF66F
F66F66F66F66F66F
F66F66F66F66F66F
F66F66F66F66F66F
F66F66F66F66F66F
F66F66F66F66F66F
F66F66F66F66F66F
F66F66F66F66F66F
F66F66F66F66F66F
F66FFFFFFFFFF66F
F6F6666666666F6F
FF666666666666FF
FFFFFFFFFFFFFFFF`],
  // TODO: rework this block bitmap
  [block, bitmap`
0000000000000000
0111111111111110
0111111111111110
0111111111111110
0111111111111110
0000000000000000
0LLLLLLLLLLLLLL0
0LLLLLLLLLLLLLL0
0LLLLLLLLLLLLLL0
0LLLLLLLLLLLLLL0
0LLLLLLLLLLLLLL0
0LLLLLLLLLLLLLL0
0LLLLLLLLLLLLLL0
0LLLLLLLLLLLLLL0
0LLLLLLLLLLLLLL0
0000000000000000`],
  // TODO: just for debugging, create better sprites for fire
  [fireCross, bitmap`
......3333......
......3333......
......3333......
......3333......
......3333......
......3333......
3333333333333333
3333333333333333
3333333333333333
3333333333333333
......3333......
......3333......
......3333......
......3333......
......3333......
......3333......`],
  [fireHorizontal, bitmap`
................
................
................
................
................
................
3333333333333333
3333333333333333
3333333333333333
3333333333333333
................
................
................
................
................
................`],
  [fireVertical, bitmap`
......3333......
......3333......
......3333......
......3333......
......3333......
......3333......
......3333......
......3333......
......3333......
......3333......
......3333......
......3333......
......3333......
......3333......
......3333......
......3333......`],
  [fireL, bitmap`
................
................
................
................
................
................
.......333333333
......3333333333
......3333333333
.......333333333
................
................
................
................
................
................`],
  [fireR, bitmap`
................
................
................
................
................
................
333333333.......
3333333333......
3333333333......
333333333.......
................
................
................
................
................
................`],
  [fireT, bitmap`
................
................
................
................
................
................
.......33.......
......3333......
......3333......
......3333......
......3333......
......3333......
......3333......
......3333......
......3333......
......3333......`],
  [fireB, bitmap`
......3333......
......3333......
......3333......
......3333......
......3333......
......3333......
......3333......
......3333......
......3333......
.......33.......
................
................
................
................
................
................`],
  [monster1, bitmap`
.......00.......
.......33...1...
......0000..1111
......8888...1L1
.....8H8838...LL
....882H3288...L
....88088088...9
....88888888...0
....8883H888...0
88...888888...88
.88...8888...880
.888.833HH8.888.
..888338HHH888..
.33.33388HHH.HH.
..3338.88.8HHH..
...33.88.8.HH...`],
  [monster2, bitmap`
................
....DDDDDDD.....
...DDDDDDDDD....
..DDD4DDD4DDD...
..DDD04D40DDD...
..DDDDDDDDDDD...
...DDD000DDD....
....D0DDD0D.....
F...FD4FDDDFF.F.
FF.F4D4.DFDDFF..
4FF44D4DDFD44DD.
4.44DD4D..DD4.D.
444DDF4D...D4.DD
..DDFFDD4..D4F..
.DDFF.D.4..D4F..
DD.F.DD.44.DDFF.`],
  [monster3, bitmap`
................
................
.....555555.....
.....5727755....
....552722755...
....577777275...
....57LLLLL25...
...5577070725...
...57777L7775...
...5757L7L775...
...57577777755..
..557577577575..
..575775757775..
..5757557575755.
.55577577757575.
5757775757577575`],

  [grassBackground, bitmap`
1111111111111111
1111111111111111
1111111111111111
1111111111111111
1111111111111111
1111111111111111
1111111111111111
1111111111111111
1111111111111111
1111111111111111
1111111111111111
1111111111111111
1111111111111111
1111111111111111
1111111111111111
1111111111111111`]
)

setSolids([
  player,
  bomb1, bomb2, bomb3,
  block,
  crate
])

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

function addSpriteWithReturn(x, y, spriteType) {
  addSprite(x, y, spriteType)
  return getAll(spriteType).at(-1) // Little bit hacky, but should work
}

function isSpriteInBounds(x, y) {
  return x >= 0 && y >= 0 &&
    x < width() && y < height()
}


let level = 0
const levels = [
  map`
...............
bbbbbbbbbbbbbbb
bp............b
b.bcb.bmb.b.b.b
b.............b
b.b.b.b.b.b.b.b
b.............b
b.b.b.b.bib.b.b
b.............b
b.b.b.b.b.bjb.b
b.............b
b.b.b.b.b.b.b.b
b.............b
bbbbbbbbbbbbbbb`
]

const soundBombPlant = tune`
100: C5^100,
3100`
const soundBombExplodes = tune`
100: E5/100 + G5/100,
100: F5/100 + A5/100,
100: G5/100 + B5/100 + A5/100,
100: B5/100 + A5/100 + G5/100,
2800`
const melody1 = tune`
115.38461538461539: C5~115.38461538461539,
115.38461538461539: E5~115.38461538461539,
115.38461538461539: C5~115.38461538461539,
115.38461538461539: D5~115.38461538461539,
115.38461538461539: E5~115.38461538461539,
115.38461538461539,
115.38461538461539: D5~115.38461538461539,
115.38461538461539: E5~115.38461538461539,
115.38461538461539: D5~115.38461538461539,
115.38461538461539: C5~115.38461538461539,
230.76923076923077,
115.38461538461539: C5~115.38461538461539,
115.38461538461539: E5~115.38461538461539,
115.38461538461539: C5~115.38461538461539,
115.38461538461539: D5~115.38461538461539,
115.38461538461539: E5~115.38461538461539,
115.38461538461539,
115.38461538461539: D5~115.38461538461539,
115.38461538461539: E5~115.38461538461539,
115.38461538461539: D5~115.38461538461539,
115.38461538461539: C5~115.38461538461539,
230.76923076923077,
115.38461538461539: C5~115.38461538461539,
115.38461538461539: E5~115.38461538461539,
115.38461538461539: C5~115.38461538461539,
115.38461538461539: D5~115.38461538461539,
115.38461538461539: E5~115.38461538461539,
115.38461538461539,
115.38461538461539: D5~115.38461538461539,
115.38461538461539: E5~115.38461538461539`
const soundPlayerMove = tune`
100: D5~100,
3100`
const soundPlayerMoveForbidden = tune`
100: D5~100 + E5~100 + F5~100,
3100`


let gameState = {
  bombsToPlant: 1,
  flameLength: 1,
  playerSpeedMs: 100,
  explosionLastsMs: 500,
  score: 0,
  // player last move tick
  playerLastMoveAt: 0
}

function checkIfPlayerCanMove() {
  const now = performance.now()

  if (now - gameState.playerLastMoveAt >= gameState.playerSpeedMs) {
    gameState.playerLastMoveAt = now
    return true
  }

  return false
}


const bombTimeoutTime = 5000


setMap(levels[level])
setBackground(grassBackground)

setPushables({
  [player]: []
})

let playerObject = getFirst(player)

onInput("s", () => {
  if (!checkIfPlayerCanMove()) return

  playerObject.y += 1
  playTune(soundPlayerMove)
})

onInput("w", () => {
  if (!checkIfPlayerCanMove()) return

  playerObject.y -= 1
  playTune(soundPlayerMove)
})

onInput("a", () => {
  if (!checkIfPlayerCanMove()) return

  playerObject.x -= 1
  playTune(soundPlayerMove)
})

onInput("d", () => {
  if (!checkIfPlayerCanMove()) return

  playerObject.x += 1
  playTune(soundPlayerMove)
})

function addCoords(a, b) {
  return [
    a[0] + b[0],
    a[1] + b[1]
  ]
}

function multiplyCoords(a, m) {
  return [a[0] * m, a[1] * m]
}

const directionsEnum = {
  LEFT: "L",
  RIGHT: "R",
  TOP: "T",
  BOTTOM: "B",
}

const directionsCoords = {
  [directionsEnum.LEFT]: [-1, 0],
  [directionsEnum.RIGHT]: [1, 0],
  [directionsEnum.TOP]: [0, -1],
  [directionsEnum.BOTTOM]: [0, 1]
}

const directionsFires = {
  [directionsEnum.LEFT]: { end: fireL, middle: fireHorizontal },
  [directionsEnum.RIGHT]: { end: fireR, middle: fireHorizontal },
  [directionsEnum.TOP]: { end: fireT, middle: fireVertical },
  [directionsEnum.BOTTOM]: { end: fireB, middle: fireVertical },
}

function explodeInOneDirection(bombCoords, direction) {
  let explodedCoords = []

  const directionCoords = directionsCoords[direction]
  const { end: fireEnd, middle: fireMiddle } = directionsFires[direction]

  for (let i = 1; i <= gameState.flameLength; i++) {
    const newCoords = addCoords(bombCoords, multiplyCoords(directionCoords, i))

    if (!isSpriteInBounds(...newCoords))
      break

    const tileSprites = getTile(...newCoords)

    // Block stops fire
    if (tileSprites.some(x => blocksSprites.includes(x.type)))
      break

    // Crate breaks
    if (tileSprites.some(x => cratesSprites.includes(x.type)))
      break

    // Explode other bomb
    if (tileSprites.some(x => bombsSprites.includes(x.type)))
      break

    addSprite(
      ...newCoords,
      i === gameState.flameLength ? fireEnd : fireMiddle
    )

    explodedCoords.push(newCoords)
  }

  return explodedCoords
}


onInput("k", () => {
  if (gameState.bombsToPlant <= 0)
    return
  gameState.bombsToPlant--

  // Spawn a bomb
  const bombObject = addSpriteWithReturn(playerObject.x, playerObject.y, bomb1)
  playTune(soundBombPlant)

  setTimeout(() => {
    playTune(soundBombExplodes)

    const tileSprites = getTile(bombObject.x, bombObject.y)
    clearTile(bombObject.x, bombObject.y)
    // TODO: add sprites from tile before?

    // Add fire, explosion
    let explodedCoords = [
      [bombObject.x, bombObject.y]
    ]
    addSprite(bombObject.x, bombObject.y, fireCross)
    explodedCoords.push(...explodeInOneDirection([bombObject.x, bombObject.y], directionsEnum.LEFT))
    explodedCoords.push(...explodeInOneDirection([bombObject.x, bombObject.y], directionsEnum.RIGHT))
    explodedCoords.push(...explodeInOneDirection([bombObject.x, bombObject.y], directionsEnum.TOP))
    explodedCoords.push(...explodeInOneDirection([bombObject.x, bombObject.y], directionsEnum.BOTTOM))

    // Hide explosion after some time
    setTimeout(() => {
      for (let coords of explodedCoords) {
        clearTile(...coords)
      }
    }, gameState.explosionLastsMs)

    // Change game state
    gameState.bombsToPlant++
  }, bombTimeoutTime)
})
