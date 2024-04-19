import { MeshPhongMaterial } from "three";
import { animated, useSpring } from "@react-spring/three";

const LightOrb = ({ position, color, radius }: any) => {
  const animatedColor = useSpring({ color: "blue" });

  return (
    <mesh position={position}>
      <sphereGeometry args={[radius, 128, 128]} />
      <animated.meshLambertMaterial
        emissive={color}
        color={color}
        reflectivity={50}
      />
    </mesh>
  );
};

export default LightOrb;
