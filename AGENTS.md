<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

## Suda architecture
- Keep domain types, fictional records and pure rules in an isolated mock module, with mutable session/CRUD state in a root React provider; this makes the frontend replaceable without external service coupling.
- Use top-level TanStack file routes for content and Radix dialogs for create/edit/delete forms; this retains accessible navigation and consistent focused editing flows.
- Define visual roles and responsive styles centrally in src/styles.css; this prevents feature code from bypassing the branded semantic theme.
- The Arabic wordmark is a replaceable shared component, and its favicon is the same temporary text-based identity; this enables the original report asset to replace both later.
