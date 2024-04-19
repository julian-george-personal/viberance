const ContainerBox = ({ scale }: any) => {
  return (
    <mesh>
      <boxGeometry args={[scale, scale, scale]} />
      <meshPhongMaterial color="white" side={1} />
    </mesh>
  );
};

export default ContainerBox;
