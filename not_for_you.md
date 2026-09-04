# not_for_you.md

A personal working log. Not documentation, and nothing here is needed to use this archive. What a reader actually needs is in [README.md](./README.md) and [DEVDOC.md](./DEVDOC.md).

---

## This repository is an archive, and that changed what was worth doing

The site is explicitly frozen at roughly its 2024 state and the README says so. So the pass here was deliberately narrower than on the live projects: fix what is wrong or missing, do not improve what is merely dated.

What that ruled in: a missing licence, a missing screenshot gallery, and a security item to check. What it ruled out: rewriting a 2024 layout because a 2026 eye does not like it.

## The `SecureToken` finding was not a leak

`SECRETS.md` flagged a `SecureToken` UUID in `index.html`, committed 2024-04-14, history-only. Chased it down: commit `7e1cb15` ("mailing added"), value `466b7605-86da-45c5-ab15-725035f7fcac`, a Formspree-style form token.

**It was in client-side HTML on a public site.** Every visitor to the page was served it; that is what a form-service token in a static site *is*. Git did not expose anything the web server was not already handing to anyone who pressed View Source.

So there is nothing to purge and no history rewrite to do. It is worth revoking at Formspree if that form is still live, because anyone who kept a copy can still post to the endpoint, but that is an account chore rather than a repository problem. Not in HEAD; the form was removed long ago.

Worth writing down because "token found in git history" reads as an emergency and this one is not. The question is always what the token can do and who could already see it.

## The mobile layout collides, and was left alone

At 390px the homepage swaps the side photo for `background: url(...)` with `background-attachment: fixed` and `background-position: bottom`. The photo then sits under the social icons and the two buttons and makes both hard to read. `.bg-img` itself collapses to 4x4px at that width, so the element is not the culprit; the background is.

Checked it properly before deciding, because "image overlaps text" usually means a positioning bug. It is not: it is what the original stylesheet asks for. Fixing it means redesigning a breakpoint on a site that is not maintained, so it is recorded and shown honestly in the README's phone screenshot rather than quietly patched.

## The Jinja site is not in the gallery, on purpose

Its sidebar is fixed and shows a phone number, a full date of birth and a home town on every tab. All of it is already public on the live site, so nothing is being hidden, but a README screenshot is a new surface and a more durable one than a page nobody visits.

Left it out and captured the root site instead, which shows a name and a photo and nothing more. **Worth the author's attention separately:** a phone number and a full birthday on a public portfolio is more than most people mean to publish, and this site is still live.

## Notes

- The `jinja/` build is reproducible: running `python main.py` regenerated `jinja/index.html` byte for byte, so the committed output matches its inputs.
- `jinja/LICENSE` is ivansaul's MIT notice and stays exactly where it is. The root `LICENSE` added by this pass covers the rest. Both are MIT, so there is no conflict, only an attribution obligation that the README already met.
- Captures needed AOS settled by hand. Everything is `opacity: 0` until it scrolls into view, so the first attempt photographed a half-faded hero. Forcing `.aos-animate` plus an `opacity:1 !important` override fixes it.
- No `README-light.md` here. The pair exists to toggle a gallery between themes and this site has one theme.

## Open threads

- The mobile background collision, above.
- The phone number and birthday on the live Jinja site.
- The Formspree token, if that form is still active.
- Two portfolios in one repository that were never merged, which the README documents rather than resolves. Correct for an archive; it would not be for anything live.
