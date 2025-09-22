import React, { useState, useEffect } from 'react';
import { useCV } from '../context/cvContext';
import { v4 as uuidv4 } from 'uuid';


const Person = () => {
  const { cvData, updatePersonal } = useCV();

  // Local state for form fields
  const [personalInfo, setPersonalInfo] = useState({
    name: '', email: '', phone: '', github: '', linkedin: ''
  });

  useEffect(() => {
    if (cvData.personal) {
      setPersonalInfo(cvData.personal);
    }
  }, [cvData.personal]);

  // Update field value
  const handlePersonalChange = (e) => {
    const { name, value } = e.target;
    setPersonalInfo(prev => ({ ...prev, [name]: value }));
  };

  // Save to context (after validating)
  const handleSavePersonal = () => {
    const hasEmpty = Object.entries(personalInfo).some(([_, value]) => !value.trim());
    if (hasEmpty) {
      alert('Please fill in all personal information fields.');
      return;
    }

    Object.entries(personalInfo).forEach(([field, value]) => {
      updatePersonal(field, value);
    });
  };

  // Clear fields
  const handleClearPersonal = () => {
    const cleared = { name: '', email: '', phone: '', github: '', linkedin: '' };
    setPersonalInfo(cleared);
    Object.keys(cleared).forEach(field => updatePersonal(field, ''));
  };

  return (
    <section className="section contact">
      <h3>Personal Information</h3>
      {['name', 'email', 'phone', 'github', 'linkedin'].map((field) => (
        <input
          key={field}
          type={field === 'email' ? 'email' : 'text'}
          name={field}
          placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
          value={personalInfo[field] || ''}
          onChange={handlePersonalChange}
        />
      ))}
      <div className="btn-contact">
        <button onClick={handleSavePersonal}>Save</button>
        <button onClick={handleClearPersonal}>Clear</button>
      </div>
    </section>
  );
};

const Summary = () => {
  const { cvData, updateSummary } = useCV();

  // Update summary as user types
  const handleSummaryChange = (e) => {
    updateSummary(e.target.value);
  };

  // Clear the summary field
  const handleClearSummary = () => {
    updateSummary('');
  };

  return (
    <section className="section">
      <h3>Summary</h3>
      <textarea
        placeholder="Write a brief summary about yourself"
        value={cvData.summary || ''}
        onChange={handleSummaryChange}
      />
      <div className="btn-contact">
        <button disabled>Save</button> {/* Save is disabled because it saves onChange */}
        <button onClick={handleClearSummary}>Clear</button>
      </div>
    </section>
  );
};

const Experience = () => {
  const { cvData, updateExperience } = useCV();

  const [experienceEntry, setExperienceEntry] = useState({
    id: null,
    company: '',
    jobTitle: '',
    startDate: '',
    endDate: '',
    description: '',
  });

  const handleExperienceChange = (e) => {
    const { name, value } = e.target;
    setExperienceEntry((prev) => ({ ...prev, [name]: value }));
  };

  const isValid = () => {
    const { startDate, endDate } = experienceEntry;

    const allFieldsFilled = Object.entries(experienceEntry)
      .filter(([key]) => key !== 'id')
      .every(([_, val]) => val.trim() !== '');

    if (!allFieldsFilled) {
      alert('Please fill in all fields before saving experience.');
      return false;
    }

    if (new Date(startDate) > new Date(endDate)) {
      alert('Start date cannot be after end date.');
      return false;
    }

    return true;
  };

  const saveExperience = () => {
    if (!isValid()) return;

    if (experienceEntry.id) {
      const updated = cvData.experience.map((exp) =>
        exp.id === experienceEntry.id ? experienceEntry : exp
      );
      updateExperience(updated);
    } else {
      const newExperience = { ...experienceEntry, id: uuidv4() };
      updateExperience([...cvData.experience, newExperience]);
    }

    handleClearExperience();
  };

  const deleteExperience = (id) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this experience?');
    if (!confirmDelete) return;

    const filtered = cvData.experience.filter((exp) => exp.id !== id);
    updateExperience(filtered);

    if (experienceEntry.id === id) {
      handleClearExperience();
    }
  };

  const editExperience = (exp) => {
    // Clone the object to avoid mutating original state
    setExperienceEntry({ ...exp });
  };

  const handleClearExperience = () => {
    setExperienceEntry({
      id: null,
      company: '',
      jobTitle: '',
      startDate: '',
      endDate: '',
      description: '',
    });
  };

  return (
    <section className="section experience">
      <h3>Experience</h3>

      <input
        type="text"
        name="company"
        placeholder="Company Name"
        value={experienceEntry.company}
        onChange={handleExperienceChange}
      />

      <input
        type="text"
        name="jobTitle"
        placeholder="Job Title"
        value={experienceEntry.jobTitle}
        onChange={handleExperienceChange}
      />

      <div style={{ display: 'flex', gap: '10px' }}>
        <input
          type="month"
          name="startDate"
          value={experienceEntry.startDate}
          onChange={handleExperienceChange}
        />
        <input
          type="month"
          name="endDate"
          value={experienceEntry.endDate}
          onChange={handleExperienceChange}
        />
      </div>

      <textarea
        name="description"
        placeholder="Job description"
        value={experienceEntry.description}
        onChange={handleExperienceChange}
        rows={4}
      />

      <div className="btn-contact" style={{ marginTop: '10px' }}>
        <button onClick={saveExperience}>
          {experienceEntry.id ? 'Update Experience' : 'Add Experience'}
        </button>
        <button onClick={handleClearExperience} style={{ marginLeft: '10px' }}>
          Clear
        </button>
      </div>

      <ul style={{ marginTop: '20px' }}>
        {cvData.experience.length === 0 && <li>No experience added yet.</li>}
        {cvData.experience.map((exp) => (
          <li key={exp.id} style={{ marginBottom: '1em' }}>
            <strong>{exp.company}</strong> — {exp.jobTitle} ({exp.startDate} to {exp.endDate})<br />
            {exp.description}
            <div style={{ marginTop: '5px' }}>
              <button onClick={() => editExperience(exp)} style={{ marginRight: '10px' }}>
                Edit
              </button>
              <button onClick={() => deleteExperience(exp.id)}>Delete</button>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
};

const Projects = () => {
  const { cvData, updateProjects } = useCV();

  const [projectEntry, setProjectEntry] = useState({
    id: null,
    name: '',
    startDate: '',
    endDate: '',
    link: '',
    description: '',
  });

  const handleProjectChange = (e) => {
    const { name, value } = e.target;
    setProjectEntry((prev) => ({ ...prev, [name]: value }));
  };

  const isValid = () => {
    const { name, startDate, endDate, link, description } = projectEntry;

    if (!name.trim() || !startDate || !endDate || !link.trim() || !description.trim()) {
      return false;
    }

    try {
      new URL(link);
    } catch {
      return false;
    }

    if (new Date(startDate) > new Date(endDate)) {
      return false;
    }

    return true;
  };

  const saveProject = () => {
    if (!isValid()) {
      alert('Please fill in all fields with valid data before saving the project.');
      return;
    }

    if (projectEntry.id) {
      const updated = cvData.projects.map((proj) =>
        proj.id === projectEntry.id ? projectEntry : proj
      );
      updateProjects(updated);
    } else {
      const newProject = { ...projectEntry, id: uuidv4() };
      updateProjects([...cvData.projects, newProject]);
    }

    handleClearProject();
  };

  const handleEditProject = (id) => {
    const project = cvData.projects.find((proj) => proj.id === id);
    if (project) {
      setProjectEntry({ ...project }); // clone to avoid direct mutation
    }
  };

  const handleDeleteProject = (id) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this project?');
    if (!confirmDelete) return;

    const filtered = cvData.projects.filter((proj) => proj.id !== id);
    updateProjects(filtered);

    if (projectEntry.id === id) {
      handleClearProject();
    }
  };

  const handleClearProject = () => {
    setProjectEntry({
      id: null,
      name: '',
      startDate: '',
      endDate: '',
      link: '',
      description: '',
    });
  };

  return (
    <section className="section projects">
      <h3>Projects</h3>

      <input
        type="text"
        name="name"
        placeholder="Project Name"
        value={projectEntry.name}
        onChange={handleProjectChange}
      />

      <input
        type="url"
        name="link"
        placeholder="Project Link (GitHub, live demo, etc.)"
        value={projectEntry.link}
        onChange={handleProjectChange}
      />

      <div style={{ display: 'flex', gap: '10px' }}>
        <input
          type="text"
          name="startDate"
          value={projectEntry.startDate}
          onChange={handleProjectChange}
        />
        <input
          type="text"
          name="endDate"
          value={projectEntry.endDate}
          onChange={handleProjectChange}
        />
      </div>

      <textarea
        name="description"
        placeholder="Project description, technologies used, your role"
        value={projectEntry.description}
        onChange={handleProjectChange}
        rows={4}
      />

      <div className="btn-contact" style={{ marginTop: '10px' }}>
        <button onClick={saveProject}>
          {projectEntry.id ? 'Update Project' : 'Add Project'}
        </button>
        <button onClick={handleClearProject} style={{ marginLeft: '10px' }}>
          Clear
        </button>
      </div>

      <ul style={{ marginTop: '20px' }}>
        {cvData.projects.length === 0 ? (
          <li>No projects added yet.</li>
        ) : (
          cvData.projects.map((proj) => (
            <li key={proj.id} style={{ marginBottom: '1em' }}>
              <strong>{proj.name}</strong> ({proj.startDate} to {proj.endDate})<br />
              <a href={proj.link} target="_blank" rel="noopener noreferrer">
                {proj.link}
              </a>
              <br />
              {proj.description}
              <div style={{ marginTop: '5px' }}>
                <button onClick={() => handleEditProject(proj.id)} style={{ marginRight: '10px' }}>
                  Edit
                </button>
                <button onClick={() => handleDeleteProject(proj.id)}>Delete</button>
              </div>
            </li>
          ))
        )}
      </ul>
    </section>
  );
};

const Education = () => {
  const { cvData, updateEducation } = useCV();

  const [educationEntry, setEducationEntry] = useState({
    id: null,
    university: '',
    degree: '',
    startDate: '',
    endDate: '',
    gpa: '',
  });

  // Handle input changes
  const handleEducationChange = (e) => {
    const { name, value } = e.target;
    setEducationEntry((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Validate input fields
  const isValid = () => {
    return !Object.entries(educationEntry)
      .filter(([key]) => key !== 'id')
      .some(([_, val]) => val.trim() === '');
  };

  // Save (add or update) education entry
  const saveEducation = () => {
    if (!isValid()) {
      alert('Please fill in all fields before saving education.');
      return;
    }

    if (educationEntry.id) {
      // Update existing
      const updated = cvData.education.map((edu) =>
        edu.id === educationEntry.id ? educationEntry : edu
      );
      updateEducation(updated);
    } else {
      // Add new
      const newEntry = { ...educationEntry, id: uuidv4() };
      updateEducation([...cvData.education, newEntry]);
    }

    handleClearEducation();
  };

  // Load entry into form for editing
  const handleEditEducation = (id) => {
    const entry = cvData.education.find((edu) => edu.id === id);
    if (entry) setEducationEntry(entry);
  };

  // Delete education entry
  const handleDeleteEducation = (id) => {
    const filtered = cvData.education.filter((edu) => edu.id !== id);
    updateEducation(filtered);

    if (educationEntry.id === id) {
      handleClearEducation();
    }
  };

  // Clear form
  const handleClearEducation = () => {
    setEducationEntry({
      id: null,
      university: '',
      degree: '',
      startDate: '',
      endDate: '',
      gpa: '',
    });
  };

  return (
    <section className="section education">
      <h3>Education</h3>

      <input
        type="text"
        name="university"
        placeholder="University Name"
        value={educationEntry.university}
        onChange={handleEducationChange}
      />
      <input
        type="text"
        name="degree"
        placeholder="Degree / Major"
        value={educationEntry.degree}
        onChange={handleEducationChange}
      />
      <div style={{ display: 'flex', gap: '10px' }}>
        <input
          type="month"
          name="startDate"
          placeholder="Start Date"
          value={educationEntry.startDate}
          onChange={handleEducationChange}
        />
        <input
          type="month"
          name="endDate"
          placeholder="End Date"
          value={educationEntry.endDate}
          onChange={handleEducationChange}
        />
        <input
          type="text"
          name="gpa"
          placeholder="GPA"
          value={educationEntry.gpa}
          onChange={handleEducationChange}
        />
      </div>

      <div className="btn-contact" style={{ marginTop: '10px' }}>
        <button onClick={saveEducation}>
          {educationEntry.id ? 'Update Education' : 'Add Education'}
        </button>
        <button onClick={handleClearEducation} style={{ marginLeft: '10px' }}>
          Clear
        </button>
      </div>

      <ul style={{ marginTop: '20px' }}>
        {cvData.education.length === 0 ? (
          <li>No education entries added yet.</li>
        ) : (
          cvData.education.map((edu) => (
            <li key={edu.id} style={{ marginBottom: '1em' }}>
              <strong>{edu.university}</strong> — {edu.degree} ({edu.startDate} to {edu.endDate}), GPA: {edu.gpa}
              <div style={{ marginTop: '5px' }}>
                <button onClick={() => handleEditEducation(edu.id)} style={{ marginRight: '10px' }}>
                  Edit
                </button>
                <button onClick={() => handleDeleteEducation(edu.id)}>Delete</button>
              </div>
            </li>
          ))
        )}
      </ul>
    </section>
  );
};

const Skills = () => {
  const { cvData, updateSkills } = useCV();

  // Update skills as user types
  const handleSkillsChange = (e) => {
    updateSkills(e.target.value);
  };

  // Clear the skills field
  const handleClearSkills = () => {
    updateSkills('');
  };

  return (
    <section className="section">
      <h3>Skills</h3>
      <textarea
        placeholder="e.g. JavaScript, React, Node.js"
        value={cvData.skills || ''}
        onChange={handleSkillsChange}
      />
      <div className="btn-contact">
        <button disabled>Save</button> {/* Save is disabled since skills auto-save onChange */}
        <button onClick={handleClearSkills}>Clear</button>
      </div>
    </section>
  );
};

const ResetButton = () => {
  const { resetCv } = useCV();

  return (
    <div className="btn-reset">
      <button
        onClick={() => {
          if (window.confirm('Are you sure you want to reset your entire CV? This action cannot be undone.')) {
            resetCv();
          }
        }}
        style={{ backgroundColor: 'red', color: 'white', padding: '8px 16px', border: 'none', cursor: 'pointer' }}
      >
        Reset CV
      </button>
    </div>
  );
};


export default function Creator() {
  return (
    <div className='cv-creator'>
      <h2>Create CV</h2>
      <Person />
      <Summary />
      <Experience />
      <Projects />
      <Education />
      <Skills />
      <ResetButton />
    </div>
  );
}
