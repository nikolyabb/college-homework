var counterAnimated = false;

// years counter animation
function initYearsCounter() {
  var counterEl = document.getElementById("yearsCounter");
  if (!counterEl) return;

  var targetValue = 7;
  var duration = 1200;

  function animateCounter() {
    if (counterAnimated) return;
    counterAnimated = true;

    var startTime = performance.now();

    function update(currentTime) {
      var elapsed = currentTime - startTime;
      var progress = elapsed / duration;
      if (progress > 1) progress = 1;
      var ease = 1 - Math.pow(1 - progress, 3);
      var current = Math.round(ease * targetValue);
      counterEl.textContent = current;

      if (progress < 1) {
        requestAnimationFrame(update);
      }
    }

    requestAnimationFrame(update);
  }

  document.addEventListener("keydown", function (event) {
    if (event.key === " " || event.code === "Space") {
      event.preventDefault();
      animateCounter();
    }
  });

  var observer = new IntersectionObserver(
    function (entries) {
      for (var i = 0; i < entries.length; i++) {
        if (entries[i].isIntersecting) {
          animateCounter();
          observer.unobserve(entries[i].target);
        }
      }
    },
    { threshold: 0.5 }
  );

  observer.observe(counterEl);
}

// random team generator
function initRandomTeam() {
  var teamGrid = document.getElementById("teamGrid");
  if (!teamGrid) return;

  var names = [
    "Артём Волков",
    "Марина Соколова",
    "Дмитрий Орлов",
    "Анна Кузнецова",
    "Игорь Лебедев",
    "Елена Новикова",
    "Сергей Попов",
    "Ольга Морозова",
  ];
  var roles = [
    "Основатель и креативный директор",
    "Главный дизайнер",
    "Руководитель печати",
    "Работа с клиентами",
    "Типограф",
    "UX-дизайнер",
    "Менеджер проектов",
    "Копирайтер",
  ];

  function shuffle(array) {
    var copy = [];
    for (var k = 0; k < array.length; k++) {
      copy.push(array[k]);
    }
    for (var i = copy.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var temp = copy[i];
      copy[i] = copy[j];
      copy[j] = temp;
    }
    return copy;
  }

  function renderTeam() {
    var shuffledNames = shuffle(names);
    var shuffledRoles = shuffle(roles);
    teamGrid.innerHTML = "";

    for (var i = 0; i < 4; i++) {
      var member = document.createElement("div");
      member.className = "team__member reveal reveal--visible";
      member.innerHTML = "<div class=\"team__name\"\u003e" + shuffledNames[i] + "</div><div class=\"team__role\"\u003e" + shuffledRoles[i] + "</div>";
      teamGrid.appendChild(member);
    }
  }

  document.addEventListener("keydown", function (event) {
    if (event.key.toLowerCase() === "t") {
      event.preventDefault();
      renderTeam();
    }
  });
}

document.addEventListener("DOMContentLoaded", function () {
  initYearsCounter();
  initRandomTeam();
});
