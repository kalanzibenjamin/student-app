import "./shared/i18n.js";
import studentNavigation from "../../partials/student-navigation.html?raw";

const navigationContainer = document.querySelector("[data-student-navigation]");

if (navigationContainer) {
  navigationContainer.innerHTML = studentNavigation;

  const savedStudent = (() => {
    try {
      return JSON.parse(localStorage.getItem("clareon-current-student") || "null");
    } catch {
      return null;
    }
  })();

  if (savedStudent?.name) {
    const nameElement = navigationContainer.querySelector("[data-student-name]");
    const registrationElement = navigationContainer.querySelector("[data-student-registration]");
    const avatarElement = navigationContainer.querySelector("[data-student-avatar]");
    if (nameElement) nameElement.textContent = savedStudent.name;
    if (registrationElement) registrationElement.textContent = savedStudent.registrationNumber || "";
    if (avatarElement) {
      avatarElement.textContent = savedStudent.name
        .split(/\s+/)
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part[0])
        .join("")
        .toUpperCase();
    }
  }

  const currentPath = window.location.pathname.replace(/\/+$/, "") || "/";
  for (const link of navigationContainer.querySelectorAll("a[href]")) {
    const linkPath = new URL(link.href, window.location.origin).pathname.replace(/\/+$/, "") || "/";
    if (linkPath === currentPath) {
      link.classList.add("is-active");
      link.setAttribute("aria-current", "page");
    }
  }

  const sidebar = navigationContainer.querySelector(".student-sidebar");
  const topbar = document.querySelector(".student-topbar");
  let backdrop = document.querySelector(".student-nav-backdrop");

  if (!backdrop) {
    backdrop = document.createElement("button");
    backdrop.type = "button";
    backdrop.className = "student-nav-backdrop";
    backdrop.setAttribute("aria-label", "Close navigation");
    document.body.appendChild(backdrop);
  }

  let menuButton = document.querySelector(".student-menu-toggle");
  if (!menuButton && topbar) {
    menuButton = document.createElement("button");
    menuButton.type = "button";
    menuButton.className = "student-menu-toggle";
    menuButton.setAttribute("aria-label", "Open navigation");
    menuButton.setAttribute("aria-controls", "student-navigation");
    menuButton.setAttribute("aria-expanded", "false");
    menuButton.innerHTML = '<i class="fas fa-bars" aria-hidden="true"></i>';
    sidebar?.setAttribute("id", "student-navigation");
    topbar.prepend(menuButton);
  }

  const setMenuOpen = (open) => {
    document.body.classList.toggle("student-nav-open", open);
    menuButton?.setAttribute("aria-expanded", String(open));
    menuButton?.setAttribute("aria-label", open ? "Close navigation" : "Open navigation");
  };

  menuButton?.addEventListener("click", () => {
    setMenuOpen(!document.body.classList.contains("student-nav-open"));
  });
  backdrop.addEventListener("click", () => setMenuOpen(false));
  navigationContainer.querySelectorAll(".student-sidebar__nav a").forEach((link) => {
    link.addEventListener("click", () => setMenuOpen(false));
  });
  navigationContainer.querySelector(".student-sidebar__signout")?.addEventListener("click", () => {
    localStorage.removeItem("clareon-current-student");
    window.location.href = "/";
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") setMenuOpen(false);
  });
}
