
import { useMemo, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import * as THREE from 'three'

const bloomColors = {
  Amazing: {
    core: '#f8a8d8',
    petal: '#f36aaf',
    glow: '#ff8fc7',
    ring: '#ec69b0',
    speed: 1.2,
    openness: 1
  },
  Good: {
    core: '#a7e8ca',
    petal: '#65c99d',
    glow: '#83e9b9',
    ring: '#58c69c',
    speed: 0.9,
    openness: 0.9
  },
  Okay: {
    core: '#d2bafa',
    petal: '#a78ae8',
    glow: '#bca0ff',
    ring: '#a183e3',
    speed: 0.7,
    openness: 0.75
  },
  Low: {
    core: '#acd9ff',
    petal: '#70afe8',
    glow: '#8dcaff',
    ring: '#6ba8e4',
    speed: 0.5,
    openness: 0.6
  },
  Stressed: {
    core: '#ffb5a9',
    petal: '#f28e82',
    glow: '#ff9b91',
    ring: '#ed817b',
    speed: 0.55,
    openness: 0.65
  },
  Default: {
    core: '#edc0e3',
    petal: '#d48ac5',
    glow: '#f0a7d6',
    ring: '#df86bc',
    speed: 0.75,
    openness: 0.8
  }
}

function useBloomPalette(mood, animate) {
  const target = bloomColors[mood] || bloomColors.Default

  const palette = useRef({
    core: new THREE.Color(target.core),
    petal: new THREE.Color(target.petal),
    glow: new THREE.Color(target.glow),
    ring: new THREE.Color(target.ring),
    speed: target.speed,
    openness: target.openness
  })

  useFrame((state, delta) => {
    const factor = animate
      ? 1 - Math.exp(-3.2 * delta)
      : 1

    palette.current.core.lerp(
      new THREE.Color(target.core),
      factor
    )

    palette.current.petal.lerp(
      new THREE.Color(target.petal),
      factor
    )

    palette.current.glow.lerp(
      new THREE.Color(target.glow),
      factor
    )

    palette.current.ring.lerp(
      new THREE.Color(target.ring),
      factor
    )

    palette.current.speed = THREE.MathUtils.lerp(
      palette.current.speed,
      target.speed,
      factor
    )

    palette.current.openness = THREE.MathUtils.lerp(
      palette.current.openness,
      target.openness,
      factor
    )
  })

  return palette
}

function Petal({
  index,
  total,
  layer,
  palette,
  animate,
  pulse
}) {
  const petalRef = useRef()
  const materialRef = useRef()

  const inner = layer === 0
  const angle = (index / total) * Math.PI * 2

  useFrame((state, delta) => {
    if (!petalRef.current) return

    const colors = palette.current
    const time = state.clock.elapsedTime

    const breathing = animate
      ? Math.sin(
          time * colors.speed * 1.4 + index * 0.2
        ) * 0.07
      : 0

    const opening =
      colors.openness * 0.55 +
      breathing +
      pulse.current * 0.35

    petalRef.current.rotation.x = THREE.MathUtils.damp(
      petalRef.current.rotation.x,
      opening,
      5,
      delta
    )

    const scale = 1 + pulse.current * 0.15

    petalRef.current.scale.setScalar(
      THREE.MathUtils.damp(
        petalRef.current.scale.x,
        scale,
        5,
        delta
      )
    )

    if (materialRef.current) {
      materialRef.current.color.copy(colors.petal)
      materialRef.current.emissive.copy(colors.glow)
    }
  })

  return (
    <group rotation={[0, 0, angle]}>
      <group
        ref={petalRef}
        position={[
          0,
          inner ? 0.72 : 0.9,
          inner ? 0.05 : -0.15
        ]}
      >
        <mesh
          position={[0, inner ? 0.38 : 0.48, 0]}
          scale={[
            inner ? 0.4 : 0.48,
            inner ? 0.76 : 0.92,
            0.12
          ]}
        >
          <sphereGeometry args={[1, 24, 24]} />

          <meshPhysicalMaterial
            ref={materialRef}
            color={palette.current.petal}
            emissive={palette.current.glow}
            emissiveIntensity={0.12}
            transparent
            opacity={inner ? 0.68 : 0.43}
            side={THREE.DoubleSide}
            depthWrite={false}
            roughness={0.3}
            metalness={0.05}
            clearcoat={0.7}
          />
        </mesh>
      </group>
    </group>
  )
}

function BloomFlower({ palette, animate, pulse }) {
  const flowerRef = useRef()

  useFrame((state, delta) => {
    if (!flowerRef.current) return

    if (animate) {
      flowerRef.current.rotation.y += delta * 0.06
      flowerRef.current.rotation.z += delta * 0.018
    }
  })

  return (
    <group ref={flowerRef}>
      {Array.from({ length: 7 }, (_, index) => (
        <Petal
          key={`inner-${index}`}
          index={index}
          total={7}
          layer={0}
          palette={palette}
          animate={animate}
          pulse={pulse}
        />
      ))}

      {Array.from({ length: 9 }, (_, index) => (
        <Petal
          key={`outer-${index}`}
          index={index}
          total={9}
          layer={1}
          palette={palette}
          animate={animate}
          pulse={pulse}
        />
      ))}
    </group>
  )
}

function BloomCore({
  palette,
  animate,
  pulse,
  onBloom
}) {
  const coreRef = useRef()
  const coreMaterial = useRef()
  const glowMaterial = useRef()
  const lightRef = useRef()

  useFrame((state, delta) => {
    const colors = palette.current
    const time = state.clock.elapsedTime

    const breathing = animate
      ? Math.sin(
          time * colors.speed * 1.5
        ) * 0.04
      : 0

    const targetScale =
      1 + breathing + pulse.current * 0.16

    if (coreRef.current) {
      coreRef.current.scale.setScalar(
        THREE.MathUtils.damp(
          coreRef.current.scale.x,
          targetScale,
          5,
          delta
        )
      )
    }

    if (coreMaterial.current) {
      coreMaterial.current.color.copy(colors.core)
      coreMaterial.current.emissive.copy(colors.glow)
    }

    if (glowMaterial.current) {
      glowMaterial.current.color.copy(colors.glow)
      glowMaterial.current.opacity =
        0.14 + pulse.current * 0.3
    }

    if (lightRef.current) {
      lightRef.current.color.copy(colors.glow)
    }
  })

  return (
    <group ref={coreRef}>
      <mesh scale={1.25}>
        <sphereGeometry args={[0.78, 48, 48]} />

        <meshBasicMaterial
          ref={glowMaterial}
          color={palette.current.glow}
          transparent
          opacity={0.14}
          depthWrite={false}
        />
      </mesh>

      <mesh onClick={onBloom}>
        <sphereGeometry args={[0.76, 48, 48]} />

        <meshPhysicalMaterial
          ref={coreMaterial}
          color={palette.current.core}
          emissive={palette.current.glow}
          emissiveIntensity={0.22}
          metalness={0.08}
          roughness={0.16}
          clearcoat={1}
          clearcoatRoughness={0.1}
          transparent
          opacity={0.97}
        />
      </mesh>

      <mesh position={[-0.18, 0.22, 0.69]}>
        <sphereGeometry args={[0.09, 16, 16]} />

        <meshBasicMaterial
          color="#ffffff"
          transparent
          opacity={0.75}
        />
      </mesh>

      <pointLight
        ref={lightRef}
        color={palette.current.glow}
        intensity={1.8}
        distance={4}
      />
    </group>
  )
}

function OrbitalRings({ palette, animate }) {
  const ringsRef = useRef()
  const ringMaterial = useRef()
  const outerMaterial = useRef()

  useFrame((state, delta) => {
    if (ringsRef.current && animate) {
      ringsRef.current.rotation.y += delta * 0.13
      ringsRef.current.rotation.z += delta * 0.035
    }

    if (ringMaterial.current) {
      ringMaterial.current.color.copy(
        palette.current.ring
      )
    }

    if (outerMaterial.current) {
      outerMaterial.current.color.copy(
        palette.current.glow
      )
    }
  })

  return (
    <group ref={ringsRef}>
      <mesh rotation={[Math.PI / 3, 0, 0]}>
        <torusGeometry args={[1.72, 0.022, 16, 128]} />

        <meshBasicMaterial
          ref={ringMaterial}
          color={palette.current.ring}
          transparent
          opacity={0.85}
          toneMapped={false}
          depthWrite={false}
        />
      </mesh>

      <mesh rotation={[0, Math.PI / 3, Math.PI / 4]}>
        <torusGeometry args={[1.88, 0.014, 16, 128]} />

        <meshBasicMaterial
          color="#ffffff"
          transparent
          opacity={0.65}
          depthWrite={false}
        />
      </mesh>

      <mesh rotation={[Math.PI / 5, 0, Math.PI / 6]}>
        <torusGeometry args={[2.02, 0.008, 12, 128]} />

        <meshBasicMaterial
          ref={outerMaterial}
          color={palette.current.glow}
          transparent
          opacity={0.6}
          depthWrite={false}
        />
      </mesh>
    </group>
  )
}

function BloomParticles({ palette, animate }) {
  const groupRef = useRef()
  const materialsRef = useRef([])

  // Deterministic particle generation.
  // This preserves the scattered effect without Math.random().
  const particles = useMemo(() => {
    const fraction = (value) =>
      value - Math.floor(value)

    return Array.from({ length: 70 }, (_, index) => {
      const angle =
        fraction(index * 0.61803398875) *
        Math.PI * 2

      const radius =
        2 + fraction(index * 0.754877666) * 1.1

      const height =
        (fraction(index * 0.569840291) - 0.5) * 3.4

      const size =
        0.008 +
        fraction(index * 0.438579021) * 0.014

      return {
        position: [
          Math.cos(angle) * radius,
          height,
          Math.sin(angle) * radius
        ],
        size
      }
    })
  }, [])

  useFrame((state, delta) => {
    if (groupRef.current && animate) {
      groupRef.current.rotation.y += delta * 0.04
    }

    materialsRef.current.forEach((material, index) => {
      if (!material || index % 3 === 0) return

      material.color.copy(palette.current.glow)
    })
  })

  return (
    <group ref={groupRef}>
      {particles.map((particle, index) => (
        <mesh key={index} position={particle.position}>
          <sphereGeometry args={[particle.size, 8, 8]} />

          <meshBasicMaterial
            ref={(material) => {
              materialsRef.current[index] = material
            }}
            color={
              index % 3 === 0
                ? '#ffffff'
                : palette.current.glow
            }
            toneMapped={false}
          />
        </mesh>
      ))}
    </group>
  )
}

function BloomScene({ mood, animate }) {
  const palette = useBloomPalette(mood, animate)
  const pulse = useRef(0)
  const sceneLight = useRef()

  useFrame((state, delta) => {
    pulse.current = animate
      ? Math.max(0, pulse.current - delta * 1.2)
      : 0

    if (sceneLight.current) {
      sceneLight.current.color.copy(
        palette.current.glow
      )
    }
  })

  function triggerBloom(event) {
    event.stopPropagation()
    if (!animate) return

    pulse.current = 1
  }

  return (
    <group>
      <BloomFlower
        palette={palette}
        animate={animate}
        pulse={pulse}
      />

      <BloomCore
        palette={palette}
        animate={animate}
        pulse={pulse}
        onBloom={triggerBloom}
      />

      <OrbitalRings
        palette={palette}
        animate={animate}
      />

      <BloomParticles
        palette={palette}
        animate={animate}
      />

      <pointLight
        ref={sceneLight}
        position={[-2, 2, 3]}
        color={palette.current.glow}
        intensity={1.5}
        distance={7}
      />
    </group>
  )
}

export default function Hologram({
  mood = '',
  animate = true
}) {
  return (
    <div className="hologram-scene">
      <Canvas
        camera={{
          position: [0, 0, 6.5],
          fov: 45
        }}
        gl={{
          alpha: true,
          antialias: true
        }}
      >
        <ambientLight intensity={1.25} />

        <directionalLight
          position={[3, 4, 5]}
          intensity={1.6}
        />

        <BloomScene mood={mood} animate={animate} />

        <OrbitControls
          enableZoom={false}
          enablePan={false}
          enableDamping={animate}
        />
      </Canvas>
    </div>
  )
}
