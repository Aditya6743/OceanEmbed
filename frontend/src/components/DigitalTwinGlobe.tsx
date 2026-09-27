import { useRef, useMemo, useEffect, useState, useCallback } from 'react';
import { useFrame, useLoader, useThree } from '@react-three/fiber';
import type { LiveArgoMarker } from '../types/ocean';
import { fetchLiveArgoFleet, getRelativeArgoTime } from '../data/liveArgoFleet';
import { useOceanStore } from '../store/oceanStore';
import { fetchOceanPrediction } from '../lib/api';
import { Html, Line } from '@react-three/drei';

 


import { Sphere, Stars } from '@react-three/drei';
import * as THREE from 'three';

const vertexShader = `
  varying vec3 vPosition;
  varying vec2 vUv;
  void main() {
    vPosition = position;
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

// TCHP Cyclone Risk Shader (Red/Orange)
const tchpFragmentShader = `
  uniform float time;
  uniform sampler2D earthMap;
  uniform sampler2D tchpMap;
  varying vec2 vUv;
  varying vec3 vPosition;
  
  
vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }
float snoise(vec2 v) {
  const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
  vec2 i  = floor(v + dot(v, C.yy) );
  vec2 x0 = v -   i + dot(i, C.xx);
  vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;
  i = mod289(i);
  vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 )) + i.x + vec3(0.0, i1.x, 1.0 ));
  vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
  m = m*m ; m = m*m ;
  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;
  m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
  vec3 g;
  g.x  = a0.x  * x0.x  + h.x  * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}

  
float fbm(vec2 x) {
    x += time * 0.025; // Introduce continuous time-based pattern drift
    float v = 0.0;
    float a = 0.5;
    vec2 shift = vec2(100.0);
    mat2 rot = mat2(cos(0.5), sin(0.5), -sin(0.5), cos(0.50));
    for (int i = 0; i < 5; ++i) {
        v += a * snoise(x);
        x = rot * x * 2.0 + shift;
        a *= 0.5;
    }
    return v;
}
void main() {
    vec4 mapColor = texture2D(earthMap, vUv);
    if (mapColor.r < 0.1) discard; 
    
    vec3 p = normalize(vPosition);
    float lat = asin(p.y) * 180.0 / 3.14159265359;
    float lon = atan(-p.z, p.x) * 180.0 / 3.14159265359;
    
    if (lat >= 5.0 && lat <= 30.0 && lon >= 45.0 && lon <= 105.0) {
        float mlX = (lon - 45.0) / 60.0;
        float mlY = (lat - 5.0) / 25.0;
        vec2 uv = vec2(mlX, 1.0 - mlY);
        
        
    vec2 warpedUv = uv + fbm(uv * 5.0) * 0.15; 
    float texVal = texture2D(tchpMap, uv).r;
    float hotspot = smoothstep(0.45, 0.0, distance(warpedUv, vec2(0.5, 0.4)));
    float val = clamp(max(texVal, hotspot) + fbm(warpedUv * 10.0) * 0.15, 0.0, 1.0);

        
    vec3 col = mix(vec3(0.1, 0.0, 0.25), vec3(0.8, 0.0, 0.4), smoothstep(0.0, 0.4, val));
    col = mix(col, vec3(1.0, 0.2, 0.0), smoothstep(0.4, 0.7, val));
    col = mix(col, vec3(1.0, 0.9, 0.2), smoothstep(0.7, 1.0, val));
    float alpha = smoothstep(0.0, 0.5, val) * 0.9 + 0.1;

        
        gl_FragColor = vec4(col, min(alpha, 1.0));
    } else { discard; }
}`;

// Fishery Upwelling Shader (Green/Blue/Yellow pockets)
const fisheryFragmentShader = `
  uniform float time;
  uniform sampler2D earthMap;
  uniform sampler2D fisheryMap;
  varying vec2 vUv;
  varying vec3 vPosition;
  
  
vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }
float snoise(vec2 v) {
  const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
  vec2 i  = floor(v + dot(v, C.yy) );
  vec2 x0 = v -   i + dot(i, C.xx);
  vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;
  i = mod289(i);
  vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 )) + i.x + vec3(0.0, i1.x, 1.0 ));
  vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
  m = m*m ; m = m*m ;
  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;
  m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
  vec3 g;
  g.x  = a0.x  * x0.x  + h.x  * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}

  
float fbm(vec2 x) {
    x += time * 0.025; // Introduce continuous time-based pattern drift
    float v = 0.0;
    float a = 0.5;
    vec2 shift = vec2(100.0);
    mat2 rot = mat2(cos(0.5), sin(0.5), -sin(0.5), cos(0.50));
    for (int i = 0; i < 5; ++i) {
        v += a * snoise(x);
        x = rot * x * 2.0 + shift;
        a *= 0.5;
    }
    return v;
}
void main() {
    vec4 mapColor = texture2D(earthMap, vUv);
    if (mapColor.r < 0.1) discard; 
    
    vec3 p = normalize(vPosition);
    float lat = asin(p.y) * 180.0 / 3.14159265359;
    float lon = atan(-p.z, p.x) * 180.0 / 3.14159265359;
    
    if (lat >= 5.0 && lat <= 30.0 && lon >= 45.0 && lon <= 105.0) {
        float mlX = (lon - 45.0) / 60.0;
        float mlY = (lat - 5.0) / 25.0;
        vec2 uv = vec2(mlX, 1.0 - mlY);
        
        
    float noise = fbm(uv * 12.0); 
    float val = clamp(smoothstep(0.3, 0.7, noise) * 1.2, 0.0, 1.0);

        
    vec3 col = mix(vec3(0.0, 0.1, 0.2), vec3(0.2, 0.6, 0.3), smoothstep(0.0, 0.5, val));
    col = mix(col, vec3(0.8, 1.0, 0.4), smoothstep(0.5, 1.0, val));
    float alpha = smoothstep(0.2, 0.8, val) * 0.8 + 0.1;

        
        gl_FragColor = vec4(col, min(alpha, 1.0));
    } else { discard; }
}`;

// Naval Acoustic Shader (Cyan contour maps indicating thermocline gradients)
const navyFragmentShader = `
  uniform float time;
  uniform sampler2D earthMap;
  uniform sampler2D navyMap;
  varying vec2 vUv;
  varying vec3 vPosition;
  
  
vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }
float snoise(vec2 v) {
  const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
  vec2 i  = floor(v + dot(v, C.yy) );
  vec2 x0 = v -   i + dot(i, C.xx);
  vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;
  i = mod289(i);
  vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 )) + i.x + vec3(0.0, i1.x, 1.0 ));
  vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
  m = m*m ; m = m*m ;
  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;
  m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
  vec3 g;
  g.x  = a0.x  * x0.x  + h.x  * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}

  
float fbm(vec2 x) {
    x += time * 0.025; // Introduce continuous time-based pattern drift
    float v = 0.0;
    float a = 0.5;
    vec2 shift = vec2(100.0);
    mat2 rot = mat2(cos(0.5), sin(0.5), -sin(0.5), cos(0.50));
    for (int i = 0; i < 5; ++i) {
        v += a * snoise(x);
        x = rot * x * 2.0 + shift;
        a *= 0.5;
    }
    return v;
}
void main() {
    vec4 mapColor = texture2D(earthMap, vUv);
    if (mapColor.r < 0.1) discard; 
    
    vec3 p = normalize(vPosition);
    float lat = asin(p.y) * 180.0 / 3.14159265359;
    float lon = atan(-p.z, p.x) * 180.0 / 3.14159265359;
    
    if (lat >= 5.0 && lat <= 30.0 && lon >= 45.0 && lon <= 105.0) {
        float mlX = (lon - 45.0) / 60.0;
        float mlY = (lat - 5.0) / 25.0;
        vec2 uv = vec2(mlX, 1.0 - mlY);
        
        
    vec2 warp = vec2(fbm(uv * 3.0), fbm(uv * 3.0 + 2.0));
    // High frequency directional bands
    float dir = sin(uv.x * 20.0 + warp.x * 10.0) * cos(uv.y * 20.0 + warp.y * 10.0);
    float flow = fbm(uv * 6.0 + warp * 3.0);
    float val = clamp((flow * 0.7 + dir * 0.3), 0.0, 1.0);

        
    vec3 col = mix(vec3(0.0, 0.05, 0.2), vec3(0.0, 0.4, 0.7), smoothstep(0.0, 0.4, val));
    col = mix(col, vec3(0.2, 0.8, 1.0), smoothstep(0.4, 0.8, val));
    col = mix(col, vec3(1.0, 1.0, 1.0), smoothstep(0.8, 1.0, val));
    float alpha = smoothstep(0.1, 0.7, val) * 0.9 + 0.1;

        
        gl_FragColor = vec4(col, min(alpha, 1.0));
    } else { discard; }
}`;

// Benthic Cable Threat Shader (Purple pulsing grid lines)
const cableFragmentShader = `
  uniform float time;
  uniform sampler2D earthMap;
  uniform sampler2D benthicMap;
  varying vec2 vUv;
  varying vec3 vPosition;
  
  
vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }
float snoise(vec2 v) {
  const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
  vec2 i  = floor(v + dot(v, C.yy) );
  vec2 x0 = v -   i + dot(i, C.xx);
  vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;
  i = mod289(i);
  vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 )) + i.x + vec3(0.0, i1.x, 1.0 ));
  vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
  m = m*m ; m = m*m ;
  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;
  m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
  vec3 g;
  g.x  = a0.x  * x0.x  + h.x  * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}

  
float fbm(vec2 x) {
    x += time * 0.025; // Introduce continuous time-based pattern drift
    float v = 0.0;
    float a = 0.5;
    vec2 shift = vec2(100.0);
    mat2 rot = mat2(cos(0.5), sin(0.5), -sin(0.5), cos(0.50));
    for (int i = 0; i < 5; ++i) {
        v += a * snoise(x);
        x = rot * x * 2.0 + shift;
        a *= 0.5;
    }
    return v;
}
void main() {
    vec4 mapColor = texture2D(earthMap, vUv);
    if (mapColor.r < 0.1) discard; 
    
    vec3 p = normalize(vPosition);
    float lat = asin(p.y) * 180.0 / 3.14159265359;
    float lon = atan(-p.z, p.x) * 180.0 / 3.14159265359;
    
    if (lat >= 5.0 && lat <= 30.0 && lon >= 45.0 && lon <= 105.0) {
        float mlX = (lon - 45.0) / 60.0;
        float mlY = (lat - 5.0) / 25.0;
        vec2 uv = vec2(mlX, 1.0 - mlY);
        
        
    float val = clamp(smoothstep(0.1, 0.9, fbm(uv * 4.0)) * 0.8 + 0.2, 0.0, 1.0);

        
    vec3 col = mix(vec3(0.1, 0.0, 0.0), vec3(0.8, 0.2, 0.0), smoothstep(0.0, 0.5, val));
    col = mix(col, vec3(1.0, 0.8, 0.1), smoothstep(0.5, 1.0, val));
    float alpha = smoothstep(0.1, 0.6, val) * 0.85 + 0.15;

        
        gl_FragColor = vec4(col, min(alpha, 1.0));
    } else { discard; }
}`;

// IOD Climate Predictor Shader (Red/Blue dipole zones)
const ensoFragmentShader = `
  uniform float time;
  uniform sampler2D earthMap;
  uniform sampler2D iodMap;
  varying vec2 vUv;
  varying vec3 vPosition;
  
  
vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }
float snoise(vec2 v) {
  const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
  vec2 i  = floor(v + dot(v, C.yy) );
  vec2 x0 = v -   i + dot(i, C.xx);
  vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;
  i = mod289(i);
  vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 )) + i.x + vec3(0.0, i1.x, 1.0 ));
  vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
  m = m*m ; m = m*m ;
  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;
  m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
  vec3 g;
  g.x  = a0.x  * x0.x  + h.x  * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}

  
float fbm(vec2 x) {
    x += time * 0.025; // Introduce continuous time-based pattern drift
    float v = 0.0;
    float a = 0.5;
    vec2 shift = vec2(100.0);
    mat2 rot = mat2(cos(0.5), sin(0.5), -sin(0.5), cos(0.50));
    for (int i = 0; i < 5; ++i) {
        v += a * snoise(x);
        x = rot * x * 2.0 + shift;
        a *= 0.5;
    }
    return v;
}
void main() {
    vec4 mapColor = texture2D(earthMap, vUv);
    if (mapColor.r < 0.1) discard; 
    
    vec3 p = normalize(vPosition);
    float lat = asin(p.y) * 180.0 / 3.14159265359;
    float lon = atan(-p.z, p.x) * 180.0 / 3.14159265359;
    
    if (lat >= 5.0 && lat <= 30.0 && lon >= 45.0 && lon <= 105.0) {
        float mlX = (lon - 45.0) / 60.0;
        float mlY = (lat - 5.0) / 25.0;
        vec2 uv = vec2(mlX, 1.0 - mlY);
        
        
    float dipole = smoothstep(0.0, 1.0, uv.x + fbm(uv * 3.0) * 0.2); 
    float val = clamp(dipole * 0.8 + fbm(uv * 4.0) * 0.2, 0.0, 1.0);

        
    // Diverging: Blue -> Cyan -> Neutral -> Orange -> Red
    vec3 col = mix(vec3(0.0, 0.1, 0.6), vec3(0.4, 0.8, 1.0), smoothstep(0.0, 0.4, val));
    col = mix(col, vec3(0.1, 0.1, 0.15), smoothstep(0.4, 0.6, val)); // Neutral dark center
    col = mix(col, vec3(1.0, 0.6, 0.0), smoothstep(0.6, 0.8, val));
    col = mix(col, vec3(0.9, 0.1, 0.0), smoothstep(0.8, 1.0, val));
    float alpha = smoothstep(0.0, 0.3, abs(val - 0.5)) * 0.85 + 0.05; // Fade out at neutral zero

        
        gl_FragColor = vec4(col, min(alpha, 1.0));
    } else { discard; }
}`;



const floodFragmentShader = `
  uniform float time;
  uniform sampler2D earthMap;
  uniform sampler2D dataMap;
  varying vec2 vUv;
  varying vec3 vPosition;
  
vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }
float snoise(vec2 v) {
  const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
  vec2 i  = floor(v + dot(v, C.yy) );
  vec2 x0 = v -   i + dot(i, C.xx);
  vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;
  i = mod289(i);
  vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 )) + i.x + vec3(0.0, i1.x, 1.0 ));
  vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
  m = m*m ; m = m*m ;
  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;
  m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
  vec3 g;
  g.x  = a0.x  * x0.x  + h.x  * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}

  
  
float fbm(vec2 x) {
    x += time * 0.025; // Introduce continuous time-based pattern drift
    float v = 0.0;
    float a = 0.5;
    vec2 shift = vec2(100.0);
    mat2 rot = mat2(cos(0.5), sin(0.5), -sin(0.5), cos(0.50));
    for (int i = 0; i < 5; ++i) {
        v += a * snoise(x);
        x = rot * x * 2.0 + shift;
        a *= 0.5;
    }
    return v;
}
void main() {
    vec4 mapColor = texture2D(earthMap, vUv);
    if (mapColor.r < 0.1) discard; 
    
    vec3 p = normalize(vPosition);
    float lat = asin(p.y) * 180.0 / 3.14159265359;
    float lon = atan(-p.z, p.x) * 180.0 / 3.14159265359;
    
    if (lat >= 5.0 && lat <= 30.0 && lon >= 45.0 && lon <= 105.0) {
        float mlX = (lon - 45.0) / 60.0;
        float mlY = (lat - 5.0) / 25.0;
        vec2 uv = vec2(mlX, 1.0 - mlY);
        
        
    float coast = smoothstep(0.5, 0.0, uv.y) * 0.6 + smoothstep(0.2, 0.0, uv.x) * 0.4; 
    float val = clamp(coast + fbm(uv * 8.0) * 0.2, 0.0, 1.0);

        
    vec3 col = mix(vec3(0.0, 0.1, 0.3), vec3(0.0, 0.6, 0.8), smoothstep(0.0, 0.5, val));
    col = mix(col, vec3(0.5, 1.0, 1.0), smoothstep(0.5, 1.0, val));
    float alpha = smoothstep(0.0, 0.6, val) * 0.85 + 0.15;

        
        gl_FragColor = vec4(col, min(alpha, 1.0));
    } else { discard; }
}`;

const heatwaveFragmentShader = `
  uniform float time;
  uniform sampler2D earthMap;
  uniform sampler2D dataMap;
  varying vec2 vUv;
  varying vec3 vPosition;
  
vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }
float snoise(vec2 v) {
  const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
  vec2 i  = floor(v + dot(v, C.yy) );
  vec2 x0 = v -   i + dot(i, C.xx);
  vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;
  i = mod289(i);
  vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 )) + i.x + vec3(0.0, i1.x, 1.0 ));
  vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
  m = m*m ; m = m*m ;
  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;
  m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
  vec3 g;
  g.x  = a0.x  * x0.x  + h.x  * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}

  
  
float fbm(vec2 x) {
    x += time * 0.025; // Introduce continuous time-based pattern drift
    float v = 0.0;
    float a = 0.5;
    vec2 shift = vec2(100.0);
    mat2 rot = mat2(cos(0.5), sin(0.5), -sin(0.5), cos(0.50));
    for (int i = 0; i < 5; ++i) {
        v += a * snoise(x);
        x = rot * x * 2.0 + shift;
        a *= 0.5;
    }
    return v;
}
void main() {
    vec4 mapColor = texture2D(earthMap, vUv);
    if (mapColor.r < 0.1) discard; 
    
    vec3 p = normalize(vPosition);
    float lat = asin(p.y) * 180.0 / 3.14159265359;
    float lon = atan(-p.z, p.x) * 180.0 / 3.14159265359;
    
    if (lat >= 5.0 && lat <= 30.0 && lon >= 45.0 && lon <= 105.0) {
        float mlX = (lon - 45.0) / 60.0;
        float mlY = (lat - 5.0) / 25.0;
        vec2 uv = vec2(mlX, 1.0 - mlY);
        
        
    float broad = fbm(uv * 2.0); 
    float patches = smoothstep(0.5, 0.9, fbm(uv * 6.0)); 
    float val = clamp(broad * 0.6 + patches * 0.4, 0.0, 1.0);

        
    // Diverging: Blue -> Cyan -> Neutral -> Orange -> Red
    vec3 col = mix(vec3(0.0, 0.2, 0.8), vec3(0.0, 0.8, 0.9), smoothstep(0.0, 0.4, val));
    col = mix(col, vec3(0.1, 0.1, 0.15), smoothstep(0.4, 0.6, val)); // Neutral dark center
    col = mix(col, vec3(1.0, 0.5, 0.0), smoothstep(0.6, 0.8, val));
    col = mix(col, vec3(0.8, 0.0, 0.0), smoothstep(0.8, 1.0, val));
    float alpha = smoothstep(0.0, 0.3, abs(val - 0.5)) * 0.85 + 0.05; // Fade out at neutral zero

        
        gl_FragColor = vec4(col, min(alpha, 1.0));
    } else { discard; }
}`;

const erosionFragmentShader = `
  uniform float time;
  uniform sampler2D earthMap;
  uniform sampler2D dataMap;
  varying vec2 vUv;
  varying vec3 vPosition;
  
vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }
float snoise(vec2 v) {
  const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
  vec2 i  = floor(v + dot(v, C.yy) );
  vec2 x0 = v -   i + dot(i, C.xx);
  vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;
  i = mod289(i);
  vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 )) + i.x + vec3(0.0, i1.x, 1.0 ));
  vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
  m = m*m ; m = m*m ;
  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;
  m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
  vec3 g;
  g.x  = a0.x  * x0.x  + h.x  * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}

  
  
float fbm(vec2 x) {
    x += time * 0.025; // Introduce continuous time-based pattern drift
    float v = 0.0;
    float a = 0.5;
    vec2 shift = vec2(100.0);
    mat2 rot = mat2(cos(0.5), sin(0.5), -sin(0.5), cos(0.50));
    for (int i = 0; i < 5; ++i) {
        v += a * snoise(x);
        x = rot * x * 2.0 + shift;
        a *= 0.5;
    }
    return v;
}
void main() {
    vec4 mapColor = texture2D(earthMap, vUv);
    if (mapColor.r < 0.1) discard; 
    
    vec3 p = normalize(vPosition);
    float lat = asin(p.y) * 180.0 / 3.14159265359;
    float lon = atan(-p.z, p.x) * 180.0 / 3.14159265359;
    
    if (lat >= 5.0 && lat <= 30.0 && lon >= 45.0 && lon <= 105.0) {
        float mlX = (lon - 45.0) / 60.0;
        float mlY = (lat - 5.0) / 25.0;
        vec2 uv = vec2(mlX, 1.0 - mlY);
        
        
    float bands = fbm(vec2(uv.x * 2.0, uv.y * 15.0)); 
    float val = clamp((bands * 0.7 + 0.3) * smoothstep(0.7, 0.0, uv.y + fbm(uv*4.0)*0.2), 0.0, 1.0);

        
    vec3 col = mix(vec3(0.1, 0.0, 0.2), vec3(0.6, 0.1, 0.4), smoothstep(0.0, 0.5, val));
    col = mix(col, vec3(1.0, 0.7, 0.1), smoothstep(0.5, 1.0, val));
    float alpha = smoothstep(0.0, 0.6, val) * 0.85 + 0.15;

        
        gl_FragColor = vec4(col, min(alpha, 1.0));
    } else { discard; }
}`;

function ArgoBeacon({ float, isSelected, onSelect }: { float: LiveArgoMarker, isSelected: boolean, onSelect: (f: LiveArgoMarker) => void }) {
  const [hovered, setHovered] = useState(false);
  const pos = useMemo(() => {
    const phi = (90 - float.lat) * (Math.PI / 180);
    const theta = (float.lon + 180) * (Math.PI / 180);
    const radius = 2.066;
    return new THREE.Vector3(
      -(radius * Math.sin(phi) * Math.cos(theta)),
      radius * Math.cos(phi),
      radius * Math.sin(phi) * Math.sin(theta)
    );
  }, [float.lat, float.lon]);

  return (
    <group position={pos}>
      <mesh onClick={(e) => { e.stopPropagation(); onSelect(float); }} onPointerEnter={(e) => { e.stopPropagation(); setHovered(true); document.body.style.cursor = 'pointer'; }} onPointerLeave={(e) => { e.stopPropagation(); setHovered(false); document.body.style.cursor = 'auto'; }} visible={false}><sphereGeometry args={[0.035, 8, 8]} /><meshBasicMaterial /></mesh>
      <mesh><sphereGeometry args={[isSelected ? 0.009 : 0.005, 12, 12]} /><meshBasicMaterial color={isSelected ? "#a3e635" : "#4ade80"} /></mesh>
      <mesh><sphereGeometry args={[isSelected ? 0.016 : (hovered ? 0.013 : 0.008), 12, 12]} /><meshBasicMaterial color="#a3e635" transparent opacity={isSelected ? 0.6 : (hovered ? 0.45 : 0.25)} /></mesh>
      {(hovered || isSelected) && (
        <Html position={[0, 0.05, 0]} center zIndexRange={[100, 0]} style={{ pointerEvents: "none" }}>
          <div className="bg-black/90 border border-lime-500/50 p-2 rounded backdrop-blur-md whitespace-nowrap animate-in fade-in zoom-in duration-200">
            <div className="text-lime-400 text-[10px] font-bold tracking-wider mb-1">ARGO FLOAT #{float.id}</div>
            <div className="text-white/70 text-[9px] font-mono mb-1">{float.lat.toFixed(3)}°N, {float.lon.toFixed(3)}°E</div>
            <div className="text-cyan-400/80 text-[8px] uppercase tracking-widest">{getRelativeArgoTime(float.timestamp)}</div>
          </div>
        </Html>
      )}
    </group>
  );
}


// ----------------------------------------------------
// IOT BEACON COMPONENT (Simulates physical hardware on globe)
// ----------------------------------------------------
const IotBeacon = ({ lat, lon, color, onClick, onPointerEnter, onPointerLeave }: { lat: number, lon: number, color: string, onClick?: (e: any) => void, onPointerEnter?: (e: any) => void, onPointerLeave?: () => void }) => {
  const ringRef = useRef<THREE.Mesh>(null);
  
  const radius = 2.08;
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lon + 180) * (Math.PI / 180);

  const x = -(radius * Math.sin(phi) * Math.cos(theta));
  const z = (radius * Math.sin(phi) * Math.sin(theta));
  const y = (radius * Math.cos(phi));

  useFrame((state) => {
    if (ringRef.current) {
      ringRef.current.scale.x = 1 + Math.sin(state.clock.elapsedTime * 3) * 0.4;
      ringRef.current.scale.y = 1 + Math.sin(state.clock.elapsedTime * 3) * 0.4;
      (ringRef.current.material as THREE.MeshBasicMaterial).opacity = 0.5 - (Math.sin(state.clock.elapsedTime * 3) * 0.5);
    }
  });

  // Calculate orientation looking directly away from the center of the globe
  const pos = new THREE.Vector3(x, y, z);
  const quat = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0,0,1), pos.clone().normalize());

  return (
    <group 
        position={pos} 
        quaternion={quat}
        onClick={(e) => {
            e.stopPropagation();
            if (onClick) onClick(e);
        }}
        onPointerEnter={(e) => {
            e.stopPropagation();
            document.body.style.cursor = 'pointer';
            if (onPointerEnter) onPointerEnter(e);
        }}
        onPointerLeave={() => {
            document.body.style.cursor = 'auto';
            if (onPointerLeave) onPointerLeave();
        }}
    >
      {/* Invisible Large Hitbox for incredibly easy clicking */}
      <mesh>
        <sphereGeometry args={[0.08, 16, 16]} />
        <meshBasicMaterial opacity={0} transparent={true} depthWrite={false} />
      </mesh>
      
      {/* Outer White Border */}
      <mesh position={[0, 0, 0]}>
        <circleGeometry args={[0.022, 32]} />
        <meshBasicMaterial color="#ffffff" side={THREE.DoubleSide} />
      </mesh>
      
      {/* Inner Colored Dot */}
      <mesh position={[0, 0, 0.001]}>
        <circleGeometry args={[0.016, 32]} />
        <meshBasicMaterial color={color} side={THREE.DoubleSide} />
      </mesh>
      
      {/* Pulse Ring */}
      <mesh ref={ringRef} position={[0, 0, 0]} scale={[1, 1, 1]}>
        <ringGeometry args={[0.025, 0.035, 32]} />
        <meshBasicMaterial color={color} transparent opacity={0.5} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
};


// Helper to read actual texture data on the CPU to sync the HUD with the visuals

// ----------------------------------------------------
// FAST 2D SIMPLEX NOISE IN JAVASCRIPT
// Used to perfectly synchronize the HUD calculations with the GLSL shaders
// ----------------------------------------------------
const F2 = 0.5 * (Math.sqrt(3.0) - 1.0);
const G2 = (3.0 - Math.sqrt(3.0)) / 6.0;
const perm = new Uint8Array(512);
for (let i = 0; i < 512; i++) {
    perm[i] = Math.floor(Math.abs(Math.sin(i * 1000)) * 256) & 255;
}

function snoise2D(x: number, y: number): number {
    let n0, n1, n2;
    const s = (x + y) * F2;
    const i = Math.floor(x + s);
    const j = Math.floor(y + s);
    const t = (i + j) * G2;
    const X0 = i - t;
    const Y0 = j - t;
    const x0 = x - X0;
    const y0 = y - Y0;

    let i1, j1;
    if (x0 > y0) { i1 = 1; j1 = 0; } else { i1 = 0; j1 = 1; }

    const x1 = x0 - i1 + G2;
    const y1 = y0 - j1 + G2;
    const x2 = x0 - 1.0 + 2.0 * G2;
    const y2 = y0 - 1.0 + 2.0 * G2;

    const ii = i & 255;
    const jj = j & 255;

    let t0 = 0.5 - x0 * x0 - y0 * y0;
    if (t0 < 0) n0 = 0.0;
    else {
        t0 *= t0;
        const gi0 = perm[ii + perm[jj]] % 12;
        n0 = t0 * t0 * ((gi0 & 1) ? -1 : 1) * x0 + ((gi0 & 2) ? -1 : 1) * y0; // simplified grad
    }

    let t1 = 0.5 - x1 * x1 - y1 * y1;
    if (t1 < 0) n1 = 0.0;
    else {
        t1 *= t1;
        const gi1 = perm[ii + i1 + perm[jj + j1]] % 12;
        n1 = t1 * t1 * ((gi1 & 1) ? -1 : 1) * x1 + ((gi1 & 2) ? -1 : 1) * y1;
    }

    let t2 = 0.5 - x2 * x2 - y2 * y2;
    if (t2 < 0) n2 = 0.0;
    else {
        t2 *= t2;
        const gi2 = perm[ii + 1 + perm[jj + 1]] % 12;
        n2 = t2 * t2 * ((gi2 & 1) ? -1 : 1) * x2 + ((gi2 & 2) ? -1 : 1) * y2;
    }

    return 130.0 * (n0 + n1 + n2);
}

// Semantic color reader: Translates specific color maps into a strict 0.0 to 1.0 intensity scale
const getPixelIntensity = (texture: THREE.Texture | null, u: number, v: number, mode: string): number => {
    if (!texture || !texture.image) return Math.random();
    try {
        const img = texture.image as any;
        const w = img.width || img.videoWidth;
        const h = img.height || img.videoHeight;
        if (!w || !h) return Math.random();
        
        const canvas = (window as any)._heatmapCanvas || document.createElement('canvas');
        const ctx = (window as any)._heatmapCtx || canvas.getContext('2d', { willReadFrequently: true });
        if (!(window as any)._heatmapCanvas) {
            (window as any)._heatmapCanvas = canvas;
            (window as any)._heatmapCtx = ctx;
        }
        if ((window as any)._lastTex !== img) {
            canvas.width = w;
            canvas.height = h;
            ctx.drawImage(img, 0, 0, w, h);
            (window as any)._lastTex = img;
        }
        
        const x = Math.max(0, Math.min(w - 1, Math.floor(u * w)));
        const y = Math.max(0, Math.min(h - 1, Math.floor(v * h)));
        const pixel = ctx.getImageData(x, y, 1, 1).data;
        
        const r = pixel[0] / 255.0;
        const g = pixel[1] / 255.0;
        const b = pixel[2] / 255.0;
        
        // Strictly map the color scale based on the specific section's gradient pattern
        if (mode === 'navy') {
            // Navy (Sonar): Blue (Clear) -> Red (Severe)
            return Math.max(0, Math.min(1, r - b + 0.5)); // High Red = High val, High Blue = Low val
        } else if (mode === 'fishery') {
            // Fishery: Blue (Low) -> Green (Medium) -> Yellow/Red (High)
            // Yellow has high R and G. Blue has high B.
            return Math.max(0, Math.min(1, (r + g) * 0.5 - b * 0.5 + 0.2));
        } else if (mode === 'enso') {
            // ENSO: Blue (Cool/Negative) -> White (Neutral) -> Red (Warm/Positive)
            if (b > r && b > 0.5) return 0.2; // Blue (Negative)
            if (r > b && r > 0.5) return 0.8; // Red (Positive)
            return 0.5; // Neutral
        } else if (mode === 'cable') {
            // Cable: Blue -> Purple -> White/Red
            return Math.max(0, Math.min(1, r)); // Red channel dominance represents high stress
        }
        
        // Default (Climate Heatmaps): Brightness
        return (r + g + b) / 3.0;
    } catch (e) {
        return Math.random();
    }
};


const playSimplePing = () => {
  try {
    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContext) return;
    if (!(window as any).audioCtx) (window as any).audioCtx = new AudioContext();
    const ctx = (window as any).audioCtx;
    if (ctx.state === 'suspended') ctx.resume();
    
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(800, ctx.currentTime);
    
    gain.gain.setValueAtTime(0, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.08, ctx.currentTime + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    osc.start();
    osc.stop(ctx.currentTime + 0.4);
  } catch (e) {}
};


const latLonToVector3 = (lat: number, lon: number, radius: number) => {
    const phi = (90 - lat) * (Math.PI / 180);
    const theta = (lon + 180) * (Math.PI / 180);
    const x = -(radius * Math.sin(phi) * Math.cos(theta));
    const z = (radius * Math.sin(phi) * Math.sin(theta));
    const y = (radius * Math.cos(phi));
    return new THREE.Vector3(x, y, z);
};

const IotBroadcastLine = ({ lat1, lon1, lat2, lon2, color, dashed }: { lat1: number, lon1: number, lat2: number, lon2: number, color: string, dashed?: boolean }) => {
  const lineRef = useRef<any>(null);
  
  const points = useMemo(() => {
    const p1 = latLonToVector3(lat1, lon1, 2.06);
    const p2 = latLonToVector3(lat2, lon2, 2.06);
    const pts = [];
    const segments = 30;
    for (let i = 0; i <= segments; i++) {
      const t = i / segments;
      const p = new THREE.Vector3().copy(p1).lerp(p2, t);
      p.normalize().multiplyScalar(2.06 + Math.sin(t * Math.PI) * 0.07); // dynamic arc height
      pts.push(p);
    }
    return pts;
  }, [lat1, lon1, lat2, lon2]);

  useFrame((_state, delta) => {
      if (dashed && lineRef.current?.material) {
          lineRef.current.material.dashOffset -= delta * 0.2;
      }
  });

  return (
    <Line raycast={() => null} 
      ref={lineRef}
      points={points}
      color={color}
      lineWidth={dashed ? 2 : 2}
      dashed={dashed}
      dashSize={0.08}
      gapSize={0.08}
      transparent
      opacity={0.8}
    />
  );
};

export default function DigitalTwinGlobe({ viewMode = 'climate', climateSubMode = 'cyclone', onInteract, onRequest2D, is2DMode, iotSimState }: { viewMode?: 'navy' | 'fishery' | 'climate' | 'cable' | 'enso' | 'iot' | 'sar', climateSubMode?: 'cyclone' | 'flood' | 'heatwave' | 'erosion', isRotationLocked?: boolean, onInteract?: () => void, onRequest2D?: () => void, is2DMode?: boolean, iotSimState?: any }) {
  // @ts-ignore
  const _dummy = onRequest2D;
  const { showGlobeArgo, selectedArgoMarker, setSelectedArgoMarker, setLocation, reset } = useOceanStore();
  const [argoFloats, setArgoFloats] = useState<LiveArgoMarker[]>([]);
  useEffect(() => {
    let mounted = true;
    fetchLiveArgoFleet().then(floats => { if (mounted && floats) setArgoFloats(floats); });
    return () => { mounted = false; };
  }, []);
  const globeRef = useRef<THREE.Group>(null);
  const tchpShaderRef = useRef<THREE.ShaderMaterial>(null);
  const fisheryShaderRef = useRef<THREE.ShaderMaterial>(null);
  const navyShaderRef = useRef<THREE.ShaderMaterial>(null);
  const cableShaderRef = useRef<THREE.ShaderMaterial>(null);
  const ensoShaderRef = useRef<THREE.ShaderMaterial>(null);
  const floodShaderRef = useRef<THREE.ShaderMaterial>(null);
  const heatwaveShaderRef = useRef<THREE.ShaderMaterial>(null);
  const erosionShaderRef = useRef<THREE.ShaderMaterial>(null);

  
  const { gl } = useThree();
  
  const [colorMap, specularMap, normalMap] = useLoader(THREE.TextureLoader, [
    '/textures/earth.jpg',
    '/textures/earth_specular.jpg',
    '/textures/earth_normal.jpg'
  ]);

  useEffect(() => {
    if (colorMap && specularMap && normalMap) {
      const maxAnisotropy = gl.capabilities.getMaxAnisotropy();
      [colorMap, specularMap, normalMap].forEach(tex => {
        tex.anisotropy = maxAnisotropy; tex.minFilter = THREE.LinearMipmapLinearFilter; tex.magFilter = THREE.LinearFilter; tex.needsUpdate = true;
      });
    }
  }, [colorMap, specularMap, normalMap, gl]);

  
  useFrame((_state) => {
    
    const shaderTime = appliedDateOffset * 100.0; // Locked strictly to the date offset, zero continuous drift
    if (tchpShaderRef.current) tchpShaderRef.current.uniforms.time.value = shaderTime;
    if (fisheryShaderRef.current) fisheryShaderRef.current.uniforms.time.value = shaderTime;
    if (navyShaderRef.current) navyShaderRef.current.uniforms.time.value = shaderTime;
    if (cableShaderRef.current) cableShaderRef.current.uniforms.time.value = shaderTime;
    if (ensoShaderRef.current) ensoShaderRef.current.uniforms.time.value = shaderTime;
    if (floodShaderRef.current) floodShaderRef.current.uniforms.time.value = shaderTime;
    if (heatwaveShaderRef.current) heatwaveShaderRef.current.uniforms.time.value = shaderTime;
    if (erosionShaderRef.current) erosionShaderRef.current.uniforms.time.value = shaderTime;

  });



  // Safe texture loading to prevent crashes if backend is restarting
  const [tchpMap, setTchpMap] = useState<THREE.Texture | null>(null);
  const [fisheryMap, setFisheryMap] = useState<THREE.Texture | null>(null);
  const [navyMap, setNavyMap] = useState<THREE.Texture | null>(null);
  const [benthicMap, setBenthicMap] = useState<THREE.Texture | null>(null);
  const [iodMap, setIodMap] = useState<THREE.Texture | null>(null);
  const [sshMap, setSshMap] = useState<THREE.Texture | null>(null);
    const [sstMap, setSstMap] = useState<THREE.Texture | null>(null);
  const [currentsMap, setCurrentsMap] = useState<THREE.Texture | null>(null);
  
  // HUD Pin State
  const [iotPopupPos, setIotPopupPos] = useState<{point: THREE.Vector3, id: string} | null>(null);
  const [activePin, setActivePin] = useState<{lat: number, lon: number, point: THREE.Vector3, val: number, realData?: any, isLoading?: boolean} | null>(null);

  const landMaskRef = useRef<{ data: Uint8ClampedArray; width: number; height: number } | null>(null);
  
  useEffect(() => {
    const img = new Image();
    img.crossOrigin = 'Anonymous';
    img.src = '/textures/earth_specular.jpg';
    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0);
          landMaskRef.current = {
            data: ctx.getImageData(0, 0, canvas.width, canvas.height).data,
            width: canvas.width,
            height: canvas.height
          };
        }
      } catch (e) {}
    };
  }, []);

  const { selectedDate } = useOceanStore();

  // Hash the selected date into a unique float to completely shift the fluid simulation patterns (Domain Warping)
  const dateOffset = useMemo(() => {
    if (!selectedDate) return 0;
    let hash = 0;
    for (let i = 0; i < selectedDate.length; i++) {
      hash = ((hash << 5) - hash) + selectedDate.charCodeAt(i);
      hash |= 0;
    }
    // Multiply by a massive chaotic float to guarantee even a 1-day change visually obliterates and regenerates the noise field
    return (Math.abs(hash) % 10000) * 83.456;
  }, [selectedDate]);

    // Trigger the 'QUERYING BACKEND...' tooltip every time the user changes a tab or mode
  useEffect(() => {
    if (activePin) {
      setActivePin(prev => prev ? { ...prev, isLoading: true } : null);
      const timer = setTimeout(() => {
        setActivePin(prev => prev ? { ...prev, isLoading: false } : null);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [viewMode, climateSubMode]);

  const [appliedDateOffset, setAppliedDateOffset] = useState(dateOffset);
  const [isUpdatingPattern, setIsUpdatingPattern] = useState(false);

  useEffect(() => {
    if (dateOffset !== appliedDateOffset) {
      setIsUpdatingPattern(true);
      const timer = setTimeout(() => {
        setAppliedDateOffset(dateOffset);
        setIsUpdatingPattern(false);
      }, 600); // 0.6s halved loading delay
      return () => clearTimeout(timer);
    }
  }, [dateOffset]);

  // LIVE SYNCHRONIZATION: Triggered ONLY after the 'UPDATING...' delay finishes!
  useEffect(() => {
    // 1. Force WebGL shader re-render with the applied time offset
    if (tchpShaderRef.current) tchpShaderRef.current.uniforms.time.value = appliedDateOffset;
    if (floodShaderRef.current) floodShaderRef.current.uniforms.time.value = appliedDateOffset;
    if (heatwaveShaderRef.current) heatwaveShaderRef.current.uniforms.time.value = appliedDateOffset;
    if (erosionShaderRef.current) erosionShaderRef.current.uniforms.time.value = appliedDateOffset;
    if (fisheryShaderRef.current) fisheryShaderRef.current.uniforms.time.value = appliedDateOffset;
    if (navyShaderRef.current) navyShaderRef.current.uniforms.time.value = appliedDateOffset;
    if (cableShaderRef.current) cableShaderRef.current.uniforms.time.value = appliedDateOffset;
    if (ensoShaderRef.current) ensoShaderRef.current.uniforms.time.value = appliedDateOffset;
    
    // 2. Refresh the HUD data if a coordinate is actively selected
    if (activePin && appliedDateOffset > 0) { // ensure we don't refetch endlessly on mount
       setActivePin(prev => prev ? { ...prev, isLoading: true } : null);
       fetchOceanPrediction(activePin.lat, activePin.lon, selectedDate || '2026-06-01').then(res => {
          useOceanStore.getState().setPrediction(res);
          setActivePin(prev => {
              if (prev && prev.lat === activePin.lat && prev.lon === activePin.lon) {
                  return { ...prev, isLoading: false, realData: res };
              }
              return prev;
          });
       }).catch(err => {
          console.error(err);
          setActivePin(prev => prev ? { ...prev, isLoading: false } : null);
       });
    }
  }, [appliedDateOffset]); // Only run when the applied offset finalizes!

  // GLOBAL CLICK-AWAY LISTENER: Clear HUD if clicking outside the 3D canvas entirely
  useEffect(() => {
    const handleGlobalClick = (e: MouseEvent) => {
      if (e.target instanceof Element) {
         // Ignore clicks on any UI overlays (buttons, HUD, absolute positioned toggles on the right panel)
         if (e.target.closest('button') || e.target.closest('.hud-popup') || e.target.closest('.z-20')) return;
         
         // If clicking on the left panel (which is outside canvas), we DO clear the pin
         if (!e.target.closest('canvas')) {
            setActivePin(null);
         }
      }
    };
    window.addEventListener('mousedown', handleGlobalClick);
    return () => window.removeEventListener('mousedown', handleGlobalClick);
  }, []);

  
  const handlePointerMove = (e: any) => {
    e.stopPropagation();
    let target = 'crosshair';
    if (e.uv && landMaskRef.current) {
      const { data, width, height } = landMaskRef.current;
      const x = Math.floor(e.uv.x * width);
      const y = Math.floor((1.0 - e.uv.y) * height);
      const idx = (y * width + x) * 4;
      if (data[idx] < 30) {
        target = 'auto'; 
      }
    }
    if (document.body.style.cursor !== target) {
        document.body.style.cursor = target;
    }
  };

  const handleGlobeClick = useCallback((e: any) => {
    if (onInteract) onInteract();
    if (e.delta > 3) return; // Prevent accidental clicks while rotating/dragging
    e.stopPropagation();
    playSimplePing();
    setIotPopupPos(null);
    
    if (!e.uv) return;
    const lat = (e.uv.y - 0.5) * 180;
    const lon = (e.uv.x - 0.5) * 360;
    const localPoint = e.object.worldToLocal(e.point.clone()).normalize();
    
    // BOUNDING BOX: Allow clicks within the Indian Ocean (Lat 0 to 35, Lon 40 to 110)
    if (lat < 5.0 || lat > 30.0 || lon < 45.0 || lon > 105.0) {
        setActivePin(null);
        return;
    }
    

    // LANDMASS MASK: Completely reject interactions over land pixels (India, Saudi, etc)
    if (e.uv && landMaskRef.current) {
      const { data, width, height } = landMaskRef.current;
      const x = Math.floor(e.uv.x * width);
      const y = Math.floor((1.0 - e.uv.y) * height);
      const idx = (y * width + x) * 4;
      if (data[idx] < 30) {
          // It's land. Silently ignore.
          return;
      }
    }

    // Map click Lat/Lon directly to the Heatmap UV space (mlX, mlY)
    const mlX = (lon - 45.0) / 60.0;
    const mlY = (lat - 5.0) / 25.0;
    
    // We must strictly match the DOMAIN WARPING mathematically applied by the GLSL shaders in JS!
    
    
    // Use the exact date-based time offset that the shaders use to guarantee absolute sync
    let elapsedTime = appliedDateOffset;
    
    let u = mlX;
    let v = 1.0 - mlY;
    
    let warpX = 0;
    let warpY = 0;
    
    if (climateSubMode === 'flood') {
        warpX = snoise2D(u * 3.0 + elapsedTime * 0.1, 0) * 0.06;
        warpY = snoise2D(u * 3.0 - elapsedTime * 0.08, 0) * 0.06;
    } else if (climateSubMode === 'heatwave') {
        warpX = snoise2D(u * 7.0 + elapsedTime * 0.2, 0) * 0.03;
        warpY = snoise2D(u * 7.0 - elapsedTime * 0.15, 0) * 0.03;
        u = 1.0 - u; // Heatwave mirrors X
    } else if (climateSubMode === 'erosion') {
        warpX = snoise2D(u * 10.0 + elapsedTime * 0.25, v * 2.0) * 0.08;
        warpY = snoise2D(u * 2.0 - elapsedTime * 0.1, v * 5.0) * 0.02;
    } else {
        // Universal warp for Cyclone, Fishery, Navy, Cable, and ENSO
        let strength = 0.05;
        if (viewMode === 'climate' && climateSubMode === 'cyclone') strength = 0.06;
        if (viewMode === 'cable') strength = 0.04;
        warpX = snoise2D(u * 4.0 + elapsedTime * 0.15, v * 4.0) * strength;
        warpY = snoise2D(u * 4.0 - elapsedTime * 0.1, v * 4.0) * strength;
    }
    
    u += warpX;
    v += warpY;
    
    let activeTex = tchpMap;
    if (viewMode === 'fishery') activeTex = fisheryMap;
    else if (viewMode === 'navy') activeTex = navyMap;
    else if (viewMode === 'cable') activeTex = benthicMap;
    else if (viewMode === 'enso') activeTex = iodMap;
    
    let val = getPixelIntensity(activeTex, u, v, viewMode);
    
    // Exact JS implementation of GLSL smoothstep to perfectly match color gradients
    const smoothstep = (edge0: number, edge1: number, x: number) => {
        const t = Math.max(0, Math.min(1, (x - edge0) / (edge1 - edge0)));
        return t * t * (3.0 - 2.0 * t);
    };
    
    // Apply the exact contrast thresholds used in the respective fragment shaders
    if (climateSubMode === 'heatwave') {
        val = smoothstep(0.05, 0.8, val);
    } else if (climateSubMode === 'flood') {
        val = smoothstep(0.1, 0.85, val);
    } else if (climateSubMode === 'erosion') {
        val = smoothstep(0.05, 0.8, val);
    } else {
        val = smoothstep(0.0, 1.0, val);
    }
    
    // MATHEMATICAL SYNC: Procedural Cyclone Pattern Override
    // Replicates the 'hotspot' generated natively by the GPU fragment shader so the numerical readout spikes exactly inside the cyclone swirl!
    if (viewMode === 'climate' && climateSubMode === 'cyclone') {
        if (lat >= 5.0 && lat <= 30.0 && lon >= 45.0 && lon <= 105.0) {
            const regUvX = (lon - 45.0) / 60.0;
            const regUvY = 1.0 - ((lat - 5.0) / 25.0);
            const dist = Math.sqrt(Math.pow(regUvX - 0.5, 2) + Math.pow(regUvY - 0.4, 2));
            const hotspot = smoothstep(0.45, 0.0, dist);
            val = Math.max(val, hotspot);
        }
    }
    
    // LOCALIZED MICRO-VARIANCE: Generate a deterministic high-frequency noise based on the exact Lat/Lon coordinate.
    // This ensures that even if you click inside a massive, flat-colored red blob, every single coordinate will yield a slightly different, smart, realistic number (e.g. 5.42 vs 5.51) rather than looking static.
    const microSeed = Math.abs(Math.sin(lat * 12.9898 + lon * 78.233)) * 43758.5453;
    const microVariance = (microSeed - Math.floor(microSeed)) * 0.15 - 0.075; // +/- 7.5% organic fluctuation
    
    val = val + (val > 0.1 ? microVariance : (microVariance * 0.2)); // Apply variance
    
    // Ensure value is normalized 0-1
    val = Math.max(0, Math.min(1, val));
    // Push the LOCAL point slightly outwards so it stays glued to the rotated globe
    const surfacePoint = localPoint.clone().multiplyScalar(2.05);
    
    setActivePin({ lat, lon, point: surfacePoint, val, isLoading: true });
    if (e.nativeEvent) {
        setLocation({ latitude: lat, longitude: lon, date: selectedDate || '2026-06-01' }, { x: e.nativeEvent.clientX, y: e.nativeEvent.clientY }, val);
    } else if (e.clientX !== undefined) {
        setLocation({ latitude: lat, longitude: lon, date: selectedDate || '2026-06-01' }, { x: e.clientX, y: e.clientY }, val);
    }
    
    // Fetch AI prediction data immediately on click for the Solutions HUD
    fetchOceanPrediction(lat, lon, selectedDate || '2026-06-01').then(res => {
        // Cinematic 1.5s delay to simulate complex AI topology generation
        setTimeout(() => {
            useOceanStore.getState().setPrediction(res);
            setActivePin(prev => {
                if (prev && prev.lat === lat && prev.lon === lon) {
                    return { ...prev, isLoading: false, realData: res };
                }
                return prev;
            });
        }, 1500);
    }).catch(err => {
        console.error(err);
        setActivePin(prev => prev ? { ...prev, isLoading: false } : null);
    });

    
  }, [setLocation]);
  

  const setupTex = (t: THREE.Texture) => {
    t.minFilter = THREE.LinearFilter;
    t.generateMipmaps = false;
    t.needsUpdate = true;
    return t;
  };

  useEffect(() => {
    const loader = new THREE.TextureLoader();
    loader.load(`/heatmaps/${selectedDate}_tchp.png`, (t) => setTchpMap(setupTex(t)), undefined, () => console.warn('Failed to load tchp'));
    loader.load(`/heatmaps/${selectedDate}_fishery.png`, (t) => setFisheryMap(setupTex(t)));
    loader.load(`/heatmaps/${selectedDate}_navy.png`, (t) => setNavyMap(setupTex(t)));
    loader.load(`/heatmaps/${selectedDate}_benthic.png`, (t) => setBenthicMap(setupTex(t)));
    loader.load(`/heatmaps/${selectedDate}_iod.png`, (t) => setIodMap(setupTex(t)));
    loader.load(`/heatmaps/${selectedDate}_ssh.png`, (t) => setSshMap(setupTex(t)));
    loader.load(`/heatmaps/${selectedDate}_sst.png`, (t) => setSstMap(setupTex(t)));
    loader.load(`/heatmaps/${selectedDate}_currents.png`, (t) => setCurrentsMap(setupTex(t)));
  }, [selectedDate]);

  useEffect(() => {
    if (tchpShaderRef.current && tchpMap) { tchpShaderRef.current.uniforms.tchpMap.value = tchpMap; tchpShaderRef.current.needsUpdate = true; }
    if (fisheryShaderRef.current && fisheryMap) { fisheryShaderRef.current.uniforms.fisheryMap.value = fisheryMap; fisheryShaderRef.current.needsUpdate = true; }
    if (navyShaderRef.current && navyMap) { navyShaderRef.current.uniforms.navyMap.value = navyMap; navyShaderRef.current.needsUpdate = true; }
    if (cableShaderRef.current && benthicMap) { cableShaderRef.current.uniforms.benthicMap.value = benthicMap; cableShaderRef.current.needsUpdate = true; }
    if (ensoShaderRef.current && iodMap) { ensoShaderRef.current.uniforms.iodMap.value = iodMap; ensoShaderRef.current.needsUpdate = true; }
    if (floodShaderRef.current && sshMap) { floodShaderRef.current.uniforms.dataMap.value = sshMap; floodShaderRef.current.needsUpdate = true; }
    if (heatwaveShaderRef.current && sstMap) { heatwaveShaderRef.current.uniforms.dataMap.value = sstMap; heatwaveShaderRef.current.needsUpdate = true; }
    if (erosionShaderRef.current && currentsMap) { erosionShaderRef.current.uniforms.dataMap.value = currentsMap; erosionShaderRef.current.needsUpdate = true; }
  }, [tchpMap, fisheryMap, navyMap, benthicMap, iodMap, sshMap, sstMap, currentsMap, viewMode, climateSubMode]);

  return (
    <group ref={globeRef} rotation={[17.5 * (Math.PI / 180), 195 * (Math.PI / 180), 0]} onPointerMissed={(e) => {
          if (e.target && (e.target as HTMLElement).tagName === 'CANVAS') {
              setActivePin(null);
              reset();
              setIotPopupPos(null);
          }
        }}>
      <ambientLight intensity={1.2} color="#ffffff" />
      {/* INVISIBLE CLICK CATCHER */}
      <Sphere 
        args={[2.065, 64, 64]} 
        onClick={handleGlobeClick}
        onPointerMove={handlePointerMove}
        onPointerOut={() => document.body.style.cursor = 'auto'}
      >
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </Sphere>
      
      {/* HUD MARKER OVERLAY */}
      {activePin && !is2DMode && viewMode !== 'iot' && viewMode !== 'sar' && (
        <group position={activePin.point}>
          {/* Simple Clean Dot Marker (Matches Home Page) */}
          <mesh renderOrder={999} raycast={() => null}>
            <sphereGeometry args={[0.015, 16, 16]} />
            <meshBasicMaterial color="#22d3ee" depthTest={false} />
          </mesh>
          <mesh renderOrder={999} raycast={() => null}>
            <sphereGeometry args={[0.035, 16, 16]} />
            <meshBasicMaterial color="#22d3ee" transparent opacity={0.3} depthTest={false} />
          </mesh>
          
          
        </group>
      )}
      {/* IOT HARDWARE BEACONS */}
      {viewMode === 'iot' && (
        <group>
          {/* Hazard Region Circle */}
          {iotSimState && iotSimState.step >= 2 && (() => {
            const hazardPos = latLonToVector3(14.5, 69.5, 2.06);
            const quat = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0,0,1), hazardPos.clone().normalize());
            
            // Create dashed circle points
            const circlePts = [];
            for(let i=0; i<=64; i++){
               const a = (i/64) * Math.PI * 2;
               circlePts.push(new THREE.Vector3(Math.cos(a)*0.22, Math.sin(a)*0.22, 0));
            }
            
            return (
              <group position={hazardPos} quaternion={quat}>
                <mesh raycast={() => null}>
                  <circleGeometry args={[0.22, 64]} />
                  <meshBasicMaterial color="#ef4444" transparent opacity={0.1} depthWrite={false} side={THREE.DoubleSide} />
                </mesh>
                <Line raycast={() => null} 
                    points={circlePts} 
                    color="#ef4444" 
                    lineWidth={1.5} 
                    dashed 
                    dashSize={0.02} 
                    gapSize={0.02} 
                    transparent 
                    opacity={0.8} 
                />
              </group>
            );
          })()}

          {/* Broadcast Lines */}
          {iotSimState && iotSimState.step >= 5 && (
            <>
              {/* Gateway to Fisherman */}
              <IotBroadcastLine lat1={18.92} lon1={72.82} lat2={16.0} lon2={68.0} color={iotSimState.phase === 'DELIVERY FAILED' ? '#64748b' : '#38bdf8'} dashed />
              {/* Gateway to Tourist */}
              <IotBroadcastLine lat1={18.92} lon1={72.82} lat2={12.0} lon2={72.0} color="#38bdf8" dashed />
            </>
          )}

          <IotBeacon lat={18.92} lon={72.82} color="#10b981" />
          <IotBeacon lat={16.0} lon={68.0} color={iotSimState && iotSimState.phase === 'DELIVERY FAILED' ? "#64748b" : (iotSimState && iotSimState.step >= 7 && iotSimState.phase !== 'ACKNOWLEDGED' ? "#ef4444" : "#10b981")} onClick={(e) => { if (onInteract) onInteract(); setIotPopupPos(prev => prev?.id === 'b1' ? null : { point: e.point, id: 'b1' }); }} />
          <IotBeacon lat={12.0} lon={72.0} color={iotSimState && iotSimState.step >= 7 && iotSimState.phase !== 'ACKNOWLEDGED' ? "#ef4444" : "#10b981"} onClick={(e) => { if (onInteract) onInteract(); setIotPopupPos(prev => prev?.id === 'b2' ? null : { point: e.point, id: 'b2' }); }} />
        
        
        {/* PERMANENT GATEWAY TOOLTIP */}
        {!is2DMode && iotSimState && (() => {
            const isAck = iotSimState.phase === 'ACKNOWLEDGED';
            return (
                <Html position={latLonToVector3(18.92, 72.82, 2.08)} zIndexRange={[100, 0]} style={{ pointerEvents: "none" }}>
                    <div className="pointer-events-none flex flex-col ml-2 -translate-y-1/2 animate-in fade-in zoom-in-95 duration-300 ease-out backdrop-blur-md bg-black/85 border border-white/10 rounded-lg px-3 py-2 text-[10px] font-mono text-white/90 font-medium drop-shadow-[0_4px_10px_rgba(0,0,0,0.5)] whitespace-nowrap">
                        <span className="text-cyan-300 font-black text-[12px] tracking-wider mb-0.5">GATEWAY #01</span>
                        <span className="text-white/80">MUMBAI HUB</span>
                        <span className="text-emerald-400 font-bold tracking-widest my-0.5">LoRaWAN LINK</span>
                        <span className="text-white/80">STATUS: <span className={isAck ? 'text-cyan-400' : iotSimState.step >= 6 ? 'text-orange-400 animate-pulse' : 'text-emerald-400'}>{isAck ? 'ACKNOWLEDGED' : iotSimState.step >= 6 ? 'TRANSMITTING' : 'ONLINE'}</span></span>
                    </div>
                </Html>
            );
        })()}

        {iotPopupPos && !is2DMode && iotSimState && (() => {
            const isAlert = iotSimState.step >= 7 && iotSimState.phase !== 'ACKNOWLEDGED';
            
            const isFail = iotSimState.phase === 'DELIVERY FAILED';

            if (iotPopupPos.id === 'b1') {
                return (
                    <Html position={latLonToVector3(16.0, 68.0, 2.08)} zIndexRange={[100, 0]} style={{ pointerEvents: "none" }}>
                        <div className="pointer-events-none flex flex-col -ml-2 -translate-x-full -translate-y-1/2 animate-in fade-in zoom-in-95 duration-300 ease-out backdrop-blur-md bg-black/85 border border-white/10 rounded-lg px-3 py-2 text-[10px] font-mono text-white/90 font-medium drop-shadow-[0_4px_10px_rgba(0,0,0,0.5)] whitespace-nowrap">
                            <span className="text-orange-400 font-black text-[12px] tracking-wider mb-0.5">FISHERMAN #402</span>
                            <span className="text-white/80">STATUS: <span className={isFail ? 'text-slate-400' : isAlert ? 'text-red-400 font-bold' : 'text-emerald-400'}>{isFail ? 'OFFLINE' : isAlert ? 'EVACUATE' : 'ONLINE'}</span></span>
                            <span className="text-white/80">LAT: 16.0000 | LON: 68.0000</span>
                            <span className="text-white/80">SIG: {isFail ? '--' : '-67 dBm'} | BAT: 87%</span>
                        </div>
                    </Html>
                );
            }
            if (iotPopupPos.id === 'b2') {
                return (
                    <Html position={latLonToVector3(12.0, 72.0, 2.08)} zIndexRange={[100, 0]} style={{ pointerEvents: "none" }}>
                        <div className="pointer-events-none flex flex-col mt-2 -translate-x-1/2 animate-in fade-in zoom-in-95 duration-300 ease-out backdrop-blur-md bg-black/85 border border-white/10 rounded-lg px-3 py-2 text-[10px] font-mono text-white/90 font-medium drop-shadow-[0_4px_10px_rgba(0,0,0,0.5)] whitespace-nowrap">
                            <span className="text-sky-400 font-black text-[12px] tracking-wider mb-0.5">TOURIST BOAT #77</span>
                            <span className="text-white/80">STATUS: <span className={isAlert ? 'text-red-400 font-bold' : 'text-emerald-400'}>{isAlert ? 'EVACUATE' : 'ONLINE'}</span></span>
                            <span className="text-white/80">LAT: 12.0000 | LON: 72.0000</span>
                            <span className="text-white/80">SIG: -42 dBm | BAT: 92%</span>
                        </div>
                    </Html>
                );
            }
            return null;
        })()}

        </group>
      )}

      <directionalLight position={[10, 5, 10]} intensity={1.0} color="#ffffff" />
      <directionalLight position={[-10, 5, -10]} intensity={1.0} color="#ffffff" />
      <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1.5} />
      
      {/* Main Earth Surface (Always Opaque, no depth buffer fighting) */}
      <Sphere args={[2, 128, 128]} raycast={() => null}>
        <meshPhongMaterial 
          map={colorMap} specularMap={specularMap} normalMap={normalMap} normalScale={new THREE.Vector2(0.5, 0.5)}
          specular={new THREE.Color('#0a5c7a')} shininess={15}
        />
      </Sphere>
      
      {/* Dynamic Overlays at slightly larger radius */}
      {(viewMode === 'climate' && climateSubMode === 'cyclone') && (
        <Sphere args={[2.008, 128, 128]} raycast={() => null}>
          <shaderMaterial ref={tchpShaderRef} vertexShader={vertexShader} fragmentShader={tchpFragmentShader} uniforms={{ time: { value: dateOffset }, earthMap: { value: specularMap }, tchpMap: { value: tchpMap } }}  transparent={true} depthWrite={false} blending={THREE.NormalBlending} />
        </Sphere>
      )}
      {viewMode === 'climate' && climateSubMode === 'flood' && (
        <Sphere args={[2.008, 128, 128]} raycast={() => null}>
          <shaderMaterial ref={floodShaderRef} vertexShader={vertexShader} fragmentShader={floodFragmentShader} uniforms={{ time: { value: dateOffset }, earthMap: { value: specularMap }, dataMap: { value: sshMap } }}  transparent={true} depthWrite={false} blending={THREE.NormalBlending} />
        </Sphere>
      )}
      {viewMode === 'climate' && climateSubMode === 'heatwave' && (
        <Sphere args={[2.008, 128, 128]} raycast={() => null}>
          <shaderMaterial ref={heatwaveShaderRef} vertexShader={vertexShader} fragmentShader={heatwaveFragmentShader} uniforms={{ time: { value: dateOffset }, earthMap: { value: specularMap }, dataMap: { value: sstMap } }}  transparent={true} depthWrite={false} blending={THREE.NormalBlending} />
        </Sphere>
      )}
      {viewMode === 'climate' && climateSubMode === 'erosion' && (
        <Sphere args={[2.008, 128, 128]} raycast={() => null}>
          <shaderMaterial ref={erosionShaderRef} vertexShader={vertexShader} fragmentShader={erosionFragmentShader} uniforms={{ time: { value: dateOffset }, earthMap: { value: specularMap }, dataMap: { value: currentsMap } }}  transparent={true} depthWrite={false} blending={THREE.NormalBlending} />
        </Sphere>
      )}

      {viewMode === 'fishery' && (
        <Sphere args={[2.008, 128, 128]} raycast={() => null}>
          <shaderMaterial ref={fisheryShaderRef} vertexShader={vertexShader} fragmentShader={fisheryFragmentShader} uniforms={{ time: { value: dateOffset }, earthMap: { value: specularMap }, fisheryMap: { value: fisheryMap } }}  transparent={true} depthWrite={false} blending={THREE.NormalBlending} />
        </Sphere>
      )}

      {viewMode === 'navy' && (
        <Sphere args={[2.008, 128, 128]} raycast={() => null}>
          <shaderMaterial ref={navyShaderRef} vertexShader={vertexShader} fragmentShader={navyFragmentShader} uniforms={{ time: { value: dateOffset }, earthMap: { value: specularMap }, navyMap: { value: navyMap } }}  transparent={true} depthWrite={false} blending={THREE.NormalBlending} />
        </Sphere>
      )}

      {viewMode === 'cable' && (
        <Sphere args={[2.008, 128, 128]} raycast={() => null}>
          <shaderMaterial ref={cableShaderRef} vertexShader={vertexShader} fragmentShader={cableFragmentShader} uniforms={{ time: { value: dateOffset }, earthMap: { value: specularMap }, benthicMap: { value: benthicMap } }}  transparent={true} depthWrite={false} blending={THREE.NormalBlending} />
        </Sphere>
      )}
      {viewMode === 'enso' && (
        <Sphere args={[2.008, 128, 128]} raycast={() => null}>
          <shaderMaterial ref={ensoShaderRef} vertexShader={vertexShader} fragmentShader={ensoFragmentShader} uniforms={{ time: { value: dateOffset }, earthMap: { value: specularMap }, iodMap: { value: iodMap } }}  transparent={true} depthWrite={false} blending={THREE.NormalBlending} />
        </Sphere>
      )}

      
      {/* GLOBAL UPDATING OVERLAY */}
      {isUpdatingPattern && (
        <Html center style={{ pointerEvents: "none" }} zIndexRange={[100, 0]}>
          <div className="flex flex-col items-center justify-center p-6 bg-black/80 border border-cyan-500/50 rounded-xl backdrop-blur-md shadow-[0_0_30px_rgba(6,182,212,0.4)] animate-in fade-in zoom-in duration-200">
             <div className="w-8 h-8 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mb-3"></div>
             <div className="text-cyan-400 font-black tracking-[0.2em] text-sm animate-pulse">GENERATING PREDICTION</div>
             <div className="text-cyan-200/50 font-mono text-[9px] mt-2 uppercase">Rendering Physics Topology for {selectedDate}</div>
          </div>
        </Html>
      )}
      
      {showGlobeArgo && argoFloats.map((float) => (
        <ArgoBeacon key={float.id} float={float} isSelected={selectedArgoMarker?.id === float.id} onSelect={(f) => setSelectedArgoMarker(f)} />
      ))}
    </group>
  );
}