import { templates } from '../../templates/templateRegistry';

function ResumeSection({ title, children }) {
  return <section className="resume-section"><h2>{title}</h2>{children}</section>;
}

function Contact({ data, className = 'contact' }) {
  return <div className={className}>
    <p>出生年月：{data.birth}</p><p className="contact-role">意向岗位：{data.role}</p>
    <p>个人电话：{data.phone}</p><p>电子邮箱：{data.email}</p>
    <p className="contact-blog">个人博客：{data.blog}</p>
  </div>;
}

function Education({ data }) {
  return <ResumeSection title="教育经历"><div className="education"><span>{data.educationDate}</span><span>{data.school}</span><span>{data.education}</span><span>{data.major}</span></div></ResumeSection>;
}

function Skills({ data }) {
  return <ResumeSection title="相关技能"><ul className="skills">{data.skills.map((skill, index) => <li key={index}>{skill}</li>)}</ul></ResumeSection>;
}

function Experience({ data }) {
  return <ResumeSection title="工作经历"><div className="jobs">{data.jobs.map(([date, company, role], index) => <div key={index}><span>{date}</span><span>{company}</span><span>{role}</span></div>)}</div></ResumeSection>;
}

function Projects({ data }) {
  return <ResumeSection title="项目经历">{data.projects.map((project, index) => <div className="project" key={index}><div className="project-head"><span>{project.date}</span><b>{project.title}</b><span>{project.role}</span></div><p>{project.intro}</p><ol>{project.points.map((point, pointIndex) => <li key={pointIndex}>{point}</li>)}</ol></div>)}</ResumeSection>;
}

function Evaluation({ data }) {
  return <ResumeSection title="个人评价"><p className="evaluation">{data.evaluation}</p></ResumeSection>;
}

function StandardDocument({ data, template }) {
  return <article className={`resume template-${template.id}`}>
    <header><h1>{data.name}</h1><Contact data={data} /></header>
    <div className="bluebar" />
    <Education data={data} /><Skills data={data} /><Experience data={data} /><Projects data={data} /><Evaluation data={data} />
  </article>;
}

function EditorialDocument({ data }) {
  return <article className="resume template-editorial">
    <header className="editorial-header"><p>{data.role}</p><h1>{data.name}</h1><Contact data={data} className="editorial-contact" /></header>
    <div className="editorial-intro"><span>CURRICULUM VITAE</span><i /></div>
    <div className="editorial-top"><Education data={data} /><Skills data={data} /></div>
    <Experience data={data} /><Projects data={data} /><Evaluation data={data} />
  </article>;
}

function TechDocument({ data }) {
  return <article className="resume template-tech">
    <aside className="tech-sidebar"><p className="tech-label">FRONTEND RESUME</p><h1>{data.name}</h1><p className="tech-role">{data.role}</p><Contact data={data} className="tech-contact" /><Skills data={data} /></aside>
    <main className="tech-main"><Education data={data} /><Experience data={data} /><Projects data={data} /><Evaluation data={data} /></main>
  </article>;
}

export function ResumeDocument({ data }) {
  const template = templates.find(item => item.id === data.templateId) || templates[0];
  if (template.id === 'editorial') return <EditorialDocument data={data} />;
  if (template.id === 'tech') return <TechDocument data={data} />;
  return <StandardDocument data={data} template={template} />;
}
