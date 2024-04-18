import { MeshPhongMaterial } from "three";

const LightOrb = ({ position, color }: any) => {
  return (
    <mesh position={position}>
      <sphereGeometry args={[1]} />
      <meshPhongMaterial color={color} />
    </mesh>
  );
};

export default LightOrb;
