export interface HighlightColor {
  id: string;
  name: string;
  color: string;
  twBadgeClass: string;
}

export const HIGHLIGHT_COLORS: readonly HighlightColor[] = [
  {
    id: "yellow",
    name: "Yellow",
    color: "#fef08a",
    twBadgeClass: "bg-yellow-200 text-yellow-900 border-yellow-300",
  },
  {
    id: "green",
    name: "Green",
    color: "#bbf7d0",
    twBadgeClass: "bg-green-200 text-green-900 border-green-300",
  },
  {
    id: "orange",
    name: "Orange",
    color: "#fed7aa",
    twBadgeClass: "bg-orange-200 text-orange-900 border-orange-300",
  },
  {
    id: "blue",
    name: "Blue",
    color: "#bfdbfe",
    twBadgeClass: "bg-blue-200 text-blue-900 border-blue-300",
  },
] as const;
