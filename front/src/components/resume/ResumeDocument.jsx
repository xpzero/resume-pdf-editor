import { templates } from '../../templates/templateRegistry';

function ResumeSection({ title, children }) {
  return <section className="resume-section"><h2>{title}</h2>{children}</section>;
}

const chineseLabels = { birth: '出生年月', role: '意向岗位', phone: '个人电话', email: '电子邮箱', blog: '个人博客', education: '教育经历', skills: '相关技能', jobs: '工作经历', projects: '项目经历', evaluation: '个人评价' };
const englishLabels = { birth: 'Born', role: 'Target role', phone: 'Phone', email: 'Email', blog: 'Portfolio', education: 'Education', skills: 'Skills', jobs: 'Experience', projects: 'Projects', evaluation: 'Profile' };

function Contact({ data, labels, className = 'contact' }) {
  return <div className={className}>
    <p>{labels.birth}: {data.birth}</p><p className="contact-role">{labels.role}: {data.role}</p>
    <p>{labels.phone}: {data.phone}</p><p>{labels.email}: {data.email}</p>
    <p className="contact-blog">{labels.blog}: {data.blog}</p>
  </div>;
}

function Education({ data, labels = chineseLabels }) {
  return <ResumeSection title={labels.education}>{data.educations.map((item, index) => <div className="education" key={index}><span>{item.date}</span><span>{item.school}</span><span>{item.degree}</span><span>{item.major}</span></div>)}</ResumeSection>;
}

function Skills({ data, labels = chineseLabels }) {
  return <ResumeSection title={labels.skills}><ul className="skills">{data.skills.map((skill, index) => <li key={index}>{skill}</li>)}</ul></ResumeSection>;
}

function Experience({ data, labels = chineseLabels }) {
  return <ResumeSection title={labels.jobs}><div className="jobs">{data.jobs.map(([date, company, role], index) => <div key={index}><span>{date}</span><span>{company}</span><span>{role}</span></div>)}</div></ResumeSection>;
}

function Projects({ data, labels = chineseLabels }) {
  return <ResumeSection title={labels.projects}>{data.projects.map((project, index) => <div className="project" key={index}><div className="project-head"><span>{project.date}</span><b>{project.title}</b><span>{project.role}</span></div><p>{project.intro}</p><ol>{project.points.map((point, pointIndex) => <li key={pointIndex}>{point}</li>)}</ol></div>)}</ResumeSection>;
}

function CustomSections({ data }) {
  return data.customSections.map((section, index) => <ResumeSection title={section.title || '未命名模块'} key={index}><ul className="skills">{section.items.map((item, itemIndex) => <li key={itemIndex}>{item}</li>)}</ul></ResumeSection>);
}

function Evaluation({ data, labels = chineseLabels }) {
  return <ResumeSection title={labels.evaluation}><p className="evaluation">{data.evaluation}</p></ResumeSection>;
}

function StandardDocument({ data, template }) {
  const labels = template.id === 'english' ? englishLabels : chineseLabels;
  return <article className={`resume template-${template.id}`}>
    <header><h1>{data.name}</h1><Contact data={data} labels={labels} /></header>
    <div className="bluebar" />
    <Education data={data} labels={labels} /><Skills data={data} labels={labels} /><Experience data={data} labels={labels} /><Projects data={data} labels={labels} /><CustomSections data={data} /><Evaluation data={data} labels={labels} />
  </article>;
}

function EditorialDocument({ data }) {
  return <article className="resume template-editorial">
    <header className="editorial-header"><p>{data.role}</p><h1>{data.name}</h1><Contact data={data} labels={chineseLabels} className="editorial-contact" /></header>
    <div className="editorial-intro"><span>CURRICULUM VITAE</span><i /></div>
    <div className="editorial-top"><Education data={data} /><Skills data={data} /></div>
    <Experience data={data} /><Projects data={data} /><CustomSections data={data} /><Evaluation data={data} />
  </article>;
}

function TechDocument({ data }) {
  return <article className="resume template-tech">
    <aside className="tech-sidebar"><p className="tech-label">FRONTEND RESUME</p><h1>{data.name}</h1><p className="tech-role">{data.role}</p><Contact data={data} labels={chineseLabels} className="tech-contact" /><Skills data={data} /></aside>
    <main className="tech-main"><Education data={data} /><Experience data={data} /><Projects data={data} /><CustomSections data={data} /><Evaluation data={data} /></main>
  </article>;
}

export function ResumeDocument({ data }) {
  const template = templates.find(item => item.id === data.templateId) || templates[0];
  if (template.id === 'editorial') return <EditorialDocument data={data} />;
  if (template.id === 'tech') return <TechDocument data={data} />;
  return <StandardDocument data={data} template={template} />;
}
