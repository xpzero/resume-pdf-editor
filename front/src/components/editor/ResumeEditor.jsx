import { Alert, Button, Collapse, Input, Select } from 'antd';
import { Field } from '../fields/Field';
import { TextList } from '../fields/TextList';
import { TrashIcon } from '../fields/TrashIcon';
import { templates } from '../../templates/templateRegistry';
import { getResumeChecks } from '../../features/quality/checks';

function EditorSection({ title, action, children, compact = false }) {
  return <section className={compact ? 'compact-section' : ''}><div className="editor-section-title"><h2>{title}</h2>{action}</div>{children}</section>;
}

export function ResumeEditor({ data, onChange, onOptimize }) {
  const update = patch => onChange(current => ({ ...current, ...patch }));
  const updateArray = (key, index, value) => update({ [key]: data[key].map((item, itemIndex) => itemIndex === index ? value : item) });
  const removeArray = (key, index) => update({ [key]: data[key].filter((_, itemIndex) => itemIndex !== index) });
  const updateProject = (index, patch) => update({ projects: data.projects.map((project, projectIndex) => projectIndex === index ? { ...project, ...patch } : project) });
  const updateCustomSection = (index, patch) => update({ customSections: data.customSections.map((section, sectionIndex) => sectionIndex === index ? { ...section, ...patch } : section) });
  const updateEducation = (index, patch) => update({ educations: data.educations.map((item, itemIndex) => itemIndex === index ? { ...item, ...patch } : item) });
  const moveJob = (index, direction) => {
    const target = index + direction;
    if (target < 0 || target >= data.jobs.length) return;
    const jobs = [...data.jobs];
    [jobs[index], jobs[target]] = [jobs[target], jobs[index]];
    update({ jobs });
  };
  const moveProject = (index, direction) => {
    const target = index + direction;
    if (target < 0 || target >= data.projects.length) return;
    const projects = [...data.projects];
    [projects[index], projects[target]] = [projects[target], projects[index]];
    update({ projects });
  };
  const projectItems = data.projects.map((project, index) => ({
    key: String(index),
    label: <div className="project-label"><span>{project.title || '未命名项目'}</span><div><Button size="small" aria-label="上移项目" disabled={index === 0} onClick={event => { event.stopPropagation(); moveProject(index, -1); }}>↑</Button><Button size="small" aria-label="下移项目" disabled={index === data.projects.length - 1} onClick={event => { event.stopPropagation(); moveProject(index, 1); }}>↓</Button></div></div>,
    children: <div className="fields project-fields"><Field label="时间" value={project.date} placeholder="例如：2024.01-至今" onChange={value => updateProject(index, { date: value })} /><Field label="项目名称" value={project.title} placeholder="项目名称" onChange={value => updateProject(index, { title: value })} /><Field label="职责" value={project.role} placeholder="你在项目中的角色" onChange={value => updateProject(index, { role: value })} /><Field label="项目描述" value={project.intro} placeholder="项目背景和目标" onChange={value => updateProject(index, { intro: value })} multiline headerAction={<Button className="project-ai-action" onClick={() => onOptimize('projects', index, 'intro')}>AI 优化</Button>} /><div className="project-points-title">项目职责</div><TextList items={project.points} placeholder="项目职责或成果" onChange={(pointIndex, value) => updateProject(index, { points: project.points.map((point, currentIndex) => currentIndex === pointIndex ? value : point) })} onRemove={pointIndex => updateProject(index, { points: project.points.filter((_, currentIndex) => currentIndex !== pointIndex) })} onReorder={project.points.length > 1 ? (from, to) => { const points = [...project.points]; const [point] = points.splice(from, 1); points.splice(to, 0, point); updateProject(index, { points }); } : undefined} onAdd={() => updateProject(index, { points: [...project.points, ''] })} addLabel="+ 添加职责" /><Button danger onClick={() => removeArray('projects', index)}>删除项目</Button></div>
  }));
  const checks = getResumeChecks(data);
  const aiAction = scope => <Button type="link" size="small" onClick={() => onOptimize(scope)}>AI 优化</Button>;

  return <aside className="editor">
    <EditorSection title="简历模板"><label className="template-select"><span>选择模板</span><Select size="large" value={data.templateId} onChange={value => update({ templateId: value })} options={templates.map(template => ({ value: template.id, label: `${template.name} - ${template.description}` }))} /></label></EditorSection>
    {checks.length > 0 && <Alert className="resume-checks" type="warning" showIcon message="简历检查" description={<ul>{checks.map(check => <li key={check}>{check}</li>)}</ul>} />}
    <EditorSection title="基本信息"><div className="fields two"><Field label="姓名" value={data.name} onChange={value => update({ name: value })} /><Field label="出生年月" value={data.birth} onChange={value => update({ birth: value })} /><Field label="个人电话" value={data.phone} onChange={value => update({ phone: value })} /><Field label="意向岗位" value={data.role} onChange={value => update({ role: value })} /><Field label="电子邮箱" value={data.email} onChange={value => update({ email: value })} /><Field label="个人博客" value={data.blog} onChange={value => update({ blog: value })} /></div></EditorSection>
    <EditorSection title="教育经历">{data.educations.map((item, index) => <div className="education-edit" key={index}><div className="fields two"><Field label="教育时间" value={item.date} placeholder="例如：2018.09-2022.06" onChange={value => updateEducation(index, { date: value })} /><Field label="学校" value={item.school} placeholder="学校名称" onChange={value => updateEducation(index, { school: value })} /><Field label="学历" value={item.degree} placeholder="例如：本科" onChange={value => updateEducation(index, { degree: value })} /><Field label="专业" value={item.major} placeholder="专业名称" onChange={value => updateEducation(index, { major: value })} /></div><Button danger onClick={() => update({ educations: data.educations.filter((_, itemIndex) => itemIndex !== index) })}>删除教育经历</Button></div>)}<Button onClick={() => update({ educations: [...data.educations, { date: '', school: '', degree: '', major: '' }] })}>+ 添加教育经历</Button></EditorSection>
    <EditorSection title="相关技能" action={aiAction('skills')} compact><TextList items={data.skills} placeholder="描述一项与岗位相关的技能" onChange={(index, value) => updateArray('skills', index, value)} onRemove={index => removeArray('skills', index)} onReorder={(from, to) => { const skills = [...data.skills]; const [skill] = skills.splice(from, 1); skills.splice(to, 0, skill); update({ skills }); }} onAdd={() => update({ skills: [...data.skills, ''] })} addLabel="+ 添加技能" /></EditorSection>
    <EditorSection title="工作经历" compact>{data.jobs.map((job, index) => <div className="job-edit" key={index}>{job.map((value, fieldIndex) => <Input size="large" key={fieldIndex} value={value} placeholder={['时间', '公司名称', '岗位'][fieldIndex]} onChange={event => update({ jobs: data.jobs.map((item, itemIndex) => itemIndex === index ? item.map((field, currentIndex) => currentIndex === fieldIndex ? event.target.value : field) : item) })} />)}<div className="job-actions"><Button size="small" disabled={index === 0} onClick={() => moveJob(index, -1)}>↑</Button><Button size="small" disabled={index === data.jobs.length - 1} onClick={() => moveJob(index, 1)}>↓</Button><Button className="delete-icon" icon={<TrashIcon />} aria-label="删除此段工作经历" onClick={() => removeArray('jobs', index)} /></div></div>)}<Button onClick={() => update({ jobs: [['', '', ''], ...data.jobs] })}>+ 在最上方添加经历</Button></EditorSection>
    <EditorSection title="项目经历"><Collapse className="project-collapse" items={projectItems} /><Button onClick={() => update({ projects: [...data.projects, { date: '', title: '', role: '', intro: '', points: [''] }] })}>+ 添加项目</Button></EditorSection>
    <EditorSection title="自定义模块" compact>{data.customSections.map((section, index) => <div className="custom-section-edit" key={index}><Field label="模块名称" value={section.title} placeholder="例如：竞赛经历" onChange={value => updateCustomSection(index, { title: value })} /><TextList items={section.items} placeholder="补充一条内容" onChange={(itemIndex, value) => updateCustomSection(index, { items: section.items.map((item, currentIndex) => currentIndex === itemIndex ? value : item) })} onRemove={itemIndex => updateCustomSection(index, { items: section.items.filter((_, currentIndex) => currentIndex !== itemIndex) })} onAdd={() => updateCustomSection(index, { items: [...section.items, ''] })} addLabel="+ 添加内容" /><Button danger onClick={() => removeArray('customSections', index)}>删除模块</Button></div>)}<Button onClick={() => update({ customSections: [...data.customSections, { title: '', items: [''] }] })}>+ 添加自定义模块</Button></EditorSection>
    <EditorSection title="个人评价" action={aiAction('evaluation')}><Input.TextArea rows={5} value={data.evaluation} onChange={event => update({ evaluation: event.target.value })} /></EditorSection>
  </aside>;
}
