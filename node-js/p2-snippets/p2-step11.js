// Task 2.11: Inheritance using util.inherits and without it
const util = require('util');
const EventEmitter = require('events');

// Base class
function Animal(name) {
  this.name = name;
}
Animal.prototype.speak = function () {
  return `${this.name} makes a sound`;
};

// Subclass using util.inherits
function Dog(name) {
  Animal.call(this, name);
}
util.inherits(Dog, Animal);
Dog.prototype.bark = function () {
  return `${this.name} barks`;
};

// Subclass without util.inherits (Object.setPrototypeOf)
function Cat(name) {
  Animal.call(this, name);
}
Cat.prototype = Object.create(Animal.prototype);
Cat.prototype.constructor = Cat;
Cat.prototype.meow = function () {
  return `${this.name} meows`;
};

const dog = new Dog('Rex');
const cat = new Cat('Whiskers');

console.log(dog.speak());
console.log(dog.bark());
console.log(cat.speak());
console.log(cat.meow());
