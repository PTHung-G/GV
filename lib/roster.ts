const LEADING_CODE = /^([A-Za-z]{0,4}\d{1,8})\s+(\S.*)$/;

/**
 * Parses pasted classroom rosters ("09001 Nguyễn Văn An", tab/CSV columns, or plain names).
 */
export function parseRosterLines(text: string): Array<{ code?: string; name: string }> {
  return text
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const parts = line
        .split(/\t|,|;|\s{2,}/)
        .map((part) => part.trim())
        .filter(Boolean);
      if (parts.length >= 2) {
        return { code: parts[0], name: parts.slice(1).join(' ') };
      }
      const match = LEADING_CODE.exec(line);
      if (match) return { code: match[1], name: match[2] };
      return { name: line };
    })
    .filter((student) => student.name);
}
