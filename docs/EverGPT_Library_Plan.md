# EverGPT Library — Design Plan

Working plan for the Foundever candidate assignment. Source of truth for the presentation, wireframes, and prototype.

**Brief in one line:** Design a simple Library experience that helps employees find, understand, and act on assets created in past EverGPT conversations.

**Timebox:** 60–90 minutes. Assessed on: understanding of user need, simple information organisation, prioritisation and trade-offs, working with incomplete context, clear communication.

---

## 1. The problem

In EverGPT today, **the chat is the container and the asset is a byproduct**. The sidebar lists chats by name ("OKRs review", "Design system updates"), but people don't remember chat names. They remember the thing they made: "the sales webpage," "the Q3 deck for the client." Once a conversation scrolls away, the asset is effectively lost.

**Problem statement**

> Employees create valuable assets in EverGPT, but those assets live inside conversations. To find one later, they have to remember which chat produced it, dig through it, and guess whether it's the latest version, whether it's live, and who can see it. The result is lost work, duplicated effort, and risk: people can't tell what's published.

**Core move of the proposal:** invert the model. The Library makes the **asset the primary object**, and the chat becomes its **provenance**: where it came from, and where you go to keep editing it.

---

## 2. Jobs to be done

The brief's three verbs become the backbone of the whole proposal.

### Find
"Where's that thing I made last week?"
- Recall happens by recency, name, and type, not by chat.
- Shared assets add a second question: "What did a colleague send me?"

### Understand
At a glance, the user needs to answer three questions:
- **What is it?** (type, title, preview)
- **Is it live?** (status)
- **Who can see it?** (visibility)

Visibility matters more than it seems. Foundever is a BPO handling client data, so "is this publicly on the web?" is a governance question, not a cosmetic one.

### Act
Continue editing, share or copy link, publish or update, unpublish, duplicate, download, delete.

---

## 3. The status / visibility model

The current UI already shows the ambiguity: the same asset card displays both "Not published" and a "Draft" chip. The fix is to separate two independent questions:

- **Status** (lifecycle): *what version is live?*
- **Visibility** (access): *who can see it?*

Merging them into one chip is how the confusion happens.

### 3a. Status

| State | Meaning | Primary action |
|---|---|---|
| Draft | Never published, only in EverGPT | Publish |
| Published | Live version = latest version | None needed. The primary slot shows a disabled "✓ Published" confirmation |
| Published · changes pending | Live version is behind the latest edit | Update live version |
| Unpublished / Archived | Was live, taken down | Republish |

**Share** sits next to the primary button in every state, so sharing never depends on status. Copy link lives in the Share dialog and the row menu.

**Why Published has no primary action:** the primary button exists to move the asset to its next lifecycle state. When the live version is already the latest, there's nothing to push, so the slot confirms the state instead of inventing a task. The button reappears as "Update live version" as soon as a new edit lands in chat.

**Key insight:** "Published · changes pending" is the state most products get wrong. Someone edits the live sales page in chat, and colleagues keep seeing the old version without anyone realising.

### 3b. Visibility

| Visibility | Who can see it | How it's signalled | Primary action |
|---|---|---|---|
| Private | Only the owner | Lock icon, "Only you" | Share |
| Shared with people | Specific colleagues the owner invited | Avatars + "Shared with 3" | Manage access |
| Anyone at Foundever | Any employee with the link (SSO) | Building icon, "Foundever only" | Copy link |
| Public on web | Anyone on the internet with the link | Globe icon in warning colour, "Public" | Copy link / Make internal |

### 3c. Design principles for the model

- **Escalating risk should look escalating.** Visibility is a ladder from safest to most exposed. Only "Public" gets a strong colour, because an unintentionally public page is the costliest mistake in the system.
- **Status and visibility combine, and the UI must show both at a glance.** Status as a chip, visibility as icon + label next to it.
  - "Draft · Shared with 3" → normal review before going live.
  - "Published · changes pending · Public" → the riskiest combination: the outside world sees an outdated version.
- **Asymmetric friction.** Moving up the ladder (especially to Public) requires confirmation: "This page will be visible to anyone on the internet." Moving down is one click.
- **For "Shared with me", show your permission.** For assets you don't own, what you can *do* matters more than visibility. Rows show **Viewer** or **Editor**. Editors get the owner's actions (Share, Publish / Update, Edit in new chat). Viewers get one primary action, **Duplicate and edit**, which copies the asset to My assets and opens it in a new chat.

---

## 4. Proposed experience

### Entry points
- **"Library" in the sidebar**, directly below "New chat," above Tools.
- **Close the loop where assets are born:** when an asset is created or published in chat, show a light "Saved to Library" confirmation. Discoverability is the most common reason features like this fail.

### Library page structure
- **Two tabs: "My assets" and "Shared with me."** Ownership is the primary mental split, because available actions differ.
- **Search** across title, content, and source chat name.
- **Two filters only:** Type (Webpage, Report, Presentation) and Status.
- **Default sort:** last edited.
- **List view with small thumbnails** rather than a pure card grid. Thumbnails help recognise visual assets; the metadata is what users need to act, and a list scans better. *(Explicit trade-off to state in the presentation.)*

### Row anatomy

```
[thumb] Sales enablement page        Webpage   ● Published · changes pending   🌐 Public
        From chat: "Create webpage about sales"   Edited 2d ago                 [⋯]
```

Fields: thumbnail, title, type, status chip, visibility icon + label, source chat, last edited, overflow menu. Shared-with-me rows add owner and permission (Viewer / Editor).

### Asset detail
- Clicking a row opens the asset in the **same right-side preview panel already used in chat**. Reusing the existing component is cheap to build, familiar to users, and consistent.
- **Panel header:** type, then **Share** (secondary) and the **state-dependent primary action** (see table 3a). Below: title, status, visibility, owner, source chat, last edited, and a Latest edit / Live version preview toggle.
- **Action bar (bottom): editing goes back through chat.** Editing in EverGPT happens through conversation, so the Library is not an editor.
  - **Edit in new chat** (labelled button): starts a fresh chat with the asset loaded. It's the default because a new chat keeps the context focused on the asset, and it works the same whether the original chat still exists or not.
  - **Chat history** (icon button next to it): lists earlier chats that worked on this asset, so you can continue one where you left off. Disabled with "No previous chats" when there are none.
  - **More (⋯):** Duplicate, Download, Rename, Unpublish, Delete.
- **The source chat is still one click away** through the provenance link on every row and in the panel details, so "go back to where I made it" doesn't depend on the action bar.
- **Close the loop in chat:** the asset card in chat shows its real status and a "Saved to Library · View" link that returns to the Library with the asset selected.

### Edge cases
- **Shared asset, Viewer:** a colleague's chat is private, so the primary action is "Duplicate and edit": a copy lands in My assets and opens in a new chat.
- **Source chat deleted:** the asset survives (the point of the brief); provenance reads "Source chat deleted." Edit in new chat still works, so nothing is blocked.
- **Empty state:** explains what lands in the Library and offers a few creation prompts.

---

## 5. Prioritisation

**Guiding principle:** solve retrieval and status clarity first. Organisation features only matter once people trust the Library as the place where their stuff lives.

### In V1
- Sidebar entry + "Saved to Library" confirmation in chat
- My assets / Shared with me tabs
- Search, Type and Status filters, sort by last edited
- List rows with status, visibility, source chat, last edited
- Preview panel with state-dependent primary action
- Core actions: Edit in new chat, continue a previous chat (history), Share, Copy link, Publish / Update / Republish, Duplicate, Download, Rename, Unpublish, Delete
- Confirmation when going Public

### Deliberately out (and why)
| Feature | Why it waits |
|---|---|
| Folders / collections | Most users likely have tens of assets, not hundreds. Search + recency covers that scale; folders add management overhead. |
| Tags, team spaces, comments | Add only when usage data shows the need. |
| Full version history UI | "Changes pending" covers the risky case. History can follow. |
| View analytics on published pages | Nice to have, outside the find / understand / act loop. |
| Bulk actions | Low value at expected asset counts. |

---

## 6. Assumptions and open questions

Framed as "I assumed X; I'd validate it by Y."

1. **Auto-save vs. explicit save.** Assumed: every generated asset is saved automatically (zero effort, nothing lost). Risk: clutter from throwaway drafts, mitigated by recency sort and archive.
2. **Iteration = new version, not new asset.** Assumed: continuing in chat updates the same asset.
3. **Does "Published" always mean public on the web?** The current "Publish to Web" button suggests yes. If so, status and visibility are coupled today, and decoupling them (allowing "publish to Foundever only") is a concrete improvement to raise in the discussion.
4. **Sharing permission model.** Assumed: Viewer and Editor.
5. **Asset volume per user.** Assumed: tens, not hundreds. This number decides whether folders ever matter.
6. **What happens to assets when an employee leaves?** Ownership transfer is out of scope but worth flagging.

---

## 7. Measuring success

| Job | Metric | Why |
|---|---|---|
| Overall | **Re-engagement rate:** % of assets reopened after their original session | Headline metric. Directly measures "remain available after the conversation ends." |
| Find | Search-to-open rate; searches with no click (failure signal); time to find in tests | Is retrieval working? |
| Understand | Usability test: can users correctly say whether an asset is live and who can see it? | Is the status/visibility model legible? |
| Act | % of Library visits ending in an action (continue, share, publish, update) | Is the Library a launchpad, not just a list? |
| Efficiency | Fewer near-identical prompts regenerating an existing asset | Measures avoided duplicate work. |
| Guardrail | Accidental publishes / unintended public exposure trending down | Protects against the costliest failure. |

**Qualitative test script:** "Find the sales page you made last week, tell me if it's live and who can see it, then share it with a colleague." Measure success rate and time.

---

## 8. Deliverable plan: presentation, wireframes, prototype

### 8a. Slide outline (8 slides + edge cases)

1. **The problem** — chat as container, asset as byproduct; problem statement.
2. **Jobs to be done** — Find, Understand, Act.
3. **The status / visibility model** — both tables, the "changes pending" insight, asymmetric friction.
4. **The scenario** — introduces the end-to-end story (8b).
5. **Wireframes** — one moment per job, each tagged Find / Understand / Act (8c).
6. **Prioritisation** — V1 vs. deliberately out.
7. **Assumptions and open questions.**
8. **Measuring success.**
9. *(Optional)* **Edge cases** — Shared with me, deleted source chat, empty state.

### 8b. Scenario that ties the wireframes together

Uses the persona and asset from the brief's screenshots:

> **Randy Bell** needs the sales webpage he made last week. He searches "sales," sees it's **Published · changes pending · Public**, updates the live version, and shares it with his manager.

### 8c. Wireframe list, organised by job

| # | Job | Screen | What it proves | Cut if short on time? |
|---|---|---|---|---|
| 1 | Find | Library list: tabs, search, filters, default state | The asset is the primary object | No |
| 2 | Find | Search result: "sales" returns the asset though the chat was named differently | Assets are found by what they are, not by chat | Yes |
| 3 | Understand | Annotated row anatomy (zoom-in) | The two tables made visible in UI | No |
| 4 | Understand | Preview panel header for "Published · changes pending · Public" | The riskiest state is explained clearly | No |
| 5 | Act | Preview panel with "Update live version" as primary action | State-dependent primary action | No |
| 6 | Act | Confirmation when moving to Public | Asymmetric friction | Yes |
| 7 | Act | Chat opened from "Edit in new chat" or chat history, asset open, "Saved to Library · View" | The loop back to creation | Yes |
| — | Edge | Shared with me (owner + Viewer/Editor), empty state | Completeness | Edge-case slide only |

**Fidelity:** mid-fi, visually close to the existing EverGPT UI so the proposal feels shippable. Judgment over pixels.

### 8d. Prototype scope

Clickable path following the scenario only: Sidebar → Library → search "sales" → open asset → see changes-pending state → Update live version → Share → confirmation. Everything else static.

### 8e. Visual reference from the existing UI (for wireframes / prototype)

- Left sidebar: "Ever GPT" logo, New chat, Tools (GPTs), Chats list, user at bottom (Randy Bell).
- Accent: indigo/purple primary buttons (e.g. "Publish to Web"), lavender user message bubbles.
- Asset card in chat: icon, title, "Not published" subtitle, "Draft" chip, overflow menu.
- Right-side artifact panel with close (×), title, and primary action top-right.
- Light, neutral background; rounded cards; compact type.

### 8f. Discussion prep

When they share the current Library implementation, compare against:
- Does it separate status from visibility?
- Does it handle "published with changes pending"?
- Is the asset or the chat the primary object?
- Where is the primary action, and does it depend on state?

Question to ask them: **"What do users actually do in the current Library, and where do they drop off?"** Positions you as someone who wants data before redesigning.
