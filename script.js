document.documentElement.classList.add("js");

const header = document.querySelector(".site-header");
const navToggle = document.querySelector(".nav-toggle");
const navLinks = document.querySelector(".nav-links");
const year = document.querySelector("#year");

if (year) year.textContent = new Date().getFullYear();

const closeMenu = () => {
  if (!navToggle || !navLinks) return;
  navToggle.setAttribute("aria-expanded", "false");
  navLinks.classList.remove("open");
  document.body.classList.remove("menu-open");
};

if (navToggle && navLinks) {
  navToggle.addEventListener("click", () => {
    const willOpen = navToggle.getAttribute("aria-expanded") !== "true";
    navToggle.setAttribute("aria-expanded", String(willOpen));
    navLinks.classList.toggle("open", willOpen);
    document.body.classList.toggle("menu-open", willOpen);
  });
  navLinks.querySelectorAll("a").forEach((link) => link.addEventListener("click", () => {
    const destination = new URL(link.href, window.location.href);
    const leavesCurrentPage = link.target !== "_blank"
      && destination.origin === window.location.origin
      && destination.pathname !== window.location.pathname;
    if (!leavesCurrentPage) window.requestAnimationFrame(closeMenu);
  }));
}

const updateScrollState = () => {
  const scrollRange = document.documentElement.scrollHeight - window.innerHeight;
  const progress = scrollRange > 0 ? Math.min(window.scrollY / scrollRange, 1) : 0;
  document.documentElement.style.setProperty("--progress", progress.toFixed(4));
  if (header) header.classList.toggle("scrolled", window.scrollY > 20);
};

updateScrollState();
window.addEventListener("scroll", updateScrollState, { passive: true });
window.addEventListener("resize", updateScrollState, { passive: true });
window.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeMenu();
});

const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const reveals = document.querySelectorAll(".reveal");

if (reducedMotion) {
  document.querySelectorAll("video[autoplay]").forEach((video) => {
    video.autoplay = false;
    video.pause();
  });
}

if (reducedMotion || !("IntersectionObserver" in window)) {
  reveals.forEach((element) => element.classList.add("in-view"));
} else {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("in-view");
      observer.unobserve(entry.target);
    });
  }, { rootMargin: "0px 0px -8%", threshold: 0.08 });
  reveals.forEach((element) => revealObserver.observe(element));
}
