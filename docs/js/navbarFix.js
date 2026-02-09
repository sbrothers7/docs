document.addEventListener("DOMContentLoaded", () => {
    const SECTIONS = ["macos", "windows", "linux", "other"];
    const DEFAULT_COLLAPSE_ID = "navbarSupportedContent";

    // ---------------------------
    // Helpers
    // ---------------------------
    const qs = (sel, root = document) => root.querySelector(sel);
    const qsa = (sel, root = document) => [...root.querySelectorAll(sel)];

    function ensureCollapseAndNavList() {
        const navbar = qs("nav.navbar");
        if (!navbar) return { navbar: null, collapse: null, navList: null };

        const collapse = qs(".navbar-collapse", navbar);
        if (!collapse) return { navbar, collapse: null, navList: null };

        // Ensure collapse has an id (required for the toggler to work)
        if (!collapse.id) collapse.id = DEFAULT_COLLAPSE_ID;

        // Ensure <ul class="navbar-nav"> exists inside collapse
        let navList = qs("ul.navbar-nav", collapse);
        if (!navList) {
            navList = document.createElement("ul");
            navList.className = "navbar-nav";
            collapse.appendChild(navList);
        }

        // Repair: move any stray <li> back into <ul.navbar-nav>
        qsa(".container > li", navbar).forEach((li) => navList.appendChild(li));
        qsa(".navbar-collapse > li", navbar).forEach((li) => navList.appendChild(li));

        return { navbar, collapse, navList };
    }

    function wireTogglerToCollapseId(collapse) {
        if (!collapse) return;

        const toggler = qs(".navbar-toggler[data-toggle='collapse']", document);
        if (!toggler) return;

        // Ensure toggler points to the real collapse id
        toggler.setAttribute("data-target", `#${collapse.id}`);
        toggler.setAttribute("aria-controls", collapse.id);
    }

    function getOrCreateDropdownMenu(li) {
        let menu = qs(":scope > .dropdown-menu", li);
        if (!menu) {
            menu = document.createElement("div");
            menu.className = "dropdown-menu";
            li.appendChild(menu);
        }
        return menu;
    }

    function buildMenuByLabel(navList) {
        const menuByLabel = new Map();

        const topDropdownLis = qsa(":scope > li.nav-item.dropdown", navList);
        for (const li of topDropdownLis) {
            const a = qs(":scope > a", li);
            if (!a) continue;

            const label = a.textContent.trim().toLowerCase();
            if (!SECTIONS.includes(label)) continue;

            menuByLabel.set(label, getOrCreateDropdownMenu(li));
        }

        return { menuByLabel, topDropdownLis };
    }

    function inferSectionFromHref(href) {
        const h = (href || "").toLowerCase();

        for (const s of SECTIONS) {
            // Works for "/macos/..." and "macos/..." and "/macos"
            if (h.includes(`/${s}/`) || h.startsWith(`${s}/`) || h.startsWith(`/${s}`)) {
                return s;
            }
        }
        return null;
    }

    function routeStraySubmenus(navList) {
        if (!navList) return;

        const { menuByLabel, topDropdownLis } = buildMenuByLabel(navList);

        // If can’t infer, fall back to the first dropdown’s menu (if any)
        const fallbackMenu = topDropdownLis.length ? getOrCreateDropdownMenu(topDropdownLis[0]) : null;

        // Only move stray submenus that ended up as direct children of the top nav list
        const straySubmenus = qsa(":scope > li.dropdown-submenu", navList);

        for (const li of straySubmenus) {
            const firstLink = qs("a[href]", li);
            const href = firstLink ? firstLink.getAttribute("href") : "";

            const section = inferSectionFromHref(href);
            const dest = (section && menuByLabel.get(section)) || fallbackMenu;

            if (dest) dest.appendChild(li);
        }
    }

    // ---------------------------
    // Run fixes (order matters)
    // ---------------------------
    const { collapse, navList } = ensureCollapseAndNavList();
    wireTogglerToCollapseId(collapse);
    routeStraySubmenus(navList);
});