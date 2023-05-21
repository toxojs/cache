class Cache {
  constructor(settings = {}) {
    this.map = new Map();
    this.indexField = settings.indexField || 'id';
    this.head = undefined;
    this.tail = undefined;
    this.capacity = settings.capacity || 100;
    this.maxAge = settings.maxAge;
    if (settings.indexFields?.length > 0) {
      this.indexes = new Map();
      settings.indexFields.forEach((field) =>
        this.indexes.set(field, new Map())
      );
    }
  }

  clear() {
    this.map.clear();
    this.head = undefined;
    this.tail = undefined;
  }

  addIndexes(value) {
    if (this.indexes) {
      const keys = [...this.indexes.keys()];
      keys.forEach((field) => {
        if (value[field]) {
          const index = this.indexes.get(field);
          index.set(value[field], value[this.indexField]);
        }
      });
    }
  }

  removeIndexes(value) {
    if (this.indexes) {
      const keys = [...this.indexes.keys()];
      keys.forEach((field) => {
        if (value[field]) {
          const index = this.indexes.get(field);
          index.delete(value[field]);
        }
      });
    }
  }

  addToFront(srcNode) {
    const node = srcNode;
    if (this.head) {
      node.next = this.head;
      this.head.prev = node;
    }
    this.head = node;
    if (!this.tail) {
      this.tail = node;
    }
    this.map.set(node[this.indexField], node);
    return node;
  }

  moveToFront(srcNode) {
    const node = srcNode;
    if (this.head === node) {
      return node;
    }
    if (this.tail === node) {
      this.tail = node.prev;
    }
    node.prev.next = node.next;
    if (node.next) {
      node.next.prev = node.prev;
    }
    node.prev = undefined;
    node.next = this.head;
    this.head.prev = node;
    this.head = node;
    return node;
  }

  removeNode(srcNode) {
    const node = srcNode;
    if (this.head === node) {
      this.head = node.next;
    }
    if (this.tail === node) {
      this.tail = node.prev;
    }
    if (node.prev) {
      node.prev.next = node.next;
    }
    if (node.next) {
      node.next.prev = node.prev;
    }
    node.prev = undefined;
    node.next = undefined;
    this.map.delete(node[this.indexField]);
    this.removeIndexes(node.value);
    return node;
  }

  removeLast() {
    return this.tail ? this.removeNode(this.tail) : undefined;
  }

  isExpired(node) {
    return Math.floor((Date.now() - node.updatedAt) / 1000) > this.maxAge;
  }

  get(id) {
    const node = this.map.get(id);
    if (node) {
      if (this.maxAge) {
        if (this.isExpired(node)) {
          this.clear();
          return undefined;
        }
      } else {
        this.moveToFront(node);
      }
      return node.value;
    }
    return undefined;
  }

  getByIndex(field, value) {
    if (field === this.indexField) {
      return this.get(value);
    }
    if (!this.indexes) {
      return undefined;
    }
    const index = this.indexes.get(field);
    if (!index) {
      return undefined;
    }
    const id = index.get(value);
    return id ? this.get(id) : undefined;
  }

  put(value) {
    const id = value[this.indexField];
    let node = this.map.get(id);
    if (node) {
      this.removeIndexes(node.value);
      node.updatedAt = Date.now();
      node.value = value;
      this.moveToFront(node);
      this.addIndexes(value);
      return node;
    }
    node = { id, value, updatedAt: Date.now() };
    this.addToFront(node);
    this.addIndexes(value);
    while (this.map.size > this.capacity) {
      this.removeLast();
    }
    return node;
  }

  remove(id) {
    const node = this.map.get(id);
    return node ? this.removeNode(node) : undefined;
  }

  setCapacity(capacity) {
    this.capacity = capacity;
    while (this.map.size > this.capacity) {
      this.removeLast();
    }
  }
}

module.exports = { Cache };
