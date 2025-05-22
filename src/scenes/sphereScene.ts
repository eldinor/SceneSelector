import {
  type Scene,
  MeshBuilder,
  Vector3,
  StandardMaterial,
  Color3,
  Effect,
  Vector2,
  PostProcess,
} from "@babylonjs/core";

export function createSphereScene(scene: Scene): void {
  // Create a sphere
  const sphere = MeshBuilder.CreateSphere("sphere", { diameter: 2 }, scene);

  // Register shader in ShadersStore
  Effect.ShadersStore["wavePostProcessVertexShader"] = `
        precision highp float;
        
        attribute vec2 position;
        
        varying vec2 vUV;
        
        const vec2 madd = vec2(0.5, 0.5);
        
        void main(void) {
            vUV = (position * madd + madd);
            gl_Position = vec4(position, 0.0, 1.0);
        }
    `;

  Effect.ShadersStore["wavePostProcessFragmentShader"] = `
        precision highp float;
        
        varying vec2 vUV;
        uniform float time;
        uniform vec2 resolution;
        uniform vec2 mousePos;
        
        #define A(v) mat2(cos(v+radians(vec4(0, -90, 90, 0))))  // rotate
        #define W(v) length(vec3(p.yz-v(p.x+vec2(0, 1.5708)+t), 0.0))-lt  // wave
        #define P(v) length(p-vec3(0.0, v(t), v(t+1.5708)))-pt  // point
        
        void main(void) {
            float lt = 0.1,  // line thickness
                  pt = 0.3,  // point thickness
                  pi = 3.1416,
                  pi2 = pi*2.0,
                  pi_2 = pi/2.0,
                  t = time*pi,
                  s = 1.0, d = 0.0, i = d;
            
            vec2 R = resolution;
            vec2 m = (mousePos*resolution-0.5*R)/R.y*4.0;
            
            vec3 o = vec3(0.0, 0.0, -7.0), // cam
                 u = normalize(vec3((vUV*resolution-0.5*R)/R.y, 1.0)),
                 c = vec3(0.0), k = c, p;
            
            if (mousePos.x < 0.0) m = -vec2(t/20.0-pi_2, 0.0); // move when not clicking
            mat2 v = A(m.y), h = A(m.x); // pitch & yaw
            
            for (int j=0; j<50; j++) { // raymarch
                p = o+u*d;
                p.yz *= v;
                p.xz *= h;
                p.x -= 3.0; // slide objects to the right a bit
                if (p.y < -1.5) p.y = 2.0/p.y; // reflect into neg y
                k.x = min(max(p.x+lt, W(sin)), P(sin)); // sine wave
                k.y = min(max(p.x+lt, W(cos)), P(cos)); // cosine wave
                s = min(s, min(k.x, k.y)); // blend
                if (s < 0.001 || d > 100.0) break; // limits
                d += s*0.5;
            }
            
            // add and color scene
            c = max(cos(d*pi2) - s*sqrt(d) - k, 0.0);
            c.gb += 0.1;
            gl_FragColor = vec4(c*0.4 + c.brg*0.6 + c*c, 1.0);
        }
    `;

  const engine = scene.getEngine();
  // Mouse position tracking
  const mousePos = new Vector2(0.5, 0.5);
  scene.onPointerMove = (evt) => {
    if (evt.x && evt.y) {
      mousePos.x = evt.x / engine.getRenderWidth();
      mousePos.y = 1.0 - evt.y / engine.getRenderHeight();
    }
  };

  // Create post-process
  const postProcess = new PostProcess(
    "wavePostProcess",
    "wavePostProcess",
    ["time", "resolution", "mousePos"],
    null, // No samplers needed
    1.0, // Options
    scene.activeCamera
  );

  postProcess.onApply = (effect) => {
    effect.setFloat("time", performance.now() / 1000);
    effect.setVector2("resolution", new Vector2(engine.getRenderWidth(), engine.getRenderHeight()));
    effect.setVector2("mousePos", mousePos);
  };

  sphere.onDisposeObservable.addOnce(() => {
    postProcess.dispose();
    console.log("SCENE DISPOSED");
  });
}
