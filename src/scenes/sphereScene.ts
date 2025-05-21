import { type Scene, MeshBuilder, Vector3, StandardMaterial, Color3 } from "@babylonjs/core"

export function createSphereScene(scene: Scene): void {
  // Create a sphere
  const sphere = MeshBuilder.CreateSphere("sphere", { diameter: 2 }, scene)
  sphere.position = new Vector3(0, 1, 0)

  // Add material
  const material = new StandardMaterial("sphereMaterial", scene)
  material.diffuseColor = new Color3(0.4, 0.4, 1.0)
  material.specularColor = new Color3(0.7, 0.7, 0.7)
  sphere.material = material

  // Add animation
  scene.registerBeforeRender(() => {
    sphere.rotation.x += 0.01
    sphere.rotation.y += 0.01
  })
}
