import { PAGE_MAP } from './page-map';
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';

export function resolvePageFromIntent(msg: string): string | null {
  const lowercaseMsg = msg.toLowerCase();
  
  // 1. Exact match
  for (const [path, info] of Object.entries(PAGE_MAP)) {
    if (info.aliases.some(alias => lowercaseMsg === alias)) {
      return path;
    }
  }
  
  // 2. Partial match (if message contains the alias)
  for (const [path, info] of Object.entries(PAGE_MAP)) {
    if (info.aliases.some(alias => lowercaseMsg.includes(alias))) {
      return path;
    }
  }

  return null;
}

export function navigateTo(router: AppRouterInstance, path: string) {
  router.push(path);
}
