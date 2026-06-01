export function parseAreaInput(value: string | number | null | undefined) {
  const text = String(value ?? "").trim();
  const numericArea = Number.parseInt(text.replace(/\+/g, ""), 10);

  return {
    area: Number.isFinite(numericArea) ? numericArea : 0,
    area_has_plus: text.endsWith("+"),
  };
}

export function formatArea(area: number | null | undefined, hasPlus?: boolean | null) {
  if (area == null) return null;

  return `${area.toLocaleString()}${hasPlus ? "+" : ""}`;
}
