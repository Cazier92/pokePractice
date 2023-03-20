class Sprite {
  constructor({
    position,
    velocity,
    image,
    frames = { max: 1, hold: 10 },
    sprites,
    animate = false,
    maxHP = 100,
    currentHP = 100,
    level = 1,
    attacks = [],
    enemy = false,
  }) {
    this.position = position
    this.image = image
    this.frames = {...frames, val: 0, elapsed: 0}

    this.image.onload = () => {
      this.width = this.image.width / this.frames.max
      this.height = this.image.height
    }
    this.animate = animate
    this.sprites = sprites
    this.maxHP = maxHP
    this.currentHP = currentHP
    this.level = level
    this.opacity = 1
    this.attacks = attacks
    this.enemy = enemy
  }
  draw() {
    context.save()
    context.globalAlpha = this.opacity
    context.drawImage(
      this.image, 
      this.frames.val * this.width,
      0,
      (this.image.width / this.frames.max),
      this.image.height,
      this.position.x,
      this.position.y,
      (this.image.width / this.frames.max),
      this.image.height,
      )
      context.restore()

      if (!this.animate) return
        if (this.frames.max > 1) {
          this.frames.elapsed++
        }
        if (this.frames.elapsed % this.frames.hold === 0) {
          if (this.frames.val < this.frames.max - 1) this.frames.val++
          else this.frames.val = 0
        }

      
    }
    attack(attack, recipient, pokemon) {
      const tl = gsap.timeline()
      if (attack.currentPP !== 0) {
        attack.currentPP--
        if (recipient.currentHP - attack.damage >= 0) {
          recipient.currentHP = recipient.currentHP - attack.damage
        } else {
          recipient.currentHP = 0
        }
        function formatAsPercentage(num) {
          return new Intl.NumberFormat('default', {
            style: 'percent',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          }).format(num / 100);
        }
        if (pokemon.enemy === true) {
          tl.to(this.position, {
            x: this.position.x +20
          }).to(this.position, {
            x: this.position.x - 40,
            duration: .1,
            onComplete() {
              gsap.to('#opponent-health-percent', {
                width: formatAsPercentage(pokemon.currentHP)
              })
              gsap.to('#user-health-percent', {
                width: formatAsPercentage(recipient.currentHP)
              })
              gsap.to(recipient.position, {
                x: recipient.position.x + 10,
                yoyo: true,
                repeat: 5,
                duration: 0.05,
              })
              gsap.to(recipient, {
                opacity: 0,
                repeat: 5,
                yoyo: true,
                duration: 0.05
              })
            }
          }).to(this.position, {
            x: this.position.x 
          })
        } else {
          tl.to(this.position, {
            x: this.position.x -20
          }).to(this.position, {
            x: this.position.x + 40,
            duration: .1,
            onComplete() {
              gsap.to('#opponent-health-percent', {
                width: formatAsPercentage(recipient.currentHP)
              })
              gsap.to('#user-health-percent', {
                width: formatAsPercentage(pokemon.currentHP)
              })
              gsap.to(recipient.position, {
                x: recipient.position.x + 10,
                yoyo: true,
                repeat: 5,
                duration: 0.05,
              })
              gsap.to(recipient, {
                opacity: 0,
                repeat: 5,
                yoyo: true,
                duration: 0.05
              })
            }
          }).to(this.position, {
            x: this.position.x 
          })

        }
      } else {
        console.log('0 PP available')
      }
    }
  }

  class Boundary {
    constructor({position}) {
      this.position = position
      this.width = 48
      this.height = 48
    }
    draw() {
      context.fillStyle = 'rgba(255, 0, 0, 0.2)'
      context.fillRect(this.position.x, this.position.y, this.width, this.height)
    }
  }