//MoveModel.js
import * as THREE from 'three'
import { HandleAnimation } from '../animation/HandleAnimation'

export class MoveModel {
  constructor(modelRoot) {
    this.modelRoot = modelRoot

    this.animationState = 'Idle'

    this.touchStates = null

    this.idleSpeed = 0

    this.minMoveSpeed = 0.1
    this.rotateSpeed = 0.01

    this.maxMoveSpeed = 0.3
    this.maxRotateSpeed = 0.02

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

    //  console.log(direction)
    let moveDirection = 'Idle'
    let rotateDirection = 'Idle'

    // if (this.activeKeys.has('w')) moveDirection = 'Run'
    // if (this.activeKeys.has('s')) moveDirection = 'Reverse'
    // if (this.activeKeys.has('a')) rotateDirection = 'RotateLeft'
    // if (this.activeKeys.has('d')) rotateDirection = 'RotateRight'

    const speedFactor = touchZones.leveledY / 10
    let currentRotateSpeed = this.rotateSpeed

    let moveSpeed =
      this.minMoveSpeed + (this.maxMoveSpeed - this.minMoveSpeed) * speedFactor
    // console.log(currentRotateSpeed)

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
        break
      case 'Reverse':
        this.newAnimationState = 'Reverse'

        break
      case 'RotateLeft':
        this.newAnimationState = 'Rotate'
        break
      case 'RotateRight':
        this.newAnimationState = 'Rotate'
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
    this.updateSpeedometer(this.idleSpeed, this.idleSpeed)
    this.updateAnimationState()
    this.handleMovement(
      moveDirection,
      rotateDirection,
      moveSpeed,
      currentRotateSpeed
    )
  }

  handleMovement(moveDirection, rotateDirection, moveSpeed, rotateSpeed) {
    const forwardVector = new THREE.Vector3(0, 0, 1)
    forwardVector.multiplyScalar(moveSpeed)
    forwardVector.applyQuaternion(this.modelRoot.quaternion)

    let rotateMeter = 0
    let speedMeter = 0

    if (moveDirection === 'Idle') {
      this.updateSpeedometer(speedMeter)
      this.updateRotateMeter(rotateMeter)
    }
    if (moveDirection === 'Run') {
      this.updateSpeedometer(speedMeter + moveSpeed)
      this.modelRoot.position.add(forwardVector) // Move forward
    }
    if (moveDirection === 'Reverse') {
      this.updateSpeedometer(speedMeter + moveSpeed)
      this.modelRoot.position.sub(forwardVector.negate())
    }
    if (rotateDirection === 'RotateLeft') {
      this.updateRotateMeter(rotateMeter + rotateSpeed)
      this.modelRoot.rotation.y += this.currentRotateSpeed
    }
    if (rotateDirection === 'RotateRight') {
      this.updateRotateMeter(rotateMeter + rotateSpeed)
      this.modelRoot.rotation.y -= this.currentRotateSpeed
    }
  }
  updateRotateMeter(rotateMeter) {
    const rotateElem = document.getElementById('rotateSpeedometer')
    rotateElem.textContent = `Rotate Speed: ${rotateMeter.toFixed(3)}`
  }
  updateSpeedometer(speedMeter) {
    const moveElem = document.getElementById('moveSpeedometer')
    moveElem.textContent = `Move Speed: ${speedMeter.toFixed(3)}`
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
