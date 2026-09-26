// Task 2.9: Generate an event and call its handlers
const EventEmitter = require('events');
const emitter = new EventEmitter();

emitter.on('greet', () => {
  console.log('Hello from first handler!');
});

emitter.on('greet', () => {
  console.log('Hello from second handler!');
});

emitter.emit('greet');
