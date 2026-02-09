document.addEventListener("DOMContentLoaded", () => {
    document.addEventListener("keydown", (e) => {
        if (e.key == "/") {
            e.preventDefault();
            openModal("mkdocs_search_modal");
        }
        else if (e.key == "?") {
            openModal("mkdocs_keyboard_modal");
        }
        else return;
    });

    let lastFocused = null;

    function openModal(id) {
        const modal = document.getElementById(id);
        if (!modal) return;

        lastFocused = document.activeElement;

        modal.style.display = 'block';
        modal.classList.add('show');

        modal.removeAttribute('aria-hidden');     // important
        modal.setAttribute('aria-modal', 'true'); // important
        modal.setAttribute('role', 'dialog');

        let focusTarget;
        if (id == "mkdocs_search_modal") {
            focusTarget = document.getElementsByClassName("form-group")[0].children[0]; // input
        }
        else {
            focusTarget = modal.querySelector('input, button, [href], [tabindex]:not([tabindex="-1"])') || modal;
        }
        focusTarget.focus();

        function closeModal(modal) {
            if (!modal) return;

            modal.classList.remove('show');
            modal.style.display = 'none';

            modal.setAttribute('aria-hidden', 'true'); // important
            modal.removeAttribute('aria-modal');

            if (lastFocused && lastFocused.focus) lastFocused.focus();
        }

        // close buttons + backdrop click
        document.addEventListener('click', (e) => {
            const closeBtn = e.target.closest('[data-dismiss="modal"], .close');
            if (closeBtn) {
                const modal = closeBtn.closest('.modal');
                closeModal(modal);
                return;
            }

            // click outside to close dialogue
            const modal = e.target.classList?.contains('modal') ? e.target : null;
            if (modal && modal.classList.contains('show')) closeModal(modal);
        });

        // ESC to close
        document.addEventListener('keydown', (e) => {
            if (e.key !== 'Escape') return;
            const open = document.querySelector('.modal.show');
            if (open) closeModal(open);
        });
    }
});