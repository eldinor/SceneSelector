"use client";

import { useEffect, useRef } from "react";
import { Engine, Scene, Vector3, HemisphericLight, ArcRotateCamera } from "@babylonjs/core";
import { sceneEvents } from "../App";
import { loadScene } from "../scenes";

interface BabylonSceneProps {
  inspectorVisible?: boolean;
}

export const BabylonScene = ({ inspectorVisible = false }: BabylonSceneProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const engineRef = useRef<Engine | null>(null);
  const sceneRef = useRef<Scene | null>(null);
  const inspectorLoadedRef = useRef<boolean>(false);

  // Helper to set canvas parent height to screen minus header and 30px padding
  const setCanvasParentHeight = () => {
    const canvas = canvasRef.current;
    if (!canvas || !canvas.parentElement) return;

    // Try to find the header element (assumes <header> tag is used)
    const header = document.querySelector("header");
    const headerHeight = header ? header.getBoundingClientRect().height : 0;
    // Subtract 30px for padding
    const newHeight = window.innerHeight - headerHeight - 30;

    canvas.parentElement.style.height = `${newHeight}px`;
    // Optionally, also set canvas height for extra safety
    canvas.style.height = "100%";
    canvas.style.width = "100%";
  };

  // Initialize the Babylon.js engine and scene
  useEffect(() => {
    if (!canvasRef.current) return;

    // Create engine
    const engine = new Engine(canvasRef.current, true, {
      preserveDrawingBuffer: true,
      stencil: true,
      disableWebGL2Support: false,
      adaptToDeviceRatio: true,
    });
    engineRef.current = engine;

    // Create scene
    const scene = new Scene(engine);
    sceneRef.current = scene;

    // Setup default environment
    setupDefaultEnvironment(scene);

    // Start render loop
    engine.runRenderLoop(() => {
      scene.render();
    });

    // Handle window resize
    const handleResize = () => {
      engine.resize();
      setCanvasParentHeight();
    };
    window.addEventListener("resize", handleResize);

    // Initial layout
    setCanvasParentHeight();

    return () => {
      window.removeEventListener("resize", handleResize);
      scene.dispose();
      engine.dispose();
    };
  }, []);

  // Handle scene changes
  useEffect(() => {
    if (!sceneRef.current) return;

    const handleSceneChange = (sceneName: string) => {
      if (!sceneRef.current) return;

      // Clear current scene
      while (sceneRef.current.meshes.length) {
        sceneRef.current.meshes[0].dispose();
      }
      while (sceneRef.current.materials.length) {
        sceneRef.current.materials[0].dispose();
      }
      for (const l of sceneRef.current.lights) {
        if (l.name != "light") {
          l.dispose();
        }
      }

      // Load the requested scene
      loadScene(sceneName, sceneRef.current);
    };

    // Subscribe to scene change events
    sceneEvents.on("sceneChanged", handleSceneChange);

    // Load default scene
    loadScene("default", sceneRef.current);

    return () => {
      sceneEvents.off("sceneChanged", handleSceneChange);
    };
  }, []);

  // Show/hide Inspector based on prop
  useEffect(() => {
    if (!sceneRef.current) return;

    const showInspector = async () => {
      if (!inspectorLoadedRef.current) {
        await import("@babylonjs/inspector");
        inspectorLoadedRef.current = true;
      }
      sceneRef.current!.debugLayer.show();
    };

    if (inspectorVisible) {
      showInspector();
    } else if (inspectorLoadedRef.current && sceneRef.current.debugLayer.isVisible()) {
      sceneRef.current.debugLayer.hide();
      
      // After hiding Inspector, recalculate canvas parent height
      setTimeout(() => {
        setCanvasParentHeight();
        window.dispatchEvent(new Event("resize"));
      }, 0);
    }
  }, [inspectorVisible]);

  return (
    <div className="w-full" style={{ width: "100%", height: "100%" }}>
      <canvas ref={canvasRef} className="w-full h-full" style={{ width: "100%", height: "100%", outline:"none" }} />
    </div>
  );
};

// Setup default camera and light
function setupDefaultEnvironment(scene: Scene) {
  // Create camera
  const camera = new ArcRotateCamera("camera", -Math.PI / 2, Math.PI / 2.5, 10, new Vector3(0, 0, 0), scene);
  camera.attachControl(scene.getEngine().getRenderingCanvas(), true);
  
  // Create light
  new HemisphericLight("light", new Vector3(0, 1, 0), scene);
}
