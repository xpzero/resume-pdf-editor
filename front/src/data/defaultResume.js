export const defaultResume = {
  templateId: 'classic',
  name: '陈默', birth: '1995.08', phone: '13800001234', role: '产品设计师',
  email: 'chenmo.demo@example.com', blog: 'https://example.com/chenmo',
  school: '星海大学', education: '本科', major: '软件工程', educationDate: '2014.09-2018.06',
  educations: [{ date: '2014.09-2018.06', school: '星海大学', degree: '本科', major: '软件工程' }],
  skills: [
    '熟练使用 Figma、Sketch、Adobe Illustrator，具备设计系统与组件规范建设经验。',
    '具备用户研究、交互设计、原型设计和产品体验优化能力。'
  ],
  jobs: [
    ['2022.04-至今', '云栖数字科技（杭州）有限公司', '高级产品设计师'],
    ['2019.07-2022.03', '远川软件有限公司', '产品设计师']
  ],
  projects: [
    {
      date: '2023.06-至今', title: '智能运营工作台', role: '产品设计师',
      intro: '面向运营团队的数据分析与任务协同平台。',
      points: [
        '负责运营流程梳理、核心页面交互和视觉设计。',
        '建立数据看板组件规范，持续优化复杂任务的操作体验。'
      ]
    },
    {
      date: '2021.03-2022.03', title: '企业协作中心', role: '产品设计师',
      intro: '为企业提供项目和审批协同能力的 SaaS 管理后台。',
      points: [
        '完成项目、审批和知识库的用户流程及高保真原型设计。',
        '与产品和研发协作推进设计落地，完善设计交付规范。'
      ]
    }
  ],
  customSections: [],
  evaluation: '做事认真，注重细节和交付质量，具备良好的沟通协作能力。'
};

export function createDefaultResume() {
  return structuredClone(defaultResume);
}
