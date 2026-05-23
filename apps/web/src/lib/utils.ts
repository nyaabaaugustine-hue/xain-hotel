import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { format } from "date-fns";

export const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs));

export const fmt = {
  date: (d: string | Date) => format(new Date(d), "dd MMM yyyy"),
  datetime: (d: string | Date) => format(new Date(d), "dd MMM yyyy, h:mm a"),
  currency: (n: number | string, symbol = "$") => `${symbol}${Number(n).toFixed(2)}`,
  percent: (n: number) => `${n.toFixed(1)}%`,
};

export const statusBadge = (status: string) => {
  const map: Record<string, string> = {
    pending: "badge-pending",
    checked_in: "badge-checkedin",
    checked_out: "badge-checkout",
    cancelled: "badge-cancelled",
  };
  return map[status] || "badge-pending";
};

export const statusLabel = (status: string) =>
  status.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
