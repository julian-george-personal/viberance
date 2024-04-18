import { MeshPhongMaterial } from "three";

const LightOrb = ({ position, color, radius }: any) => {
  return (
    <mesh position={position}>
      <sphereGeometry args={[radius, 128, 128]} />
      <meshPhongMaterial color={color} />
    </mesh>
  );
};

export default LightOrb;
