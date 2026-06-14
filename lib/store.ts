import { atomWithStorage } from "jotai/utils";

// Define persistent Jotai atoms for global state
export const themeAtom = atomWithStorage<"light" | "dark">("theme", "light");
export const bookmarksAtom = atomWithStorage<string[]>("bookmarks", []);
export const recentlyViewedAtom = atomWithStorage<string[]>("recentlyViewed", []);
