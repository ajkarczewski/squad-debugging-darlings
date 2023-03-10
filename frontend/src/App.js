import "./App.css";
import { useState } from "react";
import { LoginModal } from "./Components/LoginModal";
import { SignupModal } from "./Components/SignupModal";
import { Routes, Route } from "react-router-dom";
import ProgressBarForm from "./Components/ProgressBarForm";

const App = () => {
  const [alertMsg, setAlertMsg] = useState("");

  return (
    <div>
      <Routes>
        <Route
          path="/signup"
          element={<SignupModal />}
        />
        <Route
          path="/login"
          element={
            <LoginModal
              alertMsg={alertMsg}
              setAlertMsg={setAlertMsg}
            />
          }
        />
        <Route path="/setup-profile" element={<ProgressBarForm />} />
      </Routes>
    </div>
  );
};

export default App;
