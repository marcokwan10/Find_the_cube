import React, { useEffect, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, softShadows, MeshWobbleMaterial, Html } from "@react-three/drei";
import "./style.css";
import { useSpring, a } from "@react-spring/three";
import { useControls } from "leva";

softShadows();
const answer = "lightGrey";

const SpinningMesh = ({ position, args, color, speed, set, html }) => {
	const mesh = useRef(null);
	const [expand, setExpand] = useState(false);
	const [hover, setHover] = useState(false);

	const props = useSpring({
		scale: expand ? [7, 7, 7] : hover ? [1.8, 1.8, 1.8] : [1, 1, 1],
		zIndex: expand ? 1000 : null,
	});

	useFrame(() => {
		mesh.current.rotation.x = mesh.current.rotation.y += 0.01;
	});

	const clickHandler = () => {
		if (color === answer) {
			setExpand(true);
		}
	};

	const resetHandler = () => {
		if (expand) {
			setExpand(false);
			set();
		}
	};

	return (
		<a.mesh
			castShadow
			ref={mesh}
			position={position}
			scale={props.scale}
			onPointerOver={() => setHover(true)}
			onPointerOut={() => setHover(false)}
			onClick={clickHandler}
			visibility="false"
		>
			<boxBufferGeometry attach="geometry" args={args} />
			<MeshWobbleMaterial attach="material" color={color} speed={speed} factor={0.3} />
			{expand && (
				<Html position={0.1} distanceFactor={55} className="html" as="div">
					<button onClick={resetHandler}>
						<h2>{html}</h2>
						<p>click here to reset</p>
					</button>
				</Html>
			)}
		</a.mesh>
	);
};

function App() {
	const colorArr = ["lightBlue", "pink", "yellow", "orange", "lightGreen"];
	const { difficulty } = useControls({ difficulty: { value: 30, min: 0, max: 350, step: 20 } });
	const randomVector = (r) => [r / 2 - Math.random() * r, r / 2 - Math.random() * r + r / 2, r / 2 - Math.random() * r];
	const randomEuler = () => [Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI];
	const randomData = Array.from({ length: difficulty }, (r = 20) => ({
		color: colorArr[Math.floor(Math.random() * 5)],
		position: randomVector(r),
		rotation: randomEuler(),
	}));
	const [render, setRender] = useState(false);

	return (
		<div className="app">
			<header>
				<span>React Three Fiber</span>
				<span>Find the white box</span>
			</header>
			<Canvas shadows colorManagement camera={{ position: [-25, 16, 15], fov: 90 }}>
				<ambientLight intensity={0.3} />
				<pointLight position={[-10, 0, -20]} intensity={0.5} />
				<pointLight position={[0, -10, 0]} intensity={0.2} />
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
					{randomData.map((item, i) => (
						<SpinningMesh
							position={item.position}
							rotation={item.rotation}
							args={[1, 1, 1]}
							color={i === 5 ? answer : item.color}
							speed={13}
							key={i}
							set={() => setTimeout(() => setRender(!render), 1000)}
							html={i === 5 && "YOU WON"}
						/>
					))}
				</group>
				<OrbitControls autoRotate autoRotateSpeed={1} />
			</Canvas>
		</div>
	);
}

export default App;
