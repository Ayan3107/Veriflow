import * as THREE from "three";
import { glassVertexShader, glassFragmentShader } from "../shaders/glass";

export class GlassMaterial extends THREE.ShaderMaterial {
  constructor(customUniforms: Partial<{
    ior: number;
    thickness: number;
    dispersion: number;
    roughness: number;
    invert: number;
  }> = {}) {
    super({
      vertexShader: glassVertexShader,
      fragmentShader: glassFragmentShader,
      uniforms: {
        uBackdrop: { value: null },
        uRes: { value: new THREE.Vector2(1, 1) },
        uIor: { value: customUniforms.ior ?? 1.45 },
        uThickness: { value: customUniforms.thickness ?? 0.9 },
        uDispersion: { value: customUniforms.dispersion ?? 0.04 },
        uRoughness: { value: customUniforms.roughness ?? 0.0 },
        uInvert: { value: customUniforms.invert ?? 0.0 },
      },
      transparent: false,
      depthWrite: true,
      depthTest: true,
    });
  }

  set backdrop(texture: THREE.Texture | null) {
    this.uniforms.uBackdrop.value = texture;
  }

  set resolution(res: THREE.Vector2) {
    this.uniforms.uRes.value.copy(res);
  }

  get dispersion(): number {
    return this.uniforms.uDispersion.value;
  }

  set dispersion(val: number) {
    this.uniforms.uDispersion.value = val;
  }

  get roughness(): number {
    return this.uniforms.uRoughness.value;
  }

  set roughness(val: number) {
    this.uniforms.uRoughness.value = val;
  }

  get invert(): number {
    return this.uniforms.uInvert.value;
  }

  set invert(val: number) {
    this.uniforms.uInvert.value = val;
  }
}
