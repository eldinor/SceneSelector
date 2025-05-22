"use client"

import { useState, useEffect } from "react"
import { BabylonScene } from "./components/BabylonScene"
import { SceneViewToggle } from "./components/SceneViewToggle"
import { SceneEventEmitter } from "./utils/SceneEventEmitter"

// Create a singleton event emitter for scene communication
export const sceneEvents = new SceneEventEmitter()

function App() {
  const [currentScene, setCurrentScene] = useState<string>("default")
  const [inspectorVisible, setInspectorVisible] = useState<boolean>(false)
  const [darkMode, setDarkMode] = useState<boolean>(false)

  // On mount, check for system or saved preference
  useEffect(() => {
    const saved = localStorage.getItem("darkMode")
    if (saved !== null) {
      setDarkMode(saved === "true")
      setHtmlDark(saved === "true")
    } else {
      // Use system preference as fallback
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches
      setDarkMode(prefersDark)
      setHtmlDark(prefersDark)
    }
  }, [])

  // Helper to set/remove dark class on <html>
  const setHtmlDark = (enabled: boolean) => {
    if (enabled) {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  }

  // Toggle dark mode and persist preference
  const handleDarkModeToggle = () => {
    setDarkMode((prev) => {
      setHtmlDark(!prev)
      localStorage.setItem("darkMode", String(!prev))
      return !prev
    })
  }

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
      <div className="h-screen overflow-y-auto bg-slate-100 dark:bg-slate-900 shadow-md">
        <SceneViewToggle onSceneChange={handleSceneChange} currentScene={currentScene} />
      </div>

      {/* Main content area */}
      <div className="flex-1 flex flex-col">
        <header className="w-full px-6 py-4 bg-card dark:bg-slate-800 text-card-foreground dark:text-grey dark:active:text-slate shadow-md z-10 flex items-center justify-between">
          <h1 className="text-2xl font-bold mb-2 px-4">Scene Selector</h1>
          <div className="flex items-center gap-2 ml-auto">
            {/* Dark mode toggle button */}
            <button
              onClick={handleDarkModeToggle}
              title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
              className="flex items-center gap-2 px-3 py-2 rounded hover:bg-slate-200 dark:hover:bg-slate-700 transition"
              aria-pressed={darkMode}
            >
              {/* Moon/Sun icon */}
              {darkMode ? (
                // Sun icon for light mode
                <svg xmlns="http://www.w3.org/2000/svg" width={22} height={22} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <circle cx="12" cy="12" r="5" strokeWidth="2" />
                  <path strokeWidth="2" strokeLinecap="round" d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
                </svg>
              ) : (
                // Moon icon for dark mode
                <svg xmlns="http://www.w3.org/2000/svg" width={22} height={22} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M21 12.79A9 9 0 1111.21 3a7 7 0 109.79 9.79z" />
                </svg>
              )}
              <span className="sr-only">{darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}</span>
            </button>
            {/* Inspector toggle button */}
            <button
              onClick={handleInspectorToggle}
              title={inspectorVisible ? "Hide Inspector" : "Show Inspector"}
              className="flex items-center gap-2 px-3 py-2 rounded hover:bg-slate-200 dark:hover:bg-slate-700 transition"
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
          </div>
        </header>
        <main className="flex-1 p-3 overflow-y-auto">
          <BabylonScene inspectorVisible={inspectorVisible} />
        </main>
      </div>
    </div>
  )
}

export default App
