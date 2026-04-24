import { useState, useRef } from "react";
import "./index.css";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

function App() {
  const resumeRef = useRef();

  // NEW STATE FOR PAGE SWITCH
  const [showBuilder, setShowBuilder] = useState(false);

  const [data, setData] = useState({
    name: "",
    role: "",
    email: "",
    phone: "",
    linkedin: "",
    summary: "",
    skills: "",

    education: [{ degree: "", college: "", start: "", end: "" }],
    experience: [{ role: "", company: "", start: "", end: "", description: "" }],
    projects: [{ name: "", description: "" }],
    certifications: [""],
  });

  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const handleObjectChange = (index, field, key, value) => {
    const updated = [...data[field]];
    updated[index][key] = value;
    setData({ ...data, [field]: updated });
  };

  const addObjectField = (field, template) => {
    setData({ ...data, [field]: [...data[field], template] });
  };

  const handleSave = () => {
    localStorage.setItem("resumeData", JSON.stringify(data));
    alert("Saved locally!");
  };

  const handleDownload = async () => {
    const element = resumeRef.current;

    const canvas = await html2canvas(element);
    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF();
    const imgWidth = 210;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
    pdf.save("resume.pdf");
  };

  // LANDING PAGE
  if (!showBuilder) {
    return (
      <div
        style={{
          height: "100vh",
          backgroundImage:
            "url('https://images.unsplash.com/photo-1521737604893-d14cc237f11d')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          color: "white",
          textAlign: "center",
        }}
      >
        <h1 style={{ fontSize: "3rem", marginBottom: "20px" }}>
          Resume Builder App
        </h1>

        <p style={{ marginBottom: "30px", fontSize: "1.2rem" }}>
          Create professional resumes in minutes 🚀
        </p>

        <button
          onClick={() => setShowBuilder(true)}
          style={{
            padding: "12px 24px",
            fontSize: "16px",
            border: "none",
            borderRadius: "8px",
            backgroundColor: "#4CAF50",
            color: "white",
            cursor: "pointer",
          }}
        >
          Create Resume
        </button>
      </div>
    );
  }

  return (
    <div className="app">
      {/* FORM */}
      <div className="form">
        <h2>Resume Builder</h2>

        <button onClick={() => setShowBuilder(false)}>
          ← Back to Home
        </button>

        <div className="input-group">
          <label>Full Name</label>
          <input name="name" onChange={handleChange} />
        </div>

        <div className="input-group">
          <label>Role</label>
          <input name="role" onChange={handleChange} />
        </div>

        <div className="input-group">
          <label>Email</label>
          <input name="email" onChange={handleChange} />
        </div>

        <div className="input-group">
          <label>Phone</label>
          <input name="phone" onChange={handleChange} />
        </div>

        <div className="input-group">
          <label>LinkedIn</label>
          <input name="linkedin" onChange={handleChange} />
        </div>

        <div className="input-group">
          <label>Summary</label>
          <textarea name="summary" onChange={handleChange}></textarea>
        </div>

        <div className="input-group">
          <label>Skills (comma separated)</label>
          <textarea name="skills" onChange={handleChange}></textarea>
        </div>

        {/* EDUCATION */}
        <h3>Education</h3>
        {data.education.map((edu, index) => (
          <div className="card" key={index}>
            <div className="input-group">
              <label>Degree</label>
              <input onChange={(e) =>
                handleObjectChange(index, "education", "degree", e.target.value)
              } />
            </div>

            <div className="input-group">
              <label>College Name</label>
              <input
                className="highlight"
                onChange={(e) =>
                  handleObjectChange(index, "education", "college", e.target.value)
                }
              />
            </div>

            <div className="date-row">
              <div className="input-group">
                <label>Start Date</label>
                <input type="month"
                  onChange={(e) =>
                    handleObjectChange(index, "education", "start", e.target.value)
                  }
                />
              </div>

              <div className="input-group">
                <label>End Date</label>
                <input type="month"
                  onChange={(e) =>
                    handleObjectChange(index, "education", "end", e.target.value)
                  }
                />
              </div>
            </div>
          </div>
        ))}
        <button onClick={() => addObjectField("education", { degree: "", college: "", start: "", end: "" })}>
          + Add Education
        </button>

        {/* EXPERIENCE */}
        <h3>Experience</h3>
        {data.experience.map((exp, index) => (
          <div className="card" key={index}>
            <div className="input-group">
              <label>Role</label>
              <input
                onChange={(e) =>
                  handleObjectChange(index, "experience", "role", e.target.value)
                }
              />
            </div>

            <div className="input-group">
              <label>Company Name</label>
              <input
                className="highlight"
                onChange={(e) =>
                  handleObjectChange(index, "experience", "company", e.target.value)
                }
              />
            </div>

            <div className="date-row">
              <div className="input-group">
                <label>Start Date</label>
                <input type="month"
                  onChange={(e) =>
                    handleObjectChange(index, "experience", "start", e.target.value)
                  }
                />
              </div>

              <div className="input-group">
                <label>End Date</label>
                <input type="month"
                  onChange={(e) =>
                    handleObjectChange(index, "experience", "end", e.target.value)
                  }
                />
              </div>
            </div>

            <div className="input-group">
              <label>Description</label>
              <textarea
                onChange={(e) =>
                  handleObjectChange(index, "experience", "description", e.target.value)
                }
              />
            </div>
          </div>
        ))}
        <button onClick={() => addObjectField("experience", { role: "", company: "", start: "", end: "", description: "" })}>
          + Add Experience
        </button>

        {/* PROJECTS */}
        <h3>Projects</h3>
        {data.projects.map((proj, index) => (
          <div className="card" key={index}>
            <div className="input-group">
              <label>Project Name</label>
              <input
                className="highlight"
                onChange={(e) =>
                  handleObjectChange(index, "projects", "name", e.target.value)
                }
              />
            </div>

            <div className="input-group">
              <label>Description</label>
              <textarea
                onChange={(e) =>
                  handleObjectChange(index, "projects", "description", e.target.value)
                }
              />
            </div>
          </div>
        ))}
        <button onClick={() => addObjectField("projects", { name: "", description: "" })}>
          + Add Project
        </button>

        {/* CERTIFICATIONS */}
        <h3>Certifications</h3>
        {data.certifications.map((cert, index) => (
          <input
            key={index}
            placeholder="Certification"
            onChange={(e) => {
              const updated = [...data.certifications];
              updated[index] = e.target.value;
              setData({ ...data, certifications: updated });
            }}
          />
        ))}
        <button onClick={() => setData({ ...data, certifications: [...data.certifications, ""] })}>
          + Add Certification
        </button>

        {/* ❌ Save button removed */}

        <button className="save-btn" onClick={handleDownload}>
          Download Resume
        </button>
      </div>

      {/* PREVIEW */}
      <div className="preview" ref={resumeRef}>
        <h1>{data.name}</h1>
        <h3>{data.role}</h3>

        <p>{data.email} | {data.phone} | {data.linkedin}</p>

        <Section title="Summary" content={data.summary} />
        <SectionList title="Skills" items={data.skills.split(",")} />

        <Section title="Education">
          {data.education.map((edu, i) => (
            <div key={i} className="resume-row">
              <div>
                <b>{edu.college}</b>
                <p>{edu.degree}</p>
              </div>
              <span className="date">{edu.start} - {edu.end}</span>
            </div>
          ))}
        </Section>

        <Section title="Experience">
          {data.experience.map((exp, i) => (
            <div key={i} className="resume-row">
              <div>
                <b>{exp.company}</b>
                <p>{exp.role}</p>
                <ul>
                  {exp.description.split(".").map((d, idx) => d && <li key={idx}>{d}</li>)}
                </ul>
              </div>
              <span className="date">{exp.start} - {exp.end}</span>
            </div>
          ))}
        </Section>

        <Section title="Projects">
          {data.projects.map((proj, i) => (
            <div key={i}>
              <b>{proj.name}</b>
              <ul>
                {proj.description.split(".").map((d, idx) => d && <li key={idx}>{d}</li>)}
              </ul>
            </div>
          ))}
        </Section>

        <SectionList title="Certifications" items={data.certifications} />
      </div>
    </div>
  );
}

function Section({ title, content, children }) {
  if (!content && !children) return null;
  return (
    <div className="section">
      <div className="section-title">{title}</div>
      {content && <p>{content}</p>}
      {children}
    </div>
  );
}

function SectionList({ title, items }) {
  if (!items || items.length === 0) return null;

  return (
    <div className="section">
      <div className="section-title">{title}</div>
      <ul>
        {items.map((item, i) => item && <li key={i}>{item}</li>)}
      </ul>
    </div>
  );
}

export default App;