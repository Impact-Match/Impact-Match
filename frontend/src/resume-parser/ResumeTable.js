import React, { Fragment } from "react";

// Initial data for education and work experience
const initialEducation = {
  school: "Unknown School",
  degree: "Unknown Degree",
  gpa: "N/A",
  date: "N/A",
  descriptions: ["No description available"],
};

const initialWorkExperience = {
  company: "Unknown Company",
  jobTitle: "Unknown Job Title",
  date: "N/A",
  descriptions: ["No description available"],
};

// Class name utility (cx replacement)
const cx = (...classes) => classes.filter(Boolean).join(" ");

// Reusable table row for headers
const TableRowHeader = ({ children }) => (
  <tr className="divide-x bg-gray-50">
    <th className="px-3 py-2 font-semibold" scope="colgroup" colSpan={2}>
      {children}
    </th>
  </tr>
);

// Reusable table row for data display
const TableRow = ({ label, value, className }) => (
  <tr className={cx("divide-x", className)}>
    <th className="px-3 py-2 font-medium" scope="row">
      {label}
    </th>
    <td className="w-full px-3 py-2">
      {typeof value === "string"
        ? value
        : value.map((item, idx) => (
            <Fragment key={idx}>
              • {item}
              <br />
            </Fragment>
          ))}
    </td>
  </tr>
);

// Main Resume Table component
export const ResumeTable = ({ resume }) => {
  if (!resume) {
    return <div>No resume data available</div>; // Handle undefined resume
  }

  // Extract profile details
  const profile = resume.profile || {};
  const name = profile.name?.text || "N/A";  // Update to access the `text` field in `name`
  const email = profile.email || "N/A";
  const phone = profile.phone || "N/A";
  const location = profile.location || "N/A";
  const url = profile.url || "N/A";
  const summary = profile.summary || "N/A";

  const educations =
    resume.educations && resume.educations.length > 0
      ? resume.educations
      : [initialEducation];
  const workExperiences =
    resume.workExperiences && resume.workExperiences.length > 0
      ? resume.workExperiences
      : [initialWorkExperience];
  const skills = resume.skills?.descriptions || [];
  const featuredSkills = resume.skills?.featuredSkills
    ?.filter((item) => item.skill.trim())
    .map((item) => item.skill)
    .join(", ")
    .trim();

  if (featuredSkills) {
    skills.unshift(featuredSkills);
  }

  return (
    <table className="mt-2 w-full border text-sm text-gray-900">
      <tbody className="divide-y text-left align-top">
        <TableRowHeader>Profile</TableRowHeader>
        <TableRow label="Name" value={name} />
        <TableRow label="Email" value={email} />
        <TableRow label="Phone" value={phone} />
        <TableRow label="Location" value={location} />
        <TableRow label="Link" value={url} />
        <TableRow label="Summary" value={summary} />

        <TableRowHeader>Education</TableRowHeader>
        {educations.map((education, idx) => (
          <Fragment key={idx}>
            <TableRow label="School" value={education.school || "N/A"} className="border-t-8 border-gray-400" />
            <TableRow label="Degree" value={education.degree || "N/A"} />
            <TableRow label="GPA" value={education.gpa || "N/A"} />
            <TableRow label="Date" value={education.date || "N/A"} />
            <TableRow
              label="Descriptions"
              value={education.descriptions || []}
            />
          </Fragment>
        ))}

        <TableRowHeader>Work Experience</TableRowHeader>
        {workExperiences.map((workExperience, idx) => (
          <Fragment key={idx}>
            <TableRow label="Company" value={workExperience.company || "N/A"} className="border-t-8 border-gray-400" />
            <TableRow label="Job Title" value={workExperience.jobTitle || "N/A"} />
            <TableRow label="Date" value={workExperience.date || "N/A"} />
            <TableRow
              label="Descriptions"
              value={workExperience.descriptions || []}
            />
          </Fragment>
        ))}

        {resume.projects?.length > 0 && (
          <TableRowHeader>Projects</TableRowHeader>
        )}
        {resume.projects?.map((project, idx) => (
          <Fragment key={idx}>
            <TableRow label="Project" value={project.project || "N/A"} className="border-t-8 border-gray-400" />
            <TableRow label="Date" value={project.date || "N/A"} />
            <TableRow
              label="Descriptions"
              value={project.descriptions || []}
            />
          </Fragment>
        ))}

        <TableRowHeader>Skills</TableRowHeader>
        <TableRow label="Descriptions" value={skills} />
      </tbody>
    </table>
  );
};