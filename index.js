

const canvas = document.querySelector('canvas')
const context = canvas.getContext('2d')

// const battleBlack = document.getElementById('battle-black')

canvas.width = 1024
canvas.height = 576

const collisionsMap = []
for (let i = 0; i < collisions.length; i += 70) {
  collisionsMap.push(collisions.slice(i, i + 70))
}

const battleZonesMap = []
for (let i = 0; i < battleZonesData.length; i += 70) {
  battleZonesMap.push(battleZonesData.slice(i, i + 70))
}

const boundaries = []
const offset = {
  x: -1790,
  y: -100,
}

const battleZones = []

collisionsMap.forEach((row, i) => {
  row.forEach((sym, j) => {
    if (sym === 1025)
    boundaries.push(new Boundary({position: {
      x: j * 48 + offset.x,
      y: i * 48 + offset.y,
    }
  }))
  })
})

battleZonesMap.forEach((row, i) => {
  row.forEach((sym, j) => {
    if (sym === 1025)
    battleZones.push(new Boundary({position: {
      x: j * 48 + offset.x,
      y: i * 48 + offset.y,
    }
    
  }))
  })
})



const image = new Image()
image.src = './images/PokemonGameMap.png'

const foregroundImage = new Image()
foregroundImage.src = './images/foregroundObj.png'

const playerDown = new Image()
playerDown.src = './images/playerDown.png'

const playerUp = new Image()
playerUp.src = './images/playerUp.png'

const playerLeft = new Image()
playerLeft.src = './images/playerLeft.png'

const playerRight = new Image()
playerRight.src = './images/playerRight.png'

const player = new Sprite({
  position: {
    x: ((canvas.width / 2) - ((192 / 4) / 2)), 
    y: ((canvas.height / 2) - (68 / 2)),
  },
  image: playerDown,
  frames: {
    max: 4
  },
  sprites: {
    up: playerUp,
    left: playerLeft,
    right: playerRight,
    down: playerDown,
  }
})

const background = new Sprite({
  position: {
    x: offset.x,
    y: offset.y,
  },
  image: image
})

const foreground = new Sprite({
  position: {
    x: offset.x,
    y: offset.y,
  },
  image: foregroundImage
})

const keys = {
  w: {
    pressed: false
  },
  a: {
    pressed: false
  },
  s: {
    pressed: false
  },
  d: {
    pressed: false
  },
}

const movables = [background, ...boundaries, foreground, ...battleZones]

function rectangularCollision({rectangle1, rectangle2}) {
  return (
    rectangle1.position.x + rectangle1.width >= rectangle2.position.x &&
    rectangle1.position.x <= rectangle2.position.x + rectangle2.width &&
    // rectangle1.position.y + rectangle1.height <= rectangle2.position.y + rectangle2.height && 
    rectangle1.position.y + rectangle1.height / 2 <= rectangle2.position.y + rectangle2.height && 
    // rectangle1.position.y + rectangle1.height  >= rectangle2.position.y
    rectangle1.position.y + rectangle1.height - 5  >= rectangle2.position.y
  )
}

const battle = {
  initiated: false
}

function animate() {
  const animationId = window.requestAnimationFrame(animate)
  // console.log(animationId)
  background.draw()
  boundaries.forEach(boundary => {
    boundary.draw()
  })
  battleZones.forEach(boundary => {
    boundary.draw()
  })
  player.draw()
  foreground.draw()

  let moving = true
  player.animate = false
  if (battle.initiated) return
  //! Activate Battle:

  if (keys.w.pressed || keys.a.pressed || keys.s.pressed || keys.d.pressed) {
    for (let i = 0; i < battleZones.length; i++) {
      const battleZone = battleZones[i]
      const overlappingArea = (Math.min(player.position.x + player.width, battleZone.position.x + battleZone.width) - Math.max(player.position.x, battleZone.position.x)) * (Math.min(player.position.y + player.height, battleZone.position.y + battleZone.height) - Math.max(player.position.y, battleZone.position.y))
      if (rectangularCollision({
        rectangle1: player,
        rectangle2: battleZone
      }) && 
      overlappingArea > (player.width * player.height) / 2
      && Math.random() < 0.05
      ) {
        console.log('WILD POKEMON ENCOUNTERED')
        window.cancelAnimationFrame(animationId)
        battle.initiated = true
        gsap.to('#battle-black', {
          opacity: 1,
          repeat: 3,
          yoyo: true,
          duration: .4,
          onComplete() {
            gsap.to("#battle-black", {
              opacity: 1,
              duration: .4,
              onComplete() {
                animateBattle()
                gsap.to("#battle-black", {
                  opacity: 0,
                  duration: .4,
                })
              }
            })
          }
        })
        break
      }
    }
  }


  if (keys.s.pressed) {
    player.animate = true
    player.image = player.sprites.down

    for (let i = 0; i < boundaries.length; i++) {
      const boundary = boundaries[i]
      if (rectangularCollision({
        rectangle1: player,
        rectangle2: {...boundary, position: {
          x: boundary.position.x,
          y: boundary.position.y - 3
        }}
      })) {
        // console.log('collision')
        moving = false
        break
      }
    }
    

    if (moving)
    movables.forEach(movable => {
      movable.position.y -= 3
    })
  }
    if (keys.w.pressed) {
      player.animate = true
      player.image = player.sprites.up
      for (let i = 0; i < boundaries.length; i++) {
        const boundary = boundaries[i]
        if (rectangularCollision({
          rectangle1: player,
          rectangle2: {...boundary, position: {
            x: boundary.position.x,
            y: boundary.position.y + 3
          }}
        })) {
          // console.log('collision')
          moving = false
          break
        }
      }
      if (moving)
      movables.forEach(movable => {
        movable.position.y += 3
      })
    }
    if(keys.a.pressed) {
      player.animate = true
      player.image = player.sprites.left
      for (let i = 0; i < boundaries.length; i++) {
        const boundary = boundaries[i]
        if (rectangularCollision({
          rectangle1: player,
          rectangle2: {...boundary, position: {
            x: boundary.position.x + 3,
            y: boundary.position.y
          }}
        })) {
          // console.log('collision')
          moving = false
          break
        }
      }
      if (moving)
      movables.forEach(movable => {
        movable.position.x += 3
      })
    }
    if(keys.d.pressed) {
      player.animate = true
      player.image = player.sprites.right
      for (let i = 0; i < boundaries.length; i++) {
        const boundary = boundaries[i]
        if (rectangularCollision({
          rectangle1: player,
          rectangle2: {...boundary, position: {
            x: boundary.position.x - 3,
            y: boundary.position.y
          }}
        })) {
          // console.log('collision')
          moving = false
          break
        }
      }
      if (moving)
      movables.forEach(movable => {
        movable.position.x -= 3
      })
    }
}

// animate()

const battleBackgroundImage = new Image()
battleBackgroundImage.src = './images/battleBackground.png'

const draggleImage = new Image()
draggleImage.src = './images/draggleSprite.png'

const embyImage = new Image()
embyImage.src = './images/embySprite.png'

const battleBackground = new Sprite({
  position: {
    x: 0, 
    y: 0
  },
  image: battleBackgroundImage
})

const draggle = new Sprite({
  position: {
    x: 800,
    y: 100,
  },
  image: draggleImage,
  frames: {
    max: 4,
    hold: 30,
  },
  animate: true,
})

const emby = new Sprite({
  position: {
    x: 280,
    y: 320,
  },
  image: embyImage,
  frames: {
    max: 4,
    hold: 30,
  },
  animate: true,
})

function animateBattle() {
  window.requestAnimationFrame(animateBattle)
  battleBackground.draw()
  draggle.draw()
  emby.draw()
}

animateBattle()

window.addEventListener('keydown', (e) => {
  switch (e.key) {
    case 'w':
      keys.w.pressed = true
      break
    case 'a':
      keys.a.pressed = true
      break
    case 's':
      keys.s.pressed = true
      break
    case 'd':
      keys.d.pressed = true
      break
  }
})

window.addEventListener('keyup', (e) => {
  switch (e.key) {
    case 'w':
      keys.w.pressed = false
      break
    case 'a':
      keys.a.pressed = false
      break
    case 's':
      keys.s.pressed = false
      break
    case 'd':
      keys.d.pressed = false
      break
  }
})

