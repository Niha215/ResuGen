import { useState, useRef } from "react";
import "./index.css";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import ToastContainer from "./Toast";
import axios from "axios";

function ResumeBuilder({ setIsLoggedIn, existingData }) {
  const resumeRef = useRef();

  const [toasts, setToasts] = useState([]);

  const addToast = (message, type) => {
    const id = Date.now();

    setToasts((prev) => [
      ...prev,
      { id, message, type }
    ]);
  };

  const removeToast = (id) => {
    setToasts((prev) =>
      prev.filter((t) => t.id !== id)
    );
  };

  const [data, setData] = useState(
    existingData || {
      name: "",
      role: "",
      email: "",
      phone: "",
      linkedin: "",
      summary: "",
      skills: "",

      education: [
        {
          degree: "",
          college: "",
          start: "",
          end: "",
        },
      ],

      experience: [
        {
          role: "",
          company: "",
          start: "",
          end: "",
          description: "",
        },
      ],

      projects: [
        {
          name: "",
          description: "",
        },
      ],

      certifications: [""],
    }
  );

  const handleChange = (e) => {
    setData({
      ...data,
      [e.target.name]: e.target.value,
    });
  };

  const handleObjectChange = (
    index,
    field,
    key,
    value
  ) => {
    const updated = [...data[field]];

    updated[index][key] = value;

    setData({
      ...data,
      [field]: updated,
    });
  };

  const addObjectField = (field, template) => {
    setData({
      ...data,
      [field]: [...data[field], template],
    });
  };

  // SAVE / UPDATE
  const handleSave = async () => {
    localStorage.setItem(
      "resumeData",
      JSON.stringify(data)
    );

    try {

      // UPDATE
      if (data._id) {

        await axios.put(
          `http://localhost:5003/resumes/${data._id}`,
          data
        );

        addToast(
          "Resume Updated!",
          "success"
        );
      }

      // CREATE
      else {

        const res = await axios.post(
          "http://localhost:5003/save-resume",
          data
        );

        setData(res.data.data);

        addToast(
          "Resume Saved!",
          "success"
        );
      }

    } catch (error) {

      console.error(error);

      addToast(
        "MongoDB save failed",
        "error"
      );
    }
  };

  // DOWNLOAD PDF
  const handleDownload = async () => {

    const element = resumeRef.current;

    const canvas = await html2canvas(element, {
      useCORS: true,
      scale: 2,
      logging: false,
      windowWidth: element.scrollWidth,
      windowHeight: element.scrollHeight,
    });

    const imgData =
      canvas.toDataURL("image/png");

    const pdf = new jsPDF();

    const imgWidth = 210;

    const pageHeight =
      pdf.internal.pageSize.height;

    let imgHeight =
      (canvas.height * imgWidth) /
      canvas.width;

    let heightLeft = imgHeight;

    let position = 0;

    pdf.addImage(
      imgData,
      "PNG",
      0,
      position,
      imgWidth,
      imgHeight
    );

    heightLeft -= pageHeight;

    while (heightLeft > 0) {

      position = heightLeft - imgHeight;

      pdf.addPage();

      pdf.addImage(
        imgData,
        "PNG",
        0,
        position,
        imgWidth,
        imgHeight
      );

      heightLeft -= pageHeight;
    }

    pdf.save("resume.pdf");

    addToast(
      "Resume downloaded!",
      "success"
    );
  };

  const handleLogout = () => {

    localStorage.removeItem("isLoggedIn");

    setIsLoggedIn(false);

    addToast(
      "Logged out successfully!",
      "info"
    );
  };

  return (
    <>
      <ToastContainer
        toasts={toasts}
        removeToast={removeToast}
      />

      <div className="app">

        {/* FORM */}
        <div className="form">

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 20,
            }}
          >

            <h2 style={{ margin: 0 }}>
              Resume Builder
            </h2>

            <button
              className="logout-btn"
              onClick={handleLogout}
            >
              Logout
            </button>

          </div>

          {/* BASIC DETAILS */}

          <div className="input-group">
            <label>Full Name</label>

            <input
              name="name"
              value={data.name}
              onChange={handleChange}
            />
          </div>

          <div className="input-group">
            <label>Role</label>

            <input
              name="role"
              value={data.role}
              onChange={handleChange}
            />
          </div>

          <div className="input-group">
            <label>Email</label>

            <input
              name="email"
              value={data.email}
              onChange={handleChange}
            />
          </div>

          <div className="input-group">
            <label>Phone</label>

            <input
              name="phone"
              value={data.phone}
              onChange={handleChange}
            />
          </div>

          <div className="input-group">
            <label>LinkedIn</label>

            <input
              name="linkedin"
              value={data.linkedin}
              onChange={handleChange}
            />
          </div>

          <div className="input-group">
            <label>Summary</label>

            <textarea
              name="summary"
              value={data.summary}
              onChange={handleChange}
            />
          </div>

          <div className="input-group">
            <label>
              Skills (comma separated)
            </label>

            <textarea
              name="skills"
              value={data.skills}
              onChange={handleChange}
            />
          </div>

          {/* EDUCATION */}

          <h3>Education</h3>

          {data.education.map((edu, index) => (

            <div
              className="card"
              key={index}
            >

              <div className="input-group">
                <label>Degree</label>

                <input
                  value={edu.degree}
                  onChange={(e) =>
                    handleObjectChange(
                      index,
                      "education",
                      "degree",
                      e.target.value
                    )
                  }
                />
              </div>

              <div className="input-group">
                <label>College Name</label>

                <input
                  className="highlight"
                  value={edu.college}
                  onChange={(e) =>
                    handleObjectChange(
                      index,
                      "education",
                      "college",
                      e.target.value
                    )
                  }
                />
              </div>

              <div className="date-row">

                <div className="input-group">
                  <label>Start Date</label>

                  <input
                    type="month"
                    value={edu.start}
                    onChange={(e) =>
                      handleObjectChange(
                        index,
                        "education",
                        "start",
                        e.target.value
                      )
                    }
                  />
                </div>

                <div className="input-group">
                  <label>End Date</label>

                  <input
                    type="month"
                    value={edu.end}
                    onChange={(e) =>
                      handleObjectChange(
                        index,
                        "education",
                        "end",
                        e.target.value
                      )
                    }
                  />
                </div>

              </div>
            </div>
          ))}

          <button
            onClick={() =>
              addObjectField(
                "education",
                {
                  degree: "",
                  college: "",
                  start: "",
                  end: "",
                }
              )
            }
          >
            + Add Education
          </button>

          {/* EXPERIENCE */}

          <h3>Experience</h3>

          {data.experience.map((exp, index) => (

            <div
              className="card"
              key={index}
            >

              <div className="input-group">
                <label>Role</label>

                <input
                  value={exp.role}
                  onChange={(e) =>
                    handleObjectChange(
                      index,
                      "experience",
                      "role",
                      e.target.value
                    )
                  }
                />
              </div>

              <div className="input-group">
                <label>Company Name</label>

                <input
                  className="highlight"
                  value={exp.company}
                  onChange={(e) =>
                    handleObjectChange(
                      index,
                      "experience",
                      "company",
                      e.target.value
                    )
                  }
                />
              </div>

              <div className="date-row">

                <div className="input-group">
                  <label>Start Date</label>

                  <input
                    type="month"
                    value={exp.start}
                    onChange={(e) =>
                      handleObjectChange(
                        index,
                        "experience",
                        "start",
                        e.target.value
                      )
                    }
                  />
                </div>

                <div className="input-group">
                  <label>End Date</label>

                  <input
                    type="month"
                    value={exp.end}
                    onChange={(e) =>
                      handleObjectChange(
                        index,
                        "experience",
                        "end",
                        e.target.value
                      )
                    }
                  />
                </div>

              </div>

              <div className="input-group">
                <label>Description</label>

                <textarea
                  value={exp.description}
                  onChange={(e) =>
                    handleObjectChange(
                      index,
                      "experience",
                      "description",
                      e.target.value
                    )
                  }
                />
              </div>

            </div>
          ))}

          <button
            onClick={() =>
              addObjectField(
                "experience",
                {
                  role: "",
                  company: "",
                  start: "",
                  end: "",
                  description: "",
                }
              )
            }
          >
            + Add Experience
          </button>

          {/* PROJECTS */}

          <h3>Projects</h3>

          {data.projects.map((proj, index) => (

            <div
              className="card"
              key={index}
            >

              <div className="input-group">
                <label>Project Name</label>

                <input
                  className="highlight"
                  value={proj.name}
                  onChange={(e) =>
                    handleObjectChange(
                      index,
                      "projects",
                      "name",
                      e.target.value
                    )
                  }
                />
              </div>

              <div className="input-group">
                <label>Description</label>

                <textarea
                  value={proj.description}
                  onChange={(e) =>
                    handleObjectChange(
                      index,
                      "projects",
                      "description",
                      e.target.value
                    )
                  }
                />
              </div>

            </div>
          ))}

          <button
            onClick={() =>
              addObjectField(
                "projects",
                {
                  name: "",
                  description: "",
                }
              )
            }
          >
            + Add Project
          </button>

          {/* CERTIFICATIONS */}

          <h3>Certifications</h3>

          {data.certifications.map(
            (cert, index) => (

              <input
                key={index}
                placeholder="Certification"
                value={cert}
                onChange={(e) => {

                  const updated = [
                    ...data.certifications,
                  ];

                  updated[index] =
                    e.target.value;

                  setData({
                    ...data,
                    certifications: updated,
                  });
                }}
              />
            )
          )}

          <button
            onClick={() =>
              setData({
                ...data,
                certifications: [
                  ...data.certifications,
                  "",
                ],
              })
            }
          >
            + Add Certification
          </button>

          {/* BUTTONS */}

          <button
            className="save-btn"
            onClick={handleSave}
          >
            Save Resume
          </button>

          <button
            className="save-btn"
            onClick={handleDownload}
          >
            Download Resume
          </button>

          <button
            className="logout-btn"
            onClick={handleLogout}
          >
            Logout
          </button>

        </div>

        {/* PREVIEW */}

        <div
          className="preview"
          ref={resumeRef}
        >

          <h1>{data.name}</h1>

          <h3>{data.role}</h3>

          <p>
            {data.email} | {data.phone} |
            {" "}
            {data.linkedin}
          </p>

          <Section
            title="Summary"
            content={data.summary}
          />

          <SectionList
            title="Skills"
            items={data.skills.split(",")}
          />

          <Section
            title="Education"
            content=""
          >

            {data.education.map(
              (edu, i) => (

                <div
                  key={i}
                  className="resume-row"
                >

                  <div>
                    <b>{edu.college}</b>

                    <p>{edu.degree}</p>
                  </div>

                  <span className="date">
                    {edu.start} - {edu.end}
                  </span>

                </div>
              )
            )}

          </Section>

          <Section
            title="Experience"
            content=""
          >

            {data.experience.map(
              (exp, i) => (

                <div
                  key={i}
                  className="resume-row"
                >

                  <div>

                    <b>{exp.company}</b>

                    <p>{exp.role}</p>

                    <ul>

                      {exp.description
                        .split(".")
                        .map(
                          (d, idx) =>
                            d && (
                              <li key={idx}>
                                {d}
                              </li>
                            )
                        )}

                    </ul>

                  </div>

                  <span className="date">
                    {exp.start} - {exp.end}
                  </span>

                </div>
              )
            )}

          </Section>

          <Section
            title="Projects"
            content=""
          >

            {data.projects.map(
              (proj, i) => (

                <div key={i}>

                  <b>{proj.name}</b>

                  <ul>

                    {proj.description
                      .split(".")
                      .map(
                        (d, idx) =>
                          d && (
                            <li key={idx}>
                              {d}
                            </li>
                          )
                      )}

                  </ul>

                </div>
              )
            )}

          </Section>

          <SectionList
            title="Certifications"
            items={data.certifications}
          />

        </div>
      </div>
    </>
  );
}

function Section({
  title,
  content,
  children,
}) {

  if (!content && !children)
    return null;

  return (
    <div className="section">

      <div className="section-title">
        {title}
      </div>

      {content && <p>{content}</p>}

      {children}

    </div>
  );
}

function SectionList({
  title,
  items,
}) {

  if (!items || items.length === 0)
    return null;

  return (
    <div className="section">

      <div className="section-title">
        {title}
      </div>

      <ul>

        {items.map(
          (item, i) =>
            item && (
              <li key={i}>
                {item}
              </li>
            )
        )}

      </ul>

    </div>
  );
}

export default ResumeBuilder;