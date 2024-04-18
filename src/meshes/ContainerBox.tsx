const ContainerBox = ({ scale }: any) => {
  return (
    <mesh>
      <boxGeometry args={[scale, scale, scale]} />
      <meshPhongMaterial color={"#111"} side={1} />
    </mesh>
  );
};

export default ContainerBox;
