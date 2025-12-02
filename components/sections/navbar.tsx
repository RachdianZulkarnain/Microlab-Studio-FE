"use client";

import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { MenuIcon, XIcon } from "lucide-react";
import { useTheme } from "next-themes";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Logo } from "../ui/logo";
import { ThemeToggleButton2 } from "../ui/theme-toggle";

const NAV_LINKS: {
  id: string;
  label: string;
  children?: { id: string; label: string }[];
}[] = [
  {
    id: "services",
    label: "Services",
    children: [
      { id: "3d-print", label: "3D Printing" },
      { id: "design", label: "3D Design" },
      { id: "materials", label: "Materials" },
    ],
  },
  { id: "blog", label: "Blog" },
  { id: "about-us", label: "About Us" },
];

type NavId = (typeof NAV_LINKS)[number]["id"];

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<NavId>("home");
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const { resolvedTheme, setTheme } = useTheme();
  const [openSearch, setOpenSearch] = useState(false);

  const toggleDropdown = (id: string) => {
    setOpenDropdown((prev) => (prev === id ? null : id));
  };

  useEffect(() => {
    const ids = NAV_LINKS.map((x) => x.id);

    const setFromHash = () => {
      const hash = window.location.hash || "";
      const id = (hash.replace("#", "") || "home") as NavId;
      setActive(ids.includes(id) ? id : "home");
    };

    setFromHash();
    window.addEventListener("hashchange", setFromHash);
    return () => window.removeEventListener("hashchange", setFromHash);
  }, []);

  const handleNavClick = (id: NavId) => {
    setActive(id);
    setOpen(false);
    setOpenDropdown(null);
  };

  return (
    <nav className="sticky top-0 z-50 w-full bg-white dark:bg-black border-b px-6 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link
          href="/"
          className="flex items-center gap-2"
          onClick={() => handleNavClick("home")}
        >
          <Logo className="w-10" />
        </Link>

        {/* DESKTOP MENU */}
        <div className="font-incognito hidden md:flex items-center gap-6">
          {NAV_LINKS.map((x) => {
            const isActive = active === x.id;
            const hasChildren = Array.isArray(x.children);

            return (
              <div key={x.id} className="relative group">
                {/* PARENT LABEL */}
                {hasChildren ? (
                  <div
                    className={cn(
                      "relative text-sm font-medium tracking-wide transition-all flex items-center gap-1 group cursor-default",
                      "text-gray-600 dark:text-gray-300",
                      "group-hover:text-blue-600 dark:group-hover:text-blue-400"
                    )}
                  >
                    {x.label}

                    <motion.span
                      className="inline-block transition-transform duration-200 group-hover:rotate-180"
                      initial={false}
                      animate={{ rotate: 0 }}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 opacity-70 group-hover:opacity-100 transition"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </motion.span>
                  </div>
                ) : (
                  <Link
                    href={`/${x.id}`}
                    onClick={() => handleNavClick(x.id)}
                    className={cn(
                      "relative text-sm font-medium tracking-wide transition-all",
                      "hover:text-blue-600 dark:hover:text-blue-400",
                      isActive
                        ? "text-blue-600 dark:text-blue-400"
                        : "text-gray-600 dark:text-gray-300"
                    )}
                  >
                    {x.label}

                    {isActive && (
                      <motion.div
                        layoutId="underline"
                        className="absolute left-0 right-0 -bottom-1 h-0.5 bg-blue-600 dark:bg-blue-400"
                        transition={{
                          type: "spring",
                          stiffness: 350,
                          damping: 24,
                        }}
                      />
                    )}
                  </Link>
                )}

                {/* DROPDOWN DESKTOP */}
                {hasChildren && (
                  <div
                    className={cn(
                      "absolute left-0 w-48 mt-2 p-2 rounded-lg shadow-lg border",
                      "bg-white dark:bg-black",
                      "opacity-0 invisible group-hover:opacity-100 group-hover:visible",
                      "transition-all duration-200 z-50"
                    )}
                  >
                    {x.children?.map((child) => (
                      <Link
                        key={child.id}
                        href={`/${child.id}`}
                        onClick={() => handleNavClick(child.id as NavId)}
                        className="block px-3 py-2 rounded-md text-sm text-gray-700 dark:text-gray-300 
                        hover:bg-gray-100 dark:hover:bg-gray-900 transition"
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* ACTION BUTTONS */}
        <div className="flex items-center gap-3">
          {/* SEARCH BUTTON */}
          <div className="relative hidden md:block group">
            <button
              onClick={() => setOpenSearch((p) => !p)}
              className={cn("flex items-center justify-center w-10 h-10 ")}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-gray-600 dark:text-gray-300"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 21l-4.35-4.35m1.1-5.4a6.5 6.5 0 11-13 0 6.5 6.5 0 0113 0z"
                />
              </svg>
            </button>
          </div>

          {/* FULL WIDTH DROPDOWN */}
          {openSearch && (
            <div
              className={cn(
                "absolute left-0 right-0 top-full mt-1 px-4 z-50" // FULL WIDTH
              )}
            >
              <div
                className={cn(
                  "w-full p-4 rounded-xl border shadow-lg",
                  "bg-white dark:bg-black border-gray-300 dark:border-gray-700",
                  "animate-in fade-in slide-in-from-top-2 duration-200"
                )}
              >
                <div className="flex justify-center">
                  <div className="flex w-full max-w-xl gap-2">
                    {" "}
                    <input
                      type="text"
                      autoFocus
                      placeholder="Search Microlab Studio . . ."
                      className="flex-1 px-4 py-3 text-sm rounded-lg border bg-transparent
          border-gray-300 dark:border-gray-700
          outline-none font-incognito"
                    />
                    <button
                      className={cn(
                        "px-4 py-3 rounded-lg border text-sm font-incognito",
                        "border-gray-300 dark:border-gray-700",
                        "hover:bg-gray-100 dark:hover:bg-gray-900 transition"
                      )}
                    >
                      Search
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
          <Link
            href="/OrderNow"
            className={cn(
              "font-incognito hidden md:inline-block px-4 py-2 rounded-full text-sm font-medium",
              "border border-gray-300 dark:border-gray-700",
              "hover:bg-gray-100 dark:hover:bg-gray-900 transition"
            )}
          >
            Order Now
          </Link>

          <Link
            href="/SignIn"
            className={cn(
              "font-incognito hidden md:inline-block px-4 py-2 rounded-full text-sm font-medium",
              "border border-gray-300 dark:border-gray-700",
              "hover:bg-gray-100 dark:hover:bg-gray-900 transition"
            )}
          >
            Sign In
          </Link>

          <button
            onClick={() =>
              setTheme(resolvedTheme === "dark" ? "light" : "dark")
            }
            aria-label="Toggle theme"
          >
            <ThemeToggleButton2 className="size-5" theme={resolvedTheme} />
          </button>

          {/* MOBILE MENU BUTTON */}
          <button
            className="md:hidden p-2 rounded-md border hover:bg-gray-100 dark:hover:bg-gray-900 transition"
            onClick={() => setOpen((s) => !s)}
          >
            <AnimatePresence mode="wait" initial={false}>
              {open ? (
                <motion.div
                  key="close"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                >
                  <XIcon className="size-5" />
                </motion.div>
              ) : (
                <motion.div
                  key="menu"
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                >
                  <MenuIcon className="size-5" />
                </motion.div>
              )}
            </AnimatePresence>
          </button>
        </div>
      </div>

      {/* MOBILE MENU */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden overflow-hidden"
          >
            <div className="font-incognito mt-2 flex flex-col gap-1 border rounded-lg p-3 bg-white dark:bg-black">
              {NAV_LINKS.map((x) => {
                const hasChildren = Array.isArray(x.children);
                const isOpen = openDropdown === x.id;

                return (
                  <div key={x.id}>
                    {/* PARENT ITEM */}
                    <button
                      onClick={() =>
                        hasChildren
                          ? toggleDropdown(x.id)
                          : handleNavClick(x.id)
                      }
                      className={cn(
                        "w-full flex items-center justify-between px-3 py-2 rounded-md text-sm transition",
                        "hover:bg-gray-100 dark:hover:bg-gray-900",
                        active === x.id
                          ? "font-semibold text-blue-600 dark:text-blue-400 bg-gray-50 dark:bg-gray-900"
                          : "text-gray-700 dark:text-gray-300"
                      )}
                    >
                      {x.label}

                      {hasChildren && (
                        <motion.span
                          animate={{ rotate: isOpen ? 180 : 0 }}
                          transition={{ duration: 0.2 }}
                          className="inline-block"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4 opacity-70 transition"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 9l-7 7-7-7"
                            />
                          </svg>
                        </motion.span>
                      )}
                    </button>

                    {/* CHILDREN */}
                    {hasChildren && isOpen && (
                      <div className="ml-4 flex flex-col gap-1 mt-1">
                        {x.children?.map((child) => (
                          <Link
                            key={child.id}
                            href={`/${child.id}`}
                            onClick={() => {
                              handleNavClick(child.id as NavId);
                              setOpen(false);
                            }}
                            className="px-3 py-2 rounded-md text-sm text-left text-gray-600 
                            dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-900 transition"
                          >
                            {child.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}

              <Link
                href="/OrderNow"
                onClick={() => setOpen(false)}
                className={cn(
                  "font-incognito mt-2 px-3 py-2 rounded-md text-sm font-semibold text-white",
                  "bg-blue-600 hover:bg-blue-700 transition text-center"
                )}
              >
                Order Now
              </Link>

              <Link
                href="/SignIn"
                onClick={() => setOpen(false)}
                className={cn(
                  "font-incognito mt-2 px-3 py-2 rounded-md text-sm font-semibold text-white",
                  "bg-blue-600 hover:bg-blue-700 transition text-center"
                )}
              >
                Sign In
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
