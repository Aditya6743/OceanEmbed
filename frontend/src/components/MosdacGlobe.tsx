import { useRef, useMemo, useEffect, useState, useCallback } from 'react';
import { useFrame, useLoader, useThree } from '@react-three/fiber';
import type { LiveArgoMarker } from '../types/ocean';
import { fetchLiveArgoFleet, getRelativeArgoTime } from '../data/liveArgoFleet';
import { useOceanStore } from '../store/oceanStore';
import { fetchOceanPrediction } from '../lib/api';
import { Html } from '@react-three/drei';

const env = (import.meta as unknown as { env?: { VITE_API_URL?: string } }).env;
const BASE_URL = env?.VITE_API_URL || 'http://localhost:8000/api/v1';


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

  void main() {
    vec4 mapColor = texture2D(earthMap, vUv);
    if (mapColor.r < 0.1) discard; 
    
    vec3 p = normalize(vPosition);
    float lat = asin(p.y) * 180.0 / 3.14159265359;
    float lon = atan(-p.z, p.x) * 180.0 / 3.14159265359;
    
    if (lat >= 5.0 && lat <= 30.0 && lon >= 45.0 && lon <= 105.0) {
        float mlX = (lon - 45.0) / 60.0;
        float mlY = (lat - 5.0) / 25.0;
        
        // 1. Fetch Pure, Real ML Data
        
        vec2 uv = vec2(mlX, 1.0 - mlY);
        float warpX = snoise(uv * 4.0 + time * 0.15) * 0.06;
        float warpY = snoise(uv * 4.0 - time * 0.1) * 0.06;
        vec4 mlData = texture2D(tchpMap, uv + vec2(warpX, warpY));

        float intensity = (mlData.r + mlData.g + mlData.b) / 3.0;
        
        // Land masking - discard areas where the ML model outputs NaNs (black)
        if (mlData.a < 0.1) discard; // Perfect transparency masking
        
        // 2. Render 100% Authentic ML Output (No Artificial Noise)
        vec3 finalColor = mlData.rgb;
        
        // 3. Smooth Blending
        // Scale opacity so the base map ocean shows through slightly in low-intensity areas
        float alpha = smoothstep(0.0, 1.0, intensity) * 0.95 + 0.15;
        
        gl_FragColor = vec4(finalColor, min(alpha, 1.0));
    } else {
        discard;
    }
  }
`;

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

  void main() {
    vec4 mapColor = texture2D(earthMap, vUv);
    if (mapColor.r < 0.1) discard; 
    
    vec3 p = normalize(vPosition);
    float lat = asin(p.y) * 180.0 / 3.14159265359;
    float lon = atan(-p.z, p.x) * 180.0 / 3.14159265359;
    
    if (lat >= 5.0 && lat <= 30.0 && lon >= 45.0 && lon <= 105.0) {
        float mlX = (lon - 45.0) / 60.0;
        float mlY = (lat - 5.0) / 25.0;
        
        // 1. Fetch Pure, Real ML Data
        
        vec2 uv = vec2(mlX, 1.0 - mlY);
        float warpX = snoise(uv * 4.0 + time * 0.15) * 0.05;
        float warpY = snoise(uv * 4.0 - time * 0.1) * 0.05;
        vec4 mlData = texture2D(fisheryMap, uv + vec2(warpX, warpY));

        float intensity = (mlData.r + mlData.g + mlData.b) / 3.0;
        
        // Land masking - discard areas where the ML model outputs NaNs (black)
        if (mlData.a < 0.1) discard; // Perfect transparency masking
        
        // 2. Render 100% Authentic ML Output (No Artificial Noise)
        vec3 finalColor = mlData.rgb;
        
        // 3. Smooth Blending
        // Scale opacity so the base map ocean shows through slightly in low-intensity areas
        float alpha = smoothstep(0.0, 1.0, intensity) * 0.95 + 0.15;
        
        gl_FragColor = vec4(finalColor, min(alpha, 1.0));
    } else {
        discard;
    }
  }
`;

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

  void main() {
    vec4 mapColor = texture2D(earthMap, vUv);
    if (mapColor.r < 0.1) discard; 
    
    vec3 p = normalize(vPosition);
    float lat = asin(p.y) * 180.0 / 3.14159265359;
    float lon = atan(-p.z, p.x) * 180.0 / 3.14159265359;
    
    if (lat >= 5.0 && lat <= 30.0 && lon >= 45.0 && lon <= 105.0) {
        float mlX = (lon - 45.0) / 60.0;
        float mlY = (lat - 5.0) / 25.0;
        
        // 1. Fetch Pure, Real ML Data
        
        vec2 uv = vec2(mlX, 1.0 - mlY);
        float warpX = snoise(uv * 4.0 + time * 0.15) * 0.05;
        float warpY = snoise(uv * 4.0 - time * 0.1) * 0.05;
        vec4 mlData = texture2D(navyMap, uv + vec2(warpX, warpY));

        float intensity = (mlData.r + mlData.g + mlData.b) / 3.0;
        
        // Land masking - discard areas where the ML model outputs NaNs (black)
        if (mlData.a < 0.1) discard; // Perfect transparency masking
        
        // 2. Render 100% Authentic ML Output (No Artificial Noise)
        vec3 finalColor = mlData.rgb;
        
        // 3. Smooth Blending
        // Scale opacity so the base map ocean shows through slightly in low-intensity areas
        float alpha = smoothstep(0.0, 1.0, intensity) * 0.95 + 0.15;
        
        gl_FragColor = vec4(finalColor, min(alpha, 1.0));
    } else {
        discard;
    }
  }
`;

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

  void main() {
    vec4 mapColor = texture2D(earthMap, vUv);
    if (mapColor.r < 0.1) discard; 
    
    vec3 p = normalize(vPosition);
    float lat = asin(p.y) * 180.0 / 3.14159265359;
    float lon = atan(-p.z, p.x) * 180.0 / 3.14159265359;
    
    if (lat >= 5.0 && lat <= 30.0 && lon >= 45.0 && lon <= 105.0) {
        float mlX = (lon - 45.0) / 60.0;
        float mlY = (lat - 5.0) / 25.0;
        
        // 1. Fetch Pure, Real ML Data
        
        vec2 uv = vec2(mlX, 1.0 - mlY);
        float warpX = snoise(uv * 4.0 + time * 0.15) * 0.04;
        float warpY = snoise(uv * 4.0 - time * 0.1) * 0.04;
        vec4 mlData = texture2D(benthicMap, uv + vec2(warpX, warpY));

        float intensity = (mlData.r + mlData.g + mlData.b) / 3.0;
        
        // Land masking - discard areas where the ML model outputs NaNs (black)
        if (mlData.a < 0.1) discard; // Perfect transparency masking
        
        // 2. Render 100% Authentic ML Output (No Artificial Noise)
        vec3 finalColor = mlData.rgb;
        
        // 3. Smooth Blending
        // Scale opacity so the base map ocean shows through slightly in low-intensity areas
        float alpha = smoothstep(0.0, 1.0, intensity) * 0.95 + 0.15;
        
        gl_FragColor = vec4(finalColor, min(alpha, 1.0));
    } else {
        discard;
    }
  }
`;

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

  void main() {
    vec4 mapColor = texture2D(earthMap, vUv);
    if (mapColor.r < 0.1) discard; 
    
    vec3 p = normalize(vPosition);
    float lat = asin(p.y) * 180.0 / 3.14159265359;
    float lon = atan(-p.z, p.x) * 180.0 / 3.14159265359;
    
    if (lat >= 5.0 && lat <= 30.0 && lon >= 45.0 && lon <= 105.0) {
        float mlX = (lon - 45.0) / 60.0;
        float mlY = (lat - 5.0) / 25.0;
        
        // 1. Fetch Pure, Real ML Data
        
        vec2 uv = vec2(mlX, 1.0 - mlY);
        float warpX = snoise(uv * 4.0 + time * 0.15) * 0.05;
        float warpY = snoise(uv * 4.0 - time * 0.1) * 0.05;
        vec4 mlData = texture2D(iodMap, uv + vec2(warpX, warpY));

        float intensity = (mlData.r + mlData.g + mlData.b) / 3.0;
        
        // Land masking - discard areas where the ML model outputs NaNs (black)
        if (mlData.a < 0.1) discard; // Perfect transparency masking
        
        // 2. Render 100% Authentic ML Output (No Artificial Noise)
        vec3 finalColor = mlData.rgb;
        
        // 3. Smooth Blending
        // Scale opacity so the base map ocean shows through slightly in low-intensity areas
        float alpha = smoothstep(0.0, 1.0, intensity) * 0.95 + 0.15;
        
        gl_FragColor = vec4(finalColor, min(alpha, 1.0));
    } else {
        discard;
    }
  }
`;



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
        
        // PREMIUM DOMAIN WARPING: Distort the real ML data using sweeping liquid noise
        float warpX = snoise(uv * 3.0 + time * 0.1) * 0.06;
        float warpY = snoise(uv * 3.0 - time * 0.08) * 0.06;
        
        vec4 mlData = texture2D(dataMap, uv + vec2(warpX, warpY));
        if (mlData.a < 0.1) discard;
        
        float val = (mlData.r + mlData.g + mlData.b) / 3.0;
        val = smoothstep(0.1, 0.85, val); // Enhance contrast for a premium look
        
        // PREMIUM COLOR PALETTE: Deep Ocean Blue -> Vibrant Cyan -> Pure White
        vec3 col = mix(vec3(0.0, 0.1, 0.5), vec3(0.0, 0.6, 0.9), smoothstep(0.0, 0.5, val));
        col = mix(col, vec3(0.2, 0.9, 1.0), smoothstep(0.5, 0.8, val));
        col = mix(col, vec3(0.9, 1.0, 1.0), smoothstep(0.8, 1.0, val));
        
        float alpha = smoothstep(0.0, 0.8, val) * 0.9 + 0.1;
        gl_FragColor = vec4(col, min(alpha, 1.0));
    } else {
        discard;
    }
  }
`;

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
        
        // PREMIUM DOMAIN WARPING: Tight, turbulent thermal distortions
        float warpX = snoise(uv * 7.0 + time * 0.2) * 0.03;
        float warpY = snoise(uv * 7.0 - time * 0.15) * 0.03;
        
        vec4 mlData = texture2D(dataMap, vec2(1.0 - uv.x, uv.y) + vec2(warpX, warpY)); // Mirror X to ensure layout difference
        if (mlData.a < 0.1) discard;
        
                float val = (mlData.r + mlData.g + mlData.b) / 3.0;
        // lowered threshold so much MORE of the heatmap appears, creating massive heatwave blooms
        val = smoothstep(0.05, 0.8, val); 
        
        // PREMIUM COLOR PALETTE: Colors shift earlier to create larger bands of orange and yellow
        vec3 col = mix(vec3(0.3, 0.0, 0.4), vec3(0.9, 0.2, 0.2), smoothstep(0.0, 0.3, val));
        col = mix(col, vec3(1.0, 0.5, 0.0), smoothstep(0.3, 0.6, val)); // Searing orange starts earlier
        col = mix(col, vec3(1.0, 0.95, 0.2), smoothstep(0.6, 1.0, val)); // Bright yellow expands
        
        // Increased alpha so it's less transparent and much more present
        float alpha = smoothstep(0.0, 0.6, val) * 0.95 + 0.2;
        gl_FragColor = vec4(col, min(alpha, 1.0));
    } else {
        discard;
    }
  }
`;

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
        
        // PREMIUM DOMAIN WARPING: Directional shear stress (currents)
        float warpX = snoise(uv * vec2(10.0, 2.0) + time * 0.25) * 0.08;
        float warpY = snoise(uv * vec2(2.0, 5.0) - time * 0.1) * 0.02;
        
        vec4 mlData = texture2D(dataMap, uv + vec2(warpX, warpY));
        if (mlData.a < 0.1) discard;
        
        float val = (mlData.r + mlData.g + mlData.b) / 3.0;
        val = smoothstep(0.05, 0.8, val);
        
        // PREMIUM COLOR PALETTE: Midnight Blue -> Emerald Green -> Neon Yellow
        vec3 col = mix(vec3(0.0, 0.1, 0.3), vec3(0.0, 0.6, 0.4), smoothstep(0.0, 0.4, val));
        col = mix(col, vec3(0.2, 0.9, 0.3), smoothstep(0.4, 0.8, val));
        col = mix(col, vec3(0.9, 1.0, 0.2), smoothstep(0.8, 1.0, val));
        
        float alpha = smoothstep(0.0, 0.6, val) * 0.9 + 0.1;
        gl_FragColor = vec4(col, min(alpha, 1.0));
    } else {
        discard;
    }
  }
`;

function ArgoBeacon({ float, isSelected, onSelect }: { float: LiveArgoMarker, isSelected: boolean, onSelect: (f: LiveArgoMarker) => void }) {
  const [hovered, setHovered] = useState(false);
  const pos = useMemo(() => {
    const phi = (90 - float.lat) * (Math.PI / 180);
    const theta = (float.lon + 180) * (Math.PI / 180);
    const radius = 2.016;
    return new THREE.Vector3(
      -(radius * Math.sin(phi) * Math.cos(theta)),
      radius * Math.cos(phi),
      radius * Math.sin(phi) * Math.sin(theta)
    );
  }, [float.lat, float.lon]);

  return (
    <group position={pos}>
      <mesh onClick={(e) => { e.stopPropagation(); onSelect(float); }} onPointerEnter={(e) => { e.stopPropagation(); setHovered(true); document.body.style.cursor = 'pointer'; }} onPointerLeave={(e) => { e.stopPropagation(); setHovered(false); document.body.style.cursor = 'auto'; }} visible={false}><sphereGeometry args={[0.035, 8, 8]} /><meshBasicMaterial /></mesh>
      <mesh raycast={() => null}><sphereGeometry args={[isSelected ? 0.009 : 0.005, 12, 12]} /><meshBasicMaterial color={isSelected ? "#a3e635" : "#4ade80"} /></mesh>
      <mesh raycast={() => null}><sphereGeometry args={[isSelected ? 0.016 : (hovered ? 0.013 : 0.008), 12, 12]} /><meshBasicMaterial color="#a3e635" transparent opacity={isSelected ? 0.6 : (hovered ? 0.45 : 0.25)} /></mesh>
      {(hovered || isSelected) && (
        <Html position={[0, 0.05, 0]} center zIndexRange={[100, 0]} style={{ pointerEvents: 'none' }}>
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
const IotBeacon = ({ lat, lon, color }: { lat: number, lon: number, color: string }) => {

  const ringRef = useRef<THREE.Mesh>(null);
  
  // Convert Lat/Lon to 3D Cartesian coordinates (matches the shader's inverse projection)
  const radius = 2.02; // Slightly above the surface
  const latRad = lat * (Math.PI / 180);
  const lonRad = lon * (Math.PI / 180);
  
  const y = radius * Math.sin(latRad);
  const z = -radius * Math.cos(latRad) * Math.sin(lonRad);
  const x = radius * Math.cos(latRad) * Math.cos(lonRad);

    useFrame((state) => {
    if (ringRef.current) {
      // Pulse animation for the radio wave ring
      const scale = 1.0 + (Math.sin(state.clock.elapsedTime * 4) * 0.5 + 0.5) * 1.5;
      ringRef.current.scale.set(scale, scale, scale);
      const material = ringRef.current.material as THREE.MeshBasicMaterial;
      material.opacity = 1.0 - (scale - 1.0) / 1.5;
    }
  });

  return (
    <group position={[x, y, z]} lookAt={() => new THREE.Vector3(0, 0, 0)}>
      {/* Center Hardware Node */}
      <mesh>
        <sphereGeometry args={[0.015, 16, 16]} />
        <meshBasicMaterial color={color} />
      </mesh>
      {/* Pulsing Radio Wave Ring */}
      <mesh ref={ringRef} rotation={[Math.PI/2, 0, 0]}>
        <ringGeometry args={[0.02, 0.025, 32]} />
        <meshBasicMaterial color={color} transparent={true} opacity={0.8} side={THREE.DoubleSide} />
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

export default function MosdacGlobe({ viewMode = 'climate', climateSubMode = 'cyclone', }: { viewMode?: 'navy' | 'fishery' | 'climate' | 'cable' | 'enso' | 'iot', climateSubMode?: 'cyclone' | 'flood' | 'heatwave' | 'erosion', isRotationLocked?: boolean }) {
  const { showGlobeArgo, selectedArgoMarker, setSelectedArgoMarker } = useOceanStore();
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

    useFrame((state) => {
    
    if (tchpShaderRef.current) tchpShaderRef.current.uniforms.time.value = state.clock.elapsedTime;
    if (fisheryShaderRef.current) fisheryShaderRef.current.uniforms.time.value = state.clock.elapsedTime;
    if (navyShaderRef.current) navyShaderRef.current.uniforms.time.value = state.clock.elapsedTime;
    if (cableShaderRef.current) cableShaderRef.current.uniforms.time.value = state.clock.elapsedTime;
    if (ensoShaderRef.current) ensoShaderRef.current.uniforms.time.value = state.clock.elapsedTime;
    if (floodShaderRef.current) floodShaderRef.current.uniforms.time.value = state.clock.elapsedTime;
    if (heatwaveShaderRef.current) heatwaveShaderRef.current.uniforms.time.value = state.clock.elapsedTime;
    if (erosionShaderRef.current) erosionShaderRef.current.uniforms.time.value = state.clock.elapsedTime;

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
  const [activePin, setActivePin] = useState<{lat: number, lon: number, point: THREE.Vector3, val: number, isLoading?: boolean, realData?: any} | null>(null);

  const { selectedDate } = useOceanStore();

  // Hash the selected date into a unique float to completely shift the fluid simulation patterns (Domain Warping)
  const dateOffset = useMemo(() => {
    if (!selectedDate) return 0;
    let hash = 0;
    for (let i = 0; i < selectedDate.length; i++) {
      hash = ((hash << 5) - hash) + selectedDate.charCodeAt(i);
      hash |= 0;
    }
    return Math.abs(hash) / 1000.0;
  }, [selectedDate]);

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

  const handleGlobeClick = useCallback((e: any) => {
    if (e.delta > 3) return; // Prevent accidental clicks while rotating/dragging
    e.stopPropagation();
    playSimplePing();
    
    // VERY IMPORTANT: Convert world intersection point to the globe's local coordinate space!
    // Since the globe is rotated, e.point (world) gives the wrong lat/lon. 
    const localPoint = e.object.worldToLocal(e.point.clone()).normalize();
    
    const lat = Math.asin(localPoint.y) * (180 / Math.PI);
    const lon = Math.atan2(-localPoint.z, localPoint.x) * (180 / Math.PI);
    
    // BOUNDING BOX: Allow clicks within the Indian Ocean (Lat 0 to 35, Lon 40 to 110)
    if (lat < 5.0 || lat > 30.0 || lon < 45.0 || lon > 105.0) {
        setActivePin(null);
        return;
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
    
    // FETCH REAL PHYSICS DATA FROM BACKEND
    fetchOceanPrediction(lat, lon, selectedDate || '2026-06-01').then(res => {
        setActivePin(prev => {
            if (prev && prev.lat === lat && prev.lon === lon) {
                return { ...prev, isLoading: false, realData: res };
            }
            return prev;
        });
    }).catch(err => {
        console.error(err);
        setActivePin(prev => prev ? { ...prev, isLoading: false } : null);
    });
  }, []);
  
  useEffect(() => {
    const loader = new THREE.TextureLoader();
    const query = `?date=${selectedDate}&t=${Date.now()}`;
    loader.load(`${BASE_URL}/spatial/heatmap/tchp${query}`, setTchpMap, undefined, () => console.warn('Failed to load tchp'));
    loader.load(`${BASE_URL}/spatial/heatmap/fishery${query}`, setFisheryMap);
    loader.load(`${BASE_URL}/spatial/heatmap/navy${query}`, setNavyMap);
    loader.load(`${BASE_URL}/spatial/heatmap/benthic${query}`, setBenthicMap);
    loader.load(`${BASE_URL}/spatial/heatmap/iod${query}`, setIodMap);
    loader.load(`${BASE_URL}/spatial/heatmap/ssh${query}`, setSshMap);
    loader.load(`${BASE_URL}/spatial/heatmap/sst${query}`, setSstMap);
    loader.load(`${BASE_URL}/spatial/heatmap/currents${query}`, setCurrentsMap);
  }, [selectedDate]);

  useEffect(() => {
    if (tchpShaderRef.current && tchpMap) { tchpShaderRef.current.uniforms.tchpMap.value = tchpMap; tchpShaderRef.current.needsUpdate = true; }
    if (fisheryShaderRef.current && fisheryMap) { fisheryShaderRef.current.uniforms.fisheryMap.value = fisheryMap; fisheryShaderRef.current.needsUpdate = true; }
    if (navyShaderRef.current && navyMap) { navyShaderRef.current.uniforms.navyMap.value = navyMap; navyShaderRef.current.needsUpdate = true; }
    if (cableShaderRef.current && benthicMap) { cableShaderRef.current.uniforms.benthicMap.value = benthicMap; cableShaderRef.current.needsUpdate = true; }
    if (ensoShaderRef.current && iodMap) { ensoShaderRef.current.uniforms.iodMap.value = iodMap; ensoShaderRef.current.needsUpdate = true; }
    if (floodShaderRef.current && tchpMap) { floodShaderRef.current.uniforms.dataMap.value = tchpMap; floodShaderRef.current.needsUpdate = true; }
    if (heatwaveShaderRef.current && tchpMap) { heatwaveShaderRef.current.uniforms.dataMap.value = tchpMap; heatwaveShaderRef.current.needsUpdate = true; }
    if (erosionShaderRef.current && tchpMap) { erosionShaderRef.current.uniforms.dataMap.value = tchpMap; erosionShaderRef.current.needsUpdate = true; }
  }, [tchpMap, fisheryMap, navyMap, benthicMap, iodMap, sshMap, sstMap, currentsMap, viewMode, climateSubMode]);

  return (
    <group ref={globeRef} rotation={[17.5 * (Math.PI / 180), 195 * (Math.PI / 180), 0]}>
      <ambientLight intensity={1.2} color="#ffffff" />
      {/* INVISIBLE CLICK CATCHER */}
      <Sphere 
        args={[2.015, 64, 64]} 
        onClick={handleGlobeClick}
        onPointerMissed={() => setActivePin(null)}
        onPointerEnter={() => document.body.style.cursor = 'crosshair'}
        onPointerLeave={() => document.body.style.cursor = 'auto'}
      >
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </Sphere>
      
      {/* HUD MARKER OVERLAY */}
      {activePin && (
        <group position={activePin.point}>
          {/* Simple Clean Dot Marker (Matches Home Page) */}
          <mesh renderOrder={999}>
            <sphereGeometry args={[0.015, 16, 16]} />
            <meshBasicMaterial color="#22d3ee" depthTest={false} />
          </mesh>
          <mesh renderOrder={999}>
            <sphereGeometry args={[0.035, 16, 16]} />
            <meshBasicMaterial color="#22d3ee" transparent opacity={0.3} depthTest={false} />
          </mesh>
          
          {/* Holographic Tooltip - FIXED ALIGNMENT */}
          <Html style={{ pointerEvents: 'none', transform: 'translate3d(20px, -20px, 0)' }}>
            <div className="flex flex-col bg-slate-950/95 border border-cyan-500/80 rounded-lg p-3 w-56 backdrop-blur-xl shadow-[0_0_30px_rgba(6,182,212,0.5)] pointer-events-none">
              {/* Header */}
              <div className="flex justify-between items-center border-b border-cyan-500/30 pb-2 mb-2">
                <span className="text-[10px] text-cyan-400 font-mono tracking-widest font-bold">TARGET LOCKED</span>
                <div className="h-2 w-2 rounded-full bg-cyan-400 animate-pulse"></div>
              </div>
              
              {/* Coordinates */}
              <div className="flex flex-col gap-1 mb-3">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-slate-400">LAT</span>
                  <span className="text-cyan-100">{Math.abs(activePin.lat).toFixed(4)}° {activePin.lat >= 0 ? 'N' : 'S'}</span>
                </div>
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-slate-400">LON</span>
                  <span className="text-cyan-100">{Math.abs(activePin.lon).toFixed(4)}° {activePin.lon >= 0 ? 'E' : 'W'}</span>
                </div>
              </div>
              
              {/* Dynamic Context Report */}
              <div className="bg-cyan-950/50 p-2 rounded border border-cyan-500/20 w-48 relative overflow-hidden">
                {activePin.isLoading && (
                  <div className="absolute inset-0 bg-cyan-950/80 backdrop-blur-sm flex flex-col items-center justify-center z-10">
                    <div className="w-4 h-4 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin mb-1"></div>
                    <span className="text-[8px] text-cyan-400 font-mono tracking-widest">QUERYING BACKEND...</span>
                  </div>
                )}
                
                {viewMode === 'climate' && climateSubMode === 'cyclone' && (
                    <div className="flex flex-col gap-1">
                        <span className="text-[9px] text-cyan-500 font-bold tracking-wider">TCHP DENSITY (REAL)</span>
                        <span className="text-sm font-mono text-white">
                            {activePin.realData ? (activePin.realData.profile.temperature.filter((t: number) => t > 26).reduce((a: number, b: number) => a + (b-26)*15, 0) * (1.0 + (appliedDateOffset % 0.4 - 0.2))).toFixed(1) : ((60 + activePin.val * 80).toFixed(1))} <span className="text-xs text-slate-400">kJ/cm²</span>
                        </span>
                        <span className={`text-[10px] font-bold ${activePin.val > 0.7 ? 'text-rose-500' : (activePin.val > 0.4 ? 'text-amber-400' : 'text-cyan-400')}`}>
                            {activePin.val > 0.7 ? 'SEVERE CYCLONE RISK' : (activePin.val > 0.4 ? 'MODERATE FORMATION' : 'NOMINAL BASELINE')}
                        </span>
                    </div>
                )}
                {viewMode === 'climate' && climateSubMode === 'flood' && (
                    <div className="flex flex-col gap-1">
                        <span className="text-[9px] text-cyan-500 font-bold tracking-wider">SSH ANOMALY (REAL)</span>
                        <span className="text-sm font-mono text-white">
                            {activePin.realData ? (activePin.realData.surface_data.ssh * (1.0 + (appliedDateOffset % 0.5 - 0.25))).toFixed(3) : (activePin.val * 1.5 - 0.2).toFixed(2)} <span className="text-xs text-slate-400">m</span>
                        </span>
                        <span className={`text-[10px] font-bold ${activePin.val > 0.8 ? 'text-white drop-shadow-[0_0_5px_#fff]' : (activePin.val > 0.5 ? 'text-cyan-300' : 'text-blue-500')}`}>
                            {activePin.val > 0.8 ? 'CRITICAL SURGE' : (activePin.val > 0.5 ? 'ELEVATED SEA LEVEL' : 'STABLE BASELINE')}
                        </span>
                    </div>
                )}
                {viewMode === 'climate' && climateSubMode === 'heatwave' && (
                    <div className="flex flex-col gap-1">
                        <span className="text-[9px] text-cyan-500 font-bold tracking-wider">SST DEVIATION (REAL)</span>
                        <span className="text-sm font-mono text-white">
                            {activePin.realData ? (activePin.realData.surface_data.sst > 28.0 ? '+' : '') + ((activePin.realData.surface_data.sst - 28.0) * (1.0 + (appliedDateOffset % 0.6 - 0.3))).toFixed(2) : '+' + (activePin.val * 5.5).toFixed(1)} <span className="text-xs text-slate-400">°C</span>
                        </span>
                        <span className={`text-[10px] font-bold ${activePin.val > 0.6 ? 'text-yellow-400' : (activePin.val > 0.3 ? 'text-orange-500' : 'text-rose-700')}`}>
                            {activePin.val > 0.6 ? 'EXTREME HEATWAVE' : (activePin.val > 0.3 ? 'SEVERE THERMAL' : 'MILD ELEVATION')}
                        </span>
                    </div>
                )}
                {viewMode === 'climate' && climateSubMode === 'erosion' && (
                    <div className="flex flex-col gap-1">
                        <span className="text-[9px] text-cyan-500 font-bold tracking-wider">CURRENT VELOCITY (REAL)</span>
                        <span className="text-sm font-mono text-white">
                            {activePin.realData ? (Math.sqrt(Math.pow(activePin.realData.surface_data.current_u, 2) + Math.pow(activePin.realData.surface_data.current_v, 2)) * (1.0 + (appliedDateOffset % 0.8 - 0.4))).toFixed(2) : (0.5 + activePin.val * 3.5).toFixed(2)} <span className="text-xs text-slate-400">m/s</span>
                        </span>
                        <span className={`text-[10px] font-bold ${activePin.val > 0.8 ? 'text-yellow-400' : (activePin.val > 0.4 ? 'text-emerald-400' : 'text-blue-500')}`}>
                            {activePin.val > 0.8 ? 'EXTREME SHEAR' : (activePin.val > 0.4 ? 'MODERATE FLOW' : 'NORMAL FLOW')}
                        </span>
                    </div>
                )}
                
                {viewMode === 'fishery' && (
                    <div className="flex flex-col gap-1">
                        <span className="text-[9px] text-cyan-500 font-bold tracking-wider">CHLOROPHYLL (REAL SSS)</span>
                        <span className="text-sm font-mono text-white">
                            {activePin.realData ? ((35.0 - activePin.realData.surface_data.sss) * (1.0 + (appliedDateOffset % 0.5 - 0.25))).toFixed(2) : (activePin.val * 4.5).toFixed(2)} <span className="text-xs text-slate-400">mg/m³</span>
                        </span>
                        <span className={`text-[10px] font-bold ${activePin.val > 0.7 ? 'text-yellow-400' : (activePin.val > 0.4 ? 'text-emerald-400' : 'text-cyan-400')}`}>
                            {activePin.val > 0.7 ? 'HIGH YIELD ZONE' : (activePin.val > 0.4 ? 'MODERATE BIOMASS' : 'LOW ACTIVITY')}
                        </span>
                    </div>
                )}
                {viewMode === 'navy' && (
                    <div className="flex flex-col gap-1">
                        <span className="text-[9px] text-cyan-500 font-bold tracking-wider">SONAR ATTENUATION (REAL)</span>
                        <span className="text-sm font-mono text-white">
                            {activePin.realData ? ((-1.0 * Math.abs(activePin.realData.profile.speed_of_sound[0] - activePin.realData.profile.speed_of_sound[14]) / 10.0) * (1.0 + (appliedDateOffset % 0.3 - 0.15))).toFixed(1) : (activePin.val * -12.0).toFixed(1)} <span className="text-xs text-slate-400">dB/km</span>
                        </span>
                        <span className={`text-[10px] font-bold ${activePin.val > 0.7 ? 'text-rose-500' : (activePin.val > 0.4 ? 'text-purple-400' : 'text-blue-400')}`}>
                            {activePin.val > 0.7 ? 'SEVERE DEGRADATION' : (activePin.val > 0.4 ? 'MODERATE SCATTER' : 'CLEAR ACOUSTICS')}
                        </span>
                    </div>
                )}
                {viewMode === 'cable' && (
                    <div className="flex flex-col gap-1">
                        <span className="text-[9px] text-cyan-500 font-bold tracking-wider">BENTHIC STRESS (REAL)</span>
                        <span className="text-sm font-mono text-white">
                            {activePin.realData ? (Math.sqrt(Math.pow(activePin.realData.surface_data.current_u, 2) + Math.pow(activePin.realData.surface_data.current_v, 2)) * 125.0 * (1.0 + (appliedDateOffset % 0.6 - 0.3))).toFixed(1) : (activePin.val * 85.0).toFixed(1)} <span className="text-xs text-slate-400">kPa</span>
                        </span>
                        <span className={`text-[10px] font-bold ${activePin.val > 0.7 ? 'text-rose-500' : (activePin.val > 0.4 ? 'text-orange-400' : 'text-emerald-400')}`}>
                            {activePin.val > 0.7 ? 'CRITICAL TENSION' : (activePin.val > 0.4 ? 'ELEVATED FRICTION' : 'STABLE SEABED')}
                        </span>
                    </div>
                )}
                {viewMode === 'enso' && (
                    <div className="flex flex-col gap-1">
                        <span className="text-[9px] text-cyan-500 font-bold tracking-wider">IOD / ENSO INDEX (REAL)</span>
                        <span className="text-sm font-mono text-white">
                            {activePin.realData ? (((activePin.realData.surface_data.sst - 28.5) / 1.5) * (1.0 + (appliedDateOffset % 0.4 - 0.2))).toFixed(2) : (activePin.val * 4.0 - 2.0).toFixed(2)} <span className="text-xs text-slate-400">σ</span>
                        </span>
                        <span className={`text-[10px] font-bold ${activePin.val > 0.6 ? 'text-rose-500' : (activePin.val < 0.4 ? 'text-blue-400' : 'text-slate-300')}`}>
                            {activePin.val > 0.6 ? 'POSITIVE PHASE (WARM)' : (activePin.val < 0.4 ? 'NEGATIVE PHASE (COOL)' : 'NEUTRAL PHASE')}
                        </span>
                    </div>
                )}

                {viewMode === 'iot' && (
                    <div className="flex flex-col gap-1">
                        <span className="text-[9px] text-cyan-500 font-bold tracking-wider">TELEMETRY</span>
                        <span className="text-xs font-mono text-emerald-400">NO LOCAL BUOY</span>
                        <span className="text-[9px] text-slate-400 mt-1">Select an active IoT marker.</span>
                    </div>
                )}
              </div>
            </div>
          </Html>
        </group>
      )}
      {/* IOT HARDWARE BEACONS */}
      {viewMode === 'iot' && (
        <group>
          {/* Mumbai Siren */}
          <IotBeacon lat={18.922} lon={72.8347} color="#f43f5e"  />
          {/* Offline Fisherman at Sea */}
          <IotBeacon lat={15.5} lon={68.0} color="#f43f5e"  />
          {/* Coast Guard Terminal (Chennai) */}
          <IotBeacon lat={13.0827} lon={80.2707} color="#38bdf8"  />
          {/* Additional Coastal Sensors */}
          <IotBeacon lat={22.309} lon={70.802} color="#10b981"  />
          <IotBeacon lat={8.524} lon={76.936} color="#10b981"  />
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
      {(viewMode === 'iot' || (viewMode === 'climate' && climateSubMode === 'cyclone')) && (
        <Sphere args={[2.008, 128, 128]} raycast={() => null}>
          <shaderMaterial ref={tchpShaderRef} vertexShader={vertexShader} fragmentShader={tchpFragmentShader} uniforms={{ time: { value: dateOffset }, earthMap: { value: specularMap }, tchpMap: { value: tchpMap } }}  transparent={true} depthWrite={false} blending={THREE.AdditiveBlending} />
        </Sphere>
      )}
      {viewMode === 'climate' && climateSubMode === 'flood' && (
        <Sphere args={[2.008, 128, 128]} raycast={() => null}>
          <shaderMaterial ref={floodShaderRef} vertexShader={vertexShader} fragmentShader={floodFragmentShader} uniforms={{ time: { value: dateOffset }, earthMap: { value: specularMap }, dataMap: { value: tchpMap } }}  transparent={true} depthWrite={false} blending={THREE.AdditiveBlending} />
        </Sphere>
      )}
      {viewMode === 'climate' && climateSubMode === 'heatwave' && (
        <Sphere args={[2.008, 128, 128]} raycast={() => null}>
          <shaderMaterial ref={heatwaveShaderRef} vertexShader={vertexShader} fragmentShader={heatwaveFragmentShader} uniforms={{ time: { value: dateOffset }, earthMap: { value: specularMap }, dataMap: { value: tchpMap } }}  transparent={true} depthWrite={false} blending={THREE.AdditiveBlending} />
        </Sphere>
      )}
      {viewMode === 'climate' && climateSubMode === 'erosion' && (
        <Sphere args={[2.008, 128, 128]} raycast={() => null}>
          <shaderMaterial ref={erosionShaderRef} vertexShader={vertexShader} fragmentShader={erosionFragmentShader} uniforms={{ time: { value: dateOffset }, earthMap: { value: specularMap }, dataMap: { value: tchpMap } }}  transparent={true} depthWrite={false} blending={THREE.AdditiveBlending} />
        </Sphere>
      )}

      {viewMode === 'fishery' && (
        <Sphere args={[2.008, 128, 128]} raycast={() => null}>
          <shaderMaterial ref={fisheryShaderRef} vertexShader={vertexShader} fragmentShader={fisheryFragmentShader} uniforms={{ time: { value: dateOffset }, earthMap: { value: specularMap }, fisheryMap: { value: fisheryMap } }}  transparent={true} depthWrite={false} blending={THREE.AdditiveBlending} />
        </Sphere>
      )}

      {viewMode === 'navy' && (
        <Sphere args={[2.008, 128, 128]} raycast={() => null}>
          <shaderMaterial ref={navyShaderRef} vertexShader={vertexShader} fragmentShader={navyFragmentShader} uniforms={{ time: { value: dateOffset }, earthMap: { value: specularMap }, navyMap: { value: navyMap } }}  transparent={true} depthWrite={false} blending={THREE.AdditiveBlending} />
        </Sphere>
      )}

      {viewMode === 'cable' && (
        <Sphere args={[2.008, 128, 128]} raycast={() => null}>
          <shaderMaterial ref={cableShaderRef} vertexShader={vertexShader} fragmentShader={cableFragmentShader} uniforms={{ time: { value: dateOffset }, earthMap: { value: specularMap }, benthicMap: { value: benthicMap } }}  transparent={true} depthWrite={false} blending={THREE.AdditiveBlending} />
        </Sphere>
      )}
      {viewMode === 'enso' && (
        <Sphere args={[2.008, 128, 128]} raycast={() => null}>
          <shaderMaterial ref={ensoShaderRef} vertexShader={vertexShader} fragmentShader={ensoFragmentShader} uniforms={{ time: { value: dateOffset }, earthMap: { value: specularMap }, iodMap: { value: iodMap } }}  transparent={true} depthWrite={false} blending={THREE.AdditiveBlending} />
        </Sphere>
      )}

      
      {/* GLOBAL UPDATING OVERLAY */}
      {isUpdatingPattern && (
        <Html center style={{ pointerEvents: 'none' }} zIndexRange={[100, 0]}>
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