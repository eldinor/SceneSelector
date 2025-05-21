"use client"

import { useState } from "react"
import { BabylonScene } from "./components/BabylonScene"
import { SceneViewToggle } from "./components/SceneViewToggle"
import { SceneEventEmitter } from "./utils/SceneEventEmitter"

// Create a singleton event emitter for scene communication
export const sceneEvents = new SceneEventEmitter()

function App() {
  const [currentScene, setCurrentScene] = useState<string>("default")

  const handleSceneChange = (sceneName: string) => {
    setCurrentScene(sceneName)
    sceneEvents.emit("sceneChanged", sceneName)
  }

  return (
    <div className="flex flex-col min-h-screen w-full ">
      <header className="w-full px-6 py-4 bg-card text-card-foreground shadow-md z-10">
        <h1 className="text-2xl font-bold mb-2 px-4 ">Scene Selector</h1>
        <SceneViewToggle onSceneChange={handleSceneChange} currentScene={currentScene} />
      </header>

    </div>
  )
}

export default App
