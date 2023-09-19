// KEYBOARD
import * as THREE from "three";
import * as kd from "keydrown";
import { moveModel } from "../movement/moveModel";

export class keyboard {
  constructor(animate, modelRoot, direction, rotating) {
    this.animate = animate;
    this.controls = this.controls.bind(this); // Binding the method
    this.direction = direction;
    this.modelPosition = new moveModel();
    this.rotating = rotating;
    this.modelRoot = modelRoot;
  }

  controls() {
    //frem
    this.modelPosition.modelRoot = this.modelRoot; // <-- Should work now

    kd.W.down(() => {
      if (!this.isRunning) {
        this.animate("Run");
        this.isRunning = true;
        this.moveForward = true;
      }
    });

    kd.W.up(() => {
      this.animate("Idle");
      this.isRunning = false;
      this.moveForward = false;
    });

    //bak
    kd.S.down(() => {
      if (!this.isRunning) {
        this.animate("Run", -1);
        this.isRunning = true;
        this.moveBackward = true;
      }
    });

    kd.S.up(() => {
      this.animate("Idle");
      this.isRunning = false;
      this.moveBackward = false;
    });

    //rotere
    kd.A.down(() => {
      this.rotating = true;
      this.modelPosition.rotate("left");
    });
    kd.A.up(() => {
      this.rotating = false;
      this.modelPosition.rotate("left"); // <-- Should work now
    });

    kd.D.down(() => {
      this.rotating = true;
      this.modelPosition.rotate("right");
    });
    kd.D.up(() => {
      this.rotating = false;
      this.modelPosition.rotate("right");
    });

    kd.run(() => {
      if (this.moveForward) {
        this.modelPosition.move("forward");
      }
    });
  }
}
