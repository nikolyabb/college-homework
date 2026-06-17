var body = document.body;
var pageName = body.dataset.page || "";
var burger = document.getElementById("burger");
var mainNav = document.getElementById("mainNav");
var pageTransition = document.getElementById("pageTransition");

// page transitions
function initPageTransitions() {
  if (!pageTransition) return;

  window.addEventListener("load", function () {
    setTimeout(function () {
      pageTransition.classList.add("page-transition--hidden");
    }, 100);
  });

  var links = document.querySelectorAll('a[href^="index"], a[href^="catalog"], a[href^="about"]');
  for (var i = 0; i < links.length; i++) {
    (function (link) {
      var href = link.getAttribute("href");
      if (!href || href.indexOf("#") === 0) return;

      link.addEventListener("click", function (event) {
        event.preventDefault();
        pageTransition.classList.remove("page-transition--hidden");
        setTimeout(function () {
          window.location.href = href;
        }, 450);
      });
    })(links[i]);
  }
}

// burger menu
function initBurgerMenu() {
  if (!burger || !mainNav) return;

  function toggleMenu() {
    burger.classList.toggle("burger--active");
    mainNav.classList.toggle("nav--open");
  }

  burger.addEventListener("click", toggleMenu);
  burger.addEventListener("keydown", function (event) {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      toggleMenu();
    }
  });

  var navLinks = mainNav.querySelectorAll(".nav__link");
  for (var i = 0; i < navLinks.length; i++) {
    navLinks[i].addEventListener("click", function () {
      burger.classList.remove("burger--active");
      mainNav.classList.remove("nav--open");
    });
  }
}

// scroll reveal
function initScrollReveal() {
  var revealElements = document.querySelectorAll(".reveal");
  if (!revealElements.length) return;

  var observer = new IntersectionObserver(
    function (entries) {
      for (var i = 0; i < entries.length; i++) {
        if (entries[i].isIntersecting) {
          entries[i].target.classList.add("reveal--visible");
          observer.unobserve(entries[i].target);
        }
      }
    },
    { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
  );

  for (var i = 0; i < revealElements.length; i++) {
    observer.observe(revealElements[i]);
  }
}

// active nav on scroll
function initActiveNav() {
  var sections = document.querySelectorAll("section[id]");
  var navLinks = document.querySelectorAll(".nav__link");
  if (!sections.length || !navLinks.length) return;

  var observer = new IntersectionObserver(
    function (entries) {
      for (var i = 0; i < entries.length; i++) {
        if (entries[i].isIntersecting) {
          var id = entries[i].target.getAttribute("id");
          for (var j = 0; j < navLinks.length; j++) {
            navLinks[j].classList.remove("nav__link--active");
            var linkHref = navLinks[j].getAttribute("href");
            if (linkHref && linkHref.indexOf("#" + id) !== -1) {
              navLinks[j].classList.add("nav__link--active");
            }
          }
        }
      }
    },
    { threshold: 0.5 }
  );

  for (var i = 0; i < sections.length; i++) {
    observer.observe(sections[i]);
  }
}

// esc closes menu
function initGlobalKeyboard() {
  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape" && mainNav && mainNav.classList.contains("nav--open")) {
      burger.classList.remove("burger--active");
      mainNav.classList.remove("nav--open");
    }
  });
}

// highlight current page in nav
function initCurrentPageNav() {
  var navLinks = document.querySelectorAll(".nav__link");
  for (var i = 0; i < navLinks.length; i++) {
    var href = navLinks[i].getAttribute("href");
    if (href && href.indexOf(pageName + ".html") !== -1) {
      navLinks[i].classList.add("nav__link--active");
    }
  }
}

// magnetic effect
function initMagneticElements() {
  var magneticItems = document.querySelectorAll("[data-magnetic]");
  if (!magneticItems.length) return;

  var isTouchDevice = window.matchMedia("(pointer: coarse)").matches;
  if (isTouchDevice) return;

  for (var i = 0; i < magneticItems.length; i++) {
    magneticItems[i].addEventListener("mousemove", function (event) {
      var rect = this.getBoundingClientRect();
      var x = event.clientX - rect.left - rect.width / 2;
      var y = event.clientY - rect.top - rect.height / 2;
      var strength = 0.15;
      this.style.transform = "translate(" + x * strength + "px, " + y * strength + "px)";
    });

    magneticItems[i].addEventListener("mouseleave", function () {
      this.style.transform = "translate(0, 0)";
    });
  }
}

document.addEventListener("DOMContentLoaded", function () {
  initPageTransitions();
  initBurgerMenu();
  initScrollReveal();
  initActiveNav();
  initGlobalKeyboard();
  initCurrentPageNav();
  initMagneticElements();
});
