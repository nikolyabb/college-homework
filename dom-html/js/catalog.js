var isTouchDevice = window.matchMedia("(pointer: coarse)").matches;

// tilt product cards on mouse move
function initProductCardTilt() {
  if (isTouchDevice) return;

  var cards = document.querySelectorAll(".product-card");
  for (var i = 0; i < cards.length; i++) {
    cards[i].addEventListener("mousemove", function (event) {
      var rect = this.getBoundingClientRect();
      var x = event.clientX - rect.left;
      var y = event.clientY - rect.top;
      var centerX = rect.width / 2;
      var centerY = rect.height / 2;
      var rotateX = ((y - centerY) / centerY) * -10;
      var rotateY = ((x - centerX) / centerX) * 10;
      var shadowX = ((x - centerX) / centerX) * 20;
      var shadowY = ((y - centerY) / centerY) * 20;

      var transformString = "perspective(1000px) rotateX(" + rotateX + "deg) rotateY(" + rotateY + "deg) translateZ(12px)";
      this.style.transform = transformString;
      this.style.boxShadow = shadowX + "px " + shadowY + "px 40px rgba(0, 0, 0, 0.08)";
    });

    cards[i].addEventListener("mouseleave", function () {
      this.style.transform = "";
      this.style.boxShadow = "";
    });
  }
}

// keyboard navigation for cards
function initProductKeyboard() {
  var cards = document.querySelectorAll(".product-card");
  if (!cards.length) return;

  var focusedIndex = -1;

  function focusCard(index) {
    for (var i = 0; i < cards.length; i++) {
      if (i === index) {
        cards[i].classList.add("product-card--focused");
        cards[i].focus();
        cards[i].scrollIntoView({ behavior: "smooth", block: "center" });
      } else {
        cards[i].classList.remove("product-card--focused");
      }
    }
  }

  document.addEventListener("keydown", function (event) {
    var isArrowRight = event.key === "ArrowRight";
    var isArrowLeft = event.key === "ArrowLeft";
    var isEnter = event.key === "Enter";

    if (!isArrowRight && !isArrowLeft && !isEnter) return;

    event.preventDefault();

    if (isArrowRight) {
      focusedIndex = focusedIndex + 1;
      if (focusedIndex >= cards.length) focusedIndex = 0;
      focusCard(focusedIndex);
    } else if (isArrowLeft) {
      focusedIndex = focusedIndex - 1;
      if (focusedIndex < 0) focusedIndex = cards.length - 1;
      focusCard(focusedIndex);
    } else if (isEnter && focusedIndex !== -1) {
      var activeCard = cards[focusedIndex];
      var button = activeCard.querySelector("button");
      if (button) {
        button.click();
        button.classList.add("btn--primary");
        setTimeout(function () {
          button.classList.remove("btn--primary");
        }, 300);
      }
    }
  });
}

// order buttons
function initOrderButtons() {
  var buttons = document.querySelectorAll(".product-card button");
  for (var i = 0; i < buttons.length; i++) {
    buttons[i].addEventListener("click", function (event) {
      event.stopPropagation();
      var card = this.closest(".product-card");
      var titleEl = card.querySelector(".product-card__title");
      var title = titleEl.textContent;
      alert("Вы выбрали: " + title + ". Мы свяжемся с вами по email hello@whitestamp.ru");
    });
  }
}

document.addEventListener("DOMContentLoaded", function () {
  initProductCardTilt();
  initProductKeyboard();
  initOrderButtons();
});
