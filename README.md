# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some Oxlint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the Oxlint configuration

If you are developing a production application, we recommend enabling type-aware lint rules by installing `oxlint-tsgolint` and editing `.oxlintrc.json`:

```json
{
  "$schema": "./node_modules/oxlint/configuration_schema.json",
  "plugins": ["react", "typescript", "oxc"],
  "options": {
    "typeAware": true
  },
  "rules": {
    "react/rules-of-hooks": "error",
    "react/only-export-components": ["warn", { "allowConstantExport": true }]
  }
}
```

See the [Oxlint rules documentation](https://oxc.rs/docs/guide/usage/linter/rules) for the full list of rules and categories.

## Supabase authentication and administration

1. Create a Supabase project and open its SQL Editor.
2. Run the contents of `supabase/setup.sql`.
3. Copy `.env.example` to `.env.local` and fill in the project's **Project URL** and **publishable/anon key**. Never put a `service_role` key in a `VITE_` variable or browser code.
4. In Supabase Authentication settings, configure the site URL and redirect URLs for your local and production sites. Enable email confirmation if you want customers to verify their email.
5. Start the app with `npm run dev`. Customers can register at `/register`; the signup flow always creates a `customer`.
6. To create the first administrator, register your own account, then run this once in the Supabase SQL Editor using the same email:

   ```sql
   update public.profiles
   set role = 'admin'
   where lower(email) = lower('your-admin-email@example.com');
   ```

   Confirm that exactly one profile was updated. Do not expose admin role assignment in the public signup form.

Administrators can open `/admin` to review customer accounts and booking requests, update booking status, edit the homepage content, and create, edit, or delete blog posts. Re-run `supabase/setup.sql` on an existing project to add the blog table and its access policies. Supabase Row Level Security policies in `supabase/setup.sql` enforce access on the database; route guards are an additional UI layer, not the security boundary.
