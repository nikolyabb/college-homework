// Task 2.3: Two asynchronous calls using setTimeout
console.log('Step 3: start');
setTimeout(() => {
  console.log('First asynchronous call after 500 ms');
}, 500);
setTimeout(() => {
  console.log('Second asynchronous call after 1000 ms');
}, 1000);
console.log('Step 3: end');
