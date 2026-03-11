'use client';

import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Sphere, Html } from '@react-three/drei';
import * as THREE from 'three';

interface DisasterMarker {
  id: string;
  lat: number;
  lng: number;
  type: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  emoji: string;
  name: string;
}

interface Globe3DProps {
  disasters: DisasterMarker[];
  onMarkerClick: (id: string) => void;
  selectedId?: string | null;
  visiblePins?: string[];
  droppingPins?: string[];
}

// Convert lat/lng to 3D coordinates on sphere
function latLngToVector3(lat: number, lng: number, radius: number) {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);

  const x = -(radius * Math.sin(phi) * Math.cos(theta));
  const z = radius * Math.sin(phi) * Math.sin(theta);
  const y = radius * Math.cos(phi);

  return new THREE.Vector3(x, y, z);
}

// Severity colors
const severityColors = {
  low: '#10b981',      // green
  medium: '#f59e0b',   // amber
  high: '#f97316',     // orange
  critical: '#dc2626'  // red
};

function DisasterMarker3D({
  disaster,
  onClick,
  isSelected,
  isVisible,
  isDropping
}: {
  disaster: DisasterMarker;
  onClick: () => void;
  isSelected: boolean;
  isVisible: boolean;
  isDropping: boolean;
}) {
  const markerRef = useRef<THREE.Mesh>(null);
  const groupRef = useRef<THREE.Group>(null);
  const ringRef = useRef<THREE.Mesh>(null);

  const position = useMemo(
    () => latLngToVector3(disaster.lat, disaster.lng, 2.0),
    [disaster.lat, disaster.lng]
  );

  // Calculate rotation to make marker perpendicular to Earth surface
  const rotation = useMemo(() => {
    const phi = (90 - disaster.lat) * (Math.PI / 180);
    const theta = (disaster.lng + 90) * (Math.PI / 180);
    return new THREE.Euler(phi, theta, 0, 'YXZ');
  }, [disaster.lat, disaster.lng]);

  // Pulsing animation for all markers + dropping animation
  useFrame((state) => {
    if (markerRef.current) {
      const scale = 1 + Math.sin(state.clock.elapsedTime * 2) * 0.15;
      markerRef.current.scale.setScalar(scale);
    }
    // Rotating ring animation
    if (ringRef.current) {
      ringRef.current.rotation.x += 0.02;
    }

    // Pin drop animation
    if (groupRef.current && isDropping) {
      const elapsed = state.clock.elapsedTime;
      const dropProgress = Math.min(elapsed * 0.8, 1);
      const bounce = Math.sin(dropProgress * Math.PI);
      groupRef.current.scale.setScalar(0.3 + dropProgress * 0.7 + bounce * 0.2);
    } else if (groupRef.current && isVisible) {
      groupRef.current.scale.setScalar(1);
    }
  });

  // Don't render if not visible
  if (!isVisible && !isDropping) {
    return null;
  }

  return (
    <group position={position} rotation={rotation} ref={groupRef}>
      {/* Base circle on Earth surface */}
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.08, 32]} />
        <meshBasicMaterial
          color={severityColors[disaster.severity]}
          transparent
          opacity={0.4}
        />
      </mesh>

      {/* Pulsing ring at base */}
      <mesh ref={ringRef} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.08, 0.1, 32]} />
        <meshBasicMaterial
          color={severityColors[disaster.severity]}
          transparent
          opacity={0.6}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Vertical pin/pole perpendicular to surface */}
      <mesh position={[0, 0.12, 0]}>
        <cylinderGeometry args={[0.01, 0.01, 0.24, 8]} />
        <meshStandardMaterial
          color={severityColors[disaster.severity]}
          emissive={severityColors[disaster.severity]}
          emissiveIntensity={0.5}
          metalness={0.6}
          roughness={0.3}
        />
      </mesh>

      {/* Marker sphere at top of pin */}
      <mesh ref={markerRef} onClick={onClick} position={[0, 0.24, 0]}>
        <sphereGeometry args={[0.05, 16, 16]} />
        <meshStandardMaterial
          color={severityColors[disaster.severity]}
          emissive={severityColors[disaster.severity]}
          emissiveIntensity={isSelected ? 1.0 : 0.6}
          metalness={0.4}
          roughness={0.3}
        />
      </mesh>

      {/* Emoji label above marker */}
      <Html
        position={[0, 0.35, 0]}
        center
        distanceFactor={1.2}
        style={{
          pointerEvents: 'none',
          userSelect: 'none',
          fontSize: '28px',
          filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.8))',
          textShadow: '0 0 10px rgba(255,255,255,0.5)'
        }}
      >
        {disaster.emoji}
      </Html>

      {/* Location name label */}
      <Html
        position={[0, -0.08, 0]}
        center
        distanceFactor={2.5}
        style={{
          pointerEvents: 'none',
          userSelect: 'none',
          fontSize: '9px',
          color: '#ffffff',
          background: 'rgba(0,0,0,0.75)',
          padding: '2px 6px',
          borderRadius: '3px',
          whiteSpace: 'nowrap',
          fontWeight: 'bold',
          border: `1px solid ${severityColors[disaster.severity]}`,
          boxShadow: `0 0 8px ${severityColors[disaster.severity]}40`
        }}
      >
        {disaster.name}
      </Html>

      {/* Glow effect when selected */}
      {isSelected && (
        <>
          <mesh position={[0, 0.24, 0]}>
            <sphereGeometry args={[0.1, 16, 16]} />
            <meshBasicMaterial
              color={severityColors[disaster.severity]}
              transparent
              opacity={0.4}
            />
          </mesh>
          <pointLight
            position={[0, 0.24, 0]}
            intensity={2.5}
            color={severityColors[disaster.severity]}
            distance={0.8}
          />
        </>
      )}
    </group>
  );
}

function Earth({ disasters, onMarkerClick, selectedId, visiblePins = [], droppingPins = [] }: Globe3DProps) {
  const earthRef = useRef<THREE.Mesh>(null);
  const markersGroupRef = useRef<THREE.Group>(null);

  // Smooth auto-rotate the globe and markers together
  useFrame(() => {
    if (earthRef.current) {
      earthRef.current.rotation.y += 0.0008; // Slightly slower for more professional look
    }
    // Rotate markers with the Earth
    if (markersGroupRef.current) {
      markersGroupRef.current.rotation.y += 0.0008;
    }
  });

  // Load real NASA Earth texture from CDN
  const earthTexture = useMemo(() => {
    if (typeof window === 'undefined') return null;

    try {
      const loader = new THREE.TextureLoader();
      // Using NASA's Blue Marble Earth texture (high-quality satellite imagery)
      const texture = loader.load(
        'https://unpkg.com/three-globe@2.31.0/example/img/earth-blue-marble.jpg',
        undefined,
        undefined,
        (error) => {
          console.error('Error loading Earth texture:', error);
        }
      );
      texture.colorSpace = THREE.SRGBColorSpace;
      return texture;
    } catch (error) {
      console.error('Error creating earth texture:', error);
      return null;
    }
  }, []);

  // Load real Earth bump/elevation map
  const bumpMap = useMemo(() => {
    if (typeof window === 'undefined') return null;

    try {
      const loader = new THREE.TextureLoader();
      // Using real Earth topography/elevation data
      const texture = loader.load(
        'https://unpkg.com/three-globe@2.31.0/example/img/earth-topology.png',
        undefined,
        undefined,
        (error) => {
          console.error('Error loading bump map:', error);
        }
      );
      return texture;
    } catch (error) {
      console.error('Error creating bump map:', error);
      return null;
    }
  }, []);

  // Load night lights texture for the dark side of Earth
  const nightTexture = useMemo(() => {
    if (typeof window === 'undefined') return null;

    try {
      const loader = new THREE.TextureLoader();
      // City lights visible on night side
      const texture = loader.load(
        'https://unpkg.com/three-globe@2.31.0/example/img/earth-night.jpg',
        undefined,
        undefined,
        (error) => {
          console.error('Error loading night texture:', error);
        }
      );
      texture.colorSpace = THREE.SRGBColorSpace;
      return texture;
    } catch (error) {
      console.error('Error creating night texture:', error);
      return null;
    }
  }, []);

  return (
    <>
      {/* Earth sphere with real NASA satellite textures */}
      <Sphere ref={earthRef} args={[2, 256, 256]} castShadow receiveShadow>
        <meshStandardMaterial
          map={earthTexture || undefined}
          bumpMap={bumpMap || undefined}
          bumpScale={0.02}
          emissiveMap={nightTexture || undefined}
          emissive="#ffffff"
          emissiveIntensity={0.2}
          color={earthTexture ? undefined : '#1e3a8a'}
          roughness={0.95}
          metalness={0.0}
        />
      </Sphere>

      {/* Disaster markers - grouped to rotate with Earth */}
      <group ref={markersGroupRef}>
        {disasters.map((disaster) => (
          <DisasterMarker3D
            key={disaster.id}
            disaster={disaster}
            onClick={() => onMarkerClick(disaster.id)}
            isSelected={selectedId === disaster.id}
            isVisible={visiblePins.includes(disaster.id)}
            isDropping={droppingPins.includes(disaster.id)}
          />
        ))}
      </group>
    </>
  );
}

export default function Globe3D({ disasters, onMarkerClick, selectedId, visiblePins = [], droppingPins = [] }: Globe3DProps) {
  // Check if we're in the browser
  if (typeof window === 'undefined') {
    return (
      <div className="w-full h-[389px] bg-gradient-to-br from-gray-700 via-gray-800 to-gray-900 rounded-sm flex items-center justify-center">
        <p className="text-white text-sm">Loading...</p>
      </div>
    );
  }

  try {
    return (
      <div style={{ width: '100%', height: '454px', background: '#000000' }}>
        <Canvas
          camera={{ position: [0, 0, 5.5], fov: 50 }}
          gl={{
            antialias: true,
            alpha: false,
            powerPreference: 'high-performance',
            toneMapping: THREE.NoToneMapping,
            toneMappingExposure: 1.0
          }}
          onCreated={(state) => {
            try {
              state.gl.setClearColor('#000000', 1);
              state.gl.shadowMap.enabled = true;
              state.gl.shadowMap.type = THREE.PCFSoftShadowMap;
            } catch (e) {
              console.warn('Could not configure renderer:', e);
            }
          }}
        >
          {/* Realistic Sun Lighting Setup */}
          {/* Low ambient light - space is dark */}
          <ambientLight intensity={0.2} color="#ffffff" />

          {/* Bright Sun Core - Pure White */}
          <mesh position={[10, 3, 5]}>
            <sphereGeometry args={[0.6, 32, 32]} />
            <meshBasicMaterial
              color="#FFFFFF"
              toneMapped={false}
            />
          </mesh>

          {/* Sun Inner Glow - Bright Yellow */}
          <mesh position={[10, 3, 5]}>
            <sphereGeometry args={[1.0, 32, 32]} />
            <meshBasicMaterial
              color="#FFFF00"
              transparent
              opacity={0.7}
              toneMapped={false}
            />
          </mesh>

          {/* Sun Middle Glow - Golden */}
          <mesh position={[10, 3, 5]}>
            <sphereGeometry args={[1.5, 32, 32]} />
            <meshBasicMaterial
              color="#FFD700"
              transparent
              opacity={0.5}
              toneMapped={false}
            />
          </mesh>

          {/* Sun Outer Corona - Orange */}
          <mesh position={[10, 3, 5]}>
            <sphereGeometry args={[2.2, 32, 32]} />
            <meshBasicMaterial
              color="#FFA500"
              transparent
              opacity={0.25}
              toneMapped={false}
            />
          </mesh>

          {/* Sun Extreme Outer Glow - Soft Orange */}
          <mesh position={[10, 3, 5]}>
            <sphereGeometry args={[3.0, 32, 32]} />
            <meshBasicMaterial
              color="#FF8C00"
              transparent
              opacity={0.1}
              toneMapped={false}
            />
          </mesh>

          {/* Bright Point Light from Sun */}
          <pointLight
            position={[10, 3, 5]}
            intensity={8.0}
            color="#FFF5E1"
            distance={40}
            decay={1.5}
          />

          {/* Main Sun - strong directional light from the sun position */}
          <directionalLight
            position={[10, 3, 5]}
            intensity={4.5}
            color="#fffaf0"
            castShadow
            shadow-mapSize-width={2048}
            shadow-mapSize-height={2048}
            shadow-camera-far={50}
            shadow-camera-left={-10}
            shadow-camera-right={10}
            shadow-camera-top={10}
            shadow-camera-bottom={-10}
          />

          {/* Very subtle fill light from opposite side */}
          <directionalLight
            position={[-8, -2, -3]}
            intensity={0.15}
            color="#1e293b"
          />

          {/* Earth and markers */}
          <Earth
            disasters={disasters}
            onMarkerClick={onMarkerClick}
            selectedId={selectedId}
            visiblePins={visiblePins}
            droppingPins={droppingPins}
          />

          {/* Enhanced Controls */}
          <OrbitControls
            enableZoom={true}
            enablePan={false}
            minDistance={3.5}
            maxDistance={10}
            autoRotate={false}
            rotateSpeed={0.6}
            zoomSpeed={0.8}
            enableDamping={true}
            dampingFactor={0.05}
            minPolarAngle={Math.PI / 6}
            maxPolarAngle={Math.PI - Math.PI / 6}
          />

          {/* Enhanced Stars background */}
          <Stars />
        </Canvas>
      </div>
    );
  } catch (error) {
    console.error('Globe3D Error:', error);
    return (
      <div className="w-full h-[454px] bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 rounded-sm flex items-center justify-center border border-gray-700">
        <div className="text-center p-6">
          <div className="text-red-400 text-4xl mb-4">⚠️</div>
          <p className="text-white text-sm font-semibold mb-2">Unable to load 3D Globe</p>
          <p className="text-gray-400 text-xs">WebGL may not be supported on this device</p>
          <p className="text-gray-500 text-xs mt-3 max-w-md">{String(error)}</p>
        </div>
      </div>
    );
  }
}

// Enhanced stars component with varying sizes and subtle twinkling
function Stars() {
  const starsRef = useRef<THREE.Points>(null);

  const geometry = useMemo(() => {
    const count = 2000; // More stars for a richer sky
    const positions = new Float32Array(count * 3);
    const sizes = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      const radius = 60 + Math.random() * 80;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI;

      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = radius * Math.cos(phi);

      // Varying star sizes for depth
      sizes[i] = Math.random() * 0.15 + 0.05;
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geo.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

    return geo;
  }, []);

  // Subtle twinkling effect
  useFrame((state) => {
    if (starsRef.current) {
      const material = starsRef.current.material as THREE.PointsMaterial;
      material.opacity = 0.7 + Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
    }
  });

  return (
    <points ref={starsRef} geometry={geometry}>
      <pointsMaterial
        size={0.12}
        color="#ffffff"
        transparent
        opacity={0.8}
        sizeAttenuation={true}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

