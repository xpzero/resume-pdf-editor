import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './style.css';

const initialResume = {
  name: '徐培珊', birth: '1997.02', salary: '面议', phone: '18106505028', role: '前端开发',
  email: 'x73mail@163.com', blog: 'https://xpzero.github.io/blog/',
  school: '平顶山学院', education: '本科', major: '软件工程', educationDate: '2016.09-2020.07',
  skills: [
    '熟练使用 JavaScript / TypeScript、HTML、CSS，理解浏览器渲染、事件循环、HTTP 缓存及常见性能优化方案。',
    '熟练使用 React、Hooks、React Router、Zustand 等进行复杂业务开发，具备组件抽象、状态管理及可维护性设计能力。',
    '熟悉 Vite、Webpack、pnpm、Git 等工程化工具，具备组件库迁移、前端架构迭代及多仓库协同交付经验。',
    '具备 SSE 流式通信、iframe 通信、埋点与数据链路接入经验，能够完成 AI 应用前端及 SDK 封装。',
    '熟悉 Ant Design、Semi 等组件库，了解 Vue 的基础开发与调试。',
    '熟练使用 Claude Code、OpenCode 等 AI 协作工具开展开发、调试和研发提效，具备 Agent Skills、MCP 工具链实践经验。',
    '具备 Java、Python 基础使用能力，可进行基础的脚本编写、数据处理及服务端接口调试。'
  ],
  jobs: [
    ['2026.01-2026.08', '外企仁励人力资源服务（广州）有限公司杭州第四分公司', '前端开发工程师（OD）'],
    ['2023.12-2026.01', '武汉佰钧成技术有限责任公司', '前端工程师'],
    ['2023.03-2023.11', '杭州博彦信息技术有限公司', '前端工程师'],
    ['2022.02-2023.01', '软通动力信息技术（集团）股份有限公司', '前端工程师'],
    ['2020.05-2021.12', '北京易达未来科技有限公司', '前端工程师']
  ],
  projects: [
    { date: '2023.12-至今', title: 'ICBU业务系统', role: '前端工程师', intro: '负责国际站商品发布、商品管理、批量治理、商品成长中心及 AI 创意工作室等核心模块的需求开发与架构迭代。主要负责：', points: ['独立负责商品批量治理前端架构与全链路迭代，覆盖拿样、定制、价格、属性等 5+ 场景；实现可折叠分组、内联编辑、多页签灰度、触底分页与一键优化等复杂交互，沉淀治理卡片等通用组件 10+，支撑批量管理全场景改版。', '从 0 到 1 搭建 Product Growth Center，交付商品力与服务竞争力分层对比、任务面板等核心能力；打通 PIS 评分、曝光埋点及主题/场景筛选数据链路，覆盖交易品、商机品双场景，并协同 4+ 仓库完成交付。', '主导 AI 创意工作室从 0 到 1 建设，一个月内完成图片上传、场景模板、SSE 流式生成、历史记录与费用预估；完成 Zustand 重构及组件迁移，并将 SSE 通信、渲染和 iframe 通信抽取为独立 SDK（核心代码 7,000+ 行），支持多个外部业务低成本接入。', '以 AI 工具提升研发效率：使用 Claude Code、OpenCode 等完成 25+ 协作提交，并行支撑 3+ 需求；自建 Agent Skills 与 MCP 安装体系，并开发埋点校验 Chrome 插件，降低人工抓包与核对成本。', '参与商品管理分层浮层、一键 CPV、Shopify 店铺设置弹窗及产品卡 Web Components 迁移等业务建设，持续支持多项目协同交付。'] },
    { date: '2023.03-2023.11', title: '客服工作台', role: '前端工程师', intro: '客服工作台是阿里巴巴旗下的一款智能客服产品，提供关键信息识别、智能调度，服务中快速回复、客服辅助、快速标记，服务后数据分析、智能质检的功能。主要负责：', points: ['基础功能的维护、迭代', '杂难问题解决，包括antd的InputNumber限制实时只能输入数字、SSE(服务端推送)同服务端的配合实现'] },
    { date: '2023.05-2023.08', title: '南航工单私有化', role: '前端工程师', intro: '将现有的客服工作台迁移到南航私有环境，并替换原有工单编辑器。使用工单编辑器可动态配置工单操作的模板，使其可以使用数据源、形成表单项及联效果、表单项的权限内可显等功能。主要负责：', points: ['工单编辑器中组件的维护、项目文档的编写', 'schema在渲染器配置态及运行态之间的流转', '工单编辑器运行态与业务数据的结合', '配置态schema的生成、保存、回显与业务的联通'] },
    { date: '2022.02-2023.01', title: '电商工单工作台开发', role: '前端工程师', intro: '项目是为方便字节内部客服人员与客户、店铺等外部人员的沟通，以工单的方式显示当前正在处理的问题细节，方便客服人员快速的进行处理。其中主要负责新功能的接入、oncall处理、功能组件的开发。主要负责：', points: ['使用react hooks、react router、mobx进行平台的开发、维护、迭代', '使用Semi组件库进行页面的基本搭建，使用graphql进行前后端数据通信', '专项处理JS错误率从3.x%到0.x%', '处理项目oncall及监控异常出现的问题，以懒加载的方式实现图廊组件，统一项目中多图片一起展示的风格'] },
    { date: '2020.05-2021.12', title: '数据可视化工具开发', role: '前端工程师', intro: '该项目是一个数据BI产品，将经过处理的数据进行图表、报表、文本的形式进行展示。其中主要负责：', points: ['在引入的第三方富文本组件中嵌入动态数据，实现富文本中的数据联动', '使用echarts、canvas开发、完善项目中图表、形状组件的可视化展示', '全局、局部业务数据联动功能', '使用原生ES6和div+css模式开发和维护报表组件，使用SVG中的line和polyline实现绘制报表“组”的功能', '报表的批量更新、删除、新增等功能'] }
  ],
  evaluation: '做事稳重可靠，注重细节与交付质量，具备较强的时间观念和责任心。拥有良好的自驱学习能力，对新技术保持好奇并乐于分享；在团队协作中沟通积极、配合度高，获得身边同事和合作方的良好评价。'
};

function Field({ label, value, onChange, multiline = false }) { return <label><span>{label}</span>{multiline ? <textarea rows={5} value={value} onChange={e => onChange(e.target.value)} /> : <input value={value} onChange={e => onChange(e.target.value)} />}</label> }
function App() {
  const [data, setData] = useState(() => {
    try { return JSON.parse(localStorage.getItem('resume-editor-data')) || initialResume; }
    catch { return initialResume; }
  });
  const [savedAt, setSavedAt] = useState('');
  useEffect(() => { localStorage.setItem('resume-editor-data', JSON.stringify(data)); }, [data]);
  const save = () => {
    localStorage.setItem('resume-editor-data', JSON.stringify(data));
    setSavedAt(`已保存 ${new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })}`);
  };
  const exportMarkdown = () => {
    const markdown = [
      `# ${data.name}的简历`,
      '',
      '## 基本信息',
      `- 出生年月：${data.birth}`,
      `- 个人电话：${data.phone}`,
      `- 电子邮箱：${data.email}`,
      `- 个人博客：${data.blog}`,
      `- 意向岗位：${data.role}`,
      `- 期望薪资：${data.salary}`,
      '',
      '## 教育经历',
      `- ${data.educationDate}｜${data.school}｜${data.education}｜${data.major}`,
      '',
      '## 相关技能',
      ...data.skills.map(skill => `- ${skill}`),
      '',
      '## 工作经历',
      ...data.jobs.map(([date, company, role]) => `- ${date}｜${company}｜${role}`),
      '',
      '## 项目经历',
      ...data.projects.flatMap(project => [
        `### ${project.title}`,
        `${project.date}｜${project.role}`,
        '',
        project.intro,
        '',
        ...project.points.map(point => `- ${point}`),
        ''
      ]),
      '## 个人评价',
      data.evaluation
    ].join('\n');
    const url = URL.createObjectURL(new Blob([markdown], { type: 'text/markdown;charset=utf-8' }));
    const link = document.createElement('a');
    link.href = url;
    link.download = `${data.name || '简历'}.md`;
    document.body.append(link);
    link.click();
    link.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 0);
  };
  const exportPdf = () => {
    save();
    const previousTitle = document.title;
    const filename = `${[data.name, data.role, data.phone].join('_').replace(/[\\/:*?"<>|]/g, '-')}.pdf`;
    const restoreTitle = () => {
      document.title = previousTitle;
      window.removeEventListener('afterprint', restoreTitle);
    };
    document.title = filename;
    window.addEventListener('afterprint', restoreTitle);
    window.print();
  };
  const change = (key, value) => setData(d => ({ ...d, [key]: value }));
  const changeArray = (key, i, value) => setData(d => ({...d, [key]: d[key].map((x, n) => n === i ? value : x)}));
  const changeJob = (i, j, value) => setData(d => ({...d, jobs: d.jobs.map((row,n) => n === i ? row.map((x,k)=>k===j?value:x) : row)}));
  const moveJob = (i, direction) => setData(d => {
    const target = i + direction;
    if (target < 0 || target >= d.jobs.length) return d;
    const jobs = [...d.jobs];
    [jobs[i], jobs[target]] = [jobs[target], jobs[i]];
    return { ...d, jobs };
  });
  const changeProject = (i, key, value) => setData(d => ({...d, projects:d.projects.map((p,n)=>n===i?{...p,[key]:value}:p)}));
  const changePoint = (i, j, value) => setData(d => ({...d, projects:d.projects.map((p,n)=>n===i?{...p,points:p.points.map((x,k)=>k===j?value:x)}:p)}));
  return <main className="app">
    <aside className="editor">
      <div className="editor-head"><div><strong>简历编辑器</strong><small>{savedAt || '修改内容会实时更新预览'}</small></div><div className="actions"><button onClick={save}>保存</button><button onClick={() => { save(); exportMarkdown(); }}>导出 Markdown</button><button className="print" onClick={exportPdf}>导出 PDF</button></div></div>
      <section><h2>基本信息</h2><div className="fields two"><Field label="姓名" value={data.name} onChange={v=>change('name',v)}/><Field label="出生年月" value={data.birth} onChange={v=>change('birth',v)}/><Field label="个人电话" value={data.phone} onChange={v=>change('phone',v)}/><Field label="意向岗位" value={data.role} onChange={v=>change('role',v)}/><Field label="电子邮箱" value={data.email} onChange={v=>change('email',v)}/><Field label="个人博客" value={data.blog} onChange={v=>change('blog',v)}/></div></section>
      <section><h2>相关技能</h2>{data.skills.map((v,i)=><div className="line-edit" key={i}><textarea rows={5} value={v} onChange={e=>changeArray('skills',i,e.target.value)}/><button onClick={()=>setData(d=>({...d,skills:d.skills.filter((_,n)=>n!==i)}))}>×</button></div>)}<button onClick={()=>setData(d=>({...d,skills:[...d.skills,'新增技能']}))}>+ 添加技能</button></section>
      <section><h2>工作经历</h2>{data.jobs.map((job,i)=><div className="job-edit" key={i}>{job.map((v,j)=><input key={j} value={v} onChange={e=>changeJob(i,j,e.target.value)}/>)}<div className="job-actions"><button title="上移" disabled={i===0} onClick={()=>moveJob(i,-1)}>↑</button><button title="下移" disabled={i===data.jobs.length-1} onClick={()=>moveJob(i,1)}>↓</button><button onClick={()=>setData(d=>({...d,jobs:d.jobs.filter((_,n)=>n!==i)}))}>删除</button></div></div>)}<button onClick={()=>setData(d=>({...d,jobs:[['时间','公司名称','前端工程师'],...d.jobs]}))}>+ 在最上方添加经历</button></section>
      <section><h2>项目经历</h2>{data.projects.map((p,i)=><details key={i}><summary>{p.title || '未命名项目'}</summary><div className="fields"><Field label="时间" value={p.date} onChange={v=>changeProject(i,'date',v)}/><Field label="项目名称" value={p.title} onChange={v=>changeProject(i,'title',v)}/><Field label="职责" value={p.role} onChange={v=>changeProject(i,'role',v)}/><Field label="项目描述" value={p.intro} onChange={v=>changeProject(i,'intro',v)} multiline/>{p.points.map((x,j)=><div className="line-edit" key={j}><textarea rows={5} value={x} onChange={e=>changePoint(i,j,e.target.value)}/><button onClick={()=>changeProject(i,'points',p.points.filter((_,n)=>n!==j))}>×</button></div>)}<button onClick={()=>changeProject(i,'points',[...p.points,'新增职责'])}>+ 添加职责</button><button className="danger" onClick={()=>setData(d=>({...d,projects:d.projects.filter((_,n)=>n!==i)}))}>删除项目</button></div></details>)}<button onClick={()=>setData(d=>({...d,projects:[...d.projects,{date:'时间',title:'新增项目',role:'前端工程师',intro:'项目描述',points:['项目职责']}]}))}>+ 添加项目</button></section>
      <section><h2>个人评价</h2><textarea value={data.evaluation} onChange={e=>change('evaluation',e.target.value)}/></section>
    </aside>
    <div className="preview-wrap"><article className="resume">
      <header><h1>{data.name}</h1><div className="contact"><p>出生年月：{data.birth}</p><p>期望薪资：{data.salary}</p><p>个人电话：{data.phone}</p><p>意向岗位：{data.role}</p><p>电子邮箱：{data.email}</p><p>个人博客：{data.blog}</p></div></header>
      <div className="bluebar"/><Block title="教育经历"><div className="education"><span>{data.educationDate}</span><span>{data.school}</span><span>{data.education}</span><span>{data.major}</span></div></Block>
      <Block title="相关技能"><ul className="skills">{data.skills.map((s,i)=><li key={i}>{s}</li>)}</ul></Block>
      <Block title="工作经历"><div className="jobs">{data.jobs.map((j,i)=><div key={i}><span>{j[0]}</span><span>{j[1]}</span><span>{j[2]}</span></div>)}</div></Block>
      <Block title="项目经历">{data.projects.map((p,i)=><div className="project" key={i}><div className="project-head"><span>{p.date}</span><b>{p.title}</b><span>{p.role}</span></div><p>{p.intro}</p><ol>{p.points.map((x,j)=><li key={j}>{x}</li>)}</ol></div>)}</Block>
      <Block title="个人评价"><p className="evaluation">{data.evaluation}</p></Block>
    </article></div>
  </main>
}
function Block({title,children}) { return <section className="resume-section"><h2>{title}</h2>{children}</section> }
createRoot(document.getElementById('root')).render(<App/>);
