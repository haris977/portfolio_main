
"use client";

import React, { useEffect, useRef, useState, useCallback, ChangeEvent, MouseEvent as ReactMouseEvent } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { FilmPass } from 'three/examples/jsm/postprocessing/FilmPass.js';
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass.js';

interface PulseUniforms {
    uTime: { value: number };
    uPulsePositions: { value: THREE.Vector3[] };
    uPulseTimes: { value: number[] };
    uPulseColors: { value: THREE.Color[] };
    uPulseSpeed: { value: number };
    uBaseNodeSize: { value: number };
    uActivePalette: { value: number };
}

class Node {
    position: THREE.Vector3;
    connections: { node: Node; strength: number }[];
    level: number;
    type: number; 
    size: number;
    distanceFromRoot: number;

    constructor(position: THREE.Vector3, level: number = 0, type: number = 0) {
        if (!isFinite(position.x) || !isFinite(position.y) || !isFinite(position.z)) {
            this.position = new THREE.Vector3(0, 0, 0);
        } else {
            this.position = position;
        }
        this.connections = [];
        this.level = level;
        this.type = type;
        this.size = type === 0 ? THREE.MathUtils.randFloat(0.7, 1.2) : THREE.MathUtils.randFloat(0.4, 0.9);
        this.distanceFromRoot = 0;
    }

    addConnection(node: Node, strength: number = 1.0): void {
        if (!this.isConnectedTo(node)) {
            const validStrength = isFinite(strength) ? Math.max(0, Math.min(1, strength)) : 0.5;
            this.connections.push({ node, strength: validStrength });
            node.connections.push({ node: this, strength: validStrength }); 
        }
    }

    isConnectedTo(node: Node): boolean {
        return this.connections.some(conn => conn.node === node);
    }
}

const NeuralNetworkBackground: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [isClient, setIsClient] = useState<boolean>(false);

    const sceneRef = useRef<THREE.Scene | null>(null);
    const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
    const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
    const composerRef = useRef<EffectComposer | null>(null);
    const controlsRef = useRef<OrbitControls | null>(null);
    const nodeMeshRef = useRef<THREE.Points | null>(null);
    const connectionMeshRef = useRef<THREE.Points | null>(null);

    const animationFrameIdRef = useRef<number | null>(null);
    const lastTimeRef = useRef<number>(0);
    const pulseUniformsRef = useRef<PulseUniforms | null>(null); 
    const clickQueueRef = useRef<{ position: THREE.Vector3; color: THREE.Color }[]>([]);
    const pulseIntervalIdRef = useRef<NodeJS.Timeout | null>(null); 
     const config = useRef<{
        paused: boolean;
        activePaletteIndex: number;
        currentFormation: number;
        numFormations: number;
        densityFactor: number;
    }>({
        paused: false,
        activePaletteIndex: 1,
        currentFormation: 0,
        numFormations: 5, 
        densityFactor: 1
    });

    const colorPalettes = useRef<THREE.Color[][]>([
        [new THREE.Color(0x4F46E5), new THREE.Color(0x7C3AED), new THREE.Color(0xC026D3), new THREE.Color(0xDB2777), new THREE.Color(0x8B5CF6)],
        [new THREE.Color(0xF59E0B), new THREE.Color(0xF97316), new THREE.Color(0xDC2626), new THREE.Color(0x7F1D1D), new THREE.Color(0xFBBF24)],
        [new THREE.Color(0xEC4899), new THREE.Color(0x8B5CF6), new THREE.Color(0x6366F1), new THREE.Color(0x3B82F6), new THREE.Color(0xA855F7)],
        [new THREE.Color(0x10B981), new THREE.Color(0xA3E635), new THREE.Color(0xFACC15), new THREE.Color(0xFB923C), new THREE.Color(0x4ADE80)]
    ]);

    // Shader code (unchanged - string literals are fine in TSX)
    const noiseFunctions: string = `
    vec3 mod289(vec3 x){return x-floor(x*(1.0/289.0))*289.0;}
    vec4 mod289(vec4 x){return x-floor(x*(1.0/289.0))*289.0;}
    vec4 permute(vec4 x){return mod289(((x*34.0)+1.0)*x);}
    vec4 taylorInvSqrt(vec4 r){return 1.79284291400159-0.85373472095314*r;}
    float snoise(vec3 v){
        const vec2 C=vec2(1.0/6.0,1.0/3.0);const vec4 D=vec4(0.0,0.5,1.0,2.0);
        vec3 i=floor(v+dot(v,C.yyy));vec3 x0=v-i+dot(i,C.xxx);vec3 g=step(x0.yzx,x0.xyz);
        vec3 l=1.0-g;vec3 i1=min(g.xyz,l.zxy);vec3 i2=max(g.xyz,l.zxy);
        vec3 x1=x0-i1+C.xxx;vec3 x2=x0-i2+C.yyy;vec3 x3=x0-D.yyy;i=mod289(i);
        vec4 p=permute(permute(permute(i.z+vec4(0.0,i1.z,i2.z,1.0))+i.y+vec4(0.0,i1.y,i2.y,1.0))+i.x+vec4(0.0,i1.x,i2.x,1.0));
        float n_=0.142857142857;vec3 ns=n_*D.wyz-D.xzx;
        vec4 j=p-49.0*floor(p*ns.z*ns.z);vec4 x_=floor(j*ns.z);vec4 y_=floor(j-7.0*x_);
        vec4 x=x_*ns.x+ns.yyyy;vec4 y=y_*ns.x+ns.yyyy;vec4 h=1.0-abs(x)-abs(y);
        vec4 b0=vec4(x.xy,y.xy);vec4 b1=vec4(x.zw,y.zw);vec4 s0=floor(b0)*2.0+1.0;vec4 s1=floor(b1)*2.0+1.0;
        vec4 sh=-step(h,vec4(0.0));vec4 a0=b0.xzyw+s0.xzyw*sh.xxyy;vec4 a1=b1.xzyw+s1.xzyw*sh.zzww;
        vec3 p0=vec3(a0.xy,h.x);vec3 p1=vec3(a0.zw,h.y);vec3 p2=vec3(a1.xy,h.z);vec3 p3=vec3(a1.zw,h.w);
        vec4 norm=taylorInvSqrt(vec4(dot(p0,p0),dot(p1,p1),dot(p2,p2),dot(p3,p3)));
        p0*=norm.x;p1*=norm.y;p2*=norm.z;p3*=norm.w;vec4 m=max(0.6-vec4(dot(x0,x0),dot(x1,x1),dot(x2,x2),dot(x3,x3)),0.0);
        m*=m;return 42.0*dot(m*m,vec4(dot(p0,x0),dot(p1,x1),dot(p2,x2),dot(p3,x3)));
    }
    float fbm(vec3 p,float time){
        float value=0.0;float amplitude=0.5;float frequency=1.0;int octaves=3;
        for(int i=0;i<octaves;i++){
            value+=amplitude*snoise(p*frequency+time*0.2*frequency);
            amplitude*=0.5;frequency*=2.0;
        }
        return value;
    }`;

    const nodeShader = {
        vertexShader: `${noiseFunctions}
        attribute float nodeSize;attribute float nodeType;attribute vec3 nodeColor;attribute vec3 connectionIndices;attribute float distanceFromRoot;
        uniform float uTime;uniform vec3 uPulsePositions[3];uniform float uPulseTimes[3];uniform float uPulseSpeed;uniform float uBaseNodeSize;
        varying vec3 vColor;varying float vNodeType;varying vec3 vPosition;varying float vPulseIntensity;varying float vDistanceFromRoot;

        float getPulseIntensity(vec3 worldPos, vec3 pulsePos, float pulseTime) {
            if (pulseTime < 0.0) return 0.0;
            float timeSinceClick = uTime - pulseTime;
            if (timeSinceClick < 0.0 || timeSinceClick > 3.0) return 0.0;

            float pulseRadius = timeSinceClick * uPulseSpeed;
            float distToClick = distance(worldPos, pulsePos);
            float pulseThickness = 2.0;
            float waveProximity = abs(distToClick - pulseRadius);

            return smoothstep(pulseThickness, 0.0, waveProximity) * smoothstep(3.0, 0.0, timeSinceClick);
        }

        void main() {
            vNodeType = nodeType;
            vColor = nodeColor;
            vDistanceFromRoot = distanceFromRoot;

            vec3 worldPos = (modelMatrix * vec4(position, 1.0)).xyz;
            vPosition = worldPos;

            float totalPulseIntensity = 0.0;
            for (int i = 0; i < 3; i++) {
                totalPulseIntensity += getPulseIntensity(worldPos, uPulsePositions[i], uPulseTimes[i]);
            }
            vPulseIntensity = min(totalPulseIntensity, 1.0);

            float timeScale = 0.5 + 0.5 * sin(uTime * 0.8 + distanceFromRoot * 0.2);
            float baseSize = nodeSize * (0.8 + 0.2 * timeScale);
            float pulseSize = baseSize * (1.0 + vPulseIntensity * 2.0);

            vec3 modifiedPosition = position;
            if (nodeType > 0.5) {
                float noise = fbm(position * 0.1, uTime * 0.1);
                modifiedPosition += normal * noise * 0.2;
            }

            vec4 mvPosition = modelViewMatrix * vec4(modifiedPosition, 1.0);
            gl_PointSize = pulseSize * uBaseNodeSize * (800.0 / -mvPosition.z);
            gl_Position = projectionMatrix * mvPosition;
        }`,

        fragmentShader: `
        uniform float uTime;uniform vec3 uPulseColors[3];uniform int uActivePalette;
        varying vec3 vColor;varying float vNodeType;varying vec3 vPosition;varying float vPulseIntensity;varying float vDistanceFromRoot;

        void main() {
            vec2 center = 2.0 * gl_PointCoord - 1.0;
            float dist = length(center);
            if (dist > 1.0) discard;

            float glowStrength = 1.0 - smoothstep(0.0, 1.0, dist);
            glowStrength = pow(glowStrength, 1.4);

            vec3 baseColor = vColor * (0.8 + 0.2 * sin(uTime * 0.5 + vDistanceFromRoot * 0.3));
            vec3 finalColor = baseColor;

            if (vPulseIntensity > 0.0) {
                vec3 pulseColor = mix(vec3(1.0), uPulseColors[0], 0.3);
                finalColor = mix(baseColor, pulseColor, vPulseIntensity);
                finalColor *= (1.0 + vPulseIntensity * 0.7);
            }

            float alpha = glowStrength * (0.9 - 0.5 * dist);

            float camDistance = length(vPosition); // Simplified if cameraPosition isn't a direct uniform
            float distanceFade = smoothstep(80.0, 10.0, camDistance);


            if (vNodeType > 0.5) {
                alpha *= 0.85;
            } else {
                finalColor *= 1.2;
            }

            gl_FragColor = vec4(finalColor, alpha * distanceFade);
        }`
    };

    const connectionShader = {
        vertexShader: `${noiseFunctions}
        attribute vec3 startPoint;attribute vec3 endPoint;attribute float connectionStrength;attribute float pathIndex;attribute vec3 connectionColor;
        uniform float uTime;uniform vec3 uPulsePositions[3];uniform float uPulseTimes[3];uniform float uPulseSpeed;
        varying vec3 vColor;varying float vConnectionStrength;varying float vPulseIntensity;varying float vPathPosition;

        float getPulseIntensity(vec3 worldPos, vec3 pulsePos, float pulseTime) {
            if (pulseTime < 0.0) return 0.0;
            float timeSinceClick = uTime - pulseTime;
            if (timeSinceClick < 0.0 || timeSinceClick > 3.0) return 0.0;
            float pulseRadius = timeSinceClick * uPulseSpeed;
            float distToClick = distance(worldPos, pulsePos);
            float pulseThickness = 2.0;
            float waveProximity = abs(distToClick - pulseRadius);
            return smoothstep(pulseThickness, 0.0, waveProximity) * smoothstep(3.0, 0.0, timeSinceClick);
        }

        void main() {
            float t = position.x;
            vPathPosition = t;

            vec3 midPoint = mix(startPoint, endPoint, 0.5);
            float pathOffset = sin(t * 3.14159) * 0.1;
            vec3 perpendicular = normalize(cross(normalize(endPoint - startPoint), vec3(0.0, 1.0, 0.0)));
            if (length(perpendicular) < 0.1) perpendicular = vec3(1.0, 0.0, 0.0);
            midPoint += perpendicular * pathOffset;

            vec3 p0 = mix(startPoint, midPoint, t);
            vec3 p1 = mix(midPoint, endPoint, t);
            vec3 finalPos = mix(p0, p1, t);

            float noiseTime = uTime * 0.2;
            float noise = fbm(vec3(pathIndex * 0.1, t * 0.5, noiseTime), noiseTime);
            finalPos += perpendicular * noise * 0.1;

            vec3 worldPos = (modelMatrix * vec4(finalPos, 1.0)).xyz;

            float totalPulseIntensity = 0.0;
            for (int i = 0; i < 3; i++) {
                totalPulseIntensity += getPulseIntensity(worldPos, uPulsePositions[i], uPulseTimes[i]);
            }
            vPulseIntensity = min(totalPulseIntensity, 1.0);

            vColor = connectionColor;
            vConnectionStrength = connectionStrength;

            gl_Position = projectionMatrix * modelViewMatrix * vec4(finalPos, 1.0);
        }`,

        fragmentShader: `
        uniform float uTime;uniform vec3 uPulseColors[3];
        varying vec3 vColor;varying float vConnectionStrength;varying float vPulseIntensity;varying float vPathPosition;

        void main() {
            vec3 baseColor = vColor * (0.7 + 0.3 * sin(uTime * 0.5 + vPathPosition * 10.0));

            float flowPattern = sin(vPathPosition * 20.0 - uTime * 3.0) * 0.5 + 0.5;
            float flowIntensity = 0.3 * flowPattern * vConnectionStrength;

            vec3 finalColor = baseColor;

            if (vPulseIntensity > 0.0) {
                vec3 pulseColor = mix(vec3(1.0), uPulseColors[0], 0.3);
                finalColor = mix(baseColor, pulseColor, vPulseIntensity);
                flowIntensity += vPulseIntensity * 0.5;
            }

            finalColor *= (0.6 + flowIntensity + vConnectionStrength * 0.4);

            float alpha = 0.8 * vConnectionStrength + 0.2 * flowPattern;
            alpha = mix(alpha, min(1.0, alpha * 2.0), vPulseIntensity);

            gl_FragColor = vec4(finalColor, alpha);
        }`
    };
    const nodesRef = useRef<Node[]>([]);
    const rootNodeRef = useRef<Node | null>(null);

    const generateNeuralNetwork = useCallback((): void => {
        const nodes: Node[] = nodesRef.current;
        let rootNode: Node | null;
        nodes.length = 0; 

        const generateQuantumCortex = (): void => {
            rootNode = new Node(new THREE.Vector3(0, 0, 0), 0, 0); rootNode.size = 1.5; nodes.push(rootNode);
            rootNodeRef.current = rootNode; 
            // const layers: number = 5; // Removed unused variable 
            const primaryAxes: number = 6;
            const nodesPerAxis: number = 8;
            const axisLength: number = 20;
            const axisEndpoints: Node[] = [];

            for (let a = 0; a < primaryAxes; a++) {
                const phi: number = Math.acos(Math.max(-1, Math.min(1, -1 + (2 * a) / primaryAxes)));
                const theta: number = Math.PI * (1 + Math.sqrt(5)) * a;
                const dirVec: THREE.Vector3 = new THREE.Vector3(
                    Math.sin(phi) * Math.cos(theta),
                    Math.sin(phi) * Math.sin(theta),
                    Math.cos(phi)
                );

                if (!isFinite(dirVec.x) || !isFinite(dirVec.y) || !isFinite(dirVec.z)) {
                    dirVec.set(1, 0, 0); 
                }

                let prevNode: Node = rootNode;
                for (let i = 1; i <= nodesPerAxis; i++) {
                    const t: number = i / Math.max(nodesPerAxis, 1);
                    const distance: number = axisLength * Math.pow(t, 0.8);
                    const pos: THREE.Vector3 = new THREE.Vector3().copy(dirVec).multiplyScalar(distance);
                    
                    if (!isFinite(pos.x) || !isFinite(pos.y) || !isFinite(pos.z)) {
                        pos.set(0, 0, 0);
                    }
                    
                    const nodeType: number = (i === nodesPerAxis) ? 1 : 0;
                    const newNode: Node = new Node(pos, i, nodeType);
                    newNode.distanceFromRoot = isFinite(distance) ? distance : 0;
                    nodes.push(newNode);
                    prevNode.addConnection(newNode, 1.0 - (t * 0.3));
                    prevNode = newNode;
                    if (i === nodesPerAxis) axisEndpoints.push(newNode);
                }
            }

            const ringDistances: number[] = [5, 10, 15];
            const ringNodes: Node[][] = [];
            for (const ringDist of ringDistances) {
                const nodesInRing: number = Math.floor(ringDist * 3 * config.current.densityFactor);
                const ringLayer: Node[] = [];
                for (let i = 0; i < nodesInRing; i++) {
                    const t: number = i / Math.max(nodesInRing, 1);
                    const ringPhi: number = Math.acos(Math.max(-1, Math.min(1, 2 * Math.random() - 1)));
                    const ringTheta: number = 2 * Math.PI * t;
                    const pos: THREE.Vector3 = new THREE.Vector3(
                        ringDist * Math.sin(ringPhi) * Math.cos(ringTheta),
                        ringDist * Math.sin(ringPhi) * Math.sin(ringTheta),
                        ringDist * Math.cos(ringPhi) // Corrected from `Math.cos(phi)` to `Math.cos(ringPhi)`
                    );
                    if (!isFinite(pos.x) || !isFinite(pos.y) || !isFinite(pos.z)) {
                        pos.set(ringDist, 0, 0); 
                    }
                    
                    const level: number = Math.ceil(ringDist / 5);
                    const nodeType: number = Math.random() < 0.4 ? 1 : 0;
                    const newNode: Node = new Node(pos, level, nodeType);
                    const distanceFromRoot = rootNode.position.distanceTo(pos);
                    newNode.distanceFromRoot = isFinite(distanceFromRoot) ? distanceFromRoot : ringDist;
                    nodes.push(newNode);
                    ringLayer.push(newNode);
                }
                ringNodes.push(ringLayer);

                for (let i = 0; i < ringLayer.length; i++) {
                    const node: Node = ringLayer[i];
                    const nextNode: Node = ringLayer[(i + 1) % ringLayer.length];
                    node.addConnection(nextNode, 0.7);
                    if (i % 4 === 0 && ringLayer.length > 5) {
                        const jumpIdx: number = (i + Math.floor(ringLayer.length / 2)) % ringLayer.length;
                        node.addConnection(ringLayer[jumpIdx], 0.4);
                    }
                }
            }

            for (const ring of ringNodes) {
                for (const node of ring) {
                    let closestAxisNode: Node | null = null;
                    let minDist: number = Infinity;
                    for (const n of nodes) {
                        if (n === rootNode || n === node) continue;
                        if (n.level === 0 || n.type !== 0) continue;
                        const dist: number = node.position.distanceTo(n.position);
                        if (isFinite(dist) && dist < minDist) { minDist = dist; closestAxisNode = n; }
                    }
                    if (closestAxisNode && isFinite(minDist) && minDist < 8) {
                        const strength: number = 0.5 + (1 - minDist / 8) * 0.5;
                        if (isFinite(strength)) {
                            node.addConnection(closestAxisNode, strength);
                        }
                    }
                }
            }

            for (let r = 0; r < ringNodes.length - 1; r++) {
                const innerRing: Node[] = ringNodes[r];
                const outerRing: Node[] = ringNodes[r + 1];
                const connectionsCount: number = Math.floor(innerRing.length * 0.5);
                for (let i = 0; i < connectionsCount; i++) {
                    const innerNode: Node = innerRing[Math.floor(Math.random() * innerRing.length)];
                    const outerNode: Node = outerRing[Math.floor(Math.random() * outerRing.length)];
                    if (!innerNode.isConnectedTo(outerNode)) {
                        innerNode.addConnection(outerNode, 0.6);
                    }
                }
            }

             for (let i = 0; i < axisEndpoints.length; i++) {
                const startNode: Node = axisEndpoints[i];
                const endNode: Node = axisEndpoints[(i + 2) % axisEndpoints.length];
                const numIntermediates: number = 3;
                let prevNode: Node = startNode;
                for (let j = 1; j <= numIntermediates; j++) {
                    const t: number = j / (numIntermediates + 1);
                    const pos: THREE.Vector3 = new THREE.Vector3().lerpVectors(startNode.position, endNode.position, t);
                    pos.add(new THREE.Vector3(
                        THREE.MathUtils.randFloatSpread(3),
                        THREE.MathUtils.randFloatSpread(3),
                        THREE.MathUtils.randFloatSpread(3)
                    ));
                    
                    if (!isFinite(pos.x) || !isFinite(pos.y) || !isFinite(pos.z)) {
                        pos.set(0, 0, 0); 
                    }
                    
                    const newNode: Node = new Node(pos, startNode.level, 0);
                    const distanceFromRoot = rootNode.position.distanceTo(pos);
                    newNode.distanceFromRoot = isFinite(distanceFromRoot) ? distanceFromRoot : 0;
                    nodes.push(newNode);
                    prevNode.addConnection(newNode, 0.5);
                    prevNode = newNode;
                }
                prevNode.addConnection(endNode, 0.5);
            }
        };

        const generateHyperdimensionalMesh = (): void => {
            rootNode = new Node(new THREE.Vector3(0, 0, 0), 0, 0); rootNode.size = 1.5; nodes.push(rootNode);
            rootNodeRef.current = rootNode;
            const dimensions: number = 4;
            const nodesPerDimension: number = Math.floor(40 * config.current.densityFactor);
            const maxRadius: number = 20;

            const dimensionVectors: THREE.Vector3[] = [
                new THREE.Vector3(1, 1, 1).normalize(),
                new THREE.Vector3(-1, 1, -1).normalize(),
                new THREE.Vector3(1, -1, -1).normalize(),
                new THREE.Vector3(-1, -1, 1).normalize()
            ];

            const dimensionNodes: Node[][] = [];

            for (let d = 0; d < dimensions; d++) {
                const dimNodes: Node[] = [];
                const dimVec: THREE.Vector3 = dimensionVectors[d];
                let prevNode: Node = rootNode;
                for (let i = 0; i < nodesPerDimension; i++) {
                    const distance: number = maxRadius * Math.pow(Math.random(), 0.7);
                    const randomVec: THREE.Vector3 = new THREE.Vector3(
                        THREE.MathUtils.randFloatSpread(1),
                        THREE.MathUtils.randFloatSpread(1),
                        THREE.MathUtils.randFloatSpread(1)
                    ).normalize();
                    
                    if (!isFinite(randomVec.x) || !isFinite(randomVec.y) || !isFinite(randomVec.z)) {
                        randomVec.set(1, 0, 0);
                    }
                    
                    const biasedVec: THREE.Vector3 = new THREE.Vector3().addVectors(
                        dimVec.clone().multiplyScalar(0.6 + Math.random() * 0.4),
                        randomVec.clone().multiplyScalar(0.3)
                    ).normalize();

                    const pos: THREE.Vector3 = biasedVec.multiplyScalar(distance);
                    
                    if (!isFinite(pos.x) || !isFinite(pos.y) || !isFinite(pos.z)) {
                        pos.set(distance, 0, 0); 
                    }
                    
                    const level: number = Math.floor(distance / 5);
                    const nodeType: number = Math.random() < 0.2 ? 1 : 0;
                    const newNode: Node = new Node(pos, level, nodeType);
                    const distanceFromRoot = rootNode.position.distanceTo(pos);
                    newNode.distanceFromRoot = isFinite(distanceFromRoot) ? distanceFromRoot : distance;
                    nodes.push(newNode);
                    dimNodes.push(newNode);

                    if (i > 0) {
                        prevNode.addConnection(newNode, 0.8);
                    } else {
                        rootNode.addConnection(newNode, 0.9);
                    }
                    prevNode = newNode;
                }
                dimensionNodes.push(dimNodes);
            }

            for (let i = 0; i < dimensions; i++) {
                for (let j = i + 1; j < dimensions; j++) {
                    const dim1: Node[] = dimensionNodes[i];
                    const dim2: Node[] = dimensionNodes[j];
                    const connectionsToMake: number = Math.floor(Math.min(dim1.length, dim2.length) * 0.3 * config.current.densityFactor);

                    for (let k = 0; k < connectionsToMake; k++) {
                        const node1: Node = dim1[Math.floor(Math.random() * dim1.length)];
                        const node2: Node = dim2[Math.floor(Math.random() * dim2.length)];
                        if (!node1.isConnectedTo(node2)) {
                            node1.addConnection(node2, Math.random() * 0.6 + 0.4);
                        }
                    }
                }
            }

            for (const dim of dimensionNodes) {
                const connectionsToMake: number = Math.floor(dim.length * 0.5 * config.current.densityFactor);
                for (let k = 0; k < connectionsToMake; k++) {
                    const node1: Node = dim[Math.floor(Math.random() * dim.length)];
                    const node2: Node = dim[Math.floor(Math.random() * dim.length)];
                    if (node1 !== node2 && !node1.isConnectedTo(node2)) {
                        node1.addConnection(node2, Math.random() * 0.5 + 0.5);
                    }
                }
            }
        };

        const generateOrganicGrowth = (): void => {
            rootNode = new Node(new THREE.Vector3(0, 0, 0), 0, 0); rootNode.size = 1.5; nodes.push(rootNode);
            rootNodeRef.current = rootNode;
            const maxNodes: number = Math.floor(250 * config.current.densityFactor);
            const growthFactor: number = 0.8;
            const branchProbability: number = 0.6;
            const maxLevel: number = 5;

            const queue: Node[] = [rootNode];
            let currentNodeCount: number = 1;

            while (queue.length > 0 && currentNodeCount < maxNodes) {
                const parent: Node = queue.shift()!; // Using ! assertion because we check queue.length
                const numChildren: number = Math.floor(THREE.MathUtils.randFloat(1, 4) * growthFactor);

                for (let i = 0; i < numChildren && currentNodeCount < maxNodes; i++) {
                    if (parent.level >= maxLevel && Math.random() > 0.3) continue;

                    const angle: number = Math.random() * Math.PI * 2;
                    const distance: number = THREE.MathUtils.randFloat(2, 5) * (1 - parent.level / Math.max(maxLevel, 1) * 0.5);
                    const randomOffset: THREE.Vector3 = new THREE.Vector3(
                        THREE.MathUtils.randFloatSpread(1),
                        THREE.MathUtils.randFloatSpread(1),
                        THREE.MathUtils.randFloatSpread(1)
                    ).multiplyScalar(1.5);

                    const pos: THREE.Vector3 = parent.position.clone().add(
                        new THREE.Vector3(
                            Math.cos(angle) * distance,
                            Math.sin(angle) * distance,
                            THREE.MathUtils.randFloatSpread(distance * 0.5)
                        )
                    ).add(randomOffset);

                    if (!isFinite(pos.x) || !isFinite(pos.y) || !isFinite(pos.z)) {
                        pos.set(0, 0, 0); 
                    }

                    const nodeType: number = Math.random() < 0.15 ? 1 : 0;
                    const newNode: Node = new Node(pos, parent.level + 1, nodeType);
                    const distanceFromRoot = rootNode.position.distanceTo(pos);
                    newNode.distanceFromRoot = isFinite(distanceFromRoot) ? distanceFromRoot : 0;
                    nodes.push(newNode);
                    parent.addConnection(newNode, 0.7 + Math.random() * 0.3);
                    queue.push(newNode);
                    currentNodeCount++;

                    if (Math.random() < branchProbability && parent.level < maxLevel - 1) {
                        const branchPos = parent.position.clone().add(randomOffset.multiplyScalar(0.5));
                        
                        if (!isFinite(branchPos.x) || !isFinite(branchPos.y) || !isFinite(branchPos.z)) {
                            branchPos.set(0, 0, 0);
                        }
                        
                        const branchNode: Node = new Node(branchPos, parent.level + 1, 0);
                        const branchDistanceFromRoot = rootNode.position.distanceTo(branchPos);
                        branchNode.distanceFromRoot = isFinite(branchDistanceFromRoot) ? branchDistanceFromRoot : 0;
                        nodes.push(branchNode);
                        parent.addConnection(branchNode, 0.5);
                    }
                }
            }

            const numSecondaryConnections: number = Math.floor(nodes.length * 0.5 * config.current.densityFactor);
            for (let i = 0; i < numSecondaryConnections; i++) {
                const node1: Node = nodes[Math.floor(Math.random() * nodes.length)];
                const node2: Node = nodes[Math.floor(Math.random() * nodes.length)];
                if (node1 !== node2 && !node1.isConnectedTo(node2)) {
                    const distance = node1.position.distanceTo(node2.position);
                    if (isFinite(distance) && distance < 10) {
                        node1.addConnection(node2, Math.random() * 0.3 + 0.2);
                    }
                }
            }
        };

        const generateGridStructure = (): void => {
            rootNode = new Node(new THREE.Vector3(0, 0, 0), 0, 0); rootNode.size = 1.5; nodes.push(rootNode);
            rootNodeRef.current = rootNode;

            const gridSize: number = Math.floor(5 * Math.pow(config.current.densityFactor, 0.5));
            const spacing: number = 4;
            const offset: number = (gridSize - 1) * spacing * 0.5;

            const grid: Node[][][] = [];

            for (let x = 0; x < gridSize; x++) {
                grid[x] = [];
                for (let y = 0; y < gridSize; y++) {
                    grid[x][y] = [];
                    for (let z = 0; z < gridSize; z++) {
                        const pos: THREE.Vector3 = new THREE.Vector3(
                            x * spacing - offset + THREE.MathUtils.randFloatSpread(0.5),
                            y * spacing - offset + THREE.MathUtils.randFloatSpread(0.5),
                            z * spacing - offset + THREE.MathUtils.randFloatSpread(0.5)
                        );
                        
                        if (!isFinite(pos.x) || !isFinite(pos.y) || !isFinite(pos.z)) {
                            pos.set(x * spacing - offset, y * spacing - offset, z * spacing - offset);
                        }
                        
                        const nodeType: number = Math.random() < 0.1 ? 1 : 0;
                        const newNode: Node = new Node(pos, 0, nodeType);
                        const distanceFromRoot = rootNode.position.distanceTo(pos);
                        newNode.distanceFromRoot = isFinite(distanceFromRoot) ? distanceFromRoot : 0;
                        nodes.push(newNode);
                        grid[x][y][z] = newNode;
                    }
                }
            }

            for (let x = 0; x < gridSize; x++) {
                for (let y = 0; y < gridSize; y++) {
                    for (let z = 0; z < gridSize; z++) {
                        const node: Node = grid[x][y][z];

                        if (x > 0) node.addConnection(grid[x - 1][y][z], 1.0);
                        if (y > 0) node.addConnection(grid[x][y - 1][z], 1.0);
                        if (z > 0) node.addConnection(grid[x][y][z - 1], 1.0);

                        const diagonalProb: number = 0.1 * config.current.densityFactor;
                        if (x > 0 && y > 0 && Math.random() < diagonalProb) node.addConnection(grid[x - 1][y - 1][z], 0.7);
                        if (x > 0 && z > 0 && Math.random() < diagonalProb) node.addConnection(grid[x - 1][y][z - 1], 0.7);
                        if (y > 0 && z > 0 && Math.random() < diagonalProb) node.addConnection(grid[x][y - 1][z - 1], 0.7);
                        if (x > 0 && y > 0 && z > 0 && Math.random() < diagonalProb * 0.5) node.addConnection(grid[x - 1][y - 1][z - 1], 0.6);
                    }
                }
            }

            const centralNode: Node = grid[Math.floor(gridSize / 2)][Math.floor(gridSize / 2)][Math.floor(gridSize / 2)];
            rootNode.addConnection(centralNode, 1.0);

            const numRandomConnections: number = Math.floor(nodes.length * 0.1 * config.current.densityFactor);
            for (let i = 0; i < numRandomConnections; i++) {
                const node1: Node = nodes[Math.floor(Math.random() * nodes.length)];
                const node2: Node = nodes[Math.floor(Math.random() * nodes.length)];
                if (node1 !== node2 && !node1.isConnectedTo(node2)) {
                    const distance = node1.position.distanceTo(node2.position);
                    if (isFinite(distance) && distance > spacing * 2) {
                        node1.addConnection(node2, Math.random() * 0.2 + 0.1);
                    }
                }
            }
        };

        const generateRandomWeb = (): void => {
            rootNode = new Node(new THREE.Vector3(0, 0, 0), 0, 0); rootNode.size = 1.5; nodes.push(rootNode);
            rootNodeRef.current = rootNode;
            const numNodes: number = Math.floor(300 * config.current.densityFactor);
            const maxRadius: number = 25;

            for (let i = 0; i < numNodes; i++) {
                const pos: THREE.Vector3 = new THREE.Vector3(
                    THREE.MathUtils.randFloatSpread(maxRadius * 2),
                    THREE.MathUtils.randFloatSpread(maxRadius * 2),
                    THREE.MathUtils.randFloatSpread(maxRadius * 2)
                );
                
                if (!isFinite(pos.x) || !isFinite(pos.y) || !isFinite(pos.z)) {
                    pos.set(0, 0, 0); 
                }
                
                const nodeType: number = Math.random() < 0.2 ? 1 : 0;
                const newNode: Node = new Node(pos, 0, nodeType);
                const distanceFromRoot = rootNode.position.distanceTo(pos);
                newNode.distanceFromRoot = isFinite(distanceFromRoot) ? distanceFromRoot : 0;
                nodes.push(newNode);
            }

            const connectionRadius: number = 8 + (5 * config.current.densityFactor);
            const maxConnections: number = 5;

            for (let i = 0; i < nodes.length; i++) {
                const node1: Node = nodes[i];
                const potentialConnections: { node: Node; dist: number }[] = [];
                for (let j = 0; j < nodes.length; j++) {
                    const node2: Node = nodes[j];
                    if (node1 === node2) continue;
                    const dist: number = node1.position.distanceTo(node2.position);
                    if (isFinite(dist) && dist < connectionRadius) {
                        potentialConnections.push({ node: node2, dist: dist });
                    }
                }

                potentialConnections.sort((a, b) => a.dist - b.dist);

                for (let k = 0; k < Math.min(potentialConnections.length, maxConnections); k++) {
                    const { node: node2, dist } = potentialConnections[k];
                    const strength: number = 1.0 - (dist / Math.max(connectionRadius, 0.1)) * 0.7;
                    if (isFinite(strength)) {
                        node1.addConnection(node2, strength);
                    }
                }
            }

            for (const node of nodes) {
                if (rootNode && node !== rootNode && rootNode.connections.length < 10) {
                    const distance = rootNode.position.distanceTo(node.position);
                    if (isFinite(distance) && distance < 15) {
                        rootNode.addConnection(node, 0.8);
                    }
                }
            }
        };

        const renderNetwork = (): void => {
            const scene = sceneRef.current;
            const pulseUniforms = pulseUniformsRef.current;

            if (!scene || !pulseUniforms) return; 

            if (nodes.length === 0) return;

            const validNodes = nodes.filter(node => 
                isFinite(node.position.x) && 
                isFinite(node.position.y) && 
                isFinite(node.position.z)
            );

            if (validNodes.length === 0) return;

            if (nodeMeshRef.current) scene.remove(nodeMeshRef.current);
            if (connectionMeshRef.current) scene.remove(connectionMeshRef.current);

            const nodePositions: number[] = [];
            const nodeSizes: number[] = [];
            const nodeTypes: number[] = [];
            const nodeColors: number[] = [];
            const nodeDistancesFromRoot: number[] = [];

            validNodes.forEach((node: Node) => {
                const x = isNaN(node.position.x) ? 0 : node.position.x;
                const y = isNaN(node.position.y) ? 0 : node.position.y;
                const z = isNaN(node.position.z) ? 0 : node.position.z;
                
                nodePositions.push(x, y, z);
                nodeSizes.push(isNaN(node.size) ? 1 : node.size);
                nodeTypes.push(node.type);
                nodeColors.push(...colorPalettes.current[config.current.activePaletteIndex][node.level % colorPalettes.current[0].length].toArray());
                nodeDistancesFromRoot.push(isNaN(node.distanceFromRoot) ? 0 : node.distanceFromRoot);
            });

            const validatedNodePositions = nodePositions.map(val => isFinite(val) ? val : 0);
            const validatedNodeSizes = nodeSizes.map(val => isFinite(val) ? val : 1);
            const validatedNodeTypes = nodeTypes.map(val => isFinite(val) ? val : 0);
            const validatedNodeColors = nodeColors.map(val => isFinite(val) ? val : 0);
            const validatedNodeDistancesFromRoot = nodeDistancesFromRoot.map(val => isFinite(val) ? val : 0);

            const nodeGeometry = new THREE.BufferGeometry();
            nodeGeometry.setAttribute('position', new THREE.Float32BufferAttribute(validatedNodePositions, 3));
            nodeGeometry.setAttribute('nodeSize', new THREE.Float32BufferAttribute(validatedNodeSizes, 1));
            nodeGeometry.setAttribute('nodeType', new THREE.Float32BufferAttribute(validatedNodeTypes, 1));
            nodeGeometry.setAttribute('nodeColor', new THREE.Float32BufferAttribute(validatedNodeColors, 3));
            nodeGeometry.setAttribute('distanceFromRoot', new THREE.Float32BufferAttribute(validatedNodeDistancesFromRoot, 1));

            if (validatedNodePositions.length > 0) {
                const nodeMaterial = new THREE.ShaderMaterial({
                    uniforms: pulseUniforms as unknown as { [uniform: string]: THREE.IUniform<unknown> }, // Cast to generic uniforms type
                    vertexShader: nodeShader.vertexShader,
                    fragmentShader: nodeShader.fragmentShader,
                    transparent: true,
                    blending: THREE.AdditiveBlending,
                    depthWrite: false
                });

                nodeMeshRef.current = new THREE.Points(nodeGeometry, nodeMaterial);
                scene.add(nodeMeshRef.current);
            }

            const connectionPositions: number[] = [];
            const connectionStrengths: number[] = [];
            const connectionPathIndices: number[] = [];
            const connectionColors: number[] = [];

            let pathIndexCounter: number = 0;
            const uniqueConnections = new Set<string>();

            validNodes.forEach((node: Node) => {
                node.connections.forEach((connection: { node: Node; strength: number }) => {
                    
                    if (!validNodes.includes(connection.node)) return;
                    
                    const p1: THREE.Vector3 = node.position;
                    const p2: THREE.Vector3 = connection.node.position;

                    const p1x = isNaN(p1.x) ? 0 : p1.x;
                    const p1y = isNaN(p1.y) ? 0 : p1.y;
                    const p1z = isNaN(p1.z) ? 0 : p1.z;
                    const p2x = isNaN(p2.x) ? 0 : p2.x;
                    const p2y = isNaN(p2.y) ? 0 : p2.y;
                    const p2z = isNaN(p2.z) ? 0 : p2.z;

                    const connectionId: string = [p1x, p1y, p1z, p2x, p2y, p2z].sort().join(',');

                    if (!uniqueConnections.has(connectionId)) {
                        for (let i = 0; i <= 20; i++) { 
                            connectionPositions.push(i / 20);
                            connectionStrengths.push(isNaN(connection.strength) ? 0.5 : connection.strength);
                            connectionPathIndices.push(pathIndexCounter);
                            connectionColors.push(...colorPalettes.current[config.current.activePaletteIndex][(node.level + connection.node.level) % colorPalettes.current[0].length].toArray());
                        }
                        pathIndexCounter++;
                        uniqueConnections.add(connectionId);
                    }
                });
            });

            const startPoints: number[] = [];
            const endPoints: number[] = [];
            uniqueConnections.clear(); 
            validNodes.forEach((node: Node) => {
                node.connections.forEach((connection: { node: Node; strength: number }) => {
               
                    if (!validNodes.includes(connection.node)) return;
                    
                    const p1: THREE.Vector3 = node.position;
                    const p2: THREE.Vector3 = connection.node.position;
                    
                    const p1x = isNaN(p1.x) ? 0 : p1.x;
                    const p1y = isNaN(p1.y) ? 0 : p1.y;
                    const p1z = isNaN(p1.z) ? 0 : p1.z;
                    const p2x = isNaN(p2.x) ? 0 : p2.x;
                    const p2y = isNaN(p2.y) ? 0 : p2.y;
                    const p2z = isNaN(p2.z) ? 0 : p2.z;
                    
                    const connectionId: string = [p1x, p1y, p1z, p2x, p2y, p2z].sort().join(',');

                    if (!uniqueConnections.has(connectionId)) {
                        for (let i = 0; i <= 20; i++) {
                            startPoints.push(p1x, p1y, p1z);
                            endPoints.push(p2x, p2y, p2z);
                        }
                        uniqueConnections.add(connectionId);
                    }
                });
            });

            const validatedConnectionPositions = connectionPositions.map(val => isFinite(val) ? val : 0);
            const validatedStartPoints = startPoints.map(val => isFinite(val) ? val : 0);
            const validatedEndPoints = endPoints.map(val => isFinite(val) ? val : 0);
            const validatedConnectionStrengths = connectionStrengths.map(val => isFinite(val) ? val : 0.5);
            const validatedConnectionPathIndices = connectionPathIndices.map(val => isFinite(val) ? val : 0);
            const validatedConnectionColors = connectionColors.map(val => isFinite(val) ? val : 0);

            const connectionGeometry = new THREE.BufferGeometry();
            connectionGeometry.setAttribute('position', new THREE.Float32BufferAttribute(validatedConnectionPositions, 1));
            connectionGeometry.setAttribute('startPoint', new THREE.Float32BufferAttribute(validatedStartPoints, 3));
            connectionGeometry.setAttribute('endPoint', new THREE.Float32BufferAttribute(validatedEndPoints, 3));
            connectionGeometry.setAttribute('connectionStrength', new THREE.Float32BufferAttribute(validatedConnectionStrengths, 1));
            connectionGeometry.setAttribute('pathIndex', new THREE.Float32BufferAttribute(validatedConnectionPathIndices, 1));
            connectionGeometry.setAttribute('connectionColor', new THREE.Float32BufferAttribute(validatedConnectionColors, 3));

            if (validatedConnectionPositions.length > 0) {
                const connectionMaterial = new THREE.ShaderMaterial({
                    uniforms: pulseUniforms as unknown as { [uniform: string]: THREE.IUniform<unknown> },
                    vertexShader: connectionShader.vertexShader,
                    fragmentShader: connectionShader.fragmentShader,
                    transparent: true,
                    blending: THREE.AdditiveBlending,
                    depthWrite: false
                });

                connectionMeshRef.current = new THREE.Points(connectionGeometry, connectionMaterial);
                scene.add(connectionMeshRef.current);
            }
        };


        if (config.current.currentFormation === 0) {
            generateQuantumCortex();
        } else if (config.current.currentFormation === 1) {
            generateHyperdimensionalMesh();
        } else if (config.current.currentFormation === 2) {
            generateOrganicGrowth();
        } else if (config.current.currentFormation === 3) {
            generateGridStructure();
        } else if (config.current.currentFormation === 4) {
            generateRandomWeb();
        }
        renderNetwork();
    }, []);

    const animate = useCallback((time: DOMHighResTimeStamp): void => { 
        animationFrameIdRef.current = requestAnimationFrame(animate);

        if (!config.current.paused) {
            const deltaTime: number = (time - lastTimeRef.current) / 1000;
            if (pulseUniformsRef.current) {
                pulseUniformsRef.current.uTime.value += deltaTime;
            }
            if (controlsRef.current) {
                controlsRef.current.update();
            }
        }
        lastTimeRef.current = time;

        if (composerRef.current) {
            composerRef.current.render();
        }
    }, []);


    const processPulseQueue = useCallback((): void => {
        if (clickQueueRef.current.length > 0 && pulseUniformsRef.current) {
            const pulse = clickQueueRef.current.shift();
            if (pulse) { 
                for (let i = 0; i < 3; i++) {
                    if (pulseUniformsRef.current.uPulseTimes.value[i] < 0 || (pulseUniformsRef.current.uTime.value - pulseUniformsRef.current.uPulseTimes.value[i]) > 3.0) {
                        pulseUniformsRef.current.uPulsePositions.value[i].copy(pulse.position);
                        pulseUniformsRef.current.uPulseTimes.value[i] = pulseUniformsRef.current.uTime.value;
                        pulseUniformsRef.current.uPulseColors.value[i].copy(pulse.color);
                        break;
                    }
                }
            }
        }
    }, []);


    useEffect(() => {
        setIsClient(true);

        const canvas = canvasRef.current;
        if (!canvas) return;

        const currentScene = new THREE.Scene();
        currentScene.fog = new THREE.FogExp2(0x000000, 0.0015);
        sceneRef.current = currentScene;

        const currentCamera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1200);
        currentCamera.position.set(0, 5, 22);
        cameraRef.current = currentCamera;

        const currentRenderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, powerPreference: "high-performance" });
        currentRenderer.setSize(window.innerWidth, window.innerHeight);
        currentRenderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        currentRenderer.setClearColor(0x000000);
        currentRenderer.outputColorSpace = THREE.SRGBColorSpace;
        rendererRef.current = currentRenderer;

        const createStarfield = (): THREE.Points => {
            const count: number = 3000;
            const positions: number[] = [];
            for (let i = 0; i < count; i++) {
                const r: number = THREE.MathUtils.randFloat(40, 120);
                const phi: number = Math.acos(Math.max(-1, Math.min(1, THREE.MathUtils.randFloatSpread(2))));
                const theta: number = THREE.MathUtils.randFloat(0, Math.PI * 2);
                
                const x = r * Math.sin(phi) * Math.cos(theta);
                const y = r * Math.sin(phi) * Math.sin(theta);
                const z = r * Math.cos(phi);
                
                positions.push(
                    isFinite(x) ? x : 0,
                    isFinite(y) ? y : 0,
                    isFinite(z) ? z : 0
                );
            }
            
            const validatedPositions = positions.map(val => isFinite(val) ? val : 0);
            
            if (validatedPositions.length > 0) {
                const geo = new THREE.BufferGeometry();
                geo.setAttribute('position', new THREE.Float32BufferAttribute(validatedPositions, 3));
                const mat = new THREE.PointsMaterial({
                    color: 0xffffff,
                    size: 0.15,
                    sizeAttenuation: true,
                    depthWrite: false,
                    opacity: 0.8,
                    transparent: true
                });
                return new THREE.Points(geo, mat);
            }
            
            const geo = new THREE.BufferGeometry();
            geo.setAttribute('position', new THREE.Float32BufferAttribute([0, 0, 0], 3));
            const mat = new THREE.PointsMaterial({
                color: 0x888888,
                size: 0.15,
                sizeAttenuation: true,
                depthWrite: false,
                opacity: 0.8,
                transparent: true
            });
            return new THREE.Points(geo, mat);
        };
        const starField = createStarfield();
        currentScene.add(starField);


        const currentControls = new OrbitControls(currentCamera, currentRenderer.domElement);
        currentControls.enableDamping = true;
        currentControls.dampingFactor = 0.05;
        currentControls.rotateSpeed = 0.5;
        currentControls.minDistance = 5;
        currentControls.maxDistance = 100;
        currentControls.autoRotate = true;
        currentControls.autoRotateSpeed = 0.15;
        currentControls.enablePan = false;
        controlsRef.current = currentControls;

        const currentComposer = new EffectComposer(currentRenderer);
        currentComposer.addPass(new RenderPass(currentScene, currentCamera));
        const bloomPass = new UnrealBloomPass(new THREE.Vector2(window.innerWidth, window.innerHeight), 1.5, 0.4, 0.68);
        currentComposer.addPass(bloomPass);
        const filmPass = new FilmPass(0.35, false);
        currentComposer.addPass(filmPass);
        currentComposer.addPass(new OutputPass());
        composerRef.current = currentComposer;

        pulseUniformsRef.current = {
            uTime: { value: 0.0 },
            uPulsePositions: { value: [new THREE.Vector3(1e3, 1e3, 1e3), new THREE.Vector3(1e3, 1e3, 1e3), new THREE.Vector3(1e3, 1e3, 1e3)] },
            uPulseTimes: { value: [-1e3, -1e3, -1e3] },
            uPulseColors: { value: [new THREE.Color(1, 1, 1), new THREE.Color(1, 1, 1), new THREE.Color(1, 1, 1)] },
            uPulseSpeed: { value: 15.0 },
            uBaseNodeSize: { value: 0.5 },
            uActivePalette: { value: 0 }
        };

        generateNeuralNetwork();

        animate(0);

        pulseIntervalIdRef.current = setInterval(processPulseQueue, 100);


        const handleResize = (): void => {
            if (currentCamera && currentRenderer && currentComposer) {
                currentCamera.aspect = window.innerWidth / window.innerHeight;
                currentCamera.updateProjectionMatrix();
                currentRenderer.setSize(window.innerWidth, window.innerHeight);
                currentComposer.setSize(window.innerWidth, window.innerHeight);
            }
        };
        window.addEventListener('resize', handleResize);

        const handleClick = (event: MouseEvent): void => {
            const mouse = new THREE.Vector2(
                (event.clientX / window.innerWidth) * 2 - 1,
                -(event.clientY / window.innerHeight) * 2 + 1
            );
            const raycaster = new THREE.Raycaster();
            raycaster.setFromCamera(mouse, currentCamera);

            const intersects = raycaster.intersectObjects(currentScene.children);

            if (intersects.length > 0) {
                const intersectionPoint = intersects[0].point;
                clickQueueRef.current.push({ position: intersectionPoint, color: colorPalettes.current[config.current.activePaletteIndex][0] });
            }
        };
        canvas.addEventListener('click', handleClick);

        const pausePlayBtn = document.getElementById('pause-play-btn') as HTMLButtonElement | null;
        const resetCamBtn = document.getElementById('reset-camera-btn') as HTMLButtonElement | null;
        const changeFormationBtn = document.getElementById('change-formation-btn') as HTMLButtonElement | null;
        const themeButtons = document.querySelectorAll('.theme-button') as NodeListOf<HTMLButtonElement>;
        const densitySlider = document.getElementById('density-slider') as HTMLInputElement | null;
        const densityValueSpan = document.getElementById('density-value') as HTMLSpanElement | null;

        const handlePausePlay = (): void => {
            config.current.paused = !config.current.paused;
            if (pausePlayBtn) pausePlayBtn.textContent = config.current.paused ? 'Play' : 'Pause';
            if (controlsRef.current) controlsRef.current.autoRotate = !config.current.paused;
        };

        const handleResetCamera = (): void => {
            if (controlsRef.current) {
                controlsRef.current.reset();
                controlsRef.current.autoRotate = true;
            }
        };

        const handleChangeFormation = (): void => {
            config.current.currentFormation = (config.current.currentFormation + 1) % config.current.numFormations;
            generateNeuralNetwork();
        };

        const handleThemeChange = (event: ReactMouseEvent<HTMLButtonElement>): void => {
            if (themeButtons) {
                themeButtons.forEach(btn => btn.classList.remove('active'));
            }
            event.currentTarget.classList.add('active');
            config.current.activePaletteIndex = parseInt(event.currentTarget.dataset.theme || '0', 10); 
            generateNeuralNetwork();
        };

        const handleDensityInput = (event: ChangeEvent<HTMLInputElement>): void => {
            const slider = event.target;
            if (densityValueSpan) {
                config.current.densityFactor = parseFloat(slider.value) / 100;
                densityValueSpan.textContent = `${slider.value}%`;
            }
        };

        const handleDensityChange = (): void => {
            generateNeuralNetwork();
        };

        if (pausePlayBtn) pausePlayBtn.addEventListener('click', handlePausePlay);
        if (resetCamBtn) resetCamBtn.addEventListener('click', handleResetCamera);
        if (changeFormationBtn) changeFormationBtn.addEventListener('click', handleChangeFormation);
        if (themeButtons) themeButtons.forEach(button => button.addEventListener('click', handleThemeChange as unknown as EventListener)); 
        if (densitySlider) {
            densitySlider.addEventListener('input', handleDensityInput as unknown as EventListener); 
            densitySlider.addEventListener('change', handleDensityChange as unknown as EventListener); 
        }

        const initialThemeButton = document.getElementById(`theme-${config.current.activePaletteIndex + 1}`) as HTMLButtonElement | null;
        if (initialThemeButton) {
            initialThemeButton.classList.add('active');
        }


        return () => {
            if (animationFrameIdRef.current) {
                cancelAnimationFrame(animationFrameIdRef.current);
            }
            if (pulseIntervalIdRef.current) {
                clearInterval(pulseIntervalIdRef.current);
            }
            window.removeEventListener('resize', handleResize);
            if (canvas) { 
                canvas.removeEventListener('click', handleClick);
            }
            if (currentRenderer) currentRenderer.dispose();
            if (currentScene) currentScene.clear();
            if (currentControls) currentControls.dispose();

            if (pausePlayBtn) pausePlayBtn.removeEventListener('click', handlePausePlay);
            if (resetCamBtn) resetCamBtn.removeEventListener('click', handleResetCamera);
            if (changeFormationBtn) changeFormationBtn.removeEventListener('click', handleChangeFormation);
            if (themeButtons) themeButtons.forEach(button => button.removeEventListener('click', handleThemeChange as unknown as EventListener));
            if (densitySlider) {
                densitySlider.removeEventListener('input', handleDensityInput as unknown as EventListener);
                densitySlider.removeEventListener('change', handleDensityChange as unknown as EventListener);
            }
        };
    }, [animate, generateNeuralNetwork, processPulseQueue]);


    return (
        <>
            <canvas ref={canvasRef} id="neural-network-canvas" className="w-full h-full block absolute top-0 left-0 z-0 min-w-full"></canvas>
            {isClient && ( 
                <>
                    <div id="instructions-container" className="ui-panel">
                        <div id="instruction-title">Interactive Neural Network</div>
                        <div>Click or tap to create energy pulses through the network. Drag to rotate.</div>
                    </div>

                    <div id="theme-selector" className="ui-panel">
                        <div id="theme-selector-title">Visual Theme</div>
                        <div className="theme-grid">
                            <button className="theme-button" id="theme-1" data-theme="0" aria-label="Theme 1"></button>
                            <button className="theme-button" id="theme-2" data-theme="1" aria-label="Theme 2"></button>
                            <button className="theme-button" id="theme-3" data-theme="2" aria-label="Theme 3"></button>
                            <button className="theme-button" id="theme-4" data-theme="3" aria-label="Theme 4"></button>
                        </div>
                        <div id="density-controls">
                            <div className="density-label"><span>Density</span><span id="density-value">100%</span></div>
                            <input type="range" min="20" max="100" defaultValue="100" className="density-slider" id="density-slider" aria-label="Network Density"/>
                        </div>
                    </div>

                    <div id="control-buttons">
                        <button id="change-formation-btn" className="control-button">Formation</button>
                        <button id="pause-play-btn" className="control-button">Pause</button>
                        <button id="reset-camera-btn" className="control-button">Reset Cam</button>
                    </div>
                </>
            )}
        </>
    );
};

export default NeuralNetworkBackground;