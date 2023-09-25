//HandleAnimation.js
import * as THREE from 'three'

export class HandleAnimation {
  constructor(mixerInfos) {
    this.mixerInfos = mixerInfos
  }
  setAnimation(name) {
    this.mixerInfos.forEach((mixerInfo) => {
      const actions = mixerInfo.actions

      // const actionToPlay = actions.find(
      //   (action) => action.getClip().name === name
      // )

      // if (actionToPlay) {
      //   actions.forEach((action) => action.stop())
      //  // actionToPlay.play()
      // }
      if (name === 'Rotate') {
        let action = actions[3]
        action.stop()
        action.timeScale = 1.0
        action.play()
      }
      if (name === 'RotateFast') {
        let action = actions[3]
        action.stop()
        action.timeScale = 2.0
        action.play()
      }
      if (name === 'Reverse') {
        let action = actions[3]
        action.stop()
        action.timeScale = -1
        action.play()
      }
    })
  }
}
