export const isColor = (value) => value && typeof value === "object" && value.r;

function addFolderListeners(folder) {
  const trigger = folder.domElement.querySelector(".title");
  trigger.addEventListener("click", (e) => {
    const isOpen = !folder._closed;
    if (isOpen) {
      folder.domElement.dispatchEvent(
        new CustomEvent("open", {
          bubbles: true,
          detail: folder,
        })
      );
    }
    if (!isOpen) {
      folder.domElement.dispatchEvent(
        new CustomEvent("close", {
          bubbles: true,
          detail: folder,
        })
      );
    }
  });
}
export class ObjectGui {
  constructor(object = {}, {recursive = true} = {}) {
    // console.log(typeof object)
    
    this.object = object || {};
    this.recursive = recursive
    this.folder = null
    this.controllers = null
  }

  addTo(folder = {}) {
    this.folder = folder

    const { object } = this;
    
    if(object.parent) {
      const controller = {
        remove() {
          // THREE JS removal
          // object.parent.remove(object);
          object.removeFromParent()
          folder.destroy()
        }
      }
      folder.add(controller, "remove")
    }
    
    // Add all props
    const keys = Object.entries(object);
    const controllers = keys.map(([key, value]) => {
      // console.log(key, value)
      // Detect recursion?
      if(key === 'parent') {
        console.warn('skipped')
        return
      }
      if (isColor(value)) {
        return folder.addColor(object, key);
      }
      if (typeof value === "object" && this.recursive) {
        return new ObjectGui(value).addTo(folder.addFolder(key).open(false));
      }
      return folder.add(object, key);
    });
    this.controllers = controllers
    return this
  }
}

const { GUI } = await import("https://cdn.jsdelivr.net/npm/lil-gui@0.17/+esm");

import {app} from "./space.js"
const groupBy = (x,f)=>x.reduce((a,b)=>((a[f(b)]||=[]).push(b),a),{});

const plugin = {
  traverse() {
    const nodes = []
    app._graphics?.Scene.traverse(obj => {
      // console.log(obj)
      nodes.push(obj)
    }, true)
    const result = groupBy(nodes, ({ type }) => type);
    console.log(result)
  }
}
const gui = new GUI({ width: 400 });
window.gui = gui;

gui.add(plugin, "traverse")

// new ObjectGui(app._graphics?.Scene).addTo(gui);
window.ObjectGui = ObjectGui


const fov = 60;
const aspect = window.innerWidth / window.innerHeight;
const near = 1.0;
const far = 1000.0;
const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);

// app._entities[0].