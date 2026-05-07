import { useEffect, useState } from "react";
import axios from "axios";
import "./Dashboard.css";

function Dashboard({ onEditResume }) {

  const [resumes, setResumes] = useState([]);

  // FETCH ALL RESUMES
  const fetchResumes = async () => {

    try {

      const res = await axios.get(
        "http://localhost:5003/resumes"
      );

      setResumes(res.data);

    } catch (err) {

      console.error(err);

    }
  };

  useEffect(() => {

    fetchResumes();

  }, []);

  // DELETE RESUME
  const handleDelete = async (id) => {

    try {

      await axios.delete(
        `http://localhost:5003/resumes/${id}`
      );

      setResumes((prev) =>
        prev.filter((r) => r._id !== id)
      );

    } catch (err) {

      console.error(err);

    }
  };

  return (

    <div className="dashboard">

      <h1>Saved Resumes</h1>

      <div className="resume-grid">

        {resumes.map((resume) => (

          <div
            className="resume-card"
            key={resume._id}
          >

            <h2>{resume.name}</h2>

            <p>{resume.role}</p>

            <p>{resume.email}</p>

            <div className="card-buttons">

              <button
                className="edit-btn"
                onClick={() =>
                  onEditResume(resume)
                }
              >
                Edit
              </button>

              <button
                className="delete-btn"
                onClick={() =>
                  handleDelete(resume._id)
                }
              >
                Delete
              </button>

            </div>

          </div>

        ))}

      </div>

    </div>
  );
}

export default Dashboard;