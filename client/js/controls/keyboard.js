// KEYBOARD
import * as THREE from "three";
import * as kd from "keydrown";

export class keyboard {
  constructor(animate, direction) {
    this.animate = animate;
    this.controls = this.controls.bind(this); // Binding the method
    this.direction = direction;
  }

  controls() {
    //frem

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
      this.isRunning = true;
      this.moveBackward = true;
    });

    kd.S.up(() => {
      this.isRunning = false;
      this.moveForward = false;
    });

    //rotere
    kd.A.down(() => {
      rotateModel("left");
    });

    kd.D.down(() => {
      rotateModel("right");
    });
  }
}
