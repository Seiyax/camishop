(() => {
  "use strict";

  /* ---------------------------------------------------------
     1. Mobile Navigation Toggle
     --------------------------------------------------------- */
  const menuToggle = document.getElementById("menuToggle");
  const mobileNav = document.getElementById("mobileNav");

  if (menuToggle && mobileNav) {
    const closeMenu = () => {
      menuToggle.setAttribute("aria-expanded", "false");
      menuToggle.setAttribute("aria-label", "Open menu");
      mobileNav.hidden = true;
    };

    menuToggle.addEventListener("click", () => {
      const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
      if (isOpen) {
        closeMenu();
      } else {
        menuToggle.setAttribute("aria-expanded", "true");
        menuToggle.setAttribute("aria-label", "Close menu");
        mobileNav.hidden = false;
      }
    });

    mobileNav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", closeMenu);
    });
  }

  /* ---------------------------------------------------------
     2. "Not available yet" Toast (Google Play / App Store / Coming soon)
     --------------------------------------------------------- */
  const toast = document.getElementById("soonToast");
  const toastClose = document.getElementById("toastClose");
  const triggers = document.querySelectorAll("[data-soon-trigger]");
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  let lastTrigger = null;
  let hideTimer = null;

  function showToast(triggerEl) {
    if (!toast) return;
    lastTrigger = triggerEl || null;

    if (hideTimer) {
      window.clearTimeout(hideTimer);
      hideTimer = null;
    }

    toast.hidden = false;
    window.requestAnimationFrame(() => {
      toast.classList.add("is-visible");
      if (toastClose) toastClose.focus();
    });
  }

  function hideToast() {
    if (!toast || toast.hidden) return;
    toast.classList.remove("is-visible");

    const finish = () => {
      toast.hidden = true;
      if (lastTrigger && typeof lastTrigger.focus === "function") {
        lastTrigger.focus();
      }
    };

    if (prefersReducedMotion) {
      finish();
    } else {
      hideTimer = window.setTimeout(finish, 220);
    }
  }

  triggers.forEach((btn) => {
    btn.addEventListener("click", () => {
      showToast(btn);
    });
  });

  if (toastClose) {
    toastClose.addEventListener("click", hideToast);
  }

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && toast && !toast.hidden) {
      hideToast();
    }
  });
})();
