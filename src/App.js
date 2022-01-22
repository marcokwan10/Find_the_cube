import React, { useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, softShadows, MeshWobbleMaterial } from "@react-three/drei";
import "./style.css";
import { useSpring, a } from "@react-spring/three";

softShadows();

const SpinningMesh = ({ position, args, color, speed }) => {
	const mesh = useRef(null);
	const [expand, setExpand] = useState(false);
	const [hover, setHover] = useState(false);

	const props = useSpring({
		scale: expand ? [2, 2, 2] : hover ? [1.2, 1.2, 1.2] : [1, 1, 1],
	});

	useFrame(() => {
		mesh.current.rotation.x = mesh.current.rotation.y += 0.01;
	});
	return (
		<a.mesh
			castShadow
			ref={mesh}
			position={position}
			scale={props.scale}
			onPointerOver={() => setHover(true)}
			onPointerOut={() => setHover(false)}
			onClick={() => setExpand(!expand)}
		>
			<boxBufferGeometry attach="geometry" args={args} />
			<MeshWobbleMaterial attach="material" color={color} speed={speed} factor={0.3} />
		</a.mesh>
	);
};

function App() {
	return (
		<div className="app">
			<Canvas shadows colorManagement camera={{ position: [-5, 6, 7], fov: 60 }}>
				<ambientLight intensity={0.3} />
				<pointLight position={[-10, 0, -20]} intensity={0.5} />
				<pointLight position={[0, -10, 0]} intensity={1.5} />
				<directionalLight
					castShadow
					position={[0, 10, 0]}
					intensity={1.5}
					shadow-mapSize-width={1024}
					shadow-mapSize-height={1024}
					shadow-camera-far={50}
					shadow-camera-left={-10}
					shadow-camera-right={10}
					shadow-camera-top={10}
					shadow-camera-bottom={-10}
				/>
				<group>
					<mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, -3, 0]}>
						<planeBufferGeometry attach="geometry" args={[100, 100]} />
						<shadowMaterial attach="material" opacity={0.3} />
					</mesh>
					<SpinningMesh position={[-2, 1, -5]} args={[1, 2, 1]} color="pink" speed={10} />
					<SpinningMesh position={[0, 1, 0]} args={[3, 2, 1]} color="lightblue" speed={13} />
					<SpinningMesh position={[5, 1, -2]} args={[1, 2, 2]} color="pink" speed={8} />
					<SpinningMesh position={[3, 1, -7]} args={[3, 1, 2]} color="yellow" speed={8} />
				</group>
				<OrbitControls />
			</Canvas>
		</div>
	);
}

export default App;
