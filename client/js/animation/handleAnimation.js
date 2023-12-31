// handleAnimation.js
import * as THREE from 'three'

export class handleAnimation {
  constructor(mixerInfos) {
    this.mixerInfos = mixerInfos
    this.activeAction = null // Keep track of the active action
  }

  setAnimation(name) {
    const actions = this.mixerInfos[1].actions

    let actionToPlay = null
    switch (name) {
      case 'Idle':
        actionToPlay = actions[2]
        actionToPlay.timeScale = 3.5
        break
      case 'Run':
        actionToPlay = actions[3]
        actionToPlay.timeScale = 2.5
        break
      case 'Rotate':
        actionToPlay = actions[3]
        actionToPlay.timeScale = 3.5
        break
      case 'Reverse':
        actionToPlay = actions[3]
        actionToPlay.timeScale = -2.5
        break
    }

    if (this.activeAction && this.activeAction !== actionToPlay) {
      // Stop the previous action before playing the new one
      this.activeAction.stop()
    }

    // Play the selected action
    if (actionToPlay) {
      actionToPlay.play()
      this.activeAction = actionToPlay // Update the active action
    }
  }
}
