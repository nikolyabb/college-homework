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
        // Есть еще слова?
        if (currentWordsDeck.length === 0) {
            alert("Слова закончились!");
            finishGame();
            return;
        }

        const randIndex = Math.floor(Math.random() * currentWordsDeck.length);
        const secretWord = currentWordsDeck.splice(randIndex, 1)[0];

        let lives = 3;
        let guessedLetters = new Set();
        let isWin = false;
        const startTime = Date.now();

        while (true) {
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

            if (openCount === secretWord.length) {
                isWin = true;
                break;
            }

            let input = prompt(
                `Слово: ${mask}\nБукв: ${secretWord.length}\nЖизни: ${lives}\nВведите букву или слово:`
            );

            if (input === null) { // Отмена
                finishGame(); 
                return;
            }

            input = input.trim().toLowerCase();
            if (!/^[a-z]+$/.test(input)) {
                alert("Только английские буквы!");
                continue;
            }

            if (input.length === 1) {
                if (guessedLetters.has(input)) {
                    alert("Уже была эта буква.");
                } else if (secretWord.includes(input)) {
                    guessedLetters.add(input);
                } else {
                    lives--;
                    alert("Нет такой буквы.");
                }
            } else {
                if (input === secretWord) {
                    isWin = true;
                    break;
                } else {
                    lives--;
                    alert("Неверное слово.");
                }
            }

            if (lives === 0) {
                isWin = false;
                break;
            }
        }

        const duration = ((Date.now() - startTime) / 1000).toFixed(1); // Время в секундах

        stats.push({
            word: secretWord,
            isWin: isWin,
            time: duration
        });

        let msg = isWin ? "Победа!" : "Поражение.";
        msg += `\nСлово: ${secretWord}`;
        msg += `\nСчет игры: Побед: ${stats.filter(s => s.isWin).length}, Поражений: ${stats.filter(s => !s.isWin).length}`;
        
        alert(msg);
        if (!confirm("Сыграем еще раз?")) {
            playNext = false;
            finishGame();
        }
    }
}

function finishGame() {
    const wins = stats.filter(s => s.isWin).length;
    const losses = stats.length - wins;
    let finalMsg = "";

    if (wins > losses) {
        finalMsg = "<h3>Вы - молодец!</h3>";
    } else {
        finalMsg = "<h3>Вы всё равно молодец, но в следующий раз получится лучше!</h3>";
    }

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

    const statsContainer = document.getElementById("playerStats");
    if (statsContainer) {
        statsContainer.innerHTML = tableHTML;
    } else {
        document.body.innerHTML += tableHTML;
    }
}

startGame();