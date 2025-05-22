import {
  type Scene,
  ArcRotateCamera,
  FreeCamera,
  MeshBuilder,
  ShaderMaterial,
  Vector2,
  Vector3,
} from "@babylonjs/core";

export function createComplexScene(scene: Scene): void {
  const engine = scene.getEngine();

  const camera = new FreeCamera("camera", new Vector3(0, 0, -5), scene);
  scene.activeCamera = camera;

  const shaderMaterial = new ShaderMaterial(
    "tunnel",
    scene,
    {
      vertexSource: `
        precision highp float;
        attribute vec3 position;
        attribute vec2 uv;
        uniform mat4 worldViewProjection;
        varying vec2 vUv;
        void main() {
            vUv = uv;
            gl_Position = worldViewProjection * vec4(position, 1.0);
        }
    `,
      fragmentSource: `
        precision highp float;
        uniform float iTime;
        uniform vec2 iResolution;
        varying vec2 vUv;
        
        void main() {
            vec2 uv = (vUv - 0.5) * 2.0;
            uv.x *= iResolution.x / iResolution.y;
            
            // Tunnel effect
            float a = atan(uv.y, uv.x);
            float r = length(uv);
            float m = 1.0 / r * 0.2;
            
            // Grid pattern
            float f1 = fract(m * 5.0 + iTime * 0.5);
            float f2 = fract(a * 10.0 / (3.1415 * 2.0));
            
            // Neon colors
            vec3 col = vec3(
                sin(iTime * 0.5) * 0.5 + 0.5,
                cos(iTime * 0.7) * 0.5 + 0.5,
                sin(iTime * 0.3 + 1.0) * 0.5 + 0.5
            );
            
            // Grid lines
            float grid = smoothstep(0.95, 1.0, f1) + smoothstep(0.95, 1.0, f2);
            grid *= smoothstep(0.1, 0.5, r);
            
            gl_FragColor = vec4(col * grid, 1.0);
        }
    `,
    },
    {
      attributes: ["position", "uv"],
      uniforms: ["worldViewProjection", "iTime", "iResolution"],
    }
  );

  const plane = MeshBuilder.CreatePlane("plane", { size: 5 }, scene);
  plane.material = shaderMaterial;

  scene.registerBeforeRender(() => {
    shaderMaterial.setFloat("iTime", performance.now() / 1000);
    shaderMaterial.setVector2("iResolution", new Vector2(engine.getRenderWidth(), engine.getRenderHeight()));
  });

  plane.onDisposeObservable.addOnce(() => {
    camera.dispose();
  });
}
