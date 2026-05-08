class ChatBot {
    constructor() {
        this.isActive = false;
        this.hasStarted = false;
        this.username = 'User';
        this.pendingNumbers = null;
        
        this.elements = {
            messagesContainer: document.getElementById('messages-container'),
            userInput: document.getElementById('user-input'),
            sendButton: document.getElementById('send-button'),
            typingIndicator: null
        };

        this.avatars = {
            user: 'assets/avatars/user_avatar.png',
            bot: 'assets/avatars/bot_avatar.png'
        };

        this.initEventListeners();
    }

    initEventListeners() {
        this.elements.sendButton.addEventListener('click', () => this.handleSendMessage());
        this.elements.userInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                this.handleSendMessage();
            }
        });
        this.elements.userInput.addEventListener('input', () => this.handleInputChanged());
    }

    handleInputChanged() {
        const text = this.elements.userInput.value.trim();
        this.elements.sendButton.disabled = text === '';
        this.elements.sendButton.classList.toggle('active', text !== '');
        this.elements.userInput.scrollTop = this.elements.userInput.scrollHeight;
        this.showTyping(text.length > 0);
    }

    showTyping(show) {
        if (show) {
            if (document.querySelector('.typing-message')) return;
            
            const msgDiv = document.createElement('div');
            msgDiv.className = 'message-bubble typing-message';
            
            const dotsDiv = document.createElement('div');
            dotsDiv.className = 'dots';
            for (let i = 0; i < 3; i++) {
                const span = document.createElement('span');
                dotsDiv.appendChild(span);
            }
            
            msgDiv.appendChild(dotsDiv);
            this.elements.messagesContainer.prepend(msgDiv);
            this.elements.messagesContainer.scrollTop = 0;
        } else {
            const indicator = document.querySelector('.typing-message');
            if (indicator) indicator.remove();
        }
    }

    async handleSendMessage() {
        const text = this.elements.userInput.value.trim();
        if (!text) return;

        this.elements.userInput.value = '';
        this.elements.sendButton.disabled = true;
        this.elements.sendButton.classList.remove('active');
        this.showTyping(false);

        this.appendMessage('user', text);
        await new Promise(resolve => setTimeout(resolve, 600));
        this.processCommand(text);
    }

    processCommand(text) {
        const ERROR_MSG = 'Я не понимаю, введите другую команду!';
        
        if (this.pendingNumbers) {
            const op = text.trim();
            const operators = ['+', '-', '*', '/'];
            if (operators.includes(op)) {
                const { n1, n2 } = this.pendingNumbers;
                let result;
                switch (op) {
                    case '+': result = n1 + n2; break;
                    case '-': result = n1 - n2; break;
                    case '*': result = n1 * n2; break;
                    case '/': result = n1 / n2; break;
                }
                this.appendMessage('bot', `${n1} ${op} ${n2} = ${result}`);
                this.pendingNumbers = null;
            } else {
                this.appendMessage('bot', 'Не могу распознать операнд или такая операция не поддерживается');
                this.pendingNumbers = null;
            }
            return;
        }

        const commands = ['/start', '/stop', '/name', '/number'];
        const cmdPrefix = commands.find(c => text.startsWith(c));

        if (!cmdPrefix) {
            this.appendMessage('bot', ERROR_MSG);
            return;
        }

        const parts = text.split(':');
        const cmd = parts[0].trim();
        const argsString = parts[1] ? parts[1].trim() : '';
        const args = argsString ? argsString.split(',').map(a => a.trim()) : [];

        const argRequirements = { '/start': 0, '/stop': 0, '/name': 1, '/number': 2 };
        if (args.length !== argRequirements[cmd]) {
            this.appendMessage('bot', ERROR_MSG);
            return;
        }

        if (cmd === '/start') {
            if (this.isActive) {
                this.appendMessage('bot', ERROR_MSG);
            } else {
                this.hasStarted = true;
                this.appendMessage('bot', 'Привет, меня зовут Чат-бот, а как зовут тебя?');
            }
        } else if (cmd === '/name') {
            if (this.isActive || !this.hasStarted) {
                this.appendMessage('bot', ERROR_MSG);
            } else {
                this.username = args[0];
                this.isActive = true;
                this.appendMessage('bot', `Привет ${this.username}, приятно познакомится. Я умею считать, введи числа которые надо посчитать`);
            }
            } else if (cmd === '/stop') {
                if (this.isActive) {
                    this.isActive = false;
                    this.hasStarted = false;
                    this.appendMessage('bot', 'Всего доброго, если хочешь поговорить пиши /start');
                }
            } else if (cmd === '/number') {
            if (!this.isActive) {
                this.appendMessage('bot', ERROR_MSG);
            } else {
                const n1 = parseFloat(args[0]);
                const n2 = parseFloat(args[1]);
                if (isNaN(n1) || isNaN(n2)) {
                    this.appendMessage('bot', 'Одно из значений не является числом');
                } else {
                    this.pendingNumbers = { n1, n2 };
                    this.appendMessage('bot', 'Какую операцию вы хотите выполнить? Допустимые операции: сложение (+), вычитание (-), умножение (*), деление (/). Введите символ соотвутствующей операции:');
                }
            }
        }
    }

    appendMessage(type, text) {
        const wrapperDiv = document.createElement('div');
        wrapperDiv.className = `message-wrapper ${type}-wrapper`;

        const avatarImg = document.createElement('img');
        avatarImg.src = type === 'user' ? this.avatars.user : this.avatars.bot;
        avatarImg.className = 'avatar';

        const msgDiv = document.createElement('div');
        msgDiv.className = `message-bubble ${type}-message`;
        msgDiv.textContent = text;

        wrapperDiv.appendChild(avatarImg);
        wrapperDiv.appendChild(msgDiv);

        this.elements.messagesContainer.prepend(wrapperDiv);
        this.elements.messagesContainer.scrollTop = 0;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new ChatBot();
});