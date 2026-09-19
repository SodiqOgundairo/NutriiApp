# AGENTS.md — nutiiiApp working rules

1. Never touch `.env`.
   - Do not create, read, edit, overwrite, or copy from `.env`.
   - Use `.env.example` for variable names only.
   - Expected vars: `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`.

2. Only use Devign components from my list. Never invent one.
   - Do not guess or hallucinate Devign component names, props, or imports.
   - If a component is not on my allowed list, stop and ask.
   - If my list is missing, ask for it before writing UI code.

3. Never let type errors block putting this online.
   - Keep `npm run build` able to pass without `tsc` gating it.
   - Always check for type errors separately with `npx tsc --noEmit` so you do not get blocked later.
   - Report type errors clearly, fix types separately. Do not add `tsc -b` back into the build chain.

4. One thing at a time.
   - Do a single task per turn. Stop and report before starting the next.

5. Ask before installing anything new.
   - Do not run `npm install`, `npm add`, `npx`, or add dependencies without explicit approval.
