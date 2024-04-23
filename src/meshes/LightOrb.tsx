import React from "react";
import { MeshPhongMaterial } from "three";
import { animated, useSpring, SpringValue } from "@react-spring/three";

const LightOrb: React.FC<{
  position: number[];
  radius: number;
  animatedColorProps: { color: SpringValue<string> };
}> = ({ position, radius, animatedColorProps }: any) => {
  return (
    <mesh position={position} castShadow receiveShadow>
      <sphereGeometry args={[radius, 128, 128]} />
      <meshStandardMaterial reflectivity={50} {...animatedColorProps} />
    </mesh>
  );
};

export default LightOrb;
