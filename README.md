# EverGPT Library — clickable prototype

Vite + React 18 + TypeScript. No backend; all data is seeded in memory (`src/data`). A refresh resets everything, and so do **Shift+R** and the user-footer menu → *Reset demo*.

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # static files in dist/ (relative paths, so dist/ also works on Vercel/Netlify)
```

Demo menu (click "Randy Bell" in the sidebar): *Reset demo*, *Show empty Library*, *Show annotation pins*.

## Deviations from the brief / Figma

- **Dates.** The brief has "Design system update notes · 5d ago" listed above "Acme retail client pitch · Sep 28", and "EMEA · 4d ago" above "Holiday peak · Sep 29". Under the brief's own rule ("Nd ago" within a week), Sep 28 would render as "4d ago" and couldn't sort below 5d ago. Those two assets use **Sep 26** instead, so the Figma order holds.
- **Tab count** shows the real count (8), not the Figma placeholder (14), as the brief says.
- **Previews** are real scaled React renders (as the brief asks), not the grey wireframe blocks in the Figma thumbnails and panel.
- **Library nav icon** is drawn inline to match the Figma glyph exactly. There's no exact Tabler equivalent. Every other icon comes from `@tabler/icons-react`.
