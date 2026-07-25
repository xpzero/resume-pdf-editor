import { templates } from '../../templates/templateRegistry';

function ResumeSection({ title, children }) {
  return <section className="resume-section"><h2>{title}</h2>{children}</section>;
}

export function ResumeDocument({ data }) {
  const template = templates.find(item => item.id === data.templateId) || templates[0];
  return <article className={`resume template-${template.id}`}>
    <header>
      <h1>{data.name}</h1>
      <div className="contact">
        <p>出生年月：{data.birth}</p><p>期望薪资：{data.salary}</p>
        <p>个人电话：{data.phone}</p><p>意向岗位：{data.role}</p>
        <p>电子邮箱：{data.email}</p><p>个人博客：{data.blog}</p>
      </div>
    </header>
    <div className="bluebar" />
    <ResumeSection title="教育经历"><div className="education"><span>{data.educationDate}</span><span>{data.school}</span><span>{data.education}</span><span>{data.major}</span></div></ResumeSection>
    <ResumeSection title="相关技能"><ul className="skills">{data.skills.map((skill, index) => <li key={index}>{skill}</li>)}</ul></ResumeSection>
    <ResumeSection title="工作经历"><div className="jobs">{data.jobs.map(([date, company, role], index) => <div key={index}><span>{date}</span><span>{company}</span><span>{role}</span></div>)}</div></ResumeSection>
    <ResumeSection title="项目经历">{data.projects.map((project, index) => <div className="project" key={index}><div className="project-head"><span>{project.date}</span><b>{project.title}</b><span>{project.role}</span></div><p>{project.intro}</p><ol>{project.points.map((point, pointIndex) => <li key={pointIndex}>{point}</li>)}</ol></div>)}</ResumeSection>
    <ResumeSection title="个人评价"><p className="evaluation">{data.evaluation}</p></ResumeSection>
  </article>;
}
