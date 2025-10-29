This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Dark Mode

Dark mode is SSR-friendly and cookie driven:

- Tailwind `dark` class strategy.
- Server reads `app-theme` cookie in `app/layout.tsx` and applies `class="dark"` to `<html>` to avoid any flash.
- `ThemeProvider` receives `initialTheme` from the server and manages client-side toggling.
- `ThemeToggle` POSTs to `/api/theme` to persist the preference; cookie is `app-theme` (1 year lifetime, SameSite=Lax).
- Updated utility classes in `globals.css` use `dark:` variants; additional semantic CSS variables are defined for future extension.

### Usage

```tsx
import { useTheme } from "@/components/ThemeProvider";

function Example() {
  const { theme, toggleTheme } = useTheme();
  return <button onClick={toggleTheme}>Current: {theme}</button>;
}
```

### Changing Theme Programmatically

```ts
await fetch("/api/theme", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ theme: "dark" }),
});
```

### Resetting Theme

Delete the cookie in the browser devtools or issue:

```js
document.cookie = "app-theme=; Max-Age=0; path=/";
```

Next request will fall back to light by default.

This project includes a client-side dark mode implementation:

- Tailwind `dark` class strategy (see `tailwind.config.ts`).
- Persistent theme stored in `localStorage` under the key `app-theme`.
- A no-flash inline script in `app/layout.tsx` applies `class="dark"` before React hydration if previous choice or system preference is dark.
- `ThemeProvider` (`components/ThemeProvider.tsx`) exposes `theme`, `toggleTheme`, and `setTheme`.
- `ThemeToggle` button in the navbar switches between light/dark.
- Custom CSS variables in `globals.css` with overrides under `.dark` plus utility classes updated with `dark:` variants.

### Usage

Call `useTheme()` inside client components to access or change the theme.

```tsx
import { useTheme } from "@/components/ThemeProvider";

function Example() {
  const { theme, toggleTheme } = useTheme();
  return <button onClick={toggleTheme}>Current: {theme}</button>;
}
```

### Extending

Add new semantic colors by extending CSS variables in `:root` and `.dark` in `globals.css`, then reference via utility classes or `var(--bg)` etc.

### Resetting Theme

Remove `localStorage` key:

```js
localStorage.removeItem("app-theme");
```

Reload will fall back to system preference.
