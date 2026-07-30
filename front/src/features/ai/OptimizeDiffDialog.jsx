import { Button, Checkbox, Modal } from 'antd';
import { useEffect, useState } from 'react';

const scopeNames = { all: '整份简历', skills: '相关技能', jobs: '工作经历', projects: '项目经历', evaluation: '个人评价' };
const labels = { skills: '相关技能', jobs: '工作经历', projects: '项目经历', evaluation: '个人评价' };

function text(value) {
  return value || '（无内容）';
}

function DiffRow({ label, before, after }) {
  return <div className="ai-diff-row"><strong>{label}</strong><div className="ai-diff-values"><div><small>优化前</small><p>{text(before)}</p></div><div><small>优化后</small><p>{text(after)}</p></div></div></div>;
}

function ListDiff({ original = [], draft = [], format = item => item }) {
  const length = Math.max(original.length, draft.length);
  return <div className="ai-diff-list">{Array.from({ length }, (_, index) => <DiffRow key={index} label={`第 ${index + 1} 项`} before={format(original[index])} after={format(draft[index])} />)}</div>;
}

function ProjectDiff({ original, draft }) {
  return <div className="ai-project-diff"><DiffRow label="项目名称" before={original?.title} after={draft?.title} /><DiffRow label="项目描述" before={original?.intro} after={draft?.intro} /><ListDiff original={original?.points} draft={draft?.points} /></div>;
}

export function OptimizeDiffDialog({ original, draft, scope, targetIndex, onApply, onClose }) {
  const hasChanges = JSON.stringify(original) !== JSON.stringify(draft);
  const projectIndexes = Number.isInteger(targetIndex) ? [targetIndex] : Array.from({ length: Math.max(original?.projects?.length || 0, draft?.projects?.length || 0) }, (_, index) => index);
  const availableFields = scope === 'all' ? ['skills', 'jobs', 'projects', 'evaluation'] : [scope];
  const [selectedFields, setSelectedFields] = useState(availableFields);
  useEffect(() => setSelectedFields(availableFields), [draft, scope]);

  return <Modal open={Boolean(draft)} width={960} title="确认 AI 优化结果" onCancel={onClose} footer={<><Button onClick={onClose}>保留当前简历</Button><Button type="primary" disabled={!hasChanges || !selectedFields.length} onClick={() => onApply(selectedFields)}>应用所选结果</Button></>}>
    <p className="dialog-help">已完成“{scopeNames[scope]}”优化。请确认内容真实准确后再应用。</p>
    {!hasChanges && <p className="ai-no-change">AI 未返回可应用的修改，请调整补充描述或优化方向后重试。</p>}
    {availableFields.length > 1 && <Checkbox.Group className="ai-field-select" options={availableFields.map(field => ({ value: field, label: labels[field] }))} value={selectedFields} onChange={setSelectedFields} />}
    {scope === 'skills' && <section className="ai-diff-section"><h3>{labels.skills}</h3><ListDiff original={original?.skills} draft={draft?.skills} /></section>}
    {scope === 'jobs' && <section className="ai-diff-section"><h3>{labels.jobs}</h3><ListDiff original={original?.jobs} draft={draft?.jobs} format={item => item?.filter(Boolean).join(' · ')} /></section>}
    {scope === 'projects' && <section className="ai-diff-section"><h3>{labels.projects}</h3>{projectIndexes.map(index => <ProjectDiff key={index} original={original?.projects?.[index]} draft={draft?.projects?.[index]} />)}</section>}
    {scope === 'evaluation' && <section className="ai-diff-section"><h3>{labels.evaluation}</h3><DiffRow label="个人评价" before={original?.evaluation} after={draft?.evaluation} /></section>}
    {scope === 'all' && <div className="ai-diff"><section className="ai-diff-section"><h3>{labels.skills}</h3><ListDiff original={original?.skills} draft={draft?.skills} /></section><section className="ai-diff-section"><h3>{labels.projects}</h3>{projectIndexes.map(index => <ProjectDiff key={index} original={original?.projects?.[index]} draft={draft?.projects?.[index]} />)}</section><section className="ai-diff-section"><h3>{labels.evaluation}</h3><DiffRow label="个人评价" before={original?.evaluation} after={draft?.evaluation} /></section></div>}
  </Modal>;
}
