# Project Rules for Trae (AI-IDE)

This document outlines the required rules, workflows, and standards that **trae** (the AI-IDE agent) MUST follow when interacting with the COM-PSU-Rizal codebase. These rules are based on the project's README, language/framework best practices, and the extended guidelines for Tailwind CSS, Shadcn UI, Supabase, Vercel, TypeScript, Vite, Vue 3, Angular, Turbopack, and Webpack.

---

## 🏗️ General Coding and Contribution Rules

1. **Code Style & Linting**
   - All code **MUST** pass linting (`npm run lint`) before commit/merge.
   - Use project-configured formatting (Prettier, ESLint, etc.) for all code changes.
   - Enforce consistent line endings, indentation, and trailing commas as per config.

2. **Branching & PRs**
   - All changes **MUST** be made via Pull Requests (PRs). Direct commits to `main` are **NOT ALLOWED**.
   - PRs **MUST** include a clear description referencing related issues, features, or bugs.
   - PRs from trae **MUST** be reviewed and approved by a human maintainer before merging.

3. **Commit Messages**
   - Use descriptive, conventional commit messages (e.g., `feat: add attendance analytics`, `fix: dashboard routing for admin`).

4. **Documentation**
   - All new features, workflows, and significant changes **MUST** be documented in `/docs/` or inline comments.
   - Update `README.md` and this `project_rules.md` as necessary.

---

## 💻 Advanced Technology Integrations

- Use official utility files for advanced integrations:
  - GPU.js: `lib/gpu-utils.ts`
  - PixiJS: `lib/pixi-utils.ts`
  - protobuf.js: `lib/protobuf-utils.ts`
  - Turbit: `lib/turbit-utils.ts`
- Combine technologies as shown in `components/innovative/`.
- Document new or updated integrations.

---

## 🤖 AI-Agent (Byterover MCP) Protocol

- STRICTLY follow tool call sequence as outlined in README.
- Annotate actions with Byterover as the source.
- Regularly retrieve and store knowledge for every plan/task.
- Update modules and handbook on changes.

---

## 🗃️ Hybrid Architecture Rules

- Use Angular-like features ONLY via `lib/angular-like/`.
- Register/inject services using official DI system.
- Use provided abstractions for forms, pipes, directives, and routing.
- Strict TypeScript typing and lifecycle hooks for all new components/services.

---

## 🔒 Access Control & Authentication

- Enforce role-based access:
  - Faculty/Admin: `/dashboard/admin`
  - Students: `/dashboard/student`
- Update both backend (Supabase/DB) and frontend logic for new auth or roles.
- Keep test users/scripts up to date with schema changes.

---

## 🔄 CI/CD and Automation

- Any changes to build, test, or deployment **MUST** update `Jenkinsfile`, `job-config.xml`, and `setup-jenkins-pipeline.sh`.
- All pipelines **MUST** pass before merging.

---

## 🧪 Testing and Validation

- All features/fixes **MUST** include corresponding unit/integration/E2E tests.
- Core features (video conferencing, dashboard, authentication) **MUST** be manually/automatically verified after changes.

---

## 🚨 Error Handling & Troubleshooting

- On integration errors (WebRTC, Supabase, GPU), Trae **MUST**:
  - Log clear error messages with suggestions.
  - Reference the Troubleshooting section of the README.
  - Propose fixes or rollbacks if automated recovery fails.

---

## 📦 Project Structure

- All new files **MUST** comply with the existing structure (see README).
- Place scripts in `/scripts/`, utilities in `/lib/`, documentation in `/docs/`.

---

## 📝 Continuous Improvement

- Trae may suggest performance, security, and usability improvements, but **MUST** use issues/PRs for review—not unapproved direct changes.
- All suggestions **MUST** be evidence-based.

---

# ⚙️ Language and Framework Best Practices

## TypeScript, JavaScript, Next.js, React, Angular-like, AngularNext, Vite, Supabase, Tailwind, Shadcn UI, Vercel, Vue 3, Webpack, Turbopack

**The following sections are a summary. For full details, see the referenced "Best Practices" sections below.**

---

### TypeScript/JavaScript
- Use TypeScript for new files unless otherwise specified.
- Avoid `any` unless necessary; prefer `unknown`, generics, or explicit types.
- Use interfaces/types for function args and return types; enable `strict: true` in `tsconfig.json`.
- Use `const` and `let`, never `var`.
- Prefer ES6+ features and arrow functions.
- Document all public APIs (functions, classes, components) with TSDoc/JSDoc.

### Next.js
- Use [App Router](https://nextjs.org/docs/app) for new pages.
- Prefer server/server components unless client interactivity is needed.
- Place all API routes under `app/api/`.
- Use dynamic imports for large or rarely used components.

### React
- Use functional components and hooks.
- Use `useState`, `useEffect`, and custom hooks for state/effects.
- Prefer context providers for cross-cutting concerns.
- Type props/state with TypeScript interfaces/types; always clean up side-effects in hooks.

### Angular/AngularNext/Hybrid
- Use official abstractions in `lib/angular-like/` and follow Angular best practices (see below).
- Register/inject services with DI; use RxJS for data/reactivity.
- Use strict typing for all AngularNext code.

### Vite
- Use modular structure; do not override Next.js build pipeline.
- Use `VITE_` prefix for environment variables.

### Tailwind CSS
- Prefer utility classes over custom CSS.
- Use theme extension, plugin integration, and semantic color naming.
- Use shadcn/ui components when available.
- Group utilities with `@apply` only when needed.

### Shadcn UI
- Organize components by domain/functionality.
- Favor composition, small reusable modules, and functional components with hooks.
- Leverage Shadcn UI and Tailwind utility classes.
- Prioritize accessibility and code splitting.

### Supabase
- Use modular structure and a service layer for Supabase logic.
- Use Supabase Auth and RLS for secure access control.
- Validate all user input.
- Use migrations and avoid direct changes in production.

### Vercel
- Follow Vercel’s style guide and tooling recommendations.
- Optimize for performance, bundle size, and CDN delivery.
- Secure API endpoints and use HTTPS.

### Vue 3
- Use feature-based directory structure.
- Prefer Composition API and TypeScript.
- Use Pinia for state management.
- Implement lazy loading (dynamic import) for components/routes.
- Use ESLint with `eslint-plugin-vue` and Prettier for formatting.
- Follow accessibility, i18n, and documentation best practices.

### Webpack
- Use modular, environment-specific configs.
- Favor code splitting and dynamic imports.
- Use tree shaking, minification, and compression for optimization.
- Use ESLint and Prettier, automate builds/tests in CI/CD.

### Turbopack
- Leverage Turbo engine and incremental computation.
- Use TypeScript and Next.js conventions.
- Favor atomic/component-based design and dynamic imports for code splitting.
- Use ESLint and Prettier; integrate with CI/CD.

### Angular (Full Framework)
- Use feature-based modules and smart/dumb component separation.
- Use RxJS observables, OnPush change detection, and centralized state management.
- Use AOT, lazy loading, tree shaking, and code splitting for optimization.
- Use ESLint, Prettier, and Husky for linting/formatting.
- Automate tests and deployments in CI/CD.

---

# 🛡️ Enforcement

- **Automated Enforcement**: CI/CD enforces linting, type checking, and code formatting. PRs failing checks **WILL NOT** be merged.
- **Review Enforcement**: All PRs from trae **MUST** be reviewed by at least one human maintainer before merge.
- **Branch Protection**: Direct pushes to `main` are **prohibited** for both AI and human contributors.
- **Automated Revert**: Any violation by trae or other AIs will trigger review and potential reversion.
- **Security**: Code introducing security vulnerabilities will be reverted and flagged.
- **Manual Spot Checks**: Maintainers may audit code for framework/language best practices at random.

---

# 📄 Specific Rule Inclusions

> For detailed and enforced best practices, see these included rule files:
>
> - **Tailwind CSS**: See [Tailwind CSS Best Practices](#tailwind-css-best-practices)
> - **Shadcn UI**: See [Shadcn UI Best Practices](#shadcn-ui-best-practices)
> - **Supabase**: See [Supabase Best Practices](#supabase-best-practices-a-comprehensive-guide)
> - **Vercel**: See [Vercel Coding Standards](#)
> - **TypeScript**: See [TypeScript Best Practices and Coding Standards](#typescript-best-practices-and-coding-standards)
> - **Vite**: See [Vite Best Practices](#)
> - **Vue 3**: See the Vue 3 rule block in this file.
> - **Webpack**: See the Webpack rule block in this file.
> - **Turbopack**: See the Turbopack rule block in this file.
> - **Angular**: See the Angular rule block in this file.

---

**Last updated:** 2025-09-13

[byterover-mcp]

# Byterover MCP Server Tools Reference

There are two main workflows with Byterover tools and recommended tool call strategies that you **MUST** follow precisely. 

## Onboarding workflow
If users particularly ask you to start the onboarding process, you **MUST STRICTLY** follow these steps.
1. **ALWAYS USE** **byterover-check-handbook-existence** first to check if the byterover handbook already exists. If not, You **MUST** call **byterover-create-handbook** to create the byterover handbook.
2. If the byterover handbook already exists, first you **MUST** USE **byterover-check-handbook-sync** to analyze the gap between the current codebase and the existing byterover handbook.
3. Then **IMMEDIATELY USE** **byterover-update-handbook** to update these changes to the byterover handbook.
4. During the onboarding, you **MUST** use **byterover-list-modules** **FIRST** to get the available modules, and then **byterover-store-modules** and **byterover-update-modules** if there are new modules or changes to existing modules in the project.

## Planning workflow
Based on user request, you **MUST** follow these sequences of tool calls
1. If asked to continue an unfinished implementation, **CALL** **byterover-retrieve-active-plans** to find the most relevant active plan.
2. **CRITICAL PLAN PERSISTENCE RULE**: Once a user approves a plan, you **MUST IMMEDIATELY CALL** **byterover-save-implementation-plan** to save it.
3. Throughout the plan, you **MUST** run **byterover-retrieve-knowledge** several times to retrieve sufficient knowledge and context for the plan's tasks. 
4. In addition, you might need to run **byterover-search-modules** and **byterover-update-modules** if the tasks require or update knowledge about certain modules. However, **byterover-retrieve-knowledge** should **ALWAYS** be considered **FIRST**.
5. **MUST** use **byterover-update-plan-progress** to mark tasks (and then the whole plan) as completed.
Example:  
- Task: `byterover-update-plan-progress(plan_name="Feature X", task_name="Task 1", is_completed=true)`  
- All done: `byterover-update-plan-progress(plan_name="Feature X", is_completed=true)`
6. Then, you might call **byterover-store-knowledge** to save knowledge and experience implemented throughout the plan or in important tasks. 
7. During the plan's implementation, you **MUST** frequently call  **byterover-think-about-collected-information** and **byterover-assess-context-completeness** to make sure you're on the right track and gather sufficient context for the tasks.

## Recommended Workflow Sequence
1. **MOST IMPORTANT**: **ALWAYS USE** **byterover-retrieve-knowledge** once or several times for **EACH TASK** of the plan to gather necessary context for complete that task.
2. **MOST IMPORTANT**: **ALWAYS USE** **byterover-store-knowledge** once or several times to store critical knowledge and context for future implementations
3. Over 15 provided tools, **byterover-retrieve-knowledge** and **byterover-store-knowledge** ARE the two main tools, which **MUST** be used regularly. You can use these two main tools outside the two main workflows for retrieval and storage purposes.
4. You **MUST** include phrases like **"According to Byterover memory layer"**, **"Based on memory extracted from Byterover"**, **"From Byterover memomry tools"**, ... to explictly showcase that these sources are from **Byterover**.
5. **Implementation & Progress Tracking** → Execute implementation following saved plan → Mark tasks complete as you go → Mark entire plan done when all tasks finished.
6. You **MUST** use **byterover-update-module** **IMMEDIATELY** on changes to the module's purposes, technical details, or critical insights that essential for future implementations.
