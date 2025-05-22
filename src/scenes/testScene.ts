import { type Scene, Engine, MeshBuilder, ShaderMaterial, Vector3 } from "@babylonjs/core";
import * as GUI from "@babylonjs/gui";

export function createEnergyShield(scene: Scene): void {
  // Create the shield mesh
  const shieldSphere = MeshBuilder.CreateSphere(
    "shield",
    {
      diameter: 5,
      segments: 64, // Higher segments for better effect quality
    },
    scene
  );

  // Store shield properties in an object for easy access
  const shieldProperties = {
    color: new Vector3(0.2, 0.6, 1.0),
    intensity: 1.2,
    health: 1.0,
  };

  // Create the shader material
  const shieldMaterial = new ShaderMaterial(
    "enhancedShield",
    scene,
    {
      vertexSource: `
          precision highp float;
          
          attribute vec3 position;
          attribute vec3 normal;
          attribute vec2 uv;
          
          uniform mat4 worldViewProjection;
          uniform mat4 world;
          uniform float time;
          
          varying vec3 vPosition;
          varying vec3 vNormal;
          varying vec2 vUV;
          
          void main() {
              float pulse = sin(time * 1.5 + position.x * 3.0) * 0.03;
              vec3 offset = normal * pulse;
              
              vec4 worldPosition = world * vec4(position + offset, 1.0);
              gl_Position = worldViewProjection * worldPosition;
              
              vPosition = worldPosition.xyz;
              vNormal = normalize(mat3(world) * normal);
              vUV = uv;
          }
      `,
      fragmentSource: `
          precision highp float;
          
          varying vec3 vPosition;
          varying vec3 vNormal;
          varying vec2 vUV;
          
          uniform float time;
          uniform vec3 cameraPosition;
          uniform vec3 shieldColor;
          uniform float intensity;
          uniform float shieldHealth;
          
          float rand(vec2 n) { 
              return fract(sin(dot(n, vec2(12.9898, 4.1414))) * 43758.5453);
          }
          
          float noise(vec3 p) {
              vec3 i = floor(p);
              vec3 f = fract(p);
              f = f*f*(3.0-2.0*f);
              
              return mix(
                  mix(
                      mix(rand(vec2(i.x, i.y)), rand(vec2(i.x+1.0, i.y)), f.x),
                      mix(rand(vec2(i.x, i.y+1.0)), rand(vec2(i.x+1.0, i.y+1.0)), f.x), 
                  f.y),
                  mix(
                      mix(rand(vec2(i.x, i.y+0.0)), rand(vec2(i.x+1.0, i.y+0.0)), f.x),
                      mix(rand(vec2(i.x, i.y+1.0)), rand(vec2(i.x+1.0, i.y+1.0)), f.x), 
                  f.y),
              f.z);
          }
          
          void main() {
              vec3 viewDir = normalize(cameraPosition - vPosition);
              float fresnel = pow(1.0 - abs(dot(viewDir, vNormal)), 3.0);
              
              vec3 distortedPos = vPosition * 2.0 + vec3(sin(time), cos(time * 0.7), sin(time * 0.3));
              float distortion = noise(distortedPos * 3.0 + time) * 0.3;
              
              vec2 uv = vUV * 15.0;
              vec2 grid = abs(fract(uv - 0.5) - 0.5) / fwidth(uv);
              float hexPattern = 1.0 - min(min(grid.x, grid.y), 1.0);
              
              float pulse = sin(time * 2.0) * 0.5 + 0.5;
              
              float damageEffect = 1.0;
              if (shieldHealth < 0.7) {
                  vec3 damagedPos = vPosition * (5.0 - shieldHealth * 4.0);
                  damageEffect = 1.0 - smoothstep(0.3, 0.7, noise(damagedPos + time * 2.0)) * (1.0 - shieldHealth);
              }
              
              float alpha = (fresnel * 0.7 + distortion * 0.2 + hexPattern * 0.3 * pulse) * intensity * damageEffect;
              vec3 color = shieldColor * (fresnel * 2.0 + hexPattern * 0.5 * pulse + distortion * 0.3);
              
              if (shieldHealth < 0.5) {
                  color = mix(color, vec3(1.0, 0.3, 0.2), (0.5 - shieldHealth) * 2.0);
              }
              
              gl_FragColor = vec4(color, alpha * 0.6);
          }
      `,
    },
    {
      attributes: ["position", "normal", "uv"],
      uniforms: ["worldViewProjection", "world", "time", "cameraPosition", "shieldColor", "intensity", "shieldHealth"],
      needAlphaBlending: true,
    }
  );

  // Configure material properties
  shieldMaterial.backFaceCulling = false;
  shieldMaterial.alphaMode = Engine.ALPHA_COMBINE;
  shieldMaterial.zOffset = -1;

  // Set initial uniform values
  shieldMaterial.setVector3("shieldColor", shieldProperties.color);
  shieldMaterial.setFloat("intensity", shieldProperties.intensity);
  shieldMaterial.setFloat("shieldHealth", shieldProperties.health);

  // Apply material to sphere
  shieldSphere.material = shieldMaterial;

  // Animation and interaction
  /*
  let shieldDamage = shieldProperties.health;
 
  scene.registerBeforeRender(() => {
    shieldMaterial.setFloat("time", Date.now() / 1000);
    if (scene.activeCamera) {
      shieldMaterial.setVector3("cameraPosition", scene.activeCamera.position);
    }

    if (shieldDamage < shieldProperties.health) {
      shieldDamage = Math.min(shieldProperties.health, shieldDamage + 0.005);
      shieldMaterial.setFloat("shieldHealth", shieldDamage);
    }
  });
*/
  MeshBuilder.CreateBox("box", { size: 2 }, scene);
  //
  // GUI Controls
  let advancedTexture;
  if (!advancedTexture) {
    advancedTexture = GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");
    const panel = new GUI.StackPanel();
    panel.width = "300px";
    panel.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT;
    panel.verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_CENTER;
    advancedTexture.addControl(panel);
    //
    // Color picker using our stored color
    const colorPicker = new GUI.ColorPicker();
    colorPicker.value.r = shieldProperties.color.x;
    colorPicker.value.g = shieldProperties.color.y;
    colorPicker.value.b = shieldProperties.color.z;
    colorPicker.onValueChangedObservable.add((value: any) => {
      shieldProperties.color.x = value.r;
      shieldProperties.color.y = value.g;
      shieldProperties.color.z = value.b;
      shieldMaterial.setVector3("shieldColor", new Vector3(value.r, value.g, value.b));
    });
    panel.addControl(colorPicker);
    //
    const healthText = new GUI.TextBlock();
    healthText.text = `Shield Health: ${shieldProperties.intensity * 50}%`;
    healthText.color = "white";
    healthText.height = "30px";
    panel.addControl(healthText);
    // Intensity slider
    const intensitySlider = new GUI.Slider();
    intensitySlider.minimum = 0;
    intensitySlider.maximum = 2;
    intensitySlider.value = shieldProperties.intensity;
    intensitySlider.height = "20px";
    intensitySlider.width = "200px";
    intensitySlider.onValueChangedObservable.add((value) => {
      shieldProperties.intensity = value;
      shieldMaterial.setFloat("intensity", value);
      healthText.text = `Shield Health: ${(shieldProperties.intensity * 50).toFixed()}%`;
    });

    panel.addControl(intensitySlider);
    //
  }
  shieldSphere.onDisposeObservable.add(() => {
    console.log("DISPOSED");
    advancedTexture.dispose();
  });
  //
}
