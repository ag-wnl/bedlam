export function shouldApply(url: string, include: string[], exclude: string[]) {
  if (exclude.some((x) => url.includes(x))) return false;
  if (include.length === 0) return true;
  return include.some((x) => url.includes(x));
}

export const sleep = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));
