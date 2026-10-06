# Build brief: EverGPT Library — clickable prototype

You are building a **clickable, high-fidelity prototype** of the EverGPT Library for a design-candidate presentation at Foundever. It will be demoed live on a laptop and then compared with the company's current Library. It must look like the same product as the existing EverGPT chat, follow one scripted scenario flawlessly, and feel real everywhere else.

This is a prototype, not production: no backend, no auth, no persistence beyond the session. All data is seeded in memory.

---

## 0. Source material (read before writing code)

Put these files in `/docs` at the repo root and read them first:

| File | What it is | How to use it |
|---|---|---|
| `docs/Foundever_design-assessment.pdf` | The original assignment, with screenshots of today's EverGPT chat and empty state | Ground truth for the existing look and the brief |
| `docs/EverGPT_Library_Plan.md` | The design plan: problem, status/visibility model, V1 scope, edge cases, scenario | **Source of truth for behaviour.** If this brief and the plan disagree, ask. |
| `docs/evergpt-design-system.html` | Tokens, type, and `eg-*` component CSS sampled from the product | **Copy the `<style id="evergpt-tokens">` and `<style id="evergpt-components">` blocks verbatim** into `src/styles/tokens.css` and `src/styles/components.css`. Read its "Principles" and "Library direction" sections. |

**Figma (if the Figma MCP is connected):** file key `JKdxDDlWUkhVyrOpxHYgSP`.

| Node | Frame |
|---|---|
| `8:2` | Library — List view (default, asset open) — **the primary screen to match** |
| `14:16` | Library — Grid view |
| `12:100` | Annotations — main proposal (7 numbered callouts) |
| `15:346` | Annotation — grid view |
| `28:92` | EverGPT Design System |
| `5:37` | Existing screens (chat + empty state) |

URL: https://www.figma.com/design/JKdxDDlWUkhVyrOpxHYgSP/Foundever?node-id=12-169

If the Figma MCP is available, pull `get_design_context` / `get_screenshot` for `8:2` and `14:16` and match them closely. If not, this brief contains the measured values you need (section 4).

---

## 1. Stack and setup

- **Vite + React 18 + TypeScript.** Plain CSS using the design-system custom properties. No Tailwind, no UI kit: the `eg-*` classes already exist and the look depends on them.
- **Icons:** `@tabler/icons-react`, outline, size 18, stroke 1.5 (the design system says the product uses Tabler).
- **Fonts:** Google Fonts — Inter (400/500/600/700), Noto Sans (400/500/700), Figtree (600/700). Link in `index.html`.
- **State:** a single `useReducer` store in React context. No localStorage. Add a "Reset demo" action (see 7.4).
- **Routing:** simple in-app view state (`home | chat | library`) — no router needed. Keep the URL static so a refresh always resets to the start.
- **Target viewport:** desktop, designed at **1440 × 900**. Must work 1280–1920 wide. No mobile layout needed; below 1100px it's fine to show a "Best viewed on desktop" note.
- **Deploy:** must build to static files (`npm run build`) so it can be hosted on Vercel/Netlify or opened locally.

Suggested structure:

```
src/
  styles/ tokens.css components.css app.css
  data/ assets.ts people.ts chats.ts
  store/ reducer.ts context.tsx selectors.ts
  components/
    Sidebar.tsx  Toast.tsx  Dialog.tsx  Menu.tsx  StatusBadge.tsx  VisibilityLabel.tsx
    library/ LibraryPage.tsx  Toolbar.tsx  AssetList.tsx  AssetRow.tsx  AssetGrid.tsx  AssetCardTile.tsx  EmptyState.tsx
    panel/ AssetPanel.tsx  PanelHeader.tsx  ChangesCallout.tsx  Details.tsx  Preview.tsx  ActionBar.tsx
    dialogs/ ShareDialog.tsx  PublishDialog.tsx  ConfirmPublicDialog.tsx  DeleteDialog.tsx
    chat/ HomeView.tsx  ChatView.tsx  AssetCard.tsx  Composer.tsx
    previews/ SalesPagePreview.tsx  DeckPreview.tsx  ReportPreview.tsx
```

---

## 2. The idea the prototype must prove

> **The asset is the object. The chat is its provenance.**

Every screen should answer three questions about each asset at a glance:

1. **What is it?** — type icon, title, thumbnail/preview
2. **Is it live?** — **Status** (lifecycle)
3. **Who can see it?** — **Visibility** (access)

Status and visibility are **two separate fields shown side by side**, never merged into one chip.

---

## 3. Data model

### 3.1 Types

```ts
type AssetType = 'webpage' | 'presentation' | 'report';
type Status = 'draft' | 'published' | 'changes_pending' | 'unpublished';
type Visibility = 'private' | 'people' | 'org' | 'public';
type Permission = 'owner' | 'editor' | 'viewer';

interface Person { id: string; name: string; initials: string; email: string; }

interface Asset {
  id: string;
  title: string;
  type: AssetType;
  status: Status;
  visibility: Visibility;
  sharedWith: string[];          // person ids, used when visibility === 'people' (and shown in Share dialog for any level)
  ownerId: string;               // 'randy' for My assets
  permission: Permission;        // 'owner' for My assets; editor/viewer for Shared with me
  sourceChatId: string | null;   // null => "Source chat deleted"
  sourceChatTitle: string;       // display text for the provenance link
  editedAt: string;              // ISO date; render relatively
  livePublishedAt?: string;      // for published / changes_pending
  editsSincePublish?: number;    // for changes_pending
  keywords: string[];            // simulated "content" for search
  previewKind: 'sales' | 'deck' | 'report' | 'faq' | 'story';
}
```

### 3.2 Labels (use exactly these words)

**Status** — always a word; colour only reinforces it.

| Value | Badge text (list & panel) | Badge text (grid, short) | Badge style |
|---|---|---|---|
| `draft` | Draft | Draft | neutral: fill `#f2f2f0`, 1px `#ebebed`, text `#45444a` |
| `published` | Published (with dot) | Published | fill `#e3f5e8`, text `#1b6b34` |
| `changes_pending` | Published · changes pending (with dot) | Changes pending | fill `#fdf1d8`, text `#8a5a00` |
| `unpublished` | Unpublished | Unpublished | neutral fill/border, text `#636363` |

**Visibility** — icon + label, plain text (no fill) except Public.

| Value | Icon (Tabler) | Row label | Panel label | Style |
|---|---|---|---|---|
| `private` | `IconLock` | Only you | Only you | `ink-muted` text |
| `people` | stacked 22px avatars (max 3, then "+n") | `3` (count next to avatars) / grid: "3 people" | Shared with 3 people | `ink-secondary` |
| `org` | `IconBuilding` | Foundever | Anyone at Foundever | `ink-secondary` |
| `public` | `IconWorld` | Public | Public on the web (with chevron, opens Share) | **pill**: fill `#fdeceb`, text `#a8261b`, weight 500, radius 4 |

Only Public gets a strong colour. An unintended public page is the costliest mistake in the system.

**Primary action by state** (owner):

| Status | Panel header buttons (secondary → primary) |
|---|---|
| `draft` | — → **Publish** |
| `published` | — → **Copy link** |
| `changes_pending` | Copy link → **Update live version** |
| `unpublished` | — → **Republish** |

Exactly **one** `brand` (#5959eb) button per view.

For **Shared with me**: `editor` → primary **Edit in new chat**; `viewer` → primary **Duplicate and edit**. (A colleague's chat is private, so you never land in their chat.) Show their permission as a neutral badge "Editor" / "Viewer".

### 3.3 Seed data

People: `randy` Randy Bell (RB, randy.bell@foundever.com — the signed-in user), `ana` Ana Petrović (AP), `mark` Mark Kelly (MK, Randy's manager), `jovana` Jovana Stojić (JS), `luka` Luka Marić (LM), `sara` Sara Novak (SN).

Today in the prototype = **2 Oct 2026**. Render dates as "2d ago", "3d ago" within a week, otherwise "Sep 28".

**My assets** (in this order by edited date — this must match Figma `8:2` / `14:16`):

| # | Title | Type | Status | Visibility | Source chat | Edited |
|---|---|---|---|---|---|---|
| 1 | Sales enablement page | webpage | changes_pending (live Sep 30, 3 edits since) | public | Create webpage about sales (full: "Create webpage about sales at foundever") | 2d ago |
| 2 | Q3 OKRs review | presentation | published | org | OKRs review | 3d ago |
| 3 | Design system update notes | report | draft | people: ana, mark, jovana | Design system updates | 5d ago |
| 4 | Acme retail client pitch | presentation | draft | private | Acme pitch prep | Sep 28 |
| 5 | Onboarding FAQ page | webpage | published | org | Onboarding FAQ | Sep 22 |
| 6 | Weekly CSAT summary | report | unpublished | private | *(deleted)* → "Source chat deleted" | Sep 15 |
| 7 | Telco customer story | webpage | draft | people: ana, luka, sara | Telco case study | Sep 12 |
| 8 | Q4 hiring plan | report | published | org | Hiring plan Q4 | Sep 8 |

Tab counts are computed from data (Figma shows "14" as a placeholder; showing the real count of 8 is correct).

**Shared with me** (5):

| Title | Type | Owner | Permission | Status | Visibility | Edited |
|---|---|---|---|---|---|---|
| Brand voice guidelines | report | Ana Petrović | Viewer | published | org | 1d ago |
| EMEA sales playbook | presentation | Mark Kelly | Editor | changes_pending | people | 4d ago |
| Holiday peak staffing page | webpage | Jovana Stojić | Viewer | published | public | Sep 29 |
| Client NPS deep dive | report | Luka Marić | Editor | draft | people | Sep 24 |
| New-hire buddy programme | webpage | Sara Novak | Viewer | published | org | Sep 18 |

Keywords: give "Sales enablement page" `['sales','enablement','pitch','convert','webpage']` and give "Acme retail client pitch" `['retail','sales pitch','acme']` and "EMEA sales playbook" `['sales','emea']`, so searching **"sales"** returns several results including one matched only on content (see 5.2). Other assets get 3–5 plausible keywords.

Chats in the sidebar (recent first): "Create webpage about sales", "OKRs review", "Design system updates".

---

## 4. Layout and visual spec

Match Figma `8:2`. Use design-system tokens everywhere; never hard-code a colour that has a token.

### 4.1 Shell
- **Sidebar** 252px, `surface-sidebar`, right hairline `border`. Padding 16/12. Logo lockup (`eg-logo`) top. Then: **New chat** (IconEdit), **Library** (IconLayoutSidebar / table-ish icon), label **Tools**, **GPTs** (with chevron), label **Chats**, chat rows, spacer, user footer (RB avatar `#aaefb9`, "Randy Bell", email).
- **Library sits directly under New chat** (Figma annotation 1 — this is a deliberate change from the design-system doc, which put it under Tools; follow the Figma). Active row: `brand-tint` fill, `brand-ink` text, weight 500.

### 4.2 Library main (fluid; 668px wide when panel is open at 1440)
Horizontal padding 24px.
- **Header** (78px): title "Library" (`t-title`, Figtree 20/28 600), subtitle "Everything you made in EverGPT chats, in one place" (12–13px, `ink-muted`).
- **Search** (40px tall, full width, `eg-search` style, radius 8, IconSearch): placeholder "Search assets by name, content or source chat". `/` focuses it; `Esc` clears it.
- **Tabs** (43px): "My assets" + count pill, "Shared with me" + count pill. Active tab: `ink` 14px 500 with 2px `brand` underline; count pill `brand-tint` bg / `brand-ink` 11px 500, fully rounded. Inactive: `ink-muted`, neutral count pill. Bottom hairline across the full width.
- **Filter row** (52px): two dropdown pills **"Type: All"** and **"Status: All"** (28px, radius full, 1px `border`; label in `ink-muted`, value in `ink` 500; chevron). Right side: **"Last edited ↓"** sort control, a 1px divider, and a **list/grid segmented toggle** (62×28; two 28px icon buttons IconList / IconLayoutGrid; selected = white on `surface-muted` track).
  - Type menu: All, Webpages, Presentations, Reports.
  - Status menu: All, Draft, Published, Changes pending, Unpublished.
  - Sort menu: Last edited (default), Name A–Z, Created.
  - Active filter pills switch to `eg-filter.on` styling and show the value; add a small × to clear.
- **List header** (33px): columns **Name · Status · Who can see it · (⋮)** in `label` style `ink-muted`, bottom `border`.
- **Rows** (56px tall, inset 12px, radius 10, 2px gap): grid columns ≈ `minmax(0,1fr) 196px 104px 28px`.
  - Name cell: 36px `eg-tile` with type icon (IconWorld webpage, IconPresentation/IconDeviceDesktop presentation, IconFileText report) · title (`t-item-title`, ellipsis) · meta line `12px ink-muted`: `2d ago · [IconMessage] Create webpage about…` where the chat name is a `brand-ink` link that opens the chat. Deleted source: `Sep 15 · Source chat deleted` (no link, no icon).
  - For Shared with me, the meta line is `1d ago · Shared by Ana Petrović` and the Status cell also shows the Editor/Viewer badge after the status badge.
  - Hover: `surface-sidebar`. **Selected** (panel open on it): `surface-muted` (#f3f2f7).
  - ⋮ = `eg-kebab`, opens the row menu (7.3).

### 4.3 Grid view (Figma `14:16`)
4 columns at 1440 with panel closed (auto-fill, min 220px), 16px gap. Card: radius 10, 1px `border-soft`; top **thumbnail area** (~170px tall, `surface-muted` bg, a white mini-preview of the asset inset); body: type icon + title + ⋮; meta line (date · chat link); bottom row: short status badge + visibility label. Selected card gets a 2px `brand` outline. Clicking a card opens the same side panel; grid reflows to fewer columns when the panel is open.

### 4.4 Asset panel (520px, right, 1px left `border`)
Slides in (200ms ease-out) when a row/card is clicked. `Esc` or × closes it.
1. **Panel header** (64px, bottom `border`): × close (`eg-kebab`), type label ("Webpage", `ink-secondary` 14px), then right-aligned buttons per 3.2. Copy link = `eg-btn secondary` with IconLink; Update live version = `eg-btn primary` with IconRefresh.
2. **Summary** (padding 18/20):
   - Title "Sales enablement page" (`t-title`).
   - Badge row: status badge + visibility badge. For public: `IconWorld Public on the web ⌄` pill — clicking it opens the Share dialog.
   - **Changes-pending callout** (only when `changes_pending`): fill `#fdf8ec`, 1px `#f3dfae`, radius 8, padding 12/14, IconAlertTriangle in `#8a5a00`. Title 13px 500 `#5e3d00`: *"Anyone with the link still sees the old version"* (if visibility is org: "Everyone at Foundever still sees…"; people: "People you shared with still see…"). Body 12px `#8a5a00`: *"Live version published Sep 30. You made 3 edits in chat since then. Update to push them live."*
   - **Details** — two-column definition list (label 12px `ink-muted` ~96px; value 12px `ink`): Type · Webpage / Owner · You (Randy Bell) / Source chat · [IconMessage] *Create webpage about sales at foundever* (brand-ink link) / Last edited · 2 days ago · Live version Sep 30.
3. **Preview area** (fills remaining height, `surface-sidebar` background, padding 14/20): toolbar with "Preview" label (12px 500 `ink-muted`) and, only for published/changes_pending, a segmented control **Latest edit | Live version** (track `surface-muted`, selected white, 12px). Below: a white rounded (8px) card containing a scaled live render of the asset (section 6).
4. **Action bar** (57px, top `border`): **Continue in chat** (secondary, IconMessage), **Share** (secondary, IconUsers), spacer, icon buttons **Duplicate** (IconCopy), **Download** (IconDownload), **More** (IconDots → Unpublish, Rename, Delete). Each icon button has a tooltip.

---

## 5. The scripted scenario (must be flawless)

> **Randy Bell** needs the sales webpage he made last week. He finds it in the Library, sees it is **Published · changes pending · Public**, updates the live version, and shares it with his manager.

### 5.1 Start: home
App opens on the existing EverGPT empty state (match the assignment PDF, page 1, bottom screenshot): sidebar (now with **Library** under New chat), centred greeting "How can I help you today?", composer with Attach + Search chips and the brand mic button, footnote text underneath. Nothing is selected in the sidebar.

### 5.2 Find
1. Click **Library** → Library page, My assets, list view, no panel, sorted by last edited.
2. Type **"sales"** in search (debounce ~120ms). Results filter live. Matched text in titles is highlighted (`brand-tint` background, `brand-ink` text). Rows matched only by content or chat name show a small hint at the end of the meta line, e.g. *"· Matched in content"*. The tab counts update to show matches per tab ("My assets 2 · Shared with me 1"), so cross-tab hits aren't hidden.
3. Note: the search hits "Sales enablement page" even though the user remembers "the sales page", not the chat name — this is the point.

### 5.3 Understand
4. Click the **Sales enablement page** row → row becomes selected, panel slides in.
5. Panel shows status **Published · changes pending**, visibility **Public on the web** (red pill), the amber callout, and buttons **Copy link** + **Update live version**.
6. Toggle **Live version** in the preview → preview switches to the older version (section 6.1). Toggle back to **Latest edit**.

### 5.4 Act — update
7. Click **Update live version**. Because the asset is Public, show a light confirm popover anchored to the button (not a full modal): *"Push 3 edits live? Anyone with the link will see the latest version."* [Cancel] [Update]. 
8. On Update: button shows a spinner + "Updating…" for ~900ms, then:
   - status → `published`, `livePublishedAt` → today, `editsSincePublish` → 0
   - callout collapses (animate height), Latest/Live toggle remains but both show the same version
   - header becomes a single primary **Copy link**
   - the row in the list updates to **Published** in place
   - toast: *"Live version updated"* with a "View live" link (opens nothing; it's a stub, show a tooltip "Opens the public page")

### 5.5 Act — share
9. Click **Share** (action bar) → **Share dialog** (modal, 480px, radius 12, `shadow-menu`):
   - Title: "Share "Sales enablement page""
   - **People** input: "Add people by name or email" with autocomplete over seed people. Typing "mar" suggests **Mark Kelly**. Selected people appear as rows with avatar, name, email and a permission select (Viewer / Editor, default Viewer).
   - **General access** — the visibility ladder as a select or vertical radio list, safest first, each with icon and one-line explanation:
     - Only you — "Only you can open it"
     - Specific people — "Only people added above"
     - Anyone at Foundever — "Any employee with the link, after sign-in"
     - Public on the web — "Anyone on the internet with the link" (red icon/label)
   - Footer: **Copy link** (secondary, left) and **Done** (primary).
10. Add Mark Kelly as Viewer → Done → toast *"Shared with Mark Kelly"*. Visibility stays Public; panel details gain "Shared with: MK" avatars.

### 5.6 Asymmetric friction (must exist; not on the main path)
- Moving **up** to *Public on the web* (from any lower level, in Share or Publish) opens a confirm dialog: title *"Make this page public?"*, body *"Anyone on the internet with the link will be able to see it. Don't publish client data or internal-only information."*, buttons [Cancel] [Make public] — the confirm button uses the public red (`#a8261b` bg, white text), not brand.
- Moving **down** (e.g. Public → Anyone at Foundever) is one click with an undo toast: *"Now visible to Foundever only · Undo"*.

---

## 6. Previews

Build previews as **real small React components rendered at full size and CSS-scaled** (`transform: scale()` inside an `overflow:hidden` frame), so they look crisp, not as images.

### 6.1 Sales enablement page (latest edit) — match the assignment PDF screenshot and Figma
- Top nav: "EverGPT × Foundever" (bold, brand on "EverGPT") + nav links Challenge · Capabilities · Use Cases · Impact.
- Hero left: eyebrow pill "SALES ENABLEMENT" (`brand-tint`/`brand-ink`), headline **"Build. / Impress. / Convert."** (three lines, "Impress." in brand), short paragraph, primary pill button "Explore Capabilities" and outline "See Use Cases".
- Hero right: four feature cards (Instant Webpage Creation, Brand-Governed by Default, Global & Multilingual, Visual Storytelling), each with a brand-filled icon square.
- **Stats band** — navy `#0a0a30`: 150K+ Associates · 45 Countries · 60+ Languages · ↓70% Asset time.

**Live version (old):** same page but visibly behind: headline "Build. Impress." (no "Convert."), **no stats band** (or a light grey band with only 3 stats, no ↓70%), and only two feature cards. The difference must be obvious at a glance when toggling.

### 6.2 Others (simpler, reuse across assets)
- `deck`: 16:9 title slide on white with a brand bar, title, subtitle, and a small bar chart.
- `report`: document page with title, meta line, headings and grey text lines, one small table.
- `faq` / `story`: simple webpage variants of the sales layout with different copy.

Grid thumbnails use the same components at a smaller scale.

---

## 7. Everything else that should work (not on the script, but clickable)

### 7.1 Other states in the panel
- **Draft** → primary **Publish** → Publish dialog: choose who can see the published version (default **Anyone at Foundever**; Public triggers 5.6 confirm). On publish: status `published`, toast "Published to Foundever".
- **Published** → primary **Copy link** → toast "Link copied" (actually write a fake URL like `https://ever.foundever.com/p/sales-enablement` to the clipboard).
- **Unpublished** → primary **Republish** (same Publish dialog). Panel note in `ink-muted`: "Taken down Sep 16. Only you can see it."
- **Source chat deleted** → Details show "Source chat deleted" (no link); **Continue in chat** becomes **Edit in new chat**.
- **Shared with me** → Owner shows the colleague; your permission badge (Viewer/Editor) next to the status; primary per 3.2. Share button is disabled for viewers with tooltip "Only the owner and editors can share".

### 7.2 Continue in chat
Opens the **Chat view** for the source chat with the asset open in the right panel — i.e. the original screen from the assignment PDF (page 1, top): chat header with "Cortex" model selector, user bubble "Create webpage about sales at foundever", the in-chat **AssetCard** (now showing the asset's real status, e.g. "Published · 2 days ago" + Published badge, not "Not published / Draft"), the assistant's "Want to push it even further?" suggestions, composer with round + and mic. The chat's sidebar row becomes active. Under the AssetCard, show the small confirmation **"Saved to Library · View"** (12px, `ink-muted`, IconCheck; "View" is a brand-ink link that goes back to Library with the asset selected).

### 7.3 Row / card overflow menu (⋮)
`shadow-menu`, radius 10, 8px padding, 32px items with icons: Open · Open source chat · Share · Copy link · Duplicate · Download · Rename · *(divider)* · Unpublish (only if published/changes pending) · **Delete** (red text). Shared-with-me menus: Open · Duplicate and edit · Copy link · Remove from my Library.
- **Duplicate** → new row "Copy of …" at top, status Draft, visibility Only you, toast "Duplicated".
- **Rename** → title becomes an inline input in the row; Enter saves, Esc cancels.
- **Unpublish** → status `unpublished`, toast with Undo.
- **Delete** → confirm dialog ("Delete "X"? This removes the asset and its published link. The source chat is not affected.") → row removed, toast "Deleted · Undo" (undo restores).
- **Download** → toast "Downloading sales-enablement-page.html" (no real file needed).

### 7.4 Empty, no-results and utility states
- **No results:** centred, IconSearch in a 48px tile, "No assets match "xyz"", subline "Try a different word, or search in Shared with me", and a "Clear search" `brand-ink` link.
- **Empty Library** (reachable via the demo menu below): "Assets you create in chats show up here" (Figtree 20px), one line explaining webpages, reports and presentations land here automatically, and a secondary "New chat" button plus three prompt chips ("Create a webpage about…", "Draft a client report…", "Build a 5-slide deck…").
- **Demo menu:** clicking the user footer opens a small menu: *Reset demo*, *Show empty Library*, *Show annotation pins*. Keyboard: `Shift+R` resets.

### 7.5 Annotation pins (presenter mode)
"Show annotation pins" overlays the 7 numbered orange pins (24px circles, `#e8590c`-ish orange, white number) at the same places as in Figma `8:2`, each with a hover card holding the annotation title and text from Figma node `12:100`:
1. Library sits right under "New chat" (sidebar Library row)
2. One search, two tabs, two filters, two views (search field)
3. Status and visibility are separate columns (status cell of row 1)
4. Provenance on every row (source-chat link in row 2)
5. Primary action follows state (panel primary button)
6. Explain the risk in plain words (callout)
7. The Library is a launchpad, not an editor (action bar)

Pins only render when their target is visible. Off by default.

---

## 8. Interaction and quality details

- Motion: 150–200ms ease-out for panel, menus, dialogs, toasts; respect `prefers-reduced-motion`.
- Toasts: bottom centre, `ink` (#0a0a30) bg, white 14px text, radius 8, `shadow-menu`, optional action link in `brand-soft`, auto-dismiss 4s, stack max 2.
- Focus: visible 2px `brand` ring offset 2px on every interactive element (already in `components.css`). Dialogs trap focus and return it on close. Menus support arrow keys and Esc.
- Keyboard on the list: ↑/↓ move selection, Enter opens the panel, Esc closes panel → clears search.
- Every icon-only button has `aria-label` and a tooltip.
- Text: sentence case, no emoji in product chrome, navy `ink` instead of black.
- No layout shift when the panel opens: the list column narrows; the name column truncates with ellipsis.
- No console errors. `npm run build` passes with zero TS errors.

---

## 9. Out of scope (do not build)

Folders/collections, tags, team spaces, comments, full version history, page analytics, bulk select, real auth, real backend, mobile layout. If you are tempted to add one, don't — the presentation argues these were deliberately cut (see plan §5).

---

## 10. Build order

1. Tokens + components CSS copied from the design-system file; fonts; app shell with sidebar. Screenshot-compare with Figma `8:2` sidebar.
2. Seed data, store, selectors (filter/search/sort/counts).
3. Library list: header, search, tabs, filters, list header, rows. **Checkpoint:** list matches `8:2` with panel closed.
4. Asset panel with all four status variants + Sales page preview (latest + live).
5. Scenario actions: Update live version (popover, loading, state change, toast), Share dialog, Public confirm.
6. Grid view.
7. Menus, rename, duplicate, delete/undo, publish/republish, shared-with-me behaviour.
8. Chat view + home view + "Saved to Library · View".
9. Empty/no-results, demo menu, annotation pins.
10. Polish pass against Figma; run the acceptance test below.

After steps 3, 4 and 6, take a screenshot of the running app at 1440×900 and compare it side by side with the Figma frame; fix spacing, type and colour drift before moving on.

---

## 11. Acceptance test (run this script end to end)

1. App opens on the home empty state; sidebar shows Library under New chat.
2. Click Library → 8 rows in My assets, list view, Sales enablement page on top with **Published · changes pending** and red **Public**.
3. Type "sales" → Sales enablement page and Acme retail client pitch remain; Acme shows "· Matched in content"; Shared with me tab count shows 1.
4. Click Sales enablement page → panel opens; amber callout reads "Anyone with the link still sees the old version"; header shows Copy link + Update live version (only the latter is brand-coloured).
5. Toggle Live version → older page without the stats band; toggle back.
6. Update live version → confirm popover → Update → loading → status Published, callout gone, header shows one Copy link button, row updated, toast "Live version updated".
7. Share → add Mark Kelly (Viewer) → Done → toast "Shared with Mark Kelly".
8. In Share, change General access to Anyone at Foundever → one click, undo toast; change back to Public → confirm dialog with red "Make public" button.
9. Switch to grid view → 8 cards with thumbnails, same badges; open a card → same panel.
10. Open Weekly CSAT summary → "Source chat deleted", Republish primary, Edit in new chat.
11. Shared with me → Brand voice guidelines shows Viewer and primary "Duplicate and edit".
12. Continue in chat on Sales enablement page → chat view with the asset open and "Saved to Library · View"; View returns to Library with the asset selected.
13. User footer → Reset demo → everything back to step 1 state.

When done, give me: the run command, the build command, and a list of anything you couldn't match from the Figma or had to guess.
