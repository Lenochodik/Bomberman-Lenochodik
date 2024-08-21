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
const blockLeft = "l"
const blockRight = "r"
const blockCorner1 = "q"
const blockCorner2 = "x"
const blockCorner3 = "m"
const blockCorner4 = "n"
const crate = "c"
const crateExplosion = "e"

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
const powerup1 = "A"
const powerup2 = "S"
const powerup3 = "D"
const powerup4 = "F"
const portal1 = "H"
const portal2 = "Y"

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
  [crateExplosion, bitmap`
3333333333333333
3399999999999933
3939999999999393
3993333333333993
3993993993993993
3993993993993993
3993993993993993
3993993993993993
3993993993993993
3993993993993993
3993993993993993
3993993993993993
3993333333333993
3939999999999393
3399999999999933
3333333333333333`],
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
  [blockLeft, bitmap`
0000000000000000
011110LLLLLLLLL0
011110LLLLLLLLL0
011110LLLLLLLLL0
011110LLLLLLLLL0
011110LLLLLLLLL0
011110LLLLLLLLL0
011110LLLLLLLLL0
011110LLLLLLLLL0
011110LLLLLLLLL0
011110LLLLLLLLL0
011110LLLLLLLLL0
011110LLLLLLLLL0
011110LLLLLLLLL0
011110LLLLLLLLL0
0000000000000000`],
  [blockRight, bitmap`
0000000000000000
0LLLLLLLLL011110
0LLLLLLLLL011110
0LLLLLLLLL011110
0LLLLLLLLL011110
0LLLLLLLLL011110
0LLLLLLLLL011110
0LLLLLLLLL011110
0LLLLLLLLL011110
0LLLLLLLLL011110
0LLLLLLLLL011110
0LLLLLLLLL011110
0LLLLLLLLL011110
0LLLLLLLLL011110
0LLLLLLLLL011110
0000000000000000`],
  [blockCorner1, bitmap`
0000000000000000
0LLLLLLLLL011110
0LLLLLLLLL011110
0LLLLLLLLL011110
0LLLLLLLLL011110
0LLLLLLLLL011110
0LLLLLLLLL011110
0LLLLLLLLL011110
0LLLLLLLLL011110
0LLLLLLLLL011110
0LLLLLLLLL011110
0LLLLLLLLL011110
0LLLLLLLLL011110
0LLLLLLLLL011110
0LLLLLLLLL011110
0000000000011110`],
  [blockCorner2, bitmap`
0000000000000000
011110LLLLLLLLL0
011110LLLLLLLLL0
011110LLLLLLLLL0
011110LLLLLLLLL0
011110LLLLLLLLL0
011110LLLLLLLLL0
011110LLLLLLLLL0
011110LLLLLLLLL0
011110LLLLLLLLL0
011110LLLLLLLLL0
011110LLLLLLLLL0
011110LLLLLLLLL0
011110LLLLLLLLL0
011110LLLLLLLLL0
0111100000000000`],
  [blockCorner3, bitmap`
0000000000000000
0111111111111110
0111111111111110
0111111111111110
0111111111111110
0000000000011110
0LLLLLLLLL011110
0LLLLLLLLL011110
0LLLLLLLLL011110
0LLLLLLLLL011110
0LLLLLLLLL011110
0LLLLLLLLL011110
0LLLLLLLLL011110
0LLLLLLLLL011110
0LLLLLLLLL011110
0000000000000000`],
  [blockCorner4, bitmap`
0000000000000000
0111111111111110
0111111111111110
0111111111111110
0111111111111110
0111100000000000
011110LLLLLLLLL0
011110LLLLLLLLL0
011110LLLLLLLLL0
011110LLLLLLLLL0
011110LLLLLLLLL0
011110LLLLLLLLL0
011110LLLLLLLLL0
011110LLLLLLLLL0
011110LLLLLLLLL0
0000000000000000`],
  [fireCross, bitmap`
...3962222693...
...3962222693...
..396622226693..
3399662222669933
9966622222266699
6666222222226666
2222222222222222
2222222222222222
2222222222222222
2222222222222222
6666222222226666
9966622222266699
3399662222669933
..396622226693..
...3962222693...
...3962222693...`],
  [fireHorizontal, bitmap`
................
................
................
3333333333333333
9999999999999999
6666666666666666
2222222222222222
2222222222222222
2222222222222222
2222222222222222
6666666666666666
9999999999999999
3333333333333333
................
................
................`],
  [fireVertical, bitmap`
...3962222693...
...3962222693...
...3962222693...
...3962222693...
...3962222693...
...3962222693...
...3962222693...
...3962222693...
...3962222693...
...3962222693...
...3962222693...
...3962222693...
...3962222693...
...3962222693...
...3962222693...
...3962222693...`],
  [fireL, bitmap`
................
................
................
.......333333333
......3999999999
.....39666666666
....396222222222
....962222222222
....962222222222
....396222222222
.....39666666666
......3999999999
.......333333333
................
................
................`],
  [fireR, bitmap`
................
................
................
333333333.......
9999999993......
66666666693.....
222222222693....
222222222269....
222222222269....
222222222693....
66666666693.....
9999999993......
333333333.......
................
................
................`],
  [fireT, bitmap`
................
................
................
................
......3993......
.....396693.....
....39622693....
...3962222693...
...3962222693...
...3962222693...
...3962222693...
...3962222693...
...3962222693...
...3962222693...
...3962222693...
...3962222693...`],
  [fireB, bitmap`
...3962222693...
...3962222693...
...3962222693...
...3962222693...
...3962222693...
...3962222693...
...3962222693...
...3962222693...
...3962222693...
....39622693....
.....396693.....
......3993......
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
  [powerup1, bitmap`
..555555555555..
.55555557577755.
5555555555522555
5555566665552275
5555665566557725
5555655556555575
555555556F555575
5555555565555555
55555566F5555555
555556F555655655
55556F5555566555
5L566555555F6575
5L56FFFFF5F55655
5L55555555552755
.5LL55555572255.
..5LLLL5555555..`],
  [powerup2, bitmap`
..555555555555..
.55555555777555.
5555555555727755
5555555555552275
5555555556666725
5555555666665575
5555566669666555
5555669999966555
5556693339966555
5559933399966555
5553033039665575
5553300339655725
55L5333395555275
555L555555522755
.55LL5555572755.
..555555555555..`],
  [powerup3, bitmap`
..555555655555..
.55555559657755.
5555555639552255
5555555FF5557275
5555500F00055775
5555000FL2L05525
55500000012L0555
555000000L110575
55500000000L0555
5550000000L00555
5550000000L20555
555000000L110575
55550000L2L05725
55L5500000057255
.55LL5555557755.
..555555555555..`],
  [powerup4, bitmap`
..555555555555..
.55555555777755.
5555555555722755
555555559C992275
555555569CC99725
555555596C999575
555555569C999555
55555559CC999555
555996CCC9999555
5599999999999575
5599999999999725
5596669996665725
5L5F6F555F6F7225
55L6FF5556FF5755
.55LL5555555555.
..555555555555..`],
  [portal1, bitmap`
0000000000000000
010LLL1221LLL010
0000000000000000
0L055555555550L0
0L055555777550L0
0L055555555750L0
0105555555575010
0205555555555020
0205555555575020
010L555555555010
0L0L5555555550L0
0L055555555550L0
0L0L5LLL555550L0
0000000000000000
010LLL1221LLL010
0000000000000000`],
  [portal2, bitmap`
0000000000000000
010LLL1221LLL010
0000000000000000
0L077777777770L0
0L077777222770L0
0L077777777270L0
0107777777727010
0207777777777020
0207777777727020
0101777777777010
0L017777777770L0
0L077777777770L0
0L017111777770L0
0000000000000000
010LLL1221LLL010
0000000000000000`],

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
nbbbbbbbbbbbbbm
lp............r
l.bcb.bmb.b.b.r
l.............r
l.b.b.b.b.b.b.r
l.............r
l.b.b.b.bib.b.r
l..H..........r
l.b.b.b.b.bjb.r
l.A.S.D.F.....r
l.b.b.b.b.b.b.r
x.............q
bbbbbbbbbbbbbbb`
]

const soundBombPlant = tune`
100: C5^100,
3100`
const soundBombExplodes = tune`
100: C4/100 + E4/100,
100: D4/100 + F4/100,
100: G4/100 + F4/100 + E4/100,
100: E4/100 + F4/100 + G4/100,
2800`
const soundBombExplodes2 = tune`
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
