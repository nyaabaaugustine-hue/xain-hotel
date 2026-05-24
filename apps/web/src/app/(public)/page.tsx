// The homepage is handled by app/page.tsx at the root level to avoid
// a Next.js route conflict (both this file and app/page.tsx resolve to "/").
// This file is intentionally empty. The (public)/layout.tsx still applies
// to /rooms, /booking, /about, and /contact.
export default function PublicIndexRedirect() {
  return null;
}
