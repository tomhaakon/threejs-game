import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import * as SkeletonUtils from "three/addons/utils/SkeletonUtils.js";
import * as kd from "keydrown";

import * as detectIt from "detect-it";

//custom imports
import { sendError } from "./js/errorHandler.js";
import { sendStatus } from "./js/handleStatus.js";

sendError("loaded", "main.js"); // send msg that main.js is loaded
sendError("device", detectIt.deviceType);
function main() {
  //
  //canvas
  const canvas = document.querySelector("#c");
  const renderer = new THREE.WebGLRenderer({ antialias: true, canvas });

  //camera
  const root = new THREE.Object3D();

  const fov = 45;
  const aspect = 2;
  const near = 0.1;
  const far = 100;
  const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);

  const modelRoot = new THREE.Object3D(); // a new object just for the model

  const lookDownOffset = -8;
  const lookAtPosition = new THREE.Vector3(
    root.position.x,
    root.position.y - lookDownOffset,
    root.position.z
  );

  const offsetDistance = 20;
  const heightOffset = 30;

  camera.position.set(
    root.position.x - offsetDistance,
    root.position.y + heightOffset,
    root.position.z - offsetDistance
  );
  camera.lookAt(lookAtPosition);

  //controls
  // const controls = new OrbitControls(camera, canvas)
  // controls.target.set(0, 5, 0)
  // controls.update()

  //scene
  const scene = new THREE.Scene();
  scene.background = new THREE.Color("white");

  function addLight(...pos) {
    const color = 0xffffff;
    const intensity = 2.5;
    const light = new THREE.DirectionalLight(color, intensity);
    light.position.set(...pos);
    scene.add(light);
    scene.add(light.target);
  }
  addLight(5, 5, 2);
  addLight(-5, 5, 5);

  //loader
  const progressbarElem = document.querySelector("#progressbar");

  // Define the LoadingManager
  const manager = new THREE.LoadingManager();

  manager.onProgress = (url, itemsLoaded, itemsTotal) => {
    progressbarElem.computedStyleMap.width = `${
      ((itemsLoaded / itemsTotal) * 100) | 0
    }%`;
  };

  const models = {
    alienBug: {
      url: "https://tomhaakonbucket.s3.eu-north-1.amazonaws.com/alien-bug.glb",
    },
  };
  {
    const gltfLoader = new GLTFLoader(manager);
    for (const model of Object.values(models)) {
      gltfLoader.load(model.url, (gltf) => {
        model.gltf = gltf;
      });
    }
  }

  function prepModelsAndAnimations() {
    //
    Object.values(models).forEach((model) => {
      //
      const animsByName = {};
      model.gltf.animations.forEach((clip) => {
        //
        animsByName[clip.name] = clip;
        //
      });
      model.animations = animsByName;
    });
  }

  const mixers = [];
  let mixerInfos = [];

  function init() {
    //
    return new Promise((resolve) => {
      //
      const loadingElem = document.querySelector("#loading");
      loadingElem.style.display = "none";

      prepModelsAndAnimations();

      Object.values(models).forEach((model, ndx) => {
        const objectScale = 13;
        const clonedScene = SkeletonUtils.clone(model.gltf.scene);
        const root = new THREE.Object3D();
        root.add(clonedScene);
        scene.add(root);

        modelRoot.add(clonedScene);
        root.add(modelRoot); // add the model's root to the main root
        root.scale.set(objectScale, objectScale, objectScale); // Set the scale of the object

        root.position.x = ndx;
        root.position.y = ndx;
        root.position.z = ndx;

        root.rotation.y = Math.PI / 4;

        const mixer = new THREE.AnimationMixer(clonedScene);
        const firstClip = Object.values(model.animations)[2];
        const action = mixer.clipAction(firstClip);
        const actions = Object.values(model.animations).map((clip) => {
          return mixer.clipAction(clip);
        });
        Object.values(models).forEach((model) => {
          const animsByName = {};
          model.gltf.animations.forEach((clip) => {
            console.log(`Available animation: ${clip.name}`);
            animsByName[clip.name] = clip;
          });
          model.animations = animsByName;
        });
        const mixerInfo = {
          mixer,
          actions,
          actionNdx: -1,
        };
        ///   console.log(mixerInfo)
        mixerInfos.push(mixerInfo);
        // playNextAction(mixerInfo);
        action.play();
        mixers.push(mixer);
      });

      setupKeyBindings();
      setAnimation("Idle");
      createGround();
      resolve();
    });
  }
  manager.onLoad = () => init();

  console.log("mixerInfos outside init() function", mixerInfos);

  /*

Keybinds

*/
  function createGround() {
    // 1. Create a plane geometry. The arguments define the width and height of the plane.
    const groundGeometry = new THREE.PlaneGeometry(50, 100);

    // 2. Create a material for the plane.
    const groundMaterial = new THREE.MeshBasicMaterial({ color: "beige" }); // Simple green ground

    // 3. Combine the geometry and material to create a mesh.
    const groundMesh = new THREE.Mesh(groundGeometry, groundMaterial);

    // 4. Position the mesh. By default, the plane is vertical, so we need to rotate it.
    groundMesh.rotation.x = -Math.PI / 2; // Rotate the ground to be horizontal
    groundMesh.position.set(0, 0, 0);

    // 5. Add the mesh to your scene.
    scene.add(groundMesh);
  }

  let isRunning = false;
  let moveForward = false;

  function setupKeyBindings() {
    kd.W.down(() => {
      if (!isRunning) {
        setAnimation("Run");
        isRunning = true;

        moveForward = true; // Set the flag when W is pressed
      }
    });

    kd.W.up(() => {
      setAnimation("Idle");
      isRunning = false;
      moveForward = false; // Clear the flag when W is released
    });
    kd.A.down(() => {
      rotateModel("left");
    });

    kd.D.down(() => {
      rotateModel("right");
    });
  }
  function rotateModel(direction) {
    const rotationSpeed = 0.1;
    if (direction === "left") {
      root.rotation.y += rotationSpeed;
    } else if (direction === "right") {
      root.rotation.y -= rotationSpeed;
    }
    console.log("Model rotation:", root.rotation.y);
  }

  function setAnimation(name) {
    mixerInfos.forEach((mixerInfo) => {
      const actions = mixerInfo.actions; // renamed for clarity

      const actionToPlay = actions.find(
        (action) => action.getClip().name === name
      );

      if (actionToPlay) {
        console.log(`Action "${name}" found and will be played.`);
        actions.forEach((action) => action.stop()); // stop all actions
        actionToPlay.play(); // play the specific action
      } else {
        console.warn(`Action "${name}" not found.`);
      }
    });
  }

  //render functinons
  function resizeRendererToDisplaySize(renderer) {
    //
    const canvas = renderer.domElement;
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    const needResize = canvas.width !== width || canvas.height !== height;
    if (needResize) {
      //
      renderer.setSize(width, height, false);
    }
    return needResize;
  }

  let then = 0;
  function render(now) {
    kd.tick();

    if (moveForward) {
      console.warn("moveforward");
      const moveSpeed = 0.01;
      const direction = new THREE.Vector3(
        Math.sin(root.rotation.y),
        0,
        Math.cos(root.rotation.y)
      );
      direction.multiplyScalar(moveSpeed);
      console.log("Moving direction:", direction);
      root.position.add(direction);
      console.log("New position:", root.position);
      modelRoot.position.add(direction);

      // camera.position.add(direction);
    }

    //
    now *= 0.001;
    const deltaTime = now - then;
    then = now;
    //
    if (resizeRendererToDisplaySize(renderer)) {
      //
      const canvas = renderer.domElement;
      camera.aspect = canvas.clientWidth / canvas.clientHeight;
      camera.updateProjectionMatrix();
    }

    for (const { mixer } of mixerInfos) {
      mixer.update(deltaTime);
    }

    renderer.render(scene, camera);

    requestAnimationFrame(render);
  }
  requestAnimationFrame(render);
  //
  sendStatus(true); // icon that shows that main functio is running
  //
}
main();
