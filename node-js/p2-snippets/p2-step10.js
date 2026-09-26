// Task 2.10: Pass parameters to an event
const EventEmitter = require('events');
const emitter = new EventEmitter();

emitter.on('message', (sender, text) => {
  console.log(`${sender} says: ${text}`);
});

emitter.emit('message', 'Alice', 'Hello, world!');
emitter.emit('message', 'Bob', 'How are you?');
