import * as THREE from 'three'

export class handleAnimation {
  constructor(mixerInfos) {
    //
    this.mixerInfos = mixerInfos
  }
  setAnimation(name) {
    //
    //  console.log('setAnimation:', name)
    this.mixerInfos.forEach((mixerInfo) => {
      const actions = mixerInfo.actions // renamed for clarity

      //
      // Find the action that matches the name
      const actionToPlay = actions.find(
        (action) => action.getClip().name === name
      )

      if (actionToPlay) {
        actions.forEach((action) => action.stop()) // stop all actions
        actionToPlay.play() // play the specific action
      }
      if (name === 'Rotate') {
        let action = actions[3]
        action.timeScale = 2.0
        //   console.log(actions[3].play())
        action.play()
      } //else {
      //   console.warn(`Action "${name}" not found`)
      // }
    })
  }
}
