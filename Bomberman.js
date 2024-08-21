/*
@title: Bomberman
@author: Lenochodik
@tags: []
@addedOn: 2024-00-00
*/

// = Helper functions ==============================
// -- Random
// From: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
function getRandomInt(min, max) {
  const minCeiled = Math.ceil(min)
  const maxFloored = Math.floor(max)
  return Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled) // The maximum is exclusive and the minimum is inclusive
}

function getRandomItem(arr) {
  return arr[getRandomInt(0, arr.length)]
}

// -- Timing
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

// -- Sprig
function addSpriteWithReturn(x, y, spriteType) {
  addSprite(x, y, spriteType)
  return getAll(spriteType).at(-1) // Little bit hacky, but should work
}

function isSpriteInBounds(x, y) {
  return x >= 0 && y >= 0 &&
    x < width() && y < height()
}

// -- Player
function checkIfPlayerCanMove() {
  const now = performance.now()

  if (now - gameState.playerLastMoveAt >= gameState.playerSpeedMs) {
    gameState.playerLastMoveAt = now
    return true
  }

  return false
}

function movePlayer(direction) {
  if (!checkIfPlayerCanMove()) return

  const directionCoords = directionsCoords[direction]

  playerObject.x += directionCoords[0]
  playerObject.y += directionCoords[1]

  playTune(soundPlayerMove)
}

// -- Coords
function addCoords(a, b) {
  return [
    a[0] + b[0],
    a[1] + b[1]
  ]
}

function multiplyCoords(a, m) {
  return [a[0] * m, a[1] * m]
}

// -- Bomb
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
    if (tileSprites.some(x => categoryBlocks.includes(x.type)))
      break

    // Crate breaks
    if (tileSprites.some(x => categoryCrates.includes(x.type)))
      break

    // Explode other bomb
    if (tileSprites.some(x => categoryBombs.includes(x.type)))
      break

    addSprite(
      ...newCoords,
      i === gameState.flameLength ? fireEnd : fireMiddle
    )

    explodedCoords.push(newCoords)
  }

  return explodedCoords
}
// =================================================

// = Types =========================================
// Player
const player = "p"
// Bombs
const bomb1 = "1"
const bomb2 = "2"
const bomb3 = "3"
// Blocks
const block = "b"
const blockL = "l"
const blockR = "r"
const blockCorner1 = "q"
const blockCorner2 = "x"
const blockCornerTR = "g"
const blockCornerTL = "n"
// Crates
const crate = "c"
const crateExplosion = "e"
// Fire
const fireCross = "Q"
const fireHorizontal = "W"
const fireVertical = "E"
const fireL = "R"
const fireR = "T"
const fireT = "Z"
const fireB = "U"
// Monsters
const monster1 = "m"
const monster2 = "i"
const monster3 = "j"
const monster4 = "!"
const monster5 = "("
// Powerups
const powerupDouble = "A"
const powerupFlame = "S"
const powerupBomb = "D"
const powerupSpeed = "F"
const powerupRemoteControl = "/"
const powerupPassThroughBombs = ":"
// Portals
const portal1 = "H"
const portal2 = "Y"
// Game UI
const borderT = "L"
const borderB = "X"
const borderL = "C"
const borderR = "V"
const borderBR = "B"
const borderBL = "N"
const borderTL = "M"
const borderTR = ","
// Backgrounds
const background = "*"
// =================================================

// = Type categories ===============================
const categoryBombs = [bomb1, bomb2, bomb3]
const categoryBlocks = [block, blockL, blockR, blockCorner1, blockCorner2, blockCornerTR, blockCornerTL]
const categoryCrates = [crate, crateExplosion]
const categoryFire = [fireCross, fireHorizontal, fireVertical, fireL, fireR, fireT, fireB]
const categoryMonsters = [monster1, monster2, monster3, monster4, monster5]
const categoryPowerups = [powerupDouble, powerupFlame, powerupBomb, powerupSpeed, powerupRemoteControl, powerupPassThroughBombs]
const categoryPortals = [portal1, portal2]
// =================================================

// = Legends, solids, pushables ====================
setLegend(
  // Player
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
  // Bombs
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
  // Crates
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
  // Blocks
  [block, bitmap`
0000000000000000
0111111111111110
01LL11LLLL1LLL10
01L1111111111L10
01LLLLLLLLL1L110
0111111111111110
0000000000000000
0LLLLLLLLLLLLL00
0L0LLL0LLL0LLLL0
0LLLLLLLLLLLLLL0
0LLL0LLLLL0LL0L0
0LLLLLLLLLLLLLL0
0LLLLLLLLLLLLLL0
0L0LLL0LLL0LL0L0
0LLLLLLLLLLLLLL0
0000000000000000`],
  [blockL, bitmap`
0000000000000000
01111100LLLLLLL0
01LL110LLL0LL0L0
01L1L10LLLLLLLL0
01L1110LLLLLLLL0
0111L10L0L0LL0L0
01L1L10LLLLLLLL0
01L1L10LLLLLLLL0
01L1L10LLLLLLLL0
01L1L10L0LLLL0L0
0111L10LLLLLLLL0
0111L10LLL0LLLL0
01L1L10LLLLLLLL0
01LLL10L0LLLL0L0
0111110LLLLLLLL0
0000000000000000`],
  [blockR, bitmap`
0000000000000000
0LLLLLLLL0111110
0L0LLLL0L01LLL10
0LLLLLLLL01L1L10
0LLLL0LLL01L1110
0LLLLLLLL01L1110
0L0LLLL0L01L1L10
0LLLLLLLL01L1L10
0LLLLLLLL01L1L10
0LLLLLLLL01L1L10
0L0LL0L0L01L1110
0LLLLLLLL0111L10
0LLLLLLLL01L1L10
0L0LL0LLL011LL10
0LLLLLLL00111110
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
  [blockCornerTR, bitmap`
0000000000000000
0111111111111110
01L1LLLLL1LL1L10
01L111111111LL10
01LLLLL1LL1L1110
01111111111L1L10
00000000001L1110
0LLLLLLL001L1L10
00LLLL0LL01L1L10
0LLL0LLLL01L1L10
0LLLLL0LL01L1L10
0LLLLLLLL0111L10
00LLLLLLL01L1110
0LLLL0LLL01LLL10
0L0LLLLL00111110
0000000000000000`],
  [blockCornerTL, bitmap`
0000000000000000
0111111111111110
01LL1L1LLLLL1L10
011L111111111L10
01L1LLLLLLL1LL10
01L1111111111110
0111L10000000000
01L1L100LLLLLL00
01L1110LLLLLLLL0
01L1L10L0L0LLLL0
01L1L10LLLLLL0L0
01L1L10LL0LLLLL0
0111L10LLLLLLLL0
01LLL10LLLLLLL00
0111110L0LLL0LL0
0000000000000000`],
  // Fire
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
  // Monsters
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
  [monster4, bitmap`
.....FFFFFF.....
....F666666F....
...F66FFFF66F...
...F6F6F6LF6F...
.6.F6F06L0L6F...
.6.F6F600LFLF...
..6F6FF6F6F6L66.
...F66FFFF66F.6.
...DF666666F..0.
..D4DFFFFFF..00.
.D4D4D6DD6DDD.0.
D44DD4FDDF444D0.
DDD4400DD00DD40D
...DDD444DDDD44D
......DDD4444DD.
.........DDDD...`],
  [monster5, bitmap`
................
................
....0.......0...
....D0.....0D...
...D0D.....D0D..
...DDDDDDDDDDD..
.DDD440000044DDD
D4D44044444044D4
D44D444444444D44
D44D444444444D44
.D44D4444444D444
.D44D4444444D44D
..DDD4444444DDDD
D4444DDDDDDD444D
.DDDD.......DDD.
................`],
  // Powerups
  [powerupDouble, bitmap`
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
  [powerupFlame, bitmap`
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
  [powerupBomb, bitmap`
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
  [powerupSpeed, bitmap`
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
  [powerupRemoteControl, bitmap`
..555555555555..
.55555555777755.
5555555555722755
5553356555332275
5533369653333725
533333F533333375
5333333F33333355
5333330F03333355
5333300L10333355
55330000L2033575
5553000001035725
555500001L055725
5L55500LL0557225
55L5550005555755
.55LL5535555555.
..555555555555..`],
  [powerupPassThroughBombs, bitmap`
..555555655555..
.55555569677755.
55555555F5722755
5555500F00052275
5555000F00005725
55500000000L1575
5500000000000055
5500000000LL1155
5500000000000055
550000000LLL1175
5500000000000025
5500000LLLL11125
5L50000000000225
55L500000L115755
.55LL0000005555.
..555555555555..`],
  // Portals
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
  // Game UI
  [borderT, bitmap`
3333333333333333
9999999999999999
6666666666666666
2222222222222222
7777777777777777
7777777777777777
7777777777777777
7777777777777777
7777777777777777
7777777777777777
7777777777777777
7777777777777777
7777777777777777
7777777777777777
7777777777777777
7777777777777777`],
  [borderB, bitmap`
7777777777777777
7777777777777777
7777777777777777
7777777777777777
7777777777777777
7777777777777777
7777777777777777
7777777777777777
7777777777777777
7777777777777777
7777777777777777
7777777777777777
2222222222222222
6666666666666666
9999999999999999
3333333333333333`],
  [borderL, bitmap`
3962777777777777
3962777777777777
3962777777777777
3962777777777777
3962777777777777
3962777777777777
3962777777777777
3962777777777777
3962777777777777
3962777777777777
3962777777777777
3962777777777777
3962777777777777
3962777777777777
3962777777777777
3962777777777777`],
  [borderR, bitmap`
7777777777772693
7777777777772693
7777777777772693
7777777777772693
7777777777772693
7777777777772693
7777777777772693
7777777777772693
7777777777772693
7777777777772693
7777777777772693
7777777777772693
7777777777772693
7777777777772693
7777777777772693
7777777777772693`],
  [borderBR, bitmap`
7777777777772693
7777777777772693
7777777777772693
7777777777772693
7777777777772693
7777777777772693
7777777777772693
7777777777772693
7777777777772693
7777777777772693
7777777777772693
7777777777772693
2222222222222693
6666666666666693
9999999999999993
3333333333333333`],
  [borderBL, bitmap`
3962777777777777
3962777777777777
3962777777777777
3962777777777777
3962777777777777
3962777777777777
3962777777777777
3962777777777777
3962777777777777
3962777777777777
3962777777777777
3962777777777777
3962222222222222
3966666666666666
3999999999999999
3333333333333333`],
  [borderTL, bitmap`
3333333333333333
3999999999999999
3966666666666666
3962222222222222
3962777777777777
3962777777777777
3962777777777777
3962777777777777
3962777777777777
3962777777777777
3962777777777777
3962777777777777
3962777777777777
3962777777777777
3962777777777777
3962777777777777`],
  [borderTR, bitmap`
3333333333333333
9999999999999993
6666666666666693
2222222222222693
7777777777772693
7777777777772693
7777777777772693
7777777777772693
7777777777772693
7777777777772693
7777777777772693
7777777777772693
7777777777772693
7777777777772693
7777777777772693
7777777777772693`],
  // Backgrounds
  [background, bitmap`
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
  // Player
  player,
  // Bombs
  bomb1, bomb2, bomb3,
  // Blocks
  block, blockL, blockR, blockCorner1, blockCorner2, blockCornerTR, blockCornerTL,
  // Crates
  crate, crateExplosion
])

setPushables({
  [player]: []
})
// =================================================

// = Levels ========================================
let level = 0
const levels = [
  map`
MLLLLLLLLLLLLL,
NXXXXXXXXXXXXXB
nbbbbbbbbbbbbbg
lp............r
l.bcb.bmb.b.b.r
l.............r
l.b.b.b.b.b.b.r
l.............r
l.b.b.b.bib.b.r
l..H...!...(..r
l.b.b.b.b.bjb.r
l.A.S.D.F.:./.r
l.b.b.b.b.b.b.r
l.............r
bbbbbbbbbbbbbbb`
]
// =================================================

// = Melodies, sounds ==============================
// -- Melodies
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
// -- Sounds
// ---- Player
const soundPlayerMove = tune`
100: D5~100,
3100`
const soundPlayerMoveForbidden = tune`
100: D5~100 + E5~100 + F5~100,
3100`
// ---- Bombs
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
// =================================================

// = Constants =====================================
// -- Directions
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

// -- Timeouts
const bombTimeoutTimeMs = 5000
const explosionLastsMs = 500
// =================================================

// = Game state ====================================
let gameState = {
  bombsToPlant: 1,
  flameLength: 1,
  playerSpeedMs: 100,
  score: 0,
  // player last move tick
  playerLastMoveAt: 0
}
// =================================================

// = Start a game ==================================
setMap(levels[level])
setBackground(background)

let playerObject = getFirst(player)

onInput("s", () => {
  movePlayer(directionsEnum.BOTTOM)
})

onInput("w", () => {
  movePlayer(directionsEnum.TOP)
})

onInput("a", () => {
  movePlayer(directionsEnum.LEFT)
})

onInput("d", () => {
  movePlayer(directionsEnum.RIGHT)
})

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
    }, explosionLastsMs)

    // Change game state
    gameState.bombsToPlant++
  }, bombTimeoutTimeMs)
})
// =================================================
