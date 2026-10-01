import { Sparkles, Info, AlertCircle, AlertTriangle, type LucideIcon } from "lucide-react";

export type CalloutVariant = "takeaway" | "info" | "important" | "warning";

export interface CalloutVariantConfig {
  variant: CalloutVariant;
  label: string;
  icon: LucideIcon;
  badgeLabel: string;
  containerClass: string;
  badgeClass: string;
  iconClass: string;
}

export const CALLOUT_VARIANTS: Record<CalloutVariant, CalloutVariantConfig> = {
  takeaway: {
    variant: "takeaway",
    label: "Key Takeaway",
    badgeLabel: "Takeaway",
    icon: Sparkles,
    containerClass: "border-primary/30 bg-primary/5 dark:bg-primary/10",
    badgeClass: "bg-primary/15 text-primary border-primary/25",
    iconClass: "text-primary",
  },
  info: {
    variant: "info",
    label: "Information",
    badgeLabel: "Note",
    icon: Info,
    containerClass: "border-blue-500/30 bg-blue-500/5 dark:bg-blue-500/10",
    badgeClass: "bg-blue-500/15 text-blue-700 dark:text-blue-300 border-blue-500/25",
    iconClass: "text-blue-600 dark:text-blue-400",
  },
  important: {
    variant: "important",
    label: "Important",
    badgeLabel: "Important",
    icon: AlertCircle,
    containerClass: "border-purple-500/30 bg-purple-500/5 dark:bg-purple-500/10",
    badgeClass: "bg-purple-500/15 text-purple-700 dark:text-purple-300 border-purple-500/25",
    iconClass: "text-purple-600 dark:text-purple-400",
  },
  warning: {
    variant: "warning",
    label: "Warning",
    badgeLabel: "Warning",
    icon: AlertTriangle,
    containerClass: "border-amber-500/30 bg-amber-500/5 dark:bg-amber-500/10",
    badgeClass: "bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/25",
    iconClass: "text-amber-600 dark:text-amber-400",
  },
};
