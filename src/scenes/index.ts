import type { Scene } from "@babylonjs/core";
import { createDefaultScene } from "./defaultScene";
import { createSphereScene } from "./sphereScene";
import { createComplexScene } from "./complexScene";
import { createTestScene } from "./testScene";
import { createTestScene2 } from "./testScene2";

// Define available scenes
export const availableScenes = [
  {
    id: "default",
    name: "Default Scene",
    description: "A simple rotating box on a flat surface.",
  },
  {
    id: "sphere",
    name: "Sphere Scene",
    description: "A rotating sphere with a blue material and lighting.",
  },
  {
    id: "complex",
    name: "Complex Scene",
    description: "Multiple animated cubes, ground, and a moving point light.",
  },
  {
    id: "test",
    name: "Test Scene",
    description: "Testing!",
  },
  {
    id: "test2",
    name: "Test2 Scene",
    description: "Testing! 22",
  },
];

// Scene loader function
export function loadScene(sceneName: string, scene: Scene): void {
  switch (sceneName) {
    case "default":
      createDefaultScene(scene);
      break;
    case "sphere":
      createSphereScene(scene);
      break;
    case "complex":
      createComplexScene(scene);
      break;
    case "test":
      createTestScene(scene);
      break;
    case "test2":
      createTestScene2(scene);
      break;
    default:
      createDefaultScene(scene);
  }
}
