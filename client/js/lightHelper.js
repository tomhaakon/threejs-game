import * as THREE from "three";
import { RectAreaLightHelper } from "three/addons/helpers/RectAreaLightHelper.js";
import { GUI } from "three/addons/libs/lil-gui.module.min.js";

export function useLightHelper(light) {
  //
  class ColorGUIHelper {
    //
    constructor(object, prop) {
      this.object = object;
      this.prop = prop;
    }
    get value() {
      return `#${this.object[this.prop].getHexString()}`;
    }
    set value(hexString) {
      this.object[this.prop].set(hexString);
    }
  }

  const helper = new RectAreaLightHelper(light);
  light.add(helper);

  class DegRadHelper {
    constructor(obj, prop) {
      this.obj = obj;
      this.prop = prop;
    }
    get value() {
      return THREE.MathUtils.radToDeg(this.obj[this.prop]);
    }
    set value(v) {
      this.obj[this.prop] = THREE.MathUtils.degToRad(v);
    }
  }

  const gui = new GUI();
  gui.addColor(new ColorGUIHelper(light, "color"), "value").name("color");
  gui.add(light, "intensity", 0, 10, 0.01);
  gui.add(light, "width", 0, 20);
  gui.add(light, "height", 0, 20);
  gui
    .add(new DegRadHelper(light.rotation, "x"), "value", -180, 180)
    .name("x rotation");
  gui
    .add(new DegRadHelper(light.rotation, "y"), "value", -180, 180)
    .name("y rotation");
  gui
    .add(new DegRadHelper(light.rotation, "z"), "value", -180, 180)
    .name("z rotation");

  function makeXYZGUI(gui, vector3, name, onChangeFn) {
    const folder = gui.addFolder(name);
    folder.add(vector3, "x", -10, 10).onChange(onChangeFn);
    folder.add(vector3, "y", 0, 100).onChange(onChangeFn);
    folder.add(vector3, "z", -10, 10).onChange(onChangeFn);
    folder.open();
  }
  makeXYZGUI(gui, light.position, "position");
}
