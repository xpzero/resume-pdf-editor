function download(filename, content, type) {
  const url = URL.createObjectURL(new Blob([content], { type }));
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.append(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 0);
}

export function exportMarkdown(data) {
  const markdown = [
    `# ${data.name}的简历`, '', '## 基本信息',
    `- 出生年月：${data.birth}`, `- 个人电话：${data.phone}`, `- 电子邮箱：${data.email}`,
    `- 个人博客：${data.blog}`, `- 意向岗位：${data.role}`, `- 期望薪资：${data.salary}`, '',
    '## 教育经历', `- ${data.educationDate}｜${data.school}｜${data.education}｜${data.major}`, '',
    '## 相关技能', ...data.skills.map(skill => `- ${skill}`), '',
    '## 工作经历', ...data.jobs.map(([date, company, role]) => `- ${date}｜${company}｜${role}`), '',
    '## 项目经历', ...data.projects.flatMap(project => [`### ${project.title}`, `${project.date}｜${project.role}`, '', project.intro, '', ...project.points.map(point => `- ${point}`), '']),
    '## 个人评价', data.evaluation
  ].join('\n');
  download(`${data.name || '简历'}.md`, markdown, 'text/markdown;charset=utf-8');
}
