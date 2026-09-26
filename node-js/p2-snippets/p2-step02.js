// Task 2.2: Asynchronous code using setTimeout
console.log('Step 2: start');
setTimeout(() => {
  console.log('Asynchronous callback after 1 second');
}, 1000);
console.log('Step 2: end (callback will fire later)');
