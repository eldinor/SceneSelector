import type { Scene } from "@babylonjs/core"
import { createDefaultScene } from "./defaultScene"
import { createSphereScene } from "./sphereScene"
import { createComplexScene } from "./complexScene"

// Define available scenes
export const availableScenes = [
  { 
    id: "default", 
    name: "Default Scene",
    description: "A simple rotating box on a flat surface."
  },
  { 
    id: "sphere", 
    name: "Sphere Scene",
    description: "A rotating sphere with a blue material and lighting."
  },
  { 
    id: "complex", 
    name: "Complex Scene",
    description: "Multiple animated cubes, ground, and a moving point light."
  },
]

// Scene loader function
export function loadScene(sceneName: string, scene: Scene): void {
  switch (sceneName) {
    case "default":
      createDefaultScene(scene)
      break
    case "sphere":
      createSphereScene(scene)
      break
    case "complex":
      createComplexScene(scene)
      break
    default:
      createDefaultScene(scene)
  }
}
