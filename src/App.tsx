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
    <div className="flex min-h-screen w-full">
      {/* Sidebar */}
      <div className="h-screen overflow-y-auto bg-slate-100 shadow-md">
        <SceneViewToggle onSceneChange={handleSceneChange} currentScene={currentScene} />
      </div>

      {/* Main content area */}
      <div className="flex-1 flex flex-col">
        <header className="w-full px-6 py-4 bg-card text-card-foreground shadow-md z-10">
          <h1 className="text-2xl font-bold mb-2 px-4">Scene Selector</h1>
        </header>
        <main className="flex-1 p-6 overflow-y-auto">
          <BabylonScene />
        </main>
      </div>
    </div>
  )
}

export default App
