import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatFileSize(bytes?: number | null) {
  if (!bytes) return '—';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function initialsFrom(name?: string | null, email?: string | null) {
  const source = name?.trim() || email?.trim() || 'U';
  const parts = source.split(/[\s@]+/).filter(Boolean);
  return (parts[0]?.[0] || 'U').toUpperCase() + (parts[1]?.[0] || '').toUpperCase();
}
