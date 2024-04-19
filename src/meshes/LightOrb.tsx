import { MeshPhongMaterial } from "three";
import { animated } from "@react-spring/three";

const LightOrb = ({ position, color, radius }: any) => {
  return (
    <mesh position={position}>
      <sphereGeometry args={[radius, 128, 128]} />
      <animated.meshPhongMaterial color={color} />
    </mesh>
  );
};

export default LightOrb;
