
const menuToggle = document.getElementById("menuToggle");
const navMenu = document.getElementById("navMenu");
const navLinks = document.querySelectorAll(".nav-link");

// Mobile menu toggle
menuToggle.addEventListener("click", () => {

    navMenu.classList.toggle("show");

    const isOpen = navMenu.classList.contains("show");

    menuToggle.setAttribute("aria-expanded", isOpen);
});

// Close menu after clicking a link
navLinks.forEach(link => {

    link.addEventListener("click", () => {

        navMenu.classList.remove("show");
        menuToggle.setAttribute("aria-expanded", "false");

        navLinks.forEach(item => {
            item.classList.remove("active");
        });

        link.classList.add("active");
    });

});

// Highlight navigation based on visible section
const sections = document.querySelectorAll("section[id]");

const observer = new IntersectionObserver(entries => {

    entries.forEach(entry => {

        if (entry.isIntersecting) {

            navLinks.forEach(link => {
                link.classList.remove("active");
            });

            const activeLink = document.querySelector(
                `.nav-link[href="#${entry.target.id}"]`
            );

            if (activeLink) {
                activeLink.classList.add("active");
            }

        }

    });

}, {
    rootMargin: "-25% 0px -65% 0px"
});

sections.forEach(section => {
    observer.observe(section);
});
