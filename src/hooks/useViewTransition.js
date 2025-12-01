"use client";
import { useRouter } from "next/navigation";

export const useViewTransition = () => {
  const router = useRouter();

  const navigateWithTransition = (href, options = {}) => {
    const currentPath = window.location.pathname;
    if (currentPath === href) {
      return;
    }

    // Use browser's native View Transitions API
    if (typeof document !== "undefined" && document.startViewTransition) {
      document.startViewTransition(() => {
        router.push(href);
      });
    } else {
      router.push(href);
    }
  };

  return { navigateWithTransition, router };
};
