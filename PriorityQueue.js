class PriorityQueue {
  constructor() {
    this.items = [];
  }

  enqueue(item) {
    if (item.urgent) {
      this.items.unshift(item);
    } else {
      this.items.push(item);
    }
  }

  dequeue() {
    return this.items.shift();
  }

  isEmpty() {
    return this.items.length === 0;
  }

  peek() {
    return this.items[0];
  }
}

module.exports = PriorityQueue;
