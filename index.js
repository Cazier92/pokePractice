const canvas = document.querySelector('canvas')
const context = canvas.getContext('2d')

canvas.width = 1024
canvas.height = 576


context.fillStyle = 'white'
context.fillRect(0, 0, canvas.width, canvas.height)

const image = new Image()
image.src = './images/PokemonGameMap.png'

const playerImage = new Image()
playerImage.src = './images/playerDown.png'

image.onload = () => {
  // context.drawImage(image, -1790, -100)
  // context.drawImage(
  //   playerImage, 
  //   0,
  //   0,
  //   (playerImage.width / 4),
  //   playerImage.height,
  //   ((canvas.width / 2) - ((playerImage.width / 4) / 2)), 
  //   ((canvas.height / 2) - (playerImage.height / 2)),
  //   (playerImage.width / 4),
  //   playerImage.height,
  //   )
}

class Sprite {
  constructor({
    position,
    velocity,
    image
  }) {
    this.position = position
    this.image = image
  }
  draw() {
    context.drawImage(this.image, -1790, -100)
  }
}

const background = new Sprite({
  position: {
    x: -1790,
    y: -100,
  },
  image: image
})

function animate() {
  window.requestAnimationFrame(animate)
  background.draw()
  context.drawImage(
    playerImage, 
    0,
    0,
    (playerImage.width / 4),
    playerImage.height,
    ((canvas.width / 2) - ((playerImage.width / 4) / 2)), 
    ((canvas.height / 2) - (playerImage.height / 2)),
    (playerImage.width / 4),
    playerImage.height,
    )
}

animate()

window.addEventListener('keydown', (e) => {
  switch (e.key) {
    case 'w':
      console.log('pressed w key')
      break
    case 'a':
      console.log('pressed a key')
      break
    case 's':
      console.log('pressed s key')
      break
    case 'd':
      console.log('pressed d key')
      break
  }
})