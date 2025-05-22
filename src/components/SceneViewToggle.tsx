import { useState } from "react";
import { availableScenes } from "../scenes";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { FaList, FaThLarge } from "react-icons/fa";
import { SceneSelector } from "./SceneSelector";

interface SceneViewToggleProps {
  currentScene: string;
  onSceneChange: (sceneId: string) => void;
  // Optionally, children can be passed as the canvas content
  children?: React.ReactNode;
}

export const SceneViewToggle = ({
  currentScene,
  onSceneChange,
  children,
}: SceneViewToggleProps) => {
  const [viewMode, setViewMode] = useState<"selector" | "cards">("cards"); // Default to "cards" for sidebar

  return (
    <div className="flex h-screen"> 
      {/* Sidebar */}
      <aside className="w-72 min-w-[16rem] max-w-xs bg-muted/40 border-r flex flex-col overflow-auto">
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
      <div className="flex-1 flex flex-col">
        {/* Canvas fills the rest */}
        <main className="flex-1 w-full overflow-hidden flex flex-col">
          {/* 
            To ensure the Babylon canvas fits, 
            make sure the canvas component uses className="w-full h-full" 
            or style={{ width: "100%", height: "100%" }}.
          */}
          {children}
        </main>
      </div>
    </div>
  );
};

// Card view for scenes
interface SceneCardListProps {
  currentScene: string;
  onSceneChange: (sceneId: string) => void;
}
const SceneCardList = ({ currentScene, onSceneChange }: SceneCardListProps) => (
  <div className="flex flex-col gap-4">
    {availableScenes.map((scene) => (
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
);
