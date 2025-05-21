import { useState } from "react"
import { availableScenes } from "../scenes"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../../components/ui/card"
import { Button } from "../../components/ui/button"
import { FaList, FaThLarge } from "react-icons/fa"
import { SceneSelector } from "./SceneSelector"
import { BabylonScene } from "./BabylonScene"

interface SceneViewToggleProps {
  currentScene: string
  onSceneChange: (sceneId: string) => void
  // Optionally, children can be passed as the canvas content
  children?: React.ReactNode
}

export const SceneViewToggle = ({
  currentScene,
  onSceneChange,
  children, // remove later
}: SceneViewToggleProps) => {
  const [viewMode, setViewMode] = useState<"selector" | "cards">("cards") // Default to "cards" for sidebar

  return (
    <div className="flex">
      {/* Sidebar */}
      <aside className="w-72 min-w-[16rem] max-w-xs bg-muted/40 border-r h-full flex flex-col">
        <div className="p-4 border-b flex flex-col gap-2">
          <Button
            variant={viewMode === "selector" ? "default" : "outline"}
            size="sm"
            aria-pressed={viewMode === "selector"}
            onClick={() => setViewMode("selector")}
            className="flex items-center gap-2"
          >
            <FaList aria-hidden="true" />
            <span>Selector View</span>
          </Button>
          <Button
            variant={viewMode === "cards" ? "default" : "outline"}
            size="sm"
            aria-pressed={viewMode === "cards"}
            onClick={() => setViewMode("cards")}
            className="flex items-center gap-2"
          >
            <FaThLarge aria-hidden="true" />
            <span>Card View</span>
          </Button>
        </div>
        <div className="flex-1 overflow-y-auto p-4">
          {viewMode === "selector" ? (
            <SceneSelector currentScene={currentScene} onSceneChange={onSceneChange} />
          ) : (
            <SceneCardList currentScene={currentScene} onSceneChange={onSceneChange} />
          )}
        </div>
      </aside>
      {/* Canvas Area */}
      <main className="flex-1 h-full w-full overflow-hidden pr-2">
<BabylonScene/>
      </main>
    </div>
  )
}

// Card view for scenes
interface SceneCardListProps {
  currentScene: string
  onSceneChange: (sceneId: string) => void
}
const SceneCardList = ({ currentScene, onSceneChange }: SceneCardListProps) => (
  <div className="flex flex-col gap-4">
    {availableScenes.map(scene => (
      <Card
        key={scene.id}
        className={`cursor-pointer transition-shadow hover:shadow-lg ${
          currentScene === scene.id ? "ring-2 ring-primary" : ""
        }`}
        onClick={() => onSceneChange(scene.id)}
      >
        <CardHeader>
          <CardTitle>{scene.name}</CardTitle>
          <CardDescription>{scene.description}</CardDescription>
        </CardHeader>
        <CardContent>
          <span className="text-xs text-muted-foreground">ID: {scene.id}</span>
        </CardContent>
      </Card>
    ))}
  </div>
)
