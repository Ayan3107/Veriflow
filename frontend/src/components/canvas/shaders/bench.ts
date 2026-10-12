export const benchVertexShader = /* glsl */ `
varying vec3 vWorldPos;

void main() {
  vec4 worldPos = modelMatrix * vec4(position, 1.0);
  vWorldPos = worldPos.xyz;
  gl_Position = projectionMatrix * viewMatrix * worldPos;
}
`;

export const benchFragmentShader = /* glsl */ `
uniform float uTravel;
uniform vec3 uWorldBg;
uniform vec3 uRuleColor;
varying vec3 vWorldPos;

// Anti-aliased 1px hairline rule using screen derivatives
float computeRule(float coord, float spacing) {
  float c = coord / spacing;
  float g = abs(fract(c - 0.5) - 0.5) / fwidth(c);
  return 1.0 - clamp(g, 0.0, 1.0);
}

void main() {
  // Distance from camera for atmospheric horizon dissolve
  float dist = length(vWorldPos - cameraPosition);

  // 1. Receding horizontal ledger rules every 0.25 world units
  float zCoord = vWorldPos.z + uTravel;
  float hRulesFine = computeRule(zCoord, 0.25) * 0.16;

  // 2. Every 8th horizontal rule (every 2.0 units) is slightly stronger
  float hRulesMajor = computeRule(zCoord, 2.0) * 0.28;

  // 3. Sparse longitudinal rules running toward the horizon every 2.0 units
  float vRules = computeRule(vWorldPos.x, 2.0) * 0.12;

  // Combined rule intensity
  float totalRule = max(hRulesFine, max(hRulesMajor, vRules));

  // 4. Exponential fog dissolve toward the horizon into world background
  float fogFactor = exp(-dist * 0.075);
  fogFactor = clamp(fogFactor, 0.0, 1.0);

  // Floor is dark graphite blending to ink
  vec3 floorBase = mix(uWorldBg, vec3(0.078, 0.078, 0.086), 0.35);
  vec3 finalColor = mix(floorBase, uRuleColor, totalRule);

  // Dissolve to pure world background at distance
  finalColor = mix(uWorldBg, finalColor, fogFactor);

  gl_FragColor = vec4(finalColor, 1.0);
}
`;
