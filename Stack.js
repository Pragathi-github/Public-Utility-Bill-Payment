class Stack {
  constructor() {
    this.items = [];
  }

  push(item) {
    this.items.push(item);
  }

  pop() {
    return this.items.pop();
  }

  getHistory() {
    return this.items;
  }

  isEmpty() {
    return this.items.length === 0;
  }
}

module.exports = Stack;
