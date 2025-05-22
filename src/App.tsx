"use client"

import { useState } from "react"
import { BabylonScene } from "./components/BabylonScene"
import { SceneViewToggle } from "./components/SceneViewToggle"
import { SceneEventEmitter } from "./utils/SceneEventEmitter"

// Create a singleton event emitter for scene communication
export const sceneEvents = new SceneEventEmitter()

function App() {
  const [currentScene, setCurrentScene] = useState<string>("default")
  const [inspectorVisible, setInspectorVisible] = useState<boolean>(false)

  const handleSceneChange = (sceneName: string) => {
    setCurrentScene(sceneName)
    sceneEvents.emit("sceneChanged", sceneName)
  }

  const handleInspectorToggle = () => {
    setInspectorVisible((prev) => !prev)
    sceneEvents.emit("inspectorToggle")
  }

  return (
    <div className="flex min-h-screen w-full">
      {/* Sidebar */}
      <div className="h-screen overflow-y-auto bg-slate-100 shadow-md">
        <SceneViewToggle onSceneChange={handleSceneChange} currentScene={currentScene} />
      </div>

      {/* Main content area */}
      <div className="flex-1 flex flex-col">
        <header className="w-full px-6 py-4 bg-card text-card-foreground shadow-md z-10 flex items-center justify-between">
          <h1 className="text-2xl font-bold mb-2 px-4">Scene Selector</h1>
          <button
            onClick={handleInspectorToggle}
            title={inspectorVisible ? "Hide Inspector" : "Show Inspector"}
            className="ml-auto flex items-center gap-2 px-3 py-2 rounded hover:bg-slate-200 transition"
            aria-pressed={inspectorVisible}
          >
            {/* Simple SVG icon for Inspector (magnifying glass) */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width={22}
              height={22}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              className="inline-block"
            >
              <circle cx="11" cy="11" r="7" strokeWidth="2" />
              <line x1="16.5" y1="16.5" x2="21" y2="21" strokeWidth="2" strokeLinecap="round" />
            </svg>
            <span className="sr-only">{inspectorVisible ? "Hide Inspector" : "Show Inspector"}</span>
          </button>
        </header>
        <main className="flex-1 p-3 overflow-y-auto">
          <BabylonScene inspectorVisible={inspectorVisible} />
        </main>
      </div>
    </div>
  )
}

export default App
