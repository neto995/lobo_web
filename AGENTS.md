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

These documents provide context, but do not replace verification against the actual code, Git history and environment.

If documentation is missing from the current branch, report it and consult the appropriate source. Do not silently assume it exists.

## 2. Working principles

- Verify the working directory, active branch and Git status before making changes.
- Understand the existing implementation before proposing modifications.
- Keep changes focused on the authorized task.
- Prefer small, testable changes over large rewrites.
- Explain important architectural decisions and trade-offs.
- Do not introduce new services or dependencies without justification.
- Clearly separate facts, assumptions and proposed solutions.
- When requirements are unclear, ask before implementing changes that could affect existing functionality.

## 3. Protected production functionality

Do not modify the following without explicit authorization:

- Mercado Pago checkout and payment integrations.
- Subscription flows and external payment links.
- Product pricing and plans.
- Feeding calculator.
- Existing WhatsApp workflows.
- Production authentication and environment configuration.
- DNS, Vercel production settings or deployment configuration.

Do not deploy to production or merge into `main` without explicit approval and make sure the user underanstands by emphasizing that what is being deploy.

Changes to payment-related functionality require regression testing and appropriate payment verification.

## 4. Security and privacy

- Never expose or commit passwords, access tokens, API keys or private credentials.
- Keep `.env.local`, `.mp-sandbox/` private files and customer information out of Git.
- Do not assume a secret is safe merely because it is in a private development environment.
- Private customer and dog records must use appropriate authorization controls.
- Supabase PostgreSQL tables containing private records require Row Level Security (RLS) and isolation tests before production use.
- Never assume that successful login automatically grants access to a database record.
- Never treat a Mercado Pago return URL as proof of successful payment.
- Report unresolved vulnerabilities and security risks.
- Remind/emphisize the user to use Bitwarden to keep secrets.

## 5. Git workflow

- Work on dedicated branches for significant changes.
- Preserve unrelated code and existing behavior.
- Review changes before committing.
- Use descriptive commit messages.
- Prefer Pull Requests for important integrations.
- Verify the Pull Request's source and destination branches.
- Do not merge, force-push, rewrite shared history or perform destructive operations without authorization.
- Remember that merging development branches does not automatically mean deploying to production.

Before beginning work in an older branch, check whether its project documentation and agent instructions are outdated relative to the approved reference. Do not merge branches automatically just to synchronize documentation.

## 6. Testing and verification

Before declaring implementation complete:

1. Review the changed files.
2. Run relevant automated tests.
3. Run TypeScript validation and production build when applicable.
4. Report any failing or skipped checks.
5. Identify potential regressions.
6. Clearly distinguish simulated tests, local verification, Preview deployments and production verification.

A successful commit, push, Pull Request or Preview deployment does not by itself prove that a feature is production-ready.

## 7. Working with the project owner

The project owner is learning software development while actively building LOBO.

- Explain unfamiliar technical concepts in accessible language.
- Prefer short, sequential instructions.
- Explain why significant steps are necessary.
- Avoid introducing unrelated technical work without a clear reason.
- Identify when a task is outside the current sprint.
- Request approval before major architectural changes or scope expansion.
- Do not implement proposed ideas merely because they appear in the roadmap.
- Correct the user train of thought if you notice something is ilogical and or pushback to allign vission in a short, nice, direct way.

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

Do not overwrite historical decisions without documenting what changed and why and notifying the user.

Documentation updates must describe verified outcomes, not assumptions.

## 9. Architecture and product boundaries

Mi Expediente, customer management, commerce and automation are related but distinct areas.

- Authentication V1 is not equivalent to persistent database storage.
- Dog records should not be automatically attributed to an authenticated user when ownership cannot be verified.
- Purchasing should not require account creation unless the product owner explicitly changes this decision.
- Customer Journey designs are proposals until the relevant requirements are approved.
- Future functionality in the roadmap is not automatically authorized for implementation.

**Core rule: Protect the existing business, preserve development context and implement only the approved scope.**
