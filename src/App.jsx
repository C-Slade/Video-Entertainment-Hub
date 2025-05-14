import "./styles/app.css";
import { Routes, Route } from "react-router-dom";
import Login from "./components/auth/login";
import { useApp } from "./context/AppContext";
import Main from "./components/main/main";
import { useEffect } from "react";
import SignUp from "./components/auth/signUp";
import { ToastError, ToastSuccess } from "./utils/toast.notifications";

const App = () => {
  const { user, toast } = useApp();

  return (
    <>
      <div className="app-container">
        <Routes>
          {user ? (
            <Route path="/main" element={<Main />} />
          ) : (
            <>
              <Route path="/" element={<Login />} />
              <Route path="/createAccount" element={<SignUp />} />
            </>
          )}
        </Routes>
        {toast.type === "error" && toast.show && (
          <ToastError message={toast.message} show={toast.show} />
        )}
        {toast.type === "success" && toast.show && (
          <ToastSuccess message={toast.message} show={toast.show} />
        )}
      </div>
    </>
  );
};

export default App;
