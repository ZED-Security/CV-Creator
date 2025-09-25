import React, { useRef, useState } from "react";
import { useCV } from "../context/cvContext";
import html2pdf from "html2pdf.js";

export default function Show() {
  const { cvData } = useCV();
  const componentRef = useRef();
  const [fileName, setFileName] = useState("");

  const handleDownload = () => {
    const element = componentRef.current;

    const opt = {
      margin: 0, // No margin in PDF output
      filename: (fileName.trim() || `${cvData.personal?.name || "My"}_CV`) + ".pdf",
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: {
        scale: 1,      // Lower scale for smaller image size
        useCORS: true, // Optional: if you have images
      },
      jsPDF: {
        unit: 'in',
        format: 'letter',
        orientation: 'portrait'
      },
      pagebreak: {
        mode: ['avoid-all', 'css', 'legacy']
      }
    };

    html2pdf().set(opt).from(element).save();
  };

  return (
    <div className="cv-show">
      <h2>Show CV</h2>

      <div className="btn-show" style={{ marginBottom: "1rem" }}>
        <input
          type="text"
          placeholder="Enter file name..."
          value={fileName}
          onChange={(e) => setFileName(e.target.value)}
          style={{ marginRight: "0.5rem" }}
        />
        <button onClick={handleDownload}>Download PDF</button>
      </div>

      <div className="show">
        <div className="cv-preview" ref={componentRef}>
          {cvData.personal && (
            <>
              <p className="p-fullname">{cvData.personal?.name}</p>
              <p className="p-contact">
                {[cvData.personal?.phone, cvData.personal?.email]
                  .filter(Boolean)
                  .join(" | ")}

                {cvData.personal?.github && (
                  <>
                    {" | "}
                    <a
                      href={`https://github.com/${cvData.personal.github.replace(/^https?:\/\/(www\.)?github\.com\//, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {cvData.personal?.github}
                    </a>
                  </>
                )}

                {cvData.personal?.linkedin && (
                  <>
                    {" | "}
                    <a
                      href={`https://linkedin.com/in/${cvData.personal.linkedin.replace(/^https?:\/\/(www\.)?linkedin\.com\/in\//, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {cvData.personal?.linkedin}
                    </a>
                  </>
                )}
              </p>
              <hr />
            </>
          )}

          {cvData.summary && (
            <>
              <section>
                <p className="p-title">SUMMARY</p>
                <p className="p-summary">{cvData.summary}</p>
              </section>
              <hr />
            </>
          )}

          {cvData.experience?.length > 0 && (
            <>
              <section>
                <p className="p-title">EXPERIENCE</p>
                {cvData.experience.map((exp, idx) => (
                  <div key={idx} style={{ marginBottom: "0.3rem" }}>
                    <p className="p-exp">{exp.jobTitle} • {exp.company} • {exp.startDate} - {exp.endDate}</p>
                    {/* <p className="p-experience">{exp.description}</p> */}
                    <ul>
                      {exp.description
                      .split('\n')
                      .filter(line => line.trim() !== "")
                      .map((desc, index) => (
                        <li key={index}>{desc}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </section>
              <hr />
            </>
          )}

          {cvData.projects?.length > 0 && (
            <>
              <section>
                <p className="p-title">PROJECTS</p>
                {cvData.projects.map((proj, idx) => (
                  <div key={idx} style={{ marginBottom: "0.3rem" }}>
                    <p className="p-pro">{proj.name} • {proj.link && (
                      <a href={proj.link} target="_blank" rel="noopener noreferrer">
                        {proj.link}
                      </a>
                    )} • {proj.startDate && proj.endDate && (<span>{proj.startDate} - {proj.endDate}</span>)}</p>
                    <p className="p-project">{proj.description}</p>
                  </div>
                ))}
              </section>
              <hr />
            </>
          )}

          {cvData.education?.length > 0 && (
            <>
              <section>
                <p className="p-title">EDUCATION</p>
                {cvData.education.map((edu, idx) => (
                  <div key={idx} style={{ marginBottom: "0.3rem" }}>
                    <p className="p-edu">{edu.degree}</p>
                    <p className="p-education">{edu.university} • {edu.startDate} - {edu.endDate} • {edu.gpa || "N/A"}</p>
                  </div>
                ))}
              </section>
              <hr />
            </>
          )}

          {cvData?.skills?.length > 0 && (
            <section>
              <p className="p-title">SKILLS</p>
              <ul>
                {cvData.skills
                .split('\n')
                .filter(line => line.trim() !== "")
                .map((skill, index) => (
                  <li key={index}>{skill}</li>
                ))}
              </ul>
            </section>
          )}

        </div>
      </div>
    </div>
  );
}
