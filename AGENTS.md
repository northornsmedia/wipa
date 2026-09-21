<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Strict UI & Design Directives
- **NEVER use the Lucide `Sparkles` icon (AI sparkle / magic star icon)** anywhere in the application. Do not use sparkles for AI, intelligence, premium, or features. Use purposeful, professional, standard icons (e.g., `SlidersHorizontal`, `FileText`, `Layers`, `Briefcase`, `Shield`, etc.).
- **NEVER use glassmorphism**: Do not use `backdrop-blur`, milky semi-transparent backgrounds (`bg-white/80` or `bg-black/60` with blur), or frosted glass effects. All UI components, cards, headers, and modals must use clean, crisp, solid modern styling with solid backgrounds (`bg-white`, `dark:bg-slate-900`), clean borders (`border-slate-200`, `dark:border-slate-800`), and clean shadows.
