'use client';

import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Sphere, Box, Cone, Cylinder, Text, RoundedBox } from '@react-three/drei';
import * as THREE from 'three';

interface BCPSimulation3DProps {
  currentPhase: number;
  isRunning: boolean;
}

// Phase 1: Activation - Communication Tower with Signal Waves
function ActivationVisualization({ isActive, isCompleted }: { isActive: boolean; isCompleted: boolean }) {
  const waveRefs = useRef<THREE.Mesh[]>([]);
  
  useFrame((state) => {
    if (isActive) {
      waveRefs.current.forEach((wave, i) => {
        if (wave && !Array.isArray(wave.material)) {
          const scale = 1 + Math.sin(state.clock.elapsedTime * 2 - i * 0.5) * 0.3;
          wave.scale.set(scale, scale, scale);
          wave.material.opacity = 0.5 - (scale - 1) * 0.5;
        }
      });
    }
  });

  const color = isCompleted ? '#10b981' : isActive ? '#3b82f6' : '#6b7280';

  return (
    <group position={[-4, 2, 0]}>
      <Cylinder args={[0.1, 0.2, 1.5, 8]} position={[0, 0, 0]}>
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={isActive ? 0.5 : 0.2} />
      </Cylinder>
      <Cone args={[0.3, 0.4, 4]} position={[0, 1, 0]}>
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={isActive ? 0.6 : 0.2} />
      </Cone>
      
      {isActive && [0, 1, 2].map((i) => (
        <mesh
          key={i}
          ref={(el) => { if (el) waveRefs.current[i] = el; }}
          rotation={[Math.PI / 2, 0, 0]}
          position={[0, 0.8, 0]}
        >
          <torusGeometry args={[0.5 + i * 0.3, 0.03, 16, 32]} />
          <meshStandardMaterial color="#3b82f6" emissive="#3b82f6" emissiveIntensity={0.8} transparent opacity={0.5} />
        </mesh>
      ))}
      
      <Text position={[0, -1.2, 0]} fontSize={0.2} color="white" anchorX="center">ACTIVATION</Text>
    </group>
  );
}

// Phase 2: Assessment - Scanning Radar with Data Points
function AssessmentVisualization({ isActive, isCompleted }: { isActive: boolean; isCompleted: boolean }) {
  const radarRef = useRef<THREE.Mesh>(null);
  const dataPointsRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (radarRef.current && isActive) radarRef.current.rotation.z += 0.05;
    if (dataPointsRef.current && isActive) dataPointsRef.current.rotation.y += 0.02;
  });

  const color = isCompleted ? '#10b981' : isActive ? '#8b5cf6' : '#6b7280';

  return (
    <group position={[-2, -2, 0]}>
      <Cylinder args={[0.8, 0.8, 0.1, 32]} rotation={[0, 0, 0]}>
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={isActive ? 0.4 : 0.2} metalness={0.8} />
      </Cylinder>
      
      {isActive && (
        <mesh ref={radarRef} position={[0, 0.1, 0]}>
          <coneGeometry args={[0.8, 0.05, 32, 1, true]} />
          <meshStandardMaterial color="#8b5cf6" emissive="#8b5cf6" emissiveIntensity={0.8} transparent opacity={0.4} side={THREE.DoubleSide} />
        </mesh>
      )}
      
      <group ref={dataPointsRef} position={[0, 0.5, 0]}>
        {[0, 1, 2, 3, 4].map((i) => (
          <Sphere key={i} args={[0.08]} position={[Math.cos((i / 5) * Math.PI * 2) * 0.6, 0, Math.sin((i / 5) * Math.PI * 2) * 0.6]}>
            <meshStandardMaterial color={isActive ? '#8b5cf6' : '#6b7280'} emissive={isActive ? '#8b5cf6' : '#000000'} emissiveIntensity={isActive ? 0.8 : 0} />
          </Sphere>
        ))}
      </group>
      
      <Text position={[0, -1.2, 0]} fontSize={0.2} color="white" anchorX="center">ASSESSMENT</Text>
    </group>
  );
}

// Phase 3: Response - Multiple Systems Activating
function ResponseVisualization({ isActive, isCompleted }: { isActive: boolean; isCompleted: boolean }) {
  const systemRefs = useRef<THREE.Mesh[]>([]);
  
  useFrame((state) => {
    if (isActive) {
      systemRefs.current.forEach((system, i) => {
        if (system) system.position.y = Math.sin(state.clock.elapsedTime * 2 + i) * 0.1;
      });
    }
  });

  const color = isCompleted ? '#10b981' : isActive ? '#f97316' : '#6b7280';

  return (
    <group position={[2, -2, 0]}>
      {[0, 1, 2].map((i) => (
        <RoundedBox key={i} ref={(el) => { if (el) systemRefs.current[i] = el; }} args={[0.4, 0.6, 0.4]} position={[(i - 1) * 0.6, 0, 0]} radius={0.05}>
          <meshStandardMaterial color={color} emissive={color} emissiveIntensity={isActive ? 0.5 : 0.2} />
        </RoundedBox>
      ))}
      
      {isActive && [0, 1, 2].map((i) => (
        <mesh key={`conn-${i}`} position={[(i - 1) * 0.6, 0.5, 0]}>
          <cylinderGeometry args={[0.02, 0.02, 0.3, 8]} />
          <meshStandardMaterial color="#f97316" emissive="#f97316" emissiveIntensity={0.8} />
        </mesh>
      ))}
      
      <Text position={[0, -1.2, 0]} fontSize={0.2} color="white" anchorX="center">RESPONSE</Text>
    </group>
  );
}

// Phase 4: Recovery - Building/Facility Restoration
function RecoveryVisualization({ isActive, isCompleted }: { isActive: boolean; isCompleted: boolean }) {
  const layersRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (layersRef.current && isActive) {
      layersRef.current.children.forEach((child, i) => {
        child.position.y = i * 0.3 + Math.sin(state.clock.elapsedTime * 2 + i) * 0.05;
      });
    }
  });

  const color = isCompleted ? '#10b981' : isActive ? '#10b981' : '#6b7280';

  return (
    <group position={[4, 2, 0]}>
      <group ref={layersRef}>
        {[0, 1, 2].map((i) => (
          <Box key={i} args={[1, 0.2, 1]} position={[0, i * 0.3, 0]}>
            <meshStandardMaterial color={color} emissive={color} emissiveIntensity={isActive ? 0.4 : 0.2} />
          </Box>
        ))}
      </group>
      <Text position={[0, -1.2, 0]} fontSize={0.2} color="white" anchorX="center">RECOVERY</Text>
    </group>
  );
}

// Phase 5: Validation - Checklist with Checkmarks
function ValidationVisualization({ isActive, isCompleted }: { isActive: boolean; isCompleted: boolean }) {
  const checkmarksRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (checkmarksRef.current && isActive) {
      checkmarksRef.current.rotation.y = Math.sin(state.clock.elapsedTime) * 0.2;
    }
  });

  const color = isCompleted ? '#10b981' : isActive ? '#14b8a6' : '#6b7280';

  return (
    <group position={[0, 0, 0]}>
      <group ref={checkmarksRef}>
        {[0, 1, 2, 3].map((i) => (
          <group key={i} position={[0, 0.6 - i * 0.4, 0]}>
            <Box args={[0.8, 0.15, 0.1]}>
              <meshStandardMaterial color={color} emissive={color} emissiveIntensity={isActive ? 0.4 : 0.2} />
            </Box>
            {isActive && (
              <Sphere args={[0.08]} position={[-0.3, 0, 0.1]}>
                <meshStandardMaterial color="#14b8a6" emissive="#14b8a6" emissiveIntensity={0.8} />
              </Sphere>
            )}
          </group>
        ))}
      </group>
      <Text position={[0, -1.2, 0]} fontSize={0.2} color="white" anchorX="center">VALIDATION</Text>
    </group>
  );
}

// Connection Lines between phases
function ConnectionLines({ currentPhase }: { currentPhase: number }) {
  const positions: [number, number, number][] = [
    [-4, 2, 0],   // Activation
    [-2, -2, 0],  // Assessment
    [2, -2, 0],   // Response
    [4, 2, 0],    // Recovery
    [0, 0, 0],    // Validation
  ];

  return (
    <>
      {positions.map((pos, i) => {
        if (i < positions.length - 1) {
          const nextPos = positions[i + 1];
          const isActive = currentPhase > i;
          const points = [new THREE.Vector3(...pos), new THREE.Vector3(...nextPos)];
          const geometry = new THREE.BufferGeometry().setFromPoints(points);

          return (
            <primitive key={i} object={new THREE.Line(geometry, new THREE.LineBasicMaterial({
              color: isActive ? '#14b8a6' : '#4b5563',
              linewidth: 2,
              transparent: true,
              opacity: isActive ? 1 : 0.3
            }))} />
          );
        }
        return null;
      })}
    </>
  );
}

export default function BCPSimulation3D({ currentPhase, isRunning }: BCPSimulation3DProps) {
  return (
    <div className="w-full h-[600px] bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-sm">
      <Canvas camera={{ position: [0, 0, 12], fov: 50 }}>
        <ambientLight intensity={0.4} />
        <directionalLight position={[5, 5, 5]} intensity={1} />
        <pointLight position={[-5, -5, -5]} intensity={0.5} color="#14b8a6" />
        <hemisphereLight intensity={0.3} groundColor="#1f2937" />

        <ActivationVisualization isActive={currentPhase === 0} isCompleted={currentPhase > 0} />
        <AssessmentVisualization isActive={currentPhase === 1} isCompleted={currentPhase > 1} />
        <ResponseVisualization isActive={currentPhase === 2} isCompleted={currentPhase > 2} />
        <RecoveryVisualization isActive={currentPhase === 3} isCompleted={currentPhase > 3} />
        <ValidationVisualization isActive={currentPhase === 4} isCompleted={currentPhase > 4} />

        <ConnectionLines currentPhase={currentPhase} />

        <gridHelper args={[15, 15, '#374151', '#1f2937']} position={[0, -3, 0]} />

        <OrbitControls
          enableZoom={true}
          enablePan={true}
          minDistance={8}
          maxDistance={20}
          autoRotate={isRunning}
          autoRotateSpeed={0.5}
        />
      </Canvas>
    </div>
  );
}
