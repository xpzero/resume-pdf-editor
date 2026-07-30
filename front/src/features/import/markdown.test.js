import { describe, expect, it } from 'vitest';
import { importMarkdown } from './markdown';

describe('importMarkdown', () => {
  it('imports CRLF markdown sections and project details', () => {
    const markdown = [
      '# Ada 的简历',
      '',
      '## 基本信息',
      '- 个人电话：123456',
      '- 意向岗位：Engineer',
      '',
      '## 教育经历',
      '- 2020-2024 ｜ Example University ｜ Bachelor ｜ Computer Science',
      '',
      '## 相关技能',
      '- JavaScript',
      '',
      '## 工作经历',
      '- 2024-至今 ｜ Example Inc. ｜ Developer',
      '',
      '## 项目经历',
      '### Resume Editor',
      '2024 ｜ Developer',
      '',
      'A browser-based editor.',
      '- Built import support',
      '',
      '## 个人评价',
      'Detail-oriented.'
    ].join('\r\n');

    expect(importMarkdown(markdown, 'modern')).toMatchObject({
      templateId: 'modern',
      name: 'Ada',
      phone: '123456',
      role: 'Engineer',
      educationDate: '2020-2024',
      school: 'Example University',
      skills: ['JavaScript'],
      jobs: [['2024-至今', 'Example Inc.', 'Developer']],
      projects: [{ title: 'Resume Editor', date: '2024', role: 'Developer', intro: 'A browser-based editor.', points: ['Built import support'] }],
      evaluation: 'Detail-oriented.'
    });
  });
});
