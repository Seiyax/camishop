(() => {
  "use strict";

  /* ---------------------------------------------------------
     0. Clean Anchor Scrolling (no #hash in URL)
     --------------------------------------------------------- */
  if (window.location.hash) {
    const initialTarget = document.querySelector(window.location.hash);
    if (initialTarget) {
      initialTarget.scrollIntoView({ behavior: "auto" });
    }
    window.history.replaceState(null, "", window.location.pathname + window.location.search);
  }

  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", (event) => {
      const targetId = anchor.getAttribute("href");
      if (!targetId || targetId === "#") return;

      const target = document.querySelector(targetId);
      if (!target) return;

      event.preventDefault();

      if (targetId === "#top") {
        window.scrollTo({
          top: 0,
          behavior: "smooth"
        });
      } else {
        target.scrollIntoView({
          behavior: "smooth",
          block: "start"
        });
      }

      if (window.location.hash) {
        window.history.replaceState(null, "", window.location.pathname + window.location.search);
      }
    });
  });

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

    hideTimer = window.setTimeout(finish, 220);
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
  /* ---------------------------------------------------------
     3. Smooth Scroll & Entrance Reveal Animations
     --------------------------------------------------------- */
  const revealTargets = [
    ...document.querySelectorAll(
      ".hero-copy > *, .hero-stage, .glimpse-intro, .glimpse-list .clay-pill-row, .section-head, .bento-grid .clay-tile, .campus-strip, .contact-intro, .contact-list .clay-pill-row, .footer-card"
    )
  ];

  if ("IntersectionObserver" in window && revealTargets.length > 0) {
    // Assign calm stagger delays within sibling groups
    const staggerGroups = [
      document.querySelectorAll(".hero-copy > *"),
      document.querySelectorAll(".glimpse-list .clay-pill-row"),
      document.querySelectorAll(".bento-grid .clay-tile"),
      document.querySelectorAll(".contact-list .clay-pill-row")
    ];

    staggerGroups.forEach((group) => {
      group.forEach((el, idx) => {
        el.style.setProperty("--reveal-delay", `${idx * 75}ms`);
      });
    });

    revealTargets.forEach((el) => el.setAttribute("data-reveal", ""));
    document.documentElement.classList.add("js-ready");

    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-revealed");
            obs.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.08,
        rootMargin: "0px 0px -24px 0px"
      }
    );

    revealTargets.forEach((el) => observer.observe(el));
  }
})();
