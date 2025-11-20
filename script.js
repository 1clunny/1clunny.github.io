document.addEventListener("DOMContentLoaded", () => {
  const toggleThemeButton = document.getElementById("toggletheme");
  const themeIcon = document.getElementById("themeicon");
  const THEME_STORAGE_KEY = "oclunny-theme";
  const prefersLightScheme = window.matchMedia
    ? window.matchMedia("(prefers-color-scheme: light)")
    : null;

  if (!toggleThemeButton || !themeIcon) {
    return;
  }

  const applyTheme = (mode) => {
    const isLight = mode === "light";
    document.body.classList.toggle("light-theme", isLight);
    themeIcon.className = isLight ? "fa-solid fa-moon" : "fa-solid fa-sun";
    toggleThemeButton.setAttribute(
      "aria-label",
      isLight ? "Switch to dark theme" : "Switch to light theme"
    );
  };

  const getStoredTheme = () => {
    try {
      return localStorage.getItem(THEME_STORAGE_KEY);
    } catch (error) {
      return null;
    }
  };

  const storeTheme = (value) => {
    try {
      localStorage.setItem(THEME_STORAGE_KEY, value);
    } catch (error) {
      // Storage might be unavailable (e.g., privacy mode). Fail silently.
    }
  };

  const initTheme = () => {
    const storedTheme = getStoredTheme();
    if (storedTheme) {
      applyTheme(storedTheme);
      return;
    }
    const prefersLight = prefersLightScheme
      ? prefersLightScheme.matches
      : false;
    applyTheme(prefersLight ? "light" : "dark");
  };

  const handleSystemChange = (event) => {
    if (getStoredTheme()) {
      return;
    }
    applyTheme(event.matches ? "light" : "dark");
  };

  toggleThemeButton.addEventListener("click", () => {
    const nextTheme = document.body.classList.contains("light-theme")
      ? "dark"
      : "light";
    applyTheme(nextTheme);
    storeTheme(nextTheme);
  });

  if (prefersLightScheme) {
    if (typeof prefersLightScheme.addEventListener === "function") {
      prefersLightScheme.addEventListener("change", handleSystemChange);
    } else if (typeof prefersLightScheme.addListener === "function") {
      prefersLightScheme.addListener(handleSystemChange);
    }
  }

  initTheme();

  const smoothLinks = document.querySelectorAll('a[href^="#"]:not([href="#"])');

  smoothLinks.forEach((link) => {
    link.addEventListener("click", (event) => {
      const hrefValue = link.getAttribute("href");
      if (!hrefValue) {
        return;
      }

      const targetId = hrefValue.substring(1);
      const targetElement = document.getElementById(targetId);

      if (targetElement) {
        event.preventDefault();
        targetElement.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
  });
});
