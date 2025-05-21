import {
  type Scene,
  MeshBuilder,
  Vector3,
  StandardMaterial,
  Color3,
  PointLight,
  Animation,
  CubicEase,
  EasingFunction,
} from "@babylonjs/core"

export function createComplexScene(scene: Scene): void {
  // Create ground
  const ground = MeshBuilder.CreateGround("ground", { width: 10, height: 10 }, scene)
  const groundMaterial = new StandardMaterial("groundMaterial", scene)
  groundMaterial.diffuseColor = new Color3(0.2, 0.2, 0.2)
  ground.material = groundMaterial

  // Create multiple objects
  createAnimatedCube(scene, new Vector3(-3, 1, 0), new Color3(1, 0, 0))
  createAnimatedCube(scene, new Vector3(0, 1, 0), new Color3(0, 1, 0))
  createAnimatedCube(scene, new Vector3(3, 1, 0), new Color3(0, 0, 1))

  // Add point light
  const light = new PointLight("pointLight", new Vector3(0, 5, 0), scene)
  light.intensity = 0.8
  light.diffuse = new Color3(1, 1, 1)

  // Animate light
  const lightAnimation = new Animation(
    "lightAnimation",
    "position",
    30,
    Animation.ANIMATIONTYPE_VECTOR3,
    Animation.ANIMATIONLOOPMODE_CYCLE,
  )

  const keyFrames = [
    { frame: 0, value: new Vector3(0, 5, 0) },
    { frame: 60, value: new Vector3(5, 5, 0) },
    { frame: 120, value: new Vector3(0, 5, 5) },
    { frame: 180, value: new Vector3(-5, 5, 0) },
    { frame: 240, value: new Vector3(0, 5, -5) },
    { frame: 300, value: new Vector3(0, 5, 0) },
  ]

  lightAnimation.setKeys(keyFrames)

  const easingFunction = new CubicEase()
  easingFunction.setEasingMode(EasingFunction.EASINGMODE_EASEINOUT)
  lightAnimation.setEasingFunction(easingFunction)

  light.animations = [lightAnimation]
  scene.beginAnimation(light, 0, 300, true)
}

function createAnimatedCube(scene: Scene, position: Vector3, color: Color3) {
  const box = MeshBuilder.CreateBox("box", { size: 1 }, scene)
  box.position = position

  const material = new StandardMaterial(`material-${position.x}`, scene)
  material.diffuseColor = color
  box.material = material

  // Create animation
  const animation = new Animation(
    `boxAnimation-${position.x}`,
    "position.y",
    30,
    Animation.ANIMATIONTYPE_FLOAT,
    Animation.ANIMATIONLOOPMODE_CYCLE,
  )

  const keys = [
    { frame: 0, value: position.y },
    { frame: 30, value: position.y + 1 },
    { frame: 60, value: position.y },
  ]

  animation.setKeys(keys)
  box.animations = [animation]
  scene.beginAnimation(box, 0, 60, true)

  // Also add rotation
  scene.registerBeforeRender(() => {
    box.rotation.y += 0.01
  })
}
