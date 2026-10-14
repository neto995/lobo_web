[//]: # (BEGIN:nextjs-agent-rules)

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.

[//]: # (END:nextjs-agent-rules)

---

# LOBO — AI Development Guidelines

## 1. Project context

LOBO is a Mexican dog food brand developing a digital platform for e-commerce, dog health records, customer management and business automation.

**Production:** https://eatlikeawolf.mx  
**Repository:** `neto995/lobo_web`  
**Production branch:** `main`

### Required documentation

Before starting significant development work, read:

1. `docs/PROJECT_STATUS.md` — Current documented progress, pending work and known risks.
2. `docs/ROADMAP.md` — Product direction and priorities.
3. `docs/DECISIONS.md` — Approved decisions and their reasoning.
4. `README.md` — Development instructions and project architecture.
5. Any relevant specialized documentation in `docs/`.

Read documentation from the current branch/worktree by default, not implicitly from `main`.

These documents provide context but do not replace verification against the actual code, Git history, Pull Requests and environment.

If documentation is missing or outdated, report the gap and consult the approved reference branch explicitly before proceeding. Never silently merge branches to synchronize documentation.

## 2. Working principles

- Verify the working directory, active branch and Git status before making changes.
- Understand the existing implementation before proposing modifications.
- Keep changes focused on the authorized task.
- Prefer small, testable changes over large rewrites.
- Explain important architectural decisions and trade-offs.
- Do not introduce new services or dependencies without justification.
- Clearly separate facts, assumptions and proposed solutions.
- When requirements are unclear, ask before implementing changes that could affect existing functionality.
- Avoid unnecessary complexity and overengineering.

## 3. Protected production functionality

Do not modify the following without explicit authorization:

- Mercado Pago checkout and payment integrations.
- Subscription flows and external payment links.
- Product pricing and plans.
- Feeding calculator.
- Existing WhatsApp workflows.
- Production authentication and environment configuration.
- DNS, Vercel production settings or deployment configuration.

Do not deploy to production or merge into `main` without explicit approval.

Before requesting approval, explain in plain language:

1. Exactly what will change in production.
2. The expected impact on existing functionality.
3. Known risks and unresolved issues.
4. The proposed verification and rollback approach, when applicable.

Confirm that the project owner understands what is being deployed.

Changes to payment-related functionality require regression testing and appropriate payment verification.

## 4. Security and privacy

- Never expose or commit passwords, access tokens, API keys or private credentials.
- Keep `.env.local`, private `.mp-sandbox/` files and customer information out of Git.
- Do not assume a secret is safe merely because it is in a private development environment.
- Remind the owner to store secrets in Bitwarden rather than sharing them in Git, chats or screenshots.
- Private customer and dog records must use appropriate authorization controls.
- Supabase PostgreSQL tables containing private records require Row Level Security (RLS) and isolation tests before production use.
- Never assume that successful login automatically grants access to a database record.
- Never treat a Mercado Pago return URL as proof of successful payment.
- Report unresolved vulnerabilities and security risks.
- Do not publish features collecting personal information without reviewing applicable privacy requirements.

## 5. Git workflow

- Work on dedicated branches for significant changes.
- Preserve unrelated code and existing behavior.
- Review changes before committing.
- Use descriptive commit messages.
- Prefer Pull Requests for important integrations.
- Verify the Pull Request's source and destination branches.
- Do not merge, force-push, rewrite shared history or perform destructive operations without authorization.
- Remember that merging development branches does not automatically mean deploying to production.

Before beginning work in an older branch, check whether its project documentation and agent instructions are outdated relative to the approved reference.

Do not merge branches automatically just to synchronize documentation.

## 6. Testing and verification

Before declaring implementation complete:

1. Review the changed files.
2. Run relevant automated tests.
3. Run TypeScript validation and production build when applicable.
4. Report any failing or skipped checks.
5. Identify potential regressions.
6. Clearly distinguish simulated tests, local verification, Preview deployments and production verification.

A successful commit, push, Pull Request or Preview deployment does not by itself prove that a feature is production-ready.

Never report a test as passing unless it was actually executed and its result was verified.

## 7. Working with the project owner

The project owner is learning software development while actively building LOBO.

- Explain unfamiliar technical concepts in accessible language.
- Prefer short, sequential instructions.
- Explain why significant steps are necessary.
- Avoid introducing unrelated technical work without a clear reason.
- Identify when a task is outside the current sprint.
- Request approval before major architectural changes or scope expansion.
- Do not implement proposed ideas merely because they appear in the roadmap.
- Respectfully challenge inconsistent assumptions, flawed reasoning or scope drift.
- Explain concerns briefly and directly, proposing alternatives aligned with the approved product vision.
- Do not agree with the owner merely to be agreeable; prioritize accuracy, feasibility and long-term product quality.
- Balance technical quality with the project's practical constraints, available resources and business priorities.

## 8. Documentation continuity

After significant development work, provide a closing report containing:

- What was implemented or changed.
- Branch and commit information.
- Tests executed and results.
- Remaining issues, risks and blockers.
- Recommended next action.

Update documentation when appropriate:

- `docs/PROJECT_STATUS.md` when implementation status changes.
- `docs/DECISIONS.md` when important decisions are adopted, revised or replaced.
- `docs/ROADMAP.md` when product priorities or scope change.
- Specialized documents when technical procedures change.

Do not overwrite historical decisions without documenting what changed, why it changed and notifying the project owner.

Documentation updates must describe verified outcomes, not assumptions.

Keep documentation concise, consistent and maintainable. Avoid duplicating rapidly changing status information across multiple files.

## 9. Architecture and product boundaries

Mi Expediente, customer management, commerce and automation are related but distinct areas.

- Authentication V1 is not equivalent to persistent database storage.
- Dog records should not be automatically attributed to an authenticated user when ownership cannot be verified.
- Purchasing should not require account creation unless the project owner explicitly changes this decision.
- Customer Journey designs are proposals until the relevant requirements are approved.
- Future functionality in the roadmap is not automatically authorized for implementation.
- Do not introduce dependencies between independent product features without a justified architectural reason.

**Core rule: Protect the existing business, preserve development context, challenge weak decisions constructively and implement only the approved scope.**
