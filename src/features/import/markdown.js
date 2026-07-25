function emptyResume(templateId) {
  return {
    templateId, name: '', birth: '', phone: '', role: '', email: '', blog: '',
    school: '', education: '', major: '', educationDate: '', skills: [], jobs: [], projects: [], evaluation: ''
  };
}

function section(markdown, title) {
  const match = markdown.match(new RegExp(`## ${title}\\n([\\s\\S]*?)(?=\\n## |$)`));
  return match?.[1]?.trim() || '';
}

function listItems(content) {
  return content.split('\n').filter(line => line.startsWith('- ')).map(line => line.slice(2).trim()).filter(Boolean);
}

export function importMarkdown(markdown, templateId = 'classic') {
  const data = emptyResume(templateId);
  const title = markdown.match(/^#\s+(.+?)的简历\s*$/m)?.[1];
  if (title) data.name = title;
  const profile = section(markdown, '基本信息');
  const fields = { '出生年月': 'birth', '个人电话': 'phone', '意向岗位': 'role', '电子邮箱': 'email', '个人博客': 'blog' };
  listItems(profile).forEach(item => {
    const [label, ...value] = item.split(/[：:]/);
    if (fields[label]) data[fields[label]] = value.join('：').trim();
  });
  const education = listItems(section(markdown, '教育经历'))[0]?.split('｜').map(item => item.trim());
  if (education?.length === 4) [data.educationDate, data.school, data.education, data.major] = education;
  data.skills = listItems(section(markdown, '相关技能'));
  data.jobs = listItems(section(markdown, '工作经历')).map(item => item.split('｜').map(part => part.trim())).filter(item => item.length === 3);
  const projects = section(markdown, '项目经历');
  data.projects = [...projects.matchAll(/^###\s+(.+)\n([^\n]*)\n\n([\s\S]*?)(?=\n### |$)/gm)].map(([, titleText, meta, content]) => {
    const lines = content.trim().split('\n');
    return { title: titleText.trim(), date: meta.split('｜')[0]?.trim() || '', role: meta.split('｜')[1]?.trim() || '', intro: lines.filter(line => !line.startsWith('- ')).join('\n').trim(), points: listItems(content) };
  });
  data.evaluation = section(markdown, '个人评价');
  return data;
}
