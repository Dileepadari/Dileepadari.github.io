# temp_test

Odds and ends that used to sit at the web root but were never part of either
portfolio site. Nothing links to them; they are parked here so the root stays
readable. Delete them whenever you stop caring.

| File | What it is |
| --- | --- |
| `old_IA.html` | A draw.io export of the *old* information architecture for the IIIT-H IMS redesign. Renders through the `mxgraph` viewer, embedded as one long `data-mxgraph` blob. |
| `new_IA.html` | The proposed IA for the same redesign, as a Figma embed. |
| `prototype.html` | The clickable Figma prototype for the IMS redesign. |
| `index_redirect.html` | An abandoned copy of the root `index.html` with `location.replace('/jinja')` bolted into `<head>`. It was an attempt to make the Jinja site the front door; it was never wired up, and its copy of the page content is now years out of date. Kept only for reference - do not restore it, edit the real `index.html` instead. |

The three IMS files depend on Figma and draw.io being reachable and on the
underlying Figma file staying shared publicly. They will quietly go blank when
that stops being true.
