import type { Scene } from "@babylonjs/core";
import { createDefaultScene } from "./defaultScene";
import { createSphereScene } from "./sphereScene";
import { createComplexScene } from "./complexScene";
import { createEnergyShield } from "./testScene";
import { createTestScene2 } from "./testScene2";

// Define scene types
export type SceneType = "simple" | "shader material" | "postprocess";

// Define available scenes
export interface AvailableScene {
  id: string;
  name: string;
  description: string;
  type: SceneType;
}
export const availableScenes: AvailableScene[] = [
  {
    id: "default",
    name: "Default Scene",
    description: "A simple rotating box on a flat surface.",
    type: "simple",
  },
  {
    id: "sphere",
    name: "Sinus-Cosinus 3D",
    description: "Postprocess shader with stunning effects.",
    type: "postprocess",
  },
  {
    id: "complex",
    name: "Complex Scene",
    description: "Multiple animated cubes, ground, and a moving point light.",
    type: "simple",
  },
  {
    id: "energy",
    name: "Energy Shield",
    description: "Shader Material which may take a damage and become thinner.",
    type: "shader material",
  },
  {
    id: "drive",
    name: "The Drive Home",
    description: "Night Drive under the rain PostProcess.",
    type: "postprocess",
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
    case "energy":
      createEnergyShield(scene);
      break;
    case "drive":
      createTestScene2(scene);
      break;
    default:
      createDefaultScene(scene);
  }
}
