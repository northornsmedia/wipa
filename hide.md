# Hidden Components

## LexIQ Sidebar Button
Removed from `src/components/Sidebar.tsx` just above "MAIN NAVIGATION":

```tsx
        <Link href="/platform/ai" className="block w-full mb-6 group">
          <ShinyButton className="w-full !p-3 !rounded-[1rem] flex items-center justify-center">
            <span className="font-medium text-[15px] tracking-[0.15em] text-white">LexIQ</span>
          </ShinyButton>
        </Link>
```

## Memberships Navigation Links
Removed from `src/components/Sidebar.tsx`:
```tsx
          <Link href="/platform/memberships" className={navLinkClass('/platform/memberships')}>
            <FileText size={18} /> Memberships
          </Link>
```

Removed from `src/components/PlatformHeader.tsx` (mobile nav items array):
```tsx
  { name: 'Memberships', icon: Star, path: '/platform/memberships' },
```
