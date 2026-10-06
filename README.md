# EverGPT Library

**A home for the work people make in EverGPT.** Today every asset (a webpage, a report, a deck) lives inside the chat that produced it. This project redesigns that model: the Library makes the asset the main object, and the chat becomes where it came from.

Design assignment for Foundever · Product Design · 2026

| | |
|---|---|
| 🎨 **Figma** | [EverGPT Library: design file](https://www.figma.com/design/JKdxDDlWUkhVyrOpxHYgSP/Foundever?node-id=12-169) |
| ▶️ **Live prototype** | `TODO: add deployed URL` |

---

## The problem

In EverGPT, **the chat holds the work, and the asset is a byproduct of it.** The sidebar lists chats by name ("OKRs review", "Design system updates"), but people don't remember chat names. They remember what they made: "the sales webpage" or "the Q3 deck for the client." Once a conversation scrolls out of view, the asset is effectively lost.

> Employees create valuable assets in EverGPT, but those assets live inside conversations. To find one later, they have to remember which chat produced it, dig through it, and guess whether it's the latest version, whether it's live, and who can see it. The result is lost work, duplicated effort, and risk: people can't tell what's published.

The risk matters more here than in most products. Foundever is a BPO that handles client data, so "is this page public on the web?" is a governance question, not a cosmetic one. The current UI makes this worse: the same asset card shows both "Not published" and a "Draft" chip, two signals that seem to describe one thing.

### Jobs to be done

| Job | The user's question |
|---|---|
| **Find** | "Where's the thing I made last week?" and "What did a colleague send me?" |
| **Understand** | What is it? Is it live? Who can see it? |
| **Act** | Continue editing, share, publish or update, duplicate, download, delete |

---

## The solution

A Library, one click below **New chat**, where assets are listed in their own right, with their state visible at a glance and the right next action ready.

### 1. The asset becomes the main object
- **My assets** and **Shared with me** tabs. Who owns an asset is the main split, because it decides what you can do with it.
- Search across title, content *and* source chat name, so "sales" finds the sales page even if its chat was called something else.
- Only two filters, Type and Status. Sorted by last edited by default.
- A list view with small thumbnails is the default, and a grid view is one click away. The list is easier to scan for details; the thumbnails help people recognise visual assets.

### 2. Status and visibility are separate
Putting both in one chip is what causes today's confusion, so the Library splits them into two independent questions:

| **Status**: which version is live? | **Visibility**: who can see it? |
|---|---|
| Draft | 🔒 Only you |
| Published | 👥 Shared with people |
| **Published · changes pending** | 🏢 Anyone at Foundever |
| Unpublished | 🌐 Public on the web |

**Published · changes pending** is the state most products get wrong. Someone edits the live sales page in chat, and colleagues keep seeing the old version without anyone realising. The Library calls it out and makes **Update live version** the primary action.

### 3. Riskier visibility looks riskier
- Visibility goes up in steps from private to public. Only **Public** gets a warning colour, because a page made public by accident is the most costly mistake in the system.
- **Friction only where it protects.** Making something public asks for confirmation ("This page will be visible to anyone on the internet"). Making it more private takes one click.

### 4. The primary action depends on the state
The asset panel reuses the right-side preview panel people already know from chat. Its primary button always moves the asset to the next step of its lifecycle: **Publish**, **Update live version** or **Republish**. When there's nothing left to do, the button changes to a disabled "✓ Published" confirmation. **Share** sits next to it in every state.

### 5. Editing goes back through chat
EverGPT edits through conversation, so the Library doesn't try to be an editor. **Edit in new chat** opens a new conversation with the asset loaded. **Chat history** lets you pick up an earlier chat where you left off. In chat, the asset card shows its real status and a **Saved to Library · View** link, so you can get back to the Library from where the asset was made.

### Edge cases
- **Shared with me, as a Viewer:** a colleague's chat is private, so the primary action is **Duplicate and edit**.
- **Source chat deleted:** the asset stays, its source reads "Source chat deleted", and Edit in new chat still works.
- **Empty Library:** explains what will appear here and suggests prompts to get started.

### Scope decisions

**In V1:** retrieval and clear status first. **Left out on purpose:** folders, tags, team spaces, comments, full version history, analytics and bulk actions. At the expected scale (tens of assets per person, not hundreds), search plus recency is enough, and organisation features only pay off once people trust the Library as the place their work lives.

### How success is measured
- **Main metric:** the re-engagement rate, meaning the % of assets reopened after the session that created them.
- **Find:** search-to-open rate, and searches that end without a click.
- **Understand:** in usability tests, can people correctly say whether an asset is live and who can see it?
- **Guardrail:** accidental publishes and unintended public pages should go down.

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
