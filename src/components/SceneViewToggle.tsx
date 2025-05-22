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
const SceneCardList = ({ currentScene, onSceneChange }: SceneCardListProps) => {
  // Extract unique scene types
  const sceneTypes = Array.from(new Set(availableScenes.map(scene => scene.type)));
  const [selectedType, setSelectedType] = useState<string | null>(null);

  // Filter scenes by selected type, or show all if none selected
  const filteredScenes = selectedType
    ? availableScenes.filter(scene => scene.type === selectedType)
    : availableScenes;

  return (
    <div className="flex flex-col gap-4">
      {/* Scene type pills */}
      <div className="flex gap-2 mb-2 flex-wrap">
        <button
          type="button"
          className={`px-3 py-1 rounded-full text-xs font-medium border transition
            ${selectedType === null
              ? "bg-primary text-white border-primary"
              : "bg-slate-200 text-slate-700 border-slate-300 hover:bg-slate-300"}
          `}
          onClick={() => setSelectedType(null)}
        >
          All
        </button>
        {sceneTypes.map(type => (
          <button
            key={type}
            type="button"
            className={`px-3 py-1 rounded-full text-xs font-medium border transition
              ${selectedType === type
                ? "bg-primary text-white border-primary"
                : "bg-slate-200 text-slate-700 border-slate-300 hover:bg-slate-300"}
            `}
            onClick={() => setSelectedType(type)}
          >
            {type}
          </button>
        ))}
      </div>
      {/* Scene cards */}
      {filteredScenes.map((scene) => (
      <Card
        key={scene.id}
        className={`cursor-pointer transition-shadow hover:shadow-lg ${
          currentScene === scene.id ? "ring-2 ring-primary" : ""
        }`}
        onClick={() => onSceneChange(scene.id)}
      >
        <CardHeader>
          <CardTitle className="text-[1.2rem] font-medium">{scene.name}</CardTitle>
          <CardDescription>{scene.description}</CardDescription>
        </CardHeader>
        <CardContent>
          <span className="text-xs text-muted-foreground block">ID: {scene.id}</span>
          <span className="text-xs text-muted-foreground block">Type: {scene.type}</span>
        </CardContent>
      </Card>
    ))}
    {filteredScenes.length === 0 && (
      <div className="text-center text-muted-foreground text-xs mt-8">No scenes found for this type.</div>
    )}
  </div>
  );
};
