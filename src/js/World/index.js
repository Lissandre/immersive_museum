import { Object3D } from 'three'

import Intro from './Intro'
import Sounds from './Sounds'
import AmbientLightSource from './AmbientLight'
import SunLightSource from './SunLight'
import Houses from './Houses'
import Terrain from './Terrain'
import WaterScene from './Water'

export default class World {
  constructor(options) {
    // Set options
    this.time = options.time
    this.debug = options.debug
    this.assets = options.assets
    this.intro = options.intro
    this.camera = options.camera

    // Set up
    this.container = new Object3D()

    if (this.debug) {
      this.debugFolder = this.debug.addFolder('World')
      this.debugFolder.open()
    }

    this.setLoader()
  }
  init() {
    this.setAmbientLight()
    this.setSunLight()
    this.setHouses()
    this.setTerrain()
    this.setWater()
  }
  start() {
    this.setIntro()
    this.setSounds()
  }
  setLoader() {
    this.loadDiv = document.querySelector('.loadScreen')
    this.loadModels = this.loadDiv.querySelector('.load')
    this.progress = this.loadDiv.querySelector('.progress')

    if (this.assets.total === 0) {
      this.init()
      this.loadDiv.remove()
    } else {
      this.assets.on('ressourceLoad', () => {
        this.progress.style.width = this.loadModels.innerHTML = `${
          Math.floor((this.assets.done / this.assets.total) * 100) +
          Math.floor((1 / this.assets.total) * this.assets.currentPercent)
        }%`
      })

      this.assets.on('ressourcesReady', () => {
        this.button = document.createElement('button')
        this.button.innerHTML = 'Start the experience'
        this.loadModels.style.display = 'none'
        this.progress.style.display = 'none'
        this.loadDiv.append(this.button)
        this.button.addEventListener('click', () => {
          setTimeout(() => {
            this.loadDiv.style.opacity = 0
            setTimeout(() => {
              this.loadDiv.remove()
            }, 550)
          }, 1000)
          this.start()
        })
        this.init()
      })
    }
  }
  setIntro() {
    if (this.intro === true) {
      new Intro()
    }
  }
  setSounds() {
    this.sounds = new Sounds({
      assets: this.assets,
      camera: this.camera,
    })
  }
  setAmbientLight() {
    this.light = new AmbientLightSource({
      debug: this.debugFolder,
    })
    this.container.add(this.light.container)
  }
  setSunLight() {
    this.light = new SunLightSource({
      debug: this.debugFolder,
      time: this.time,
    })
    this.container.add(this.light.container)
  }
  setHouses() {
    this.houses = new Houses({
      time: this.time,
      assets: this.assets,
    })
    this.container.add(this.houses.container)
  }
  setTerrain() {
    this.terrain = new Terrain({
      time: this.time,
      assets: this.assets,
    })
    this.container.add(this.terrain.container)
  }
  setWater() {
    this.water = new WaterScene({
      time: this.time,
      assets: this.assets,
    })
    this.container.add(this.water.container)
  }
}
