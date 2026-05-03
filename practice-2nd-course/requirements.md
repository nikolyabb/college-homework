## Overivew

This is a learning project to implement a very simplistic chatbot to perform basic arithmetic operations and returns result to the chat.

It is very important to make it simple and concise. No need for all best practices, a ton of comments, very fancy styles.

## Interface requirements
* Interface needs to be implemented in HTML5 and JavaScript
* Interface has to be adaptive for both Desktop and Mobile devices
* Implementation has to be done on client side (no server)

## Chatbot interface
1. Chatbot has to have main window with a single block with rounded corners. Width has to be  about 60% of screen width bit no more than 700px.
2. Main window has black background. Outside main window there is also black background.
3. Main window has 3 key items inside:  
* The User's Input box with "Send" button, located in the bottom instide the main box. If user input is larger than the Input box it size stays the same, but latest typing is always visible by the effect of scrolling text to the cursor. If cursor goes to the left, then text scrolls in the same direction to allow easily ediding it in full.  
* Messages box that contains messages inside. Takes most of the space in the main box. It supports scroll for the content inside. There are 3 types of the messages: User message, Chatbot agent message and special message to highlight the user input is in progress.  
* Message object composed of 2 parts: the avatar and the message. User messages have white background, chat agent messages has yellow background. The avatar is a round picture of fixed size. The Message bubble has adaptive height depending of the message length with left side alignment.  
4. Chat direction goes from downside up.  
5. "Send" button in the message box should stay inactive (unclickable) as long as Message box is empty. Inavtive button color is gray, active color is yellow.  
6. When User starts composing a message in the input field a special message should appear in the Messages box, that has animation of 3 dots. When message is sent, this Message object going to be replaced by the User's message.  
7. Interface should be built for Russian speaking audience with all messages in Russian.  

## Chatbot commands and behavior

1. Chatbot is in Inactive state by default. It can be switched to Active start with command */start* and then make sure User intorduced himself with */name: <username>* command. Until both is done it should not process any other command and just return the following message: "Введите команду /start, для начала общения".  
2. Chatbot operates only with commands. Some of the commands imply additional input that has to be processed accordingly. Otherwise the chatbot always answers with "Я не понимаю, введите другую команду!".  
3. Chatbot can be inactivated by */stop* command if it was in Active state. Otherwise */stop* command shoudl be ignored.  
4. After activation the chatbot reach the Main Cycle. In the Main Cycle there are two commands are valid: */stop* and */number*.  
5. If command has colon symbol at the end then it expects to have one or more arguments.  

### Command behavior:
* */start* command requires no arguments and initiates bot activation process with the message "Привет, меня зовут Чат-бот, а как зовут тебя?" and then waits until the next command. If next command is */name* then it completes activation process and starts the main loop. Otherwise it returns the same answer as if no command were provided - "Я не понимаю, введите другую команду!".  
* */name: <username>* command requires 1 argument which is an User name that will be used later as a local variable. It has to be stored in browser LocalStorage. Command is avlid only during Chatbot activation process and after */start* command. If command were provided correctly it should return the following response: "Привет <username>, приятно познакомится. Я умею считать, введи числа которые надо посчитать".  
* */number: <number_1>, <number_2>* command requires 2 arguments which are numbers. Input validation is required, if at lease one of the arguments is not a number then chatbot returns message "Одно из значений не является числом". If both of the arguments are numbers then chatbot asks for the next input about what operation should be performed with these numbers by returning a message "Какую операцию вы хотите выполнить? Допустимые операции: сложение (+), вычитание (-), умножение (\*), деление (/). Введите символ соотвутствующей операции:". Then it should wait for the user input (next message). If user input have only one symbol and that is one of ['+', '-', '\*', '/'] then chatbot need to do the selected operation on <number_1> and <number_2> and return a message with result in the following format "<number_1> <operation> <nubmer_2> = <result>", otherwise it should return "Не могу распознать операнд или такая операция не поддерживается" and return to the Main Cycle.  

### Design description  
There are supplementary files provided to help understand the other requirements for the design:
* ./chat-bot/user_avatar.png - user's avatar
* ./chat-bot/bot_avatar.png - chatbot's avatar
* ./chat-bot/chatbot.pdf - two pages has versions for desktop and mobile for UI
* ./chat-bot/css-examples/primer-desktop.css - styles for Desktop version
* ./chat-bot/css-examples/primer-mobile.css - styles for Mobile version
* ./chat-bot/webfonts-examples - examples fo the webfonts to use in UI
* ./chat-bot/paper-plane.svg - logo for "Send" button.  

These files can be copied into the new project structure and reused.  