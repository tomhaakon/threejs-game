//moveModel.js
import * as THREE from 'three'
import { handleAnimation } from '../animation/handleAnimation'
import { miniConsole } from '../miniConsole'
import socket from '../socket'

export class moveModel {
  constructor(modelRoot) {
    this.modelRoot = modelRoot
    this.miniConsole = new miniConsole()
    this.animationState = 'Idle'

    this.touchStates = null

    this.currentMoveSpeed = 0
    this.currentRotateSpeed = 0

    this.minMoveSpeed = 0.1
    this.rotateSpeed = 0.01

    this.maxMoveSpeed = 0.3
    this.maxRotateSpeed = 0.02

    this.prevPosition = modelRoot.position.clone()
    this.prevTimestamp = performance.now()
    this.prevRotation = modelRoot.rotation.y

    this.activeKeys = new Set()
    this.setupKeyboardListeners()

    // this.socket = socket
  }

  setMixerInfos(mixerInfos) {
    this.animate = new handleAnimation(mixerInfos)
  }

  updateAnimationState() {
    if (this.newAnimationState !== this.animationState) {
      this.animationState = this.newAnimationState
    }
    this.runAnimation()
  }
  runAnimation() {
    this.animate.setAnimation(this.animationState)
  }
  move(
    direction,
    touchZones = { leveledX: 0, leveledY: 0 },
    inputType = 'touch'
  ) {
    if (!this.modelRoot || !this.animate) return

    let moveDirection = 'Idle'
    let rotateDirection = 'Idle'

    const speedFactor = touchZones.leveledY / 10
    let currentRotateSpeed = this.rotateSpeed

    let moveSpeed =
      this.minMoveSpeed + (this.maxMoveSpeed - this.minMoveSpeed) * speedFactor

    if (inputType === 'keyboard') {
      moveSpeed *= 10
      currentRotateSpeed = this.maxRotateSpeed
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

    const currentPosition = this.modelRoot.position.clone()

    let speedMeter = moveSpeed

    this.prevPosition = currentPosition

    if (moveDirection === 'Idle') {
      speedMeter = 0
    }

    this.miniConsole.update(
      `Move speed:${speedMeter.toFixed(2)}`,
      'Left',
      'moveSpeed'
    )
    const playerData = this.modelRoot
    const timestampSent = Date.now()
    //  this.socket.emit('playerMovement', { playerData, timestampSent })

    if (moveDirection === 'Run') {
      this.modelRoot.position.add(forwardVector)
    } else if (moveDirection === 'Reverse') {
      this.modelRoot.position.sub(forwardVector.negate())
    }
    if (moveDirection === 'Run' || moveDirection === 'Reverse') {
      socket.emit('playerMovement', {
        position: {
          x: this.modelRoot.position.x,
          y: this.modelRoot.position.y,
          z: this.modelRoot.position.z,
        },
        rotation: {
          x: this.modelRoot.rotation.x,
          y: this.modelRoot.rotation.y,
          z: this.modelRoot.rotation.z,
        },
      })
    }

    if (rotateDirection === 'RotateLeft') {
      this.modelRoot.rotation.y += this.currentRotateSpeed
    }
    if (rotateDirection === 'RotateRight') {
      this.modelRoot.rotation.y -= this.currentRotateSpeed
    }
    // Add emission for Rotation
    if (rotateDirection === 'RotateLeft' || rotateDirection === 'RotateRight') {
      socket.emit('playerMovement', {
        position: {
          x: this.modelRoot.position.x,
          y: this.modelRoot.position.y,
          z: this.modelRoot.position.z,
        },
        rotation: {
          x: this.modelRoot.rotation.x,
          y: this.modelRoot.rotation.y,
          z: this.modelRoot.rotation.z,
        },
      })
    }
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
