import { useState, useEffect } from "react";
import Login from "./Login";
import ResumeBuilder from "./ResumeBuilder";


function App() {
  // Always start with login page
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    localStorage.setItem("isLoggedIn", isLoggedIn ? "true" : "false");
  }, [isLoggedIn]);

  return (
    <>
      {isLoggedIn ? (
        <ResumeBuilder setIsLoggedIn={setIsLoggedIn} />
      ) : (
        <Login setIsLoggedIn={setIsLoggedIn} />
      )}
    </>
  );
}

export default App;