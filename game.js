import { OrbitControls } from "https://cdn.jsdelivr.net/npm/three@0.112.1/examples/jsm/controls/OrbitControls.js";
import { Graphics } from "./graphics.js";

export class Game {
  constructor() {
    this._graphics = new Graphics(this);
    if (!this._graphics.Initialize()) {
      this._DisplayError("WebGL2 is not available.");
      return;
    }

    this._controls = this._CreateControls();
    this._previousRAF = null;

    this._RAF();
  }

  _CreateControls() {
    const controls = new OrbitControls(
      this._graphics._camera,
      this._graphics._threejs.domElement
    );
    controls.target.set(0, 0, 0);
    controls.update();
    return controls;
  }

  _DisplayError(errorText) {
    const error = document.getElementById("error");
    error.innerText = errorText;
  }

  _RAF() {
    requestAnimationFrame((t) => {
      if (this._previousRAF === null) {
        this._previousRAF = t;
      }
      this._Render(t - this._previousRAF);
      this._previousRAF = t;
    });
  }

  _Render(timeInMS) {
    const timeInSeconds = timeInMS * 0.001;
    this._OnStep(timeInSeconds);
    this._graphics.Render(timeInSeconds);

    this._RAF();
  }
}
