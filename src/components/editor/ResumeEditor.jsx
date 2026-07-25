import { Button, Collapse, Input, Select } from 'antd';
import { Field } from '../fields/Field';
import { TextList } from '../fields/TextList';
import { templates } from '../../templates/templateRegistry';

function EditorSection({ title, children }) {
  return <section><h2>{title}</h2>{children}</section>;
}

export function ResumeEditor({ data, onChange }) {
  const update = patch => onChange(current => ({ ...current, ...patch }));
  const updateArray = (key, index, value) => update({ [key]: data[key].map((item, itemIndex) => itemIndex === index ? value : item) });
  const removeArray = (key, index) => update({ [key]: data[key].filter((_, itemIndex) => itemIndex !== index) });
  const updateProject = (index, patch) => update({ projects: data.projects.map((project, projectIndex) => projectIndex === index ? { ...project, ...patch } : project) });
  const moveJob = (index, direction) => {
    const target = index + direction;
    if (target < 0 || target >= data.jobs.length) return;
    const jobs = [...data.jobs];
    [jobs[index], jobs[target]] = [jobs[target], jobs[index]];
    update({ jobs });
  };
  const projectItems = data.projects.map((project, index) => ({
    key: String(index),
    label: project.title || '未命名项目',
    children: <div className="fields project-fields"><Field label="时间" value={project.date} onChange={value => updateProject(index, { date: value })} /><Field label="项目名称" value={project.title} onChange={value => updateProject(index, { title: value })} /><Field label="职责" value={project.role} onChange={value => updateProject(index, { role: value })} /><Field label="项目描述" value={project.intro} onChange={value => updateProject(index, { intro: value })} multiline /><TextList items={project.points} onChange={(pointIndex, value) => updateProject(index, { points: project.points.map((point, currentIndex) => currentIndex === pointIndex ? value : point) })} onRemove={pointIndex => updateProject(index, { points: project.points.filter((_, currentIndex) => currentIndex !== pointIndex) })} onAdd={() => updateProject(index, { points: [...project.points, '新增职责'] })} addLabel="+ 添加职责" /><Button danger onClick={() => removeArray('projects', index)}>删除项目</Button></div>
  }));

  return <aside className="editor">
    <EditorSection title="简历模板"><label className="template-select"><span>选择模板</span><Select size="large" value={data.templateId} onChange={value => update({ templateId: value })} options={templates.map(template => ({ value: template.id, label: `${template.name} - ${template.description}` }))} /></label></EditorSection>
    <EditorSection title="基本信息"><div className="fields two"><Field label="姓名" value={data.name} onChange={value => update({ name: value })} /><Field label="出生年月" value={data.birth} onChange={value => update({ birth: value })} /><Field label="个人电话" value={data.phone} onChange={value => update({ phone: value })} /><Field label="意向岗位" value={data.role} onChange={value => update({ role: value })} /><Field label="电子邮箱" value={data.email} onChange={value => update({ email: value })} /><Field label="个人博客" value={data.blog} onChange={value => update({ blog: value })} /></div></EditorSection>
    <EditorSection title="相关技能"><TextList items={data.skills} onChange={(index, value) => updateArray('skills', index, value)} onRemove={index => removeArray('skills', index)} onAdd={() => update({ skills: [...data.skills, '新增技能'] })} addLabel="+ 添加技能" /></EditorSection>
    <EditorSection title="工作经历">{data.jobs.map((job, index) => <div className="job-edit" key={index}>{job.map((value, fieldIndex) => <Input size="large" key={fieldIndex} value={value} onChange={event => update({ jobs: data.jobs.map((item, itemIndex) => itemIndex === index ? item.map((field, currentIndex) => currentIndex === fieldIndex ? event.target.value : field) : item) })} />)}<div className="job-actions"><Button size="small" disabled={index === 0} onClick={() => moveJob(index, -1)}>↑</Button><Button size="small" disabled={index === data.jobs.length - 1} onClick={() => moveJob(index, 1)}>↓</Button><Button size="small" danger onClick={() => removeArray('jobs', index)}>删除</Button></div></div>)}<Button onClick={() => update({ jobs: [['时间', '公司名称', '前端工程师'], ...data.jobs] })}>+ 在最上方添加经历</Button></EditorSection>
    <EditorSection title="项目经历"><Collapse className="project-collapse" items={projectItems} /><Button onClick={() => update({ projects: [...data.projects, { date: '时间', title: '新增项目', role: '前端工程师', intro: '项目描述', points: ['项目职责'] }] })}>+ 添加项目</Button></EditorSection>
    <EditorSection title="个人评价"><Input.TextArea rows={5} value={data.evaluation} onChange={event => update({ evaluation: event.target.value })} /></EditorSection>
  </aside>;
}
