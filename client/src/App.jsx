import { useState, useEffect } from "react";
import Login from "./Login";
import ResumeBuilder from "./ResumeBuilder";
import Dashboard from "./Dashboard";

function App() {

  // LOGIN STATE
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // DASHBOARD / BUILDER
  const [showDashboard, setShowDashboard] = useState(true);

  // EDIT RESUME DATA
  const [selectedResume, setSelectedResume] = useState(null);

  // SAVE LOGIN STATUS
  useEffect(() => {
    localStorage.setItem(
      "isLoggedIn",
      isLoggedIn ? "true" : "false"
    );
  }, [isLoggedIn]);

  return (
    <>
      {
        isLoggedIn ? (

          <div>

            {/* TOP NAV */}
            <div
              style={{
                padding: "20px",
                display: "flex",
                gap: "10px",
                background: "#f4f4f4",
              }}
            >

              <button
                onClick={() => {
                  setShowDashboard(true);
                }}
              >
                Dashboard
              </button>

              <button
                onClick={() => {
                  setSelectedResume(null);
                  setShowDashboard(false);
                }}
              >
                Create Resume
              </button>

            </div>

            {/* PAGES */}
            {
              showDashboard ? (

                <Dashboard
                  onEditResume={(resume) => {
                    setSelectedResume(resume);
                    setShowDashboard(false);
                  }}
                />

              ) : (

                <ResumeBuilder
                  setIsLoggedIn={setIsLoggedIn}
                  existingData={selectedResume}
                />

              )
            }

          </div>

        ) : (

          <Login setIsLoggedIn={setIsLoggedIn} />

        )
      }
    </>
  );
}

export default App;