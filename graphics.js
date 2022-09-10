import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.112.1/build/three.module.js";
import Stats from "https://cdn.jsdelivr.net/npm/three@0.112.1/examples/jsm/libs/stats.module.js";
import { WEBGL } from "https://cdn.jsdelivr.net/npm/three@0.112.1/examples/jsm/WebGL.js";
import { EffectComposer } from "https://cdn.jsdelivr.net/npm/three@0.112.1/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "https://cdn.jsdelivr.net/npm/three@0.112.1/examples/jsm/postprocessing/RenderPass.js";
import { GlitchPass } from "https://cdn.jsdelivr.net/npm/three@0.112.1/examples/jsm/postprocessing/GlitchPass.js";
import { UnrealBloomPass } from "https://cdn.jsdelivr.net/npm/three@0.112.1/examples/jsm/postprocessing/UnrealBloomPass.js";

export const PostFX = {
  UnrealBloomPass: UnrealBloomPass,
  GlitchPass: GlitchPass,
};
export class Graphics {
  Initialize() {
    if (!WEBGL.isWebGL2Available()) {
      return false;
    }

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
    });
    this._threejs = renderer
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    // renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);

    const target = document.body // getElementById("target");
    target.appendChild(renderer.domElement);

    this._stats = new Stats();
    target.appendChild(this._stats.dom);

    const fov = 60;
    // const aspect = 1920 / 1080;
    const aspect = window.innerWidth / window.innerHeight;
    const near = 1.0;
    const far = 1000.0;
    this._camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    this._camera.position.set(75, 20, 0);

    this._scene = new THREE.Scene();

    this._CreateLights();

    const composer = new EffectComposer(renderer);
    this._composer = composer;
    this._composer.addPass(new RenderPass(this._scene, this._camera));

    this._OnWindowResize();

    window.addEventListener(
      "resize",
      () => {
        this._OnWindowResize();
      },
      false
    );

    return true;
  }

  _CreateLights() {
    let light = new THREE.DirectionalLight(0xffffff, 1, 100);
    light.position.set(100, 100, 100);
    light.target.position.set(0, 0, 0);
    light.castShadow = true;
    light.shadowCameraVisible = true;
    light.shadow.bias = -0.01;
    light.shadow.mapSize.width = 2048;
    light.shadow.mapSize.height = 2048;
    light.shadow.camera.near = 1.0;
    light.shadow.camera.far = 500;
    light.shadow.camera.left = 200;
    light.shadow.camera.right = -200;
    light.shadow.camera.top = 200;
    light.shadow.camera.bottom = -200;
    this._scene.add(light);

    // light = new THREE.DirectionalLight(0x404040, 1, 100);
    // light.position.set(-100, 100, -100);
    // light.target.position.set(0, 0, 0);
    // light.castShadow = false;
    // this._scene.add(light);

    // light = new THREE.DirectionalLight(0x404040, 1, 100);
    // light.position.set(100, 100, -100);
    // light.target.position.set(0, 0, 0);
    // light.castShadow = false;
    // this._scene.add(light);
  }

  AddPostFX(passClass, params) {
    const pass = new passClass();
    for (const k in params) {
      pass[k] = params[k];
    }
    this._composer.addPass(pass);
    return pass;
  }

  _OnWindowResize() {
    this._camera.aspect = window.innerWidth / window.innerHeight;
    this._camera.updateProjectionMatrix();
    this._threejs.setSize(window.innerWidth, window.innerHeight);
    this._composer.setSize(window.innerWidth, window.innerHeight);
    // console.log(window.innerWidth, window.innerHeight)
  }

  get Scene() {
    return this._scene;
  }

  Render(timeInSeconds) {
    this._composer.render();
    this._stats.update();
  }
}
