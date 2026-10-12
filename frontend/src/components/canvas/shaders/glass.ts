export const glassVertexShader = /* glsl */ `
varying vec3 vNormal;
varying vec3 vViewDir;
varying vec3 vWorldPos;

void main() {
  vec4 worldPos = modelMatrix * vec4(position, 1.0);
  vWorldPos = worldPos.xyz;

  // View-space normal and view direction for screen-aligned refraction
  vNormal = normalize(normalMatrix * normal);
  vec4 viewPos = modelViewMatrix * vec4(position, 1.0);
  vViewDir = normalize(-viewPos.xyz);

  gl_Position = projectionMatrix * viewPos;
}
`;

export const glassFragmentShader = /* glsl */ `
uniform sampler2D uBackdrop;
uniform vec2 uRes;
uniform float uIor;
uniform float uThickness;
uniform float uDispersion;
uniform float uRoughness;
uniform float uInvert;

varying vec3 vNormal;
varying vec3 vViewDir;
varying vec3 vWorldPos;

// Multi-tap screen space blur for physical roughness
vec3 tapBackdrop(vec2 uv, float blur) {
  if (blur <= 0.0001) {
    return texture2D(uBackdrop, uv).rgb;
  }
  vec3 c = texture2D(uBackdrop, uv).rgb;
  c += texture2D(uBackdrop, uv + vec2( 0.7,  0.2) * blur).rgb;
  c += texture2D(uBackdrop, uv + vec2(-0.6,  0.5) * blur).rgb;
  c += texture2D(uBackdrop, uv + vec2( 0.1, -0.8) * blur).rgb;
  c += texture2D(uBackdrop, uv + vec2(-0.3, -0.4) * blur).rgb;
  return c / 5.0;
}

void main() {
  // Screen-space UV coordinates
  vec2 uv = gl_FragCoord.xy / uRes;
  vec3 n = normalize(vNormal);
  vec3 v = normalize(vViewDir);

  // Physical refraction offset based on surface normal and IOR
  vec2 off = n.xy * (uIor - 1.0) * uThickness * 0.045;

  // Controlled warm/cool chromatic dispersion (Red forward, Blue backward)
  // Zero dispersion = identical sampling UVs = perfectly crisp
  vec3 col;
  col.r = tapBackdrop(uv + off * (1.0 + uDispersion * 2.0), uRoughness).r;
  col.g = tapBackdrop(uv + off, uRoughness).g;
  col.b = tapBackdrop(uv + off * (1.0 - uDispersion * 2.0), uRoughness).b;

  // Physical Fresnel rim reflection
  float fres = pow(1.0 - max(dot(n, v), 0.0), 3.0);

  // Key light specular highlight along bevel edges
  vec3 keyDir = normalize(vec3(-0.55, 0.85, 0.4));
  vec3 ref = reflect(-v, n);
  float strip = smoothstep(0.95, 0.995, dot(ref, keyDir));

  // Subtle interior glass density tint (dark graphite)
  vec3 glassBody = mix(col, vec3(0.06, 0.06, 0.07), 0.18);

  // Bone highlight color
  vec3 boneSpecular = mix(vec3(0.93, 0.91, 0.87), vec3(0.08, 0.08, 0.09), uInvert);

  // Combine transmission, Fresnel rim, and specular highlight
  vec3 finalColor = mix(glassBody, boneSpecular, fres * 0.4) + strip * 0.85;

  gl_FragColor = vec4(finalColor, 1.0);
}
`;
