const ContainerBox = (props: any) => {
  return (
    <mesh {...props}>
      <boxGeometry args={[20, 20, 20]} />
      <meshStandardMaterial color={"black"} side={1} />
    </mesh>
  );
};

export default ContainerBox;
