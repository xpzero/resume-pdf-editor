import { Alert, Button, Collapse, Input, Select } from 'antd';
import { Fragment, useState } from 'react';
import { Field } from '../fields/Field';
import { TextList } from '../fields/TextList';
import { DragHandleIcon, TrashIcon } from '../fields/TrashIcon';
import { DragPlaceholder, useDragSort } from '../fields/dragSort';
import { templates } from '../../templates/templateRegistry';
import { getResumeChecks } from '../../features/quality/checks';

function EditorSection({ title, action, children, compact = false }) {
  return <section className={compact ? 'compact-section' : ''}><div className="editor-section-title"><h2>{title}</h2>{action}</div>{children}</section>;
}

function DragHandleRow({ drag, index, children }) {
  return <Fragment>
    {drag.placeholderIndex === index && <DragPlaceholder height={drag.placeholderHeight} />}
    {children}
  </Fragment>;
}

export function ResumeEditor({ data, onChange, onOptimize }) {
  const update = patch => onChange(current => ({ ...current, ...patch }));
  const updateArray = (key, index, value) => update({ [key]: data[key].map((item, itemIndex) => itemIndex === index ? value : item) });
  const removeArray = (key, index) => update({ [key]: data[key].filter((_, itemIndex) => itemIndex !== index) });
  const updateProject = (index, patch) => update({ projects: data.projects.map((project, projectIndex) => projectIndex === index ? { ...project, ...patch } : project) });
  const updateCustomSection = (index, patch) => update({ customSections: data.customSections.map((section, sectionIndex) => sectionIndex === index ? { ...section, ...patch } : section) });
  const updateEducation = (index, patch) => update({ educations: data.educations.map((item, itemIndex) => itemIndex === index ? { ...item, ...patch } : item) });
  const reorderList = (key, from, to) => {
    const list = [...data[key]];
    const [moved] = list.splice(from, 1);
    list.splice(to, 0, moved);
    update({ [key]: list });
  };
  const focusFirstInput = selector => requestAnimationFrame(() => document.querySelector(selector)?.focus());
  const dragEducations = useDragSort((from, to) => reorderList('educations', from, to));
  const dragJobs = useDragSort((from, to) => reorderList('jobs', from, to));
  const dragProjects = useDragSort((from, to) => reorderList('projects', from, to));
  const dragCustomSections = useDragSort((from, to) => reorderList('customSections', from, to));
  const [openProjects, setOpenProjects] = useState([]);
  const addProject = () => {
    update({ projects: [{ date: '', title: '', role: '', intro: '', points: [''] }, ...data.projects] });
    setOpenProjects(['0']);
    focusFirstInput('.project-collapse input[placeholder="项目名称"]');
  };
  const projectItems = data.projects.map((project, index) => ({
    key: String(index),
    label: <div className="project-label" {...dragProjects.itemProps(index)}>
      <span className="project-label-title"><span className="drag-handle" aria-label="拖拽调整顺序" {...dragProjects.handleProps(index)}><DragHandleIcon /></span><span className="project-label-text">{project.title || '未命名项目'}</span></span>
    </div>,
    children: <div className="fields project-fields"><Field label="时间" value={project.date} placeholder="例如：2024.01-至今" onChange={value => updateProject(index, { date: value })} /><Field label="项目名称" value={project.title} placeholder="项目名称" onChange={value => updateProject(index, { title: value })} /><Field label="职责" value={project.role} placeholder="你在项目中的角色" onChange={value => updateProject(index, { role: value })} /><Field label="项目描述" value={project.intro} placeholder="项目背景和目标" onChange={value => updateProject(index, { intro: value })} multiline headerAction={<Button className="project-ai-action" onClick={() => onOptimize('projects', index, 'intro')}>AI 优化</Button>} /><div className="project-points-title">项目职责</div><TextList items={project.points} placeholder="项目职责或成果" onChange={(pointIndex, value) => updateProject(index, { points: project.points.map((point, currentIndex) => currentIndex === pointIndex ? value : point) })} onRemove={pointIndex => updateProject(index, { points: project.points.filter((_, currentIndex) => currentIndex !== pointIndex) })} onReorder={(from, to) => { const points = [...project.points]; const [point] = points.splice(from, 1); points.splice(to, 0, point); updateProject(index, { points }); }} onAdd={() => updateProject(index, { points: ['', ...project.points] })} addLabel="+ 添加职责" /><Button danger onClick={() => removeArray('projects', index)}>删除项目</Button></div>
  }));
  const collapseItems = [];
  projectItems.forEach((item, index) => {
    if (dragProjects.placeholderIndex === index) collapseItems.push({ key: `drag-placeholder-${index}`, className: 'drag-placeholder-item', label: <DragPlaceholder height={dragProjects.placeholderHeight} />, showArrow: false, collapsible: 'disabled' });
    collapseItems.push(item);
  });
  if (dragProjects.placeholderIndex === projectItems.length) collapseItems.push({ key: 'drag-placeholder-end', className: 'drag-placeholder-item', label: <DragPlaceholder height={dragProjects.placeholderHeight} />, showArrow: false, collapsible: 'disabled' });
  const checks = getResumeChecks(data);
  const aiAction = scope => <Button type="link" size="small" onClick={() => onOptimize(scope)}>AI 优化</Button>;

  return <aside className="editor">
    <EditorSection title="简历模板"><label className="template-select"><span>选择模板</span><Select size="large" value={data.templateId} onChange={value => update({ templateId: value })} options={templates.map(template => ({ value: template.id, label: `${template.name} - ${template.description}` }))} /></label></EditorSection>
    {checks.length > 0 && <Alert className="resume-checks" type="warning" showIcon message="简历检查" description={<ul>{checks.map(check => <li key={check}>{check}</li>)}</ul>} />}
    <EditorSection title="基本信息"><div className="fields two"><Field label="姓名" value={data.name} onChange={value => update({ name: value })} /><Field label="出生年月" value={data.birth} onChange={value => update({ birth: value })} /><Field label="个人电话" value={data.phone} onChange={value => update({ phone: value })} /><Field label="意向岗位" value={data.role} onChange={value => update({ role: value })} /><Field label="电子邮箱" value={data.email} onChange={value => update({ email: value })} /><Field label="个人博客" value={data.blog} onChange={value => update({ blog: value })} /><Field label="GitHub" value={data.github || ''} placeholder="例如：https://github.com/username" onChange={value => update({ github: value })} /></div></EditorSection>
    <EditorSection title="教育经历"><div className="sortable-list" {...dragEducations.listProps}>{data.educations.map((item, index) => <DragHandleRow drag={dragEducations} index={index} key={index}><div className={`education-edit${dragEducations.dragIndex === index ? ' is-dragging' : ''}`} {...dragEducations.itemProps(index)}><span className="drag-handle" aria-label="拖拽调整顺序" {...dragEducations.handleProps(index)}><DragHandleIcon /></span><div className="fields two"><Field label="教育时间" value={item.date} placeholder="例如：2018.09-2022.06" onChange={value => updateEducation(index, { date: value })} /><Field label="学校" value={item.school} placeholder="学校名称" onChange={value => updateEducation(index, { school: value })} /><Field label="学历" value={item.degree} placeholder="例如：本科" onChange={value => updateEducation(index, { degree: value })} /><Field label="专业" value={item.major} placeholder="专业名称" onChange={value => updateEducation(index, { major: value })} /></div><Button danger onClick={() => removeArray('educations', index)}>删除教育经历</Button></div></DragHandleRow>)}{dragEducations.placeholderIndex === data.educations.length && <DragPlaceholder height={dragEducations.placeholderHeight} />}</div><Button onClick={() => { update({ educations: [{ date: '', school: '', degree: '', major: '' }, ...data.educations] }); focusFirstInput('.education-edit input'); }}>+ 添加教育经历</Button></EditorSection>
    <EditorSection title="相关技能" action={aiAction('skills')} compact><TextList items={data.skills} placeholder="描述一项与岗位相关的技能" onChange={(index, value) => updateArray('skills', index, value)} onRemove={index => removeArray('skills', index)} onReorder={(from, to) => reorderList('skills', from, to)} onAdd={() => update({ skills: ['', ...data.skills] })} addLabel="+ 添加技能" /></EditorSection>
    <EditorSection title="工作经历" compact><div className="sortable-list" {...dragJobs.listProps}>{data.jobs.map((job, index) => <DragHandleRow drag={dragJobs} index={index} key={index}><div className={`job-edit${dragJobs.dragIndex === index ? ' is-dragging' : ''}`} {...dragJobs.itemProps(index)}><span className="drag-handle" aria-label="拖拽调整顺序" {...dragJobs.handleProps(index)}><DragHandleIcon /></span>{job.map((value, fieldIndex) => <Input size="large" key={fieldIndex} value={value} placeholder={['时间', '公司名称', '岗位'][fieldIndex]} onChange={event => update({ jobs: data.jobs.map((item, itemIndex) => itemIndex === index ? item.map((field, currentIndex) => currentIndex === fieldIndex ? event.target.value : field) : item) })} />)}<div className="job-actions"><Button className="delete-icon" icon={<TrashIcon />} aria-label="删除此段工作经历" onClick={() => removeArray('jobs', index)} /></div></div></DragHandleRow>)}{dragJobs.placeholderIndex === data.jobs.length && <DragPlaceholder height={dragJobs.placeholderHeight} />}</div><Button onClick={() => { update({ jobs: [['', '', ''], ...data.jobs] }); focusFirstInput('.job-edit .ant-input'); }}>+ 添加工作经历</Button></EditorSection>
    <EditorSection title="项目经历"><Collapse className="project-collapse" items={collapseItems} activeKey={openProjects} onChange={setOpenProjects} /><Button onClick={addProject}>+ 添加项目</Button></EditorSection>
    <EditorSection title="自定义模块" compact><div className="sortable-list" {...dragCustomSections.listProps}>{data.customSections.map((section, index) => <DragHandleRow drag={dragCustomSections} index={index} key={index}><div className={`custom-section-edit${dragCustomSections.dragIndex === index ? ' is-dragging' : ''}`} {...dragCustomSections.itemProps(index)}><div className="custom-section-head"><span className="drag-handle" aria-label="拖拽调整顺序" {...dragCustomSections.handleProps(index)}><DragHandleIcon /></span><Field label="模块名称" value={section.title} placeholder="例如：竞赛经历" onChange={value => updateCustomSection(index, { title: value })} /></div><TextList items={section.items} placeholder="补充一条内容" onChange={(itemIndex, value) => updateCustomSection(index, { items: section.items.map((item, currentIndex) => currentIndex === itemIndex ? value : item) })} onRemove={itemIndex => updateCustomSection(index, { items: section.items.filter((_, currentIndex) => currentIndex !== itemIndex) })} onReorder={(from, to) => { const items = [...section.items]; const [moved] = items.splice(from, 1); items.splice(to, 0, moved); updateCustomSection(index, { items }); }} onAdd={() => updateCustomSection(index, { items: ['', ...section.items] })} addLabel="+ 添加内容" /><Button danger onClick={() => removeArray('customSections', index)}>删除模块</Button></div></DragHandleRow>)}{dragCustomSections.placeholderIndex === data.customSections.length && <DragPlaceholder height={dragCustomSections.placeholderHeight} />}</div><Button onClick={() => { update({ customSections: [{ title: '', items: [''] }, ...data.customSections] }); focusFirstInput('.custom-section-edit input'); }}>+ 添加自定义模块</Button></EditorSection>
    <EditorSection title="个人评价" action={aiAction('evaluation')}><Input.TextArea rows={5} value={data.evaluation} onChange={event => update({ evaluation: event.target.value })} /></EditorSection>
  </aside>;
}
