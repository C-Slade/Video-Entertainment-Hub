import { useApp } from "../../context/appContext";

const Main = () => {
  const { handleSignOut } = useApp();
  return (
    <>
      <h1>Main</h1>
      <button onClick={handleSignOut}>Signout</button>
    </>
  );
};

export default Main;
