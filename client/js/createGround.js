import * as THREE from "three";

export class createGround {
  //
  constructor(scene, textureFile) {
    //
    this.scene = scene;
    this.textureFile = textureFile;

    const textureLoader = new THREE.TextureLoader();
    textureLoader.load(textureFile, function (texture) {
      texture.wrapS = THREE.RepeatWrapping;
      texture.wrapT = THREE.RepeatWrapping;
      texture.repeat.set(3, 3);

      const groundGeometry = new THREE.PlaneGeometry(100, 100);
      const groundMaterial = new THREE.MeshStandardMaterial({ map: texture });
      const groundMesh = new THREE.Mesh(groundGeometry, groundMaterial);

      groundMesh.receiveShadow = true; // ground should be able to receive shadows
      groundMesh.rotation.x = -Math.PI / 2; // Rotate the ground to be horizontal
      scene.add(groundMesh);
    });
  }
}

// function createGround() {
//     //
//     // Load the texture
//     const textureLoader = new THREE.TextureLoader();
//     textureLoader.load("./resources/textures/gr.jpg", function (texture) {
//       //
//       texture.wrapS = THREE.RepeatWrapping;
//       texture.wrapT = THREE.RepeatWrapping;
//       texture.repeat.set(3, 3);

//       const groundGeometry = new THREE.PlaneGeometry(100, 100);
//       const groundMaterial = new THREE.MeshStandardMaterial({ map: texture });
//       const groundMesh = new THREE.Mesh(groundGeometry, groundMaterial);

//       groundMesh.receiveShadow = true; // ground should be able to receive shadows
//       groundMesh.rotation.x = -Math.PI / 2; // Rotate the ground to be horizontal
//       scene.add(groundMesh);
//     });
//   }

// import * as THREE from "three";

// export class handleAnimation {
//   constructor(mixerInfos) {
//     //
//     this.mixerInfos = mixerInfos;
//   }
//   setAnimation(name) {
//     //
//     console.log("setAnimation:", name);
//     this.mixerInfos.forEach((mixerInfo) => {
//       const actions = mixerInfo.actions; // renamed for clarity

//       //
//       // Find the action that matches the name
//       const actionToPlay = actions.find(
//         (action) => action.getClip().name === name
//       );

//       if (actionToPlay) {
//         actions.forEach((action) => action.stop()); // stop all actions
//         actionToPlay.play(); // play the specific action
//       } else {
//         console.warn(`Action "${name}" not found`);
//       }
//     });
//   }
// }
