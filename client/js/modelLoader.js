import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'

export class ModelLoader {
  constructor(manager) {
    this.loader = new GLTFLoader(manager)
  }

  loadModel(url) {
    return new Promise((resolve, reject) => {
      this.loader.load(
        url,
        (gltf) => {
          resolve(gltf)
        },
        undefined,
        reject
      )
    })
  }
}
// this.models = {
//     alienBug: {
//       url: 'https://tomhaakonbucket.s3.eu-north-1.amazonaws.com/alien-bug.glb',
//       scale: 13,
//     },
//   }
