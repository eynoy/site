Array.prototype.empty = function() {
  return this.length == 0;
};

Array.prototype.front = function() {
  return this[0];
};

const getRandomInt = (max) => {
  return Math.floor(Math.random() * Math.floor(max));
}