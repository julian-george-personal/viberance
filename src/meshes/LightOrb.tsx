import React from "react";
import { animated, SpringValue } from "@react-spring/three";

const LightOrb: React.FC<{
  position: number[];
  radius: number;
  animatedColorProps: { color: SpringValue<string> };
}> = ({ position, radius, animatedColorProps }: any) => {
  return (
    <mesh position={position}>
      <sphereGeometry args={[radius, 128, 128]} />
      <animated.meshStandardMaterial
        emissive={animatedColorProps.color}
        emissiveIntensity={0.5}
        // transparent
        // opacity={1}
        color={animatedColorProps.color}
      />
    </mesh>
  );
};

export default LightOrb;
