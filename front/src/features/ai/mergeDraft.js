export function mergeDraft(original, draft, fields) {
  const next = { ...original };
  for (const field of fields) next[field] = draft[field];
  return next;
}
