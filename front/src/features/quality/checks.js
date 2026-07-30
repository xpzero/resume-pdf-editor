export function getResumeChecks(data) {
  const checks = [];
  if (!data.name || !data.role || !data.phone || !data.email) checks.push('请补全姓名、岗位、电话和邮箱。');
  if (!data.educations.length || data.educations.some(item => !item.date || !item.school || !item.degree || !item.major)) checks.push('请补全教育经历。');
  if (!data.skills.length) checks.push('建议至少填写一项相关技能。');
  if (!data.jobs.length && !data.projects.length) checks.push('建议补充工作经历或项目经历。');
  if (data.projects.some(project => !project.title || !project.intro || !project.points.length)) checks.push('存在信息不完整的项目经历。');
  if (data.customSections.some(section => !section.title || !section.items.length)) checks.push('存在信息不完整的自定义模块。');
  if (data.email && !/^\S+@\S+\.\S+$/.test(data.email)) checks.push('邮箱格式可能不正确。');
  return checks;
}
