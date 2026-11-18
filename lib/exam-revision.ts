/** Stable synchronous content revision shared by editor and grading. Not a security signature. */
export function examContentHash(content: string): string {
  let hash = 2166136261;
  for (let index = 0; index < content.length; index += 1) {
    hash ^= content.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return `v1-${content.length}-${(hash >>> 0).toString(16)}`;
}
