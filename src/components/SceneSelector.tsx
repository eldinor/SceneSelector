"use client"

import { availableScenes } from "../scenes"

interface SceneSelectorProps {
  onSceneChange: (sceneName: string) => void
  currentScene: string
}

export const SceneSelector = ({ onSceneChange, currentScene }: SceneSelectorProps) => {
  const selectedScene = availableScenes.find(scene => scene.id === currentScene);

  return (
    <div className="scene-selector">
      <label htmlFor="scene-select">Select Scene: </label>
      <select 
        id="scene-select" 
        value={currentScene} 
        onChange={(e) => onSceneChange(e.target.value)}
        className="w-full p-2 border rounded"
      >
        {availableScenes.map((scene) => (
          <option key={scene.id} value={scene.id}>
            {scene.name}
          </option>
        ))}
      </select>
      {selectedScene && (
        <div className="mt-2 text-gray-600 text-sm">
          {selectedScene.description}
        </div>
      )}
    </div>
  )
}
