//MoveModel.js
import * as THREE from 'three'
import { HandleAnimation } from '../animation/HandleAnimation'

export class MoveModel {
  constructor(modelRoot) {
    this.modelRoot = modelRoot
    this.animationState = 'Idle'
    this.setAnimationState = false

    this.touchStates = null

    this.animate = null
    this.newAnimationState = ''
    this.baseMoveSpeed = 0.1
    this.rotateSpeed = 0.01

    this.maxMoveSpeed = 0.3 // or whatever you consider as max speed
    this.maxRotateSpeed = 0.02 // or whatever you consider as max rotation speed
    // Inside MoveModel's constructor
    this.currentMoveSpeed = this.baseMoveSpeed
    this.currentRotateSpeed = this.rotateSpeed

    this.activeKeys = new Set()
    this.setupKeyboardListeners()
  }

  setMixerInfos(mixerInfos) {
    this.animate = new HandleAnimation(mixerInfos)
  }

  updateAnimationState() {
    if (this.newAnimationState !== this.animationState) {
      this.animationState = this.newAnimationState
    }
    this.runAnimation()
  }
  runAnimation() {
    this.animate.setAnimation(this.animationState)
    ///  console.warn(this.newAnimationState)
  }
  move(
    direction,
    touchZones = { leveledX: 0, leveledY: 0 },
    inputType = 'touch'
  ) {
    if (!this.modelRoot || !this.animate) return

    let moveDirection = 'Idle'
    let rotateDirection = 'Idle'

    if (this.activeKeys.has('w')) moveDirection = 'Run'
    if (this.activeKeys.has('s')) moveDirection = 'Reverse'
    if (this.activeKeys.has('a')) rotateDirection = 'RotateLeft'
    if (this.activeKeys.has('d')) rotateDirection = 'RotateRight'

    const speedFactor = touchZones.leveledY / 10
    let currentRotateSpeed = this.rotateSpeed

    let moveSpeed =
      this.baseMoveSpeed +
      (this.maxMoveSpeed - this.baseMoveSpeed) * speedFactor

    if (inputType === 'keyboard') {
      moveSpeed *= 10
      currentRotateSpeed = this.maxRotateSpeed // or you can set it to any other value you feel comfortable with.
    } else {
    }

    if (inputType === 'touch') {
      moveDirection = direction
      rotateDirection = direction

      const rotateFactor = Math.abs(touchZones.leveledX) / 10
      currentRotateSpeed +=
        (this.maxRotateSpeed - this.rotateSpeed) * rotateFactor
    }

    this.currentMoveSpeed = moveSpeed
    this.currentRotateSpeed = currentRotateSpeed

    //animation
    switch (direction) {
      case 'Idle':
        this.newAnimationState = 'Idle'
        break
      case 'Run':
        this.newAnimationState = 'Run'
        //   this.modelRoot.position.add(forwardVector)
        break
      case 'Reverse':
        this.newAnimationState = 'Reverse'
        //   this.modelRoot.position.sub(forwardVector)
        break
      case 'RotateLeft':
        this.newAnimationState = 'Rotate'
        //     this.modelRoot.rotation.y += this.rotateSpeed
        break
      case 'RotateRight':
        this.newAnimationState = 'Rotate'
        //  this.modelRoot.rotation.y -= this.rotateSpeed
        break
      case 'RunTurnLeft':
        this.newAnimationState = 'Rotate'
        break
      case 'RunTurnRight':
        this.newAnimationState = 'Rotate'
        break

      default:
        console.warn(`Unknown direction: ${direction}`)
    }
    this.updateAnimationState()
    this.updateSpeedometer(this.currentMoveSpeed, currentRotateSpeed)
    this.handleMovement(moveDirection, rotateDirection, moveSpeed)
  }

  handleAnimation(direction) {}
  handleMovement(moveDirection, rotateDirection, moveSpeed) {
    const forwardVector = new THREE.Vector3(0, 0, 1)
    forwardVector.multiplyScalar(moveSpeed)
    forwardVector.applyQuaternion(this.modelRoot.quaternion)

    if (moveDirection === 'Idle' && rotateDirection === 'Idle') {
      this.updateSpeedometer(0, 0) // Explicitly set speed to 0
    }

    if (moveDirection === 'Idle' && rotateDirection === 'Idle') {
      this.currentMoveSpeed = 0
      this.currentRotateSpeed = 0
    }
    if (moveDirection === 'Run') {
      this.modelRoot.position.add(forwardVector) // Move forward
    }
    if (moveDirection === 'Reverse') {
      this.modelRoot.position.sub(forwardVector.negate())
      //console.log(moveDirection)
    }
    if (rotateDirection === 'RotateLeft') {
      this.modelRoot.rotation.y += this.currentRotateSpeed
    }
    if (rotateDirection === 'RotateRight') {
      this.modelRoot.rotation.y -= this.currentRotateSpeed
    }
  }

  updateSpeedometer(moveSpeed, rotateSpeed) {
    const moveElem = document.getElementById('moveSpeedometer')
    const rotateElem = document.getElementById('rotateSpeedometer')

    moveElem.textContent = `Move Speed: ${moveSpeed.toFixed(3)}`
    rotateElem.textContent = `Rotate Speed: ${rotateSpeed.toFixed(3)}`
  }
  setupKeyboardListeners() {
    document.addEventListener('keydown', (event) => {
      if (['w', 'a', 's', 'd'].includes(event.key)) {
        this.activeKeys.add(event.key)
      }
    })

    document.addEventListener('keyup', (event) => {
      this.activeKeys.delete(event.key)
    })
  }
  setupListeners(eventEmitter) {
    eventEmitter.on('move', (direction, touchZones) => {
      this.move(direction, touchZones)
    })
  }
}
