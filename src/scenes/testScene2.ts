import { type Scene, MeshBuilder, Vector3 } from "@babylonjs/core";

export function createTestScene2(scene: Scene): void {
  // Create a simple box
  const box = MeshBuilder.CreateTorus("torus");
  box.position = new Vector3(0, 1, 0);

  // Add animation
  scene.registerBeforeRender(() => {
    box.rotation.y += 0.01;
  });
}
