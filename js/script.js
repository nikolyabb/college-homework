// Используем тут только буквы в нижнем регистре, поскольку дальше ввод пользователя
// будет приводиться toLowerCase()
const WORDS_DATA = {
    "1": ["cat", "dog", "fox", "owl", "tree", "lion", "duck", "fish", "frog", "wolf"], 
    "2": ["apple", "grape", "melon", "lemon", "peach", "tiger", "horse", "mouse", "panda", "zebra"],
    "3": ["elephant", "giraffe", "penguin", "leopard", "hamster", "dolphin", "buffalo", "gorilla", "panther", "monitor"]
};

let stats = []; 
let currentWordsDeck = [];
let chosenDifficulty = "";


function startGame() {
    if (!confirm("Хотите сыграть?")) return;

    while (true) {
        chosenDifficulty = prompt("Выберите уровень сложности:\n1 – Лёгкий\n2 – Средний\n3 – Сложный");
        if (WORDS_DATA[chosenDifficulty]) {
            currentWordsDeck = [...WORDS_DATA[chosenDifficulty]];
            break;
        }
    }
    runGameLoop();
}

function runGameLoop() {
    let playNext = true;

    while (playNext) {
        // Проверка: остались ли слова
        if (currentWordsDeck.length === 0) {
            alert("Слова закончились!");
            finishGame();
            return;
        }

        // --- НАЧАЛО РАУНДА ---
        // 8.1 Случайное слово
        const randIndex = Math.floor(Math.random() * currentWordsDeck.length);
        const secretWord = currentWordsDeck.splice(randIndex, 1)[0];

        let lives = 3;
        let guessedLetters = new Set();
        let isWin = false;
        const startTime = Date.now();

        // Цикл угадывания
        while (true) {
            // Формируем маску слова (например: a**le)
            let mask = "";
            let openCount = 0;
            for (let char of secretWord) {
                if (guessedLetters.has(char)) {
                    mask += char;
                    openCount++;
                } else {
                    mask += "*";
                }
            }

            // Проверка победы (все буквы открыты)
            if (openCount === secretWord.length) {
                isWin = true;
                break;
            }

            // Запрос ввода (пункты 3.2, 3.3)
            let input = prompt(
                `Слово: ${mask}\nБукв: ${secretWord.length}\nЖизни: ${lives}\nВведите букву или слово:`
            );

            if (input === null) { // Если нажали Отмена
                finishGame(); 
                return;
            }

            input = input.trim().toLowerCase();

            // Валидация (пункт 3.3.4 - только латиница)
            if (!/^[a-z]+$/.test(input)) {
                alert("Только английские буквы!");
                continue;
            }

            // Логика проверки
            if (input.length === 1) {
                // Буква
                if (guessedLetters.has(input)) {
                    alert("Уже была эта буква.");
                } else if (secretWord.includes(input)) {
                    guessedLetters.add(input);
                } else {
                    lives--;
                    alert("Нет такой буквы.");
                }
            } else {
                // Слово
                if (input === secretWord) {
                    isWin = true;
                    break;
                } else {
                    lives--;
                    alert("Неверное слово.");
                }
            }

            // Проверка поражения
            if (lives === 0) {
                isWin = false;
                break;
            }
        }

        // --- КОНЕЦ РАУНДА ---
        const duration = ((Date.now() - startTime) / 1000).toFixed(1); // Время в секундах

        // Сохраняем статистику
        stats.push({
            word: secretWord,
            isWin: isWin,
            time: duration
        });

        // 8.1 - 8.3 Вывод промежуточного итога (алерт)
        let msg = isWin ? "Победа!" : "Поражение.";
        msg += `\nСлово: ${secretWord}`;
        msg += `\nСчет игры: Побед: ${stats.filter(s => s.isWin).length}, Поражений: ${stats.filter(s => !s.isWin).length}`;
        
        alert(msg);

        // 8.4 Предложение сыграть еще
        if (!confirm("Сыграем еще раз?")) {
            playNext = false;
            finishGame();
        }
    }
}

function finishGame() {
    // 8.4.2 Логика "Молодец"
    const wins = stats.filter(s => s.isWin).length;
    const losses = stats.length - wins;
    let finalMsg = "";

    if (wins > losses) {
        finalMsg = "<h3>Вы - молодец!</h3>";
    } else {
        finalMsg = "<h3>Вы всё равно молодец, но в следующий раз получится лучше!</h3>";
    }

    // Генерация HTML таблицы (как ты просил)
    let tableHTML = `
        ${finalMsg}
        <p>Сложность: ${chosenDifficulty}</p>
        <table border="1" style="border-collapse: collapse; padding: 5px;">
            <tr>
                <th>Слово</th>
                <th>Угадал?</th>
                <th>Время (сек)</th>
            </tr>
    `;

    // Без сортировки, просто вывод как было сыграно
    for (let item of stats) {
        tableHTML += `
            <tr>
                <td>${item.word}</td>
                <td>${item.isWin ? "Да" : "Нет"}</td>
                <td>${item.time}</td>
            </tr>
        `;
    }
    tableHTML += "</table>";

    // Вставка в DOM
    const statsContainer = document.getElementById("playerStats");
    if (statsContainer) {
        statsContainer.innerHTML = tableHTML;
    } else {
        // Если вдруг div не найден, выведем в body
        document.body.innerHTML += tableHTML;
    }
}

// Запуск
startGame();