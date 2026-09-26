let name = '';

function setName(newName) {
  name = newName;
}

function sayHello() {
  if (!name) return console.log('Привет, аноним!');
  console.log(`Привет, ${name}!`);
}

module.exports = {
  setName,
  sayHello,
};
