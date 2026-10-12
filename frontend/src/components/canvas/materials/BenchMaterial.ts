import * as THREE from "three";
import { benchVertexShader, benchFragmentShader } from "../shaders/bench";

export class BenchMaterial extends THREE.ShaderMaterial {
  constructor() {
    super({
      vertexShader: benchVertexShader,
      fragmentShader: benchFragmentShader,
      uniforms: {
        uTravel: { value: 0.0 },
        uWorldBg: { value: new THREE.Color("#0A0A0B") },
        uRuleColor: { value: new THREE.Color("#ECE8DF") },
      },
      depthWrite: true,
      depthTest: true,
    });
  }

  get travel(): number {
    return this.uniforms.uTravel.value;
  }

  set travel(val: number) {
    this.uniforms.uTravel.value = val;
  }
}
