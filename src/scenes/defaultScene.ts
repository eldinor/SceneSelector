import { type Scene, MeshBuilder, Vector3 } from "@babylonjs/core"

export function createDefaultScene(scene: Scene): void {
  // Create a simple box
  const box = MeshBuilder.CreateBox("box", { size: 2 }, scene)
  box.position = new Vector3(0, 1, 0)

  // Add animation
  scene.registerBeforeRender(() => {
    box.rotation.y += 0.01
  })
}
