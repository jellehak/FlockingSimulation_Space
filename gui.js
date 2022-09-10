export const isColor = (value) => value && typeof value === "object" && value.r;

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
    
    const keys = Object.entries(object);
    const controllers = keys.map(([key, value]) => {
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

const gui = new GUI({ width: 400 });
window.gui = gui;

// new ObjectGui(window.app).addTo(gui);
