import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import * as SkeletonUtils from 'three/addons/utils/SkeletonUtils.js'

//custom imports
import { sendError } from './errorHandler.js'
import { sendStatus } from './handleStatus.js'

sendError('loaded', 'main.js') // send msg that main.js is loaded

function main() {
  //
  //canvas
  const canvas = document.querySelector('#c')
  const renderer = new THREE.WebGLRenderer({ antialias: true, canvas })

  //camera
  const fov = 45
  const aspect = 2
  const near = 0.1
  const far = 100
  const camera = new THREE.PerspectiveCamera(fov, aspect, near, far)
  camera.position.set(0, 20, 40)

  //controls
  // const controls = new OrbitControls(camera, canvas)
  // controls.target.set(0, 5, 0)
  // controls.update()

  //scene
  const scene = new THREE.Scene()
  scene.background = new THREE.Color('white')

  function addLight(...pos) {
    const color = 0xffffff
    const intensity = 2.5
    const light = new THREE.DirectionalLight(color, intensity)
    light.position.set(...pos)
    scene.add(light)
    scene.add(light.target)
  }

  addLight(5, 5, 2)
  addLight(-5, 5, 5)

  //loader

  const manager = new THREE.LoadingManager()
  manager.onLoad = init

  const progressbarElem = document.querySelector('#progressbar')
  manager.onProgress = (url, itemsLoaded, itemsTotal) => {
    progressbarElem.computedStyleMap.width = `${
      ((itemsLoaded / itemsTotal) * 100) | 0
    }%`
  }

  const models = {
    alienBug: {
      url: 'https://tomhaakonbucket.s3.eu-north-1.amazonaws.com/alien-bug.glb',
    },
  }
  {
    const gltfLoader = new GLTFLoader(manager)
    for (const model of Object.values(models)) {
      gltfLoader.load(model.url, (gltf) => {
        model.gltf = gltf
      })
    }
  }

  function prepModelsAndAnimations() {
    //
    Object.values(models).forEach((model) => {
      //
      const animsByName = {}
      model.gltf.animations.forEach((clip) => {
        //
        animsByName[clip.name] = clip
        //
      })
      model.animations = animsByName
    })
  }

  const mixers = []
  const mixerInfos = []

  function init() {
    //
    const loadingElem = document.querySelector('#loading')
    loadingElem.style.display = 'none'

    prepModelsAndAnimations()

    Object.values(models).forEach((model, ndx) => {
      const objectScale = 13
      const clonedScene = SkeletonUtils.clone(model.gltf.scene)
      const root = new THREE.Object3D()
      root.add(clonedScene)
      scene.add(root)

      root.scale.set(objectScale, objectScale, objectScale) // Set the scale of the object

      root.position.x = ndx
      root.position.y = ndx + 18
      root.position.z = ndx + 10

      root.rotation.y = Math.PI / 4

      const mixer = new THREE.AnimationMixer(clonedScene)
      //const firstClip = Object.values(model.animations)[2]
      // const action = mixer.clipAction(firstClip)
      const actions = Object.values(model.animations).map((clip) => {
        return mixer.clipAction(clip)
      })
      const mixerInfo = {
        mixer,
        actions,
        actionNdx: -1,
      }
      ///   console.log(mixerInfo)
      mixerInfos.push(mixerInfo)
      playNextAction(mixerInfo)
      //  action.play()
      //   mixers.push(mixer)
    })
  }

  function playNextAction(mixerInfo) {
    const { actions, actionNdx } = mixerInfo
    const nextActionNdx = (actionNdx + 1) % actions.length
    mixerInfo.actionNdx = nextActionNdx
    actions.forEach((action, ndx) => {
      const enabled = ndx === nextActionNdx
      action.enabled = enabled
      if (enabled) {
        action.play()
      }
    })
  }

  window.addEventListener('keydown', (e) => {
    if (e.code == 'Space') {
      mixerInfos.forEach((mixerInfo) => {
        playNextAction(mixerInfo)
      })
    }
  })
  window.addEventListener('click', () => {
    mixerInfos.forEach((mixerInfo) => {
      playNextAction(mixerInfo)
    })
  })

  //render functinons
  function resizeRendererToDisplaySize(renderer) {
    //
    const canvas = renderer.domElement
    const width = canvas.clientWidth
    const height = canvas.clientHeight
    const needResize = canvas.width !== width || canvas.height !== height
    if (needResize) {
      //
      renderer.setSize(width, height, false)
    }
    return needResize
  }

  let then = 0
  function render(now) {
    //
    now *= 0.001
    const deltaTime = now - then
    then = now
    //
    if (resizeRendererToDisplaySize(renderer)) {
      //
      const canvas = renderer.domElement
      camera.aspect = canvas.clientWidth / canvas.clientHeight
      camera.updateProjectionMatrix()
    }

    for (const { mixer } of mixerInfos) {
      mixer.update(deltaTime)
    }

    renderer.render(scene, camera)

    requestAnimationFrame(render)
  }
  requestAnimationFrame(render)
  //
  sendStatus(true) // icon that shows that main functio is running
  //
}
main()
