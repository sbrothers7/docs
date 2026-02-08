document.addEventListener("DOMContentLoaded", () => {
    // Find the navbar collapse area
    const collapse = document.querySelector(".navbar .navbar-collapse");
    if (!collapse) return;

    // Find (or create) the navbar UL inside collapse
    let ul = collapse.querySelector("ul.navbar-nav");
    if (!ul) {
        ul = document.createElement("ul");
        ul.className = "navbar-nav";
        collapse.appendChild(ul);
    }

    // Move any direct LI children of .container (or other invalid parent) back into ul
    document.querySelectorAll(".navbar .container > li").forEach((li) => {
        ul.appendChild(li);
    });

    // Also move any LI that ended up directly under collapse
    document.querySelectorAll(".navbar .navbar-collapse > li").forEach((li) => {
        ul.appendChild(li);
    });
});
