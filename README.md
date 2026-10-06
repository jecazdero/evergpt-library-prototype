# EverGPT Library

**A home for the work people make in EverGPT.** Today every asset (a webpage, a report, a deck) lives inside the chat that produced it. This project redesigns that model: the Library makes the asset the main object, and the chat becomes where it came from.

Design assignment for Foundever · Product Design · 2026

| | |
|---|---|
| 🎨 **Figma** | [EverGPT Library: design file](https://www.figma.com/design/JKdxDDlWUkhVyrOpxHYgSP/Foundever?node-id=12-169) |
| ▶️ **Live prototype** | `TODO: add deployed URL` |

---

## The problem

Assets made in EverGPT live inside the chats that produced them. People remember *what* they made, not which chat it was in, so finding an asset later means digging through conversations and guessing whether it's the latest version, whether it's live, and who can see it.

The result is lost work, duplicated effort and risk. Foundever handles client data, so not knowing whether a page is public on the web is a governance problem, not a cosmetic one.

**Users need to:** **find** what they made or were sent, **understand** whether it's live and who can see it, and **act** on it (edit, share, publish).

---

## The solution

A **Library** in the sidebar, right under New chat, where the asset is the main object and the chat is where it came from.

- **Find:** *My assets* and *Shared with me* tabs, search across title, content and chat name, Type and Status filters, sorted by last edited.
- **Understand:** **status** (Draft, Published, *Published · changes pending*, Unpublished) and **visibility** (Only you, Shared, Foundever, Public) are shown separately. Today they're mixed into one chip, which is what causes the confusion.
- **Act:** the primary button follows the asset's state: *Publish*, *Update live version* or *Republish*. Editing goes back through chat with *Edit in new chat*.
- **Safe by design:** only *Public* gets a warning colour, and making something public asks for confirmation. Making it more private takes one click.

**Out of V1 on purpose:** folders, tags, version history and bulk actions. At tens of assets per person, search and recency are enough.

**Main success metric:** the share of assets reopened after the session that created them.

The full reasoning, assumptions and open questions are in the [design plan](docs/EverGPT_Library_Plan.md).

---

## The prototype

A clickable, high-fidelity prototype built to match the existing EverGPT UI. It follows one scripted scenario end to end and behaves realistically everywhere else.

> **Scenario:** Randy Bell needs the sales webpage he made last week. He searches "sales", sees it's *Published · changes pending · Public*, updates the live version, and shares it with his manager.

- Click **"Randy Bell"** in the sidebar for the demo menu: *Reset demo*, *Show empty Library*, *Show annotation pins*.
- **Shift+R** resets the demo. A page refresh resets everything too.
- Designed for desktop at 1440 × 900 (works from 1280 to 1920 px wide).

### Figma frames

| Frame | Link |
|---|---|
| Library, list view (primary screen) | [8:2](https://www.figma.com/design/JKdxDDlWUkhVyrOpxHYgSP/Foundever?node-id=8-2) |
| Library, grid view | [14:16](https://www.figma.com/design/JKdxDDlWUkhVyrOpxHYgSP/Foundever?node-id=14-16) |
| Annotations, main proposal | [12:100](https://www.figma.com/design/JKdxDDlWUkhVyrOpxHYgSP/Foundever?node-id=12-100) |
| EverGPT design system | [28:92](https://www.figma.com/design/JKdxDDlWUkhVyrOpxHYgSP/Foundever?node-id=28-92) |
| Existing screens (chat, empty state) | [5:37](https://www.figma.com/design/JKdxDDlWUkhVyrOpxHYgSP/Foundever?node-id=5-37) |

---

## Tech stack

| Layer | Choice | Why |
|---|---|---|
| Framework | **React 18 + TypeScript** | Typed asset, status and visibility models keep the states consistent |
| Build | **Vite 5** | Fast dev server; builds to static files that can be hosted anywhere |
| Styling | **Plain CSS + design tokens** | Custom properties and `eg-*` component classes taken from the EverGPT product. No Tailwind and no UI kit, so it looks like the real product |
| Icons | **[Tabler Icons](https://tabler.io/icons)** (`@tabler/icons-react`) | The icon set the product already uses |
| Type | **Inter, Noto Sans, Figtree** (Google Fonts) | Matches the existing UI |
| State | **`useReducer` + React Context** | One store for the whole app, seeded data, no backend or persistence |
| Previews | **Live scaled React renders** | Asset thumbnails and previews are real components, not images |

### Project structure

```
src/
  data/          seeded assets, people and chats
  store/         reducer, context, selectors
  styles/        tokens, components, app, previews
  components/
    library/     Library page, toolbar, list and grid, empty state
    panel/       asset panel: header, changes callout, details, preview, action bar
    dialogs/     share, publish, confirm-public, delete
    chat/        home, chat view, in-chat asset card, composer
    previews/    sales page, deck, report renders
docs/            assignment, design plan, design system
```

### Run locally

```bash
npm install
```

```bash
npm run dev
```

Then open http://localhost:5173. To build static files into `dist/` (they use relative paths, so they work on Vercel, Netlify or opened locally):

```bash
npm run build
```

---

## Differences from the Figma file

- **Dates.** In the brief, "Design system update notes · 5d ago" is listed above "Acme retail client pitch · Sep 28", and "EMEA · 4d ago" above "Holiday peak · Sep 29". Under the brief's own rule ("Nd ago" for anything within a week), Sep 28 would show as "4d ago" and couldn't sort below 5d ago. Those two assets use **Sep 26** instead, so the Figma order holds.
- **Tab count** shows the real count (8), not the Figma placeholder (14), as the brief asks.
- **Previews** are real scaled React renders, as the brief asks, rather than the grey wireframe blocks in the Figma thumbnails.
- **The Library nav icon** is drawn inline to match the Figma glyph, because Tabler has no exact equivalent. Every other icon comes from `@tabler/icons-react`.
