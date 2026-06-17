var isTouchDevice = window.matchMedia("(pointer: coarse)").matches;

// parallax on mouse move
function initHeroParallax() {
  var pattern = document.getElementById("heroPattern");
  var title = document.getElementById("heroTitle");
  var desc = document.getElementById("heroDesc");

  if (!pattern) return;

  var ticking = false;

  document.addEventListener("mousemove", function (event) {
    if (ticking) return;

    requestAnimationFrame(function () {
      var x = (event.clientX / window.innerWidth - 0.5) * 2;
      var y = (event.clientY / window.innerHeight - 0.5) * 2;

      if (pattern) {
        pattern.style.transform = "translate(" + x * -30 + "px, " + y * -20 + "px) rotate(" + x * 2 + "deg)";
      }
      if (title) {
        title.style.transform = "translate(" + x * 8 + "px, " + y * 6 + "px)";
      }
      if (desc) {
        desc.style.transform = "translate(" + x * 4 + "px, " + y * 3 + "px)";
      }

      ticking = false;
    });

    ticking = true;
  });
}

// spotlight features by key 1-3
function initFeatureKeyboard() {
  var features = document.querySelectorAll(".feature");
  if (!features.length) return;

  function setSpotlight(index) {
    if (index < 0 || index >= features.length) return;

    for (var i = 0; i < features.length; i++) {
      if (i === index) {
        features[i].classList.add("feature--spotlight");
      } else {
        features[i].classList.remove("feature--spotlight");
      }
    }

    var target = features[index];
    target.focus({ preventScroll: true });
    target.scrollIntoView({ behavior: "smooth", block: "center", inline: "center" });
  }

  function clearSpotlight() {
    for (var i = 0; i < features.length; i++) {
      features[i].classList.remove("feature--spotlight");
    }
  }

  document.addEventListener("keydown", function (event) {
    var key = event.key;
    var isDigit = key === "1" || key === "2" || key === "3";
    var isEnter = key === "Enter";
    var isEsc = key === "Escape";

    if (!isDigit && !isEnter && !isEsc) return;

    event.preventDefault();

    if (isDigit) {
      var num = parseInt(key, 10);
      setSpotlight(num - 1);
    } else if (isEsc) {
      clearSpotlight();
    } else if (isEnter) {
      var spotlight = document.querySelector(".feature--spotlight");
      if (spotlight) {
        window.location.href = "catalog.html";
      }
    }
  });

  var scrollTimeout;
  window.addEventListener("scroll", function () {
    window.clearTimeout(scrollTimeout);
    scrollTimeout = window.setTimeout(function () {
      var spotlight = document.querySelector(".feature--spotlight");
      if (!spotlight) return;
      var rect = spotlight.getBoundingClientRect();
      var isVisible = rect.top >= 0 && rect.bottom <= window.innerHeight;
      if (!isVisible) clearSpotlight();
    }, 150);
  });
}

// tilt cards on hover
function initFeatureTilt() {
  if (isTouchDevice) return;

  var features = document.querySelectorAll(".feature");
  for (var i = 0; i < features.length; i++) {
    features[i].addEventListener("mousemove", function (event) {
      var rect = this.getBoundingClientRect();
      var x = event.clientX - rect.left;
      var y = event.clientY - rect.top;
      var centerX = rect.width / 2;
      var centerY = rect.height / 2;
      var rotateX = ((y - centerY) / centerY) * -6;
      var rotateY = ((x - centerX) / centerX) * 6;

      this.style.transform = "perspective(800px) rotateX(" + rotateX + "deg) rotateY(" + rotateY + "deg) translateY(-4px)";
    });

    features[i].addEventListener("mouseleave", function () {
      this.style.transform = "";
    });
  }
}

document.addEventListener("DOMContentLoaded", function () {
  initHeroParallax();
  initFeatureKeyboard();
  initFeatureTilt();
});
