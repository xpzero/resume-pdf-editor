import { ResumeDocument } from './ResumeDocument';

export function ResumePreview({ data }) {
  return <div className="preview-wrap"><ResumeDocument data={data} /></div>;
}
