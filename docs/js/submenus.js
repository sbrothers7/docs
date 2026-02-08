document.addEventListener("DOMContentLoaded", () => {
    const nav = document.querySelector(".navbar-nav");
    if (!nav) return;

    // Top-level sections (must match BOTH navbar label text and folder name in URLs)
    const sections = ["macos", "windows", "linux", "other"];

    // Collect top-level dropdown <li> items
    const topDropdownLis = [...nav.querySelectorAll(":scope > li.nav-item.dropdown")];

    function getOrCreateMenu(li) {
        let menu = li.querySelector(":scope > .dropdown-menu");
        if (!menu) {
            menu = document.createElement("div");
            menu.className = "dropdown-menu";
            li.appendChild(menu);
        }
        return menu;
    }

    // Map label -> menu
    const menuByLabel = new Map();
    for (const li of topDropdownLis) {
        const a = li.querySelector(":scope > a");
        if (!a) continue;
        const label = a.textContent.trim().toLowerCase();
        if (sections.includes(label)) {
            menuByLabel.set(label, getOrCreateMenu(li));
        }
    }

    // Infer which section a submenu belongs to from its link href
    function inferSection(href) {
        const h = (href || "").toLowerCase();
        for (const s of sections) {
            // matches "/macos/" or "macos/..."
            if (h.includes(`/${s}/`) || h.startsWith(`${s}/`) || h.startsWith(`/${s}`)) return s;
        }
        return null;
    }

    // Fallback: if we can't infer, put it under the first dropdown
    const fallbackMenu = topDropdownLis.length ? getOrCreateMenu(topDropdownLis[0]) : null;

    // Move only stray submenu LIs that ended up at top level
    const straySubmenus = [...nav.querySelectorAll(":scope > li.dropdown-submenu")];
    for (const li of straySubmenus) {
        const firstLink = li.querySelector("a[href]");
        const href = firstLink ? firstLink.getAttribute("href") : "";

        const section = inferSection(href);
        const dest = (section && menuByLabel.get(section)) || fallbackMenu;

        if (dest) dest.appendChild(li);
    }
});