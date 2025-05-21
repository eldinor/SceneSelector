"use client"

import { useEffect, useRef } from "react"
import { Engine, Scene, Vector3, HemisphericLight, ArcRotateCamera } from "@babylonjs/core"
import { sceneEvents } from "../App"
import { loadScene } from "../scenes"

export const BabylonScene = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const engineRef = useRef<Engine | null>(null)
  const sceneRef = useRef<Scene | null>(null)

  // Initialize the Babylon.js engine and scene
  useEffect(() => {
    if (!canvasRef.current) return

    // Create engine
    const engine = new Engine(canvasRef.current, true, {
      preserveDrawingBuffer: true,
      stencil: true,
      disableWebGL2Support: false,
      adaptToDeviceRatio: true,
    })
    engineRef.current = engine

    // Create scene
    const scene = new Scene(engine)
    sceneRef.current = scene

    // Setup default environment
    setupDefaultEnvironment(scene)

    // Start render loop
    engine.runRenderLoop(() => {
      scene.render()
    })

    // Handle window resize
    const handleResize = () => {
      engine.resize()
    }
    window.addEventListener("resize", handleResize)

    return () => {
      window.removeEventListener("resize", handleResize)
      scene.dispose()
      engine.dispose()
    }
  }, [])

  // Handle scene changes
  useEffect(() => {
    if (!sceneRef.current) return

    const handleSceneChange = (sceneName: string) => {
      if (!sceneRef.current) return

      // Clear current scene
      while (sceneRef.current.meshes.length) {
        sceneRef.current.meshes[0].dispose()
      }

      // Load the requested scene
      loadScene(sceneName, sceneRef.current)
    }

    // Subscribe to scene change events
    sceneEvents.on("sceneChanged", handleSceneChange)

    // Load default scene
    loadScene("default", sceneRef.current)

    return () => {
      sceneEvents.off("sceneChanged", handleSceneChange)
    }
  }, [])

  return <canvas ref={canvasRef} className=" w-full h-full" />
}

// Setup default camera and light
function setupDefaultEnvironment(scene: Scene) {
  // Create camera
  const camera = new ArcRotateCamera("camera", -Math.PI / 2, Math.PI / 2.5, 10, new Vector3(0, 0, 0), scene)
  camera.attachControl(scene.getEngine().getRenderingCanvas(), true)

  // Create light
  new HemisphericLight("light", new Vector3(0, 1, 0), scene)
}
