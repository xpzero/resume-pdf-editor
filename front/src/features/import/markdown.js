function emptyResume(templateId) {
  return {
    templateId, name: '', birth: '', phone: '', role: '', email: '', blog: '',
    school: '', education: '', major: '', educationDate: '', skills: [], jobs: [], projects: [], customSections: [], evaluation: ''
  };
}

function sections(markdown) {
  const headings = [...markdown.matchAll(/^##\s+(.+?)\s*$/gm)];
  return headings.map((match, index) => ({
    title: match[1].trim(),
    content: markdown.slice(match.index + match[0].length, headings[index + 1]?.index).trim()
  }));
}

function section(allSections, title) {
  return allSections.find(item => item.title === title)?.content || '';
}

function listItems(content) {
  return content.split('\n').filter(line => line.startsWith('- ')).map(line => line.slice(2).trim()).filter(Boolean);
}

export function importMarkdown(markdown, templateId = 'classic') {
  markdown = markdown.replace(/\r\n?/g, '\n');
  const data = emptyResume(templateId);
  const allSections = sections(markdown);
  const title = markdown.match(/^#\s+(.+?)的简历\s*$/m)?.[1]?.trim();
  if (title) data.name = title;
  const profile = section(allSections, '基本信息');
  const fields = { '出生年月': 'birth', '个人电话': 'phone', '意向岗位': 'role', '电子邮箱': 'email', '个人博客': 'blog' };
  listItems(profile).forEach(item => {
    const [label, ...value] = item.split(/[：:]/);
    if (fields[label]) data[fields[label]] = value.join('：').trim();
  });
  const education = listItems(section(allSections, '教育经历'))[0]?.split('｜').map(item => item.trim());
  if (education?.length === 4) [data.educationDate, data.school, data.education, data.major] = education;
  data.skills = listItems(section(allSections, '相关技能'));
  data.jobs = listItems(section(allSections, '工作经历')).map(item => item.split('｜').map(part => part.trim())).filter(item => item.length === 3);
  const projects = section(allSections, '项目经历');
  data.projects = [...projects.matchAll(/(?:^|\n)###\s+([^\n]+)\n([^\n]*)\n\n([\s\S]*?)(?=\n###\s+|$)/g)].map(([, titleText, meta, content]) => {
    const lines = content.trim().split('\n');
    return { title: titleText.trim(), date: meta.split('｜')[0]?.trim() || '', role: meta.split('｜')[1]?.trim() || '', intro: lines.filter(line => !line.startsWith('- ')).join('\n').trim(), points: listItems(content) };
  });
  data.evaluation = section(allSections, '个人评价');
  const knownSections = new Set(['基本信息', '教育经历', '相关技能', '工作经历', '项目经历', '个人评价']);
  data.customSections = allSections.filter(item => !knownSections.has(item.title)).map(item => {
    const items = listItems(item.content);
    return { title: item.title, items: items.length ? items : item.content.split('\n').map(line => line.trim()).filter(Boolean) };
  });
  return data;
}
