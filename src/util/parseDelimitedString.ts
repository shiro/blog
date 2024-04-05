export const parseDelimitedString = (s: string, delimiter: string) => {
  return Object.fromEntries(
    s.split(delimiter).map((p) => {
      const parts = p.split("=");
      const name = parts[0].trim();
      return [name, parts[1]?.trim() ?? true];
    })
  );
};
