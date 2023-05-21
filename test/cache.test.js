const { Cache } = require('../src');

describe('Cache', () => {
  describe('constructor', () => {
    it('Should create a new instance', () => {
      const cache = new Cache();
      expect(cache).toBeDefined();
      expect(cache.capacity).toEqual(100);
    });
    it('Should create a new instance with a capacity', () => {
      const cache = new Cache({ capacity: 7 });
      expect(cache).toBeDefined();
      expect(cache.capacity).toEqual(7);
    });
  });

  describe('addToFront', () => {
    it('Should add a node to the front of the list', () => {
      const cache = new Cache();
      const node = { id: 1 };
      cache.addToFront(node);
      expect(cache.head).toEqual(node);
      expect(cache.tail).toEqual(node);
    });
    it('Should add several nodes and be double linked', () => {
      const cache = new Cache();
      cache.addToFront({ id: 1 });
      cache.addToFront({ id: 2 });
      cache.addToFront({ id: 3 });
      cache.addToFront({ id: 4 });
      let node = cache.head;
      expect(node.prev).toBeUndefined();
      expect(node.id).toEqual(4);
      node = node.next;
      expect(node.id).toEqual(3);
      node = node.next;
      expect(node.id).toEqual(2);
      node = node.next;
      expect(node.id).toEqual(1);
      expect(node.next).toBeUndefined();
      expect(node).toBe(cache.tail);
      node = node.prev;
      expect(node.id).toEqual(2);
      node = node.prev;
      expect(node.id).toEqual(3);
      node = node.prev;
      expect(node.id).toEqual(4);
      expect(node.prev).toBeUndefined();
      expect(node).toBe(cache.head);
    });
    it('If capacity is excedeed delete last node', () => {
      const cache = new Cache();
      for (let i = 0; i < 20; i += 1) {
        cache.addToFront({ id: i });
      }
      expect(cache.head.id).toEqual(19);
      expect(cache.tail.id).toEqual(0);
    });
  });

  describe('clear', () => {
    it('should clear map, tail and head', () => {
      const cache = new Cache();
      for (let i = 0; i < 20; i += 1) {
        cache.addToFront({ id: i });
      }
      cache.clear();
      expect(cache.head).toBeUndefined();
      expect(cache.tail).toBeUndefined();
    });
  });

  describe('moveToFront', () => {
    it('Should move a node to the front', () => {
      const cache = new Cache();
      cache.addToFront({ id: 1 });
      cache.addToFront({ id: 2 });
      const targetNode = { id: 3 };
      cache.addToFront(targetNode);
      cache.addToFront({ id: 4 });
      cache.moveToFront(targetNode);
      let node = cache.head;
      expect(node.id).toEqual(3);
      expect(node.prev).toBeUndefined();
      node = node.next;
      expect(node.id).toEqual(4);
      node = node.next;
      expect(node.id).toEqual(2);
      node = node.next;
      expect(node.id).toEqual(1);
      expect(node.next).toBeUndefined();
      node = node.prev;
      expect(node.id).toEqual(2);
      node = node.prev;
      expect(node.id).toEqual(4);
      node = node.prev;
      expect(node.id).toEqual(3);
    });
    it('Should move tail to the front', () => {
      const cache = new Cache();
      const targetNode = { id: 1 };
      cache.addToFront(targetNode);
      cache.addToFront({ id: 2 });
      cache.addToFront({ id: 3 });
      cache.addToFront({ id: 4 });
      cache.moveToFront(targetNode);
      let node = cache.head;
      expect(node.id).toEqual(1);
      expect(node.prev).toBeUndefined();
      node = node.next;
      expect(node.id).toEqual(4);
      node = node.next;
      expect(node.id).toEqual(3);
      node = node.next;
      expect(node.id).toEqual(2);
      expect(node.next).toBeUndefined();
      node = node.prev;
      expect(node.id).toEqual(3);
      node = node.prev;
      expect(node.id).toEqual(4);
      node = node.prev;
      expect(node.id).toEqual(1);
    });
    it('Should move head to the front', () => {
      const cache = new Cache();
      cache.addToFront({ id: 1 });
      cache.addToFront({ id: 2 });
      cache.addToFront({ id: 3 });
      const targetNode = { id: 4 };
      cache.addToFront(targetNode);
      cache.moveToFront(targetNode);
      let node = cache.head;
      expect(node.id).toEqual(4);
      expect(node.prev).toBeUndefined();
      node = node.next;
      expect(node.id).toEqual(3);
      node = node.next;
      expect(node.id).toEqual(2);
      node = node.next;
      expect(node.id).toEqual(1);
      expect(node.next).toBeUndefined();
      node = node.prev;
      expect(node.id).toEqual(2);
      node = node.prev;
      expect(node.id).toEqual(3);
      node = node.prev;
      expect(node.id).toEqual(4);
    });
  });

  describe('removeLast', () => {
    it('Should remove the last node', () => {
      const cache = new Cache();
      cache.addToFront({ id: 1 });
      cache.addToFront({ id: 2 });
      cache.addToFront({ id: 3 });
      cache.addToFront({ id: 4 });
      cache.removeLast();
      expect(cache.tail.id).toEqual(2);
      expect(cache.tail.next).toBeUndefined();
      expect(cache.tail.prev.id).toEqual(3);
    });
    it('Should not crash if cache is empty', () => {
      const cache = new Cache();
      cache.removeLast();
      expect(cache.head).toBeUndefined();
      expect(cache.tail).toBeUndefined();
    });
    it('Should remove node if is the only node in the list', () => {
      const cache = new Cache();
      cache.addToFront({ id: 1 });
      cache.removeLast();
      expect(cache.head).toBeUndefined();
      expect(cache.tail).toBeUndefined();
    });
  });

  describe('get and put', () => {
    it('Should limit elements to capacity', () => {
      const cache = new Cache({ capacity: 5 });
      for (let i = 1; i <= 10; i += 1) {
        cache.put({ id: i, value: i * 100 });
      }
      expect(cache.map.size).toEqual(5);
    });
    it('If an existing element is put again, move it to the begin of the cache', () => {
      const cache = new Cache();
      for (let i = 1; i <= 10; i += 1) {
        cache.put({ id: i, value: i * 100 });
      }
      cache.put({ id: 1, value: 100 });
      expect(cache.head.id).toEqual(1);
      expect(cache.head.next.id).toEqual(10);
    });
    it('Should return value form existing item', () => {
      const cache = new Cache();
      for (let i = 1; i <= 10; i += 1) {
        cache.put({ id: i, value: i * 100 });
      }
      expect(cache.get(1)).toEqual({ id: 1, value: 100 });
      expect(cache.get(10)).toEqual({ id: 10, value: 1000 });
    });
    it('Should return undefined if get non existing item', () => {
      const cache = new Cache();
      for (let i = 1; i <= 10; i += 1) {
        cache.put(i, i * 100);
      }
      expect(cache.get(11)).toBeUndefined();
    });
  });

  describe('indexes', () => {
    it('should allow to search by indexes', () => {
      const cache = new Cache({ indexFields: ['name', 'uuid'] });
      cache.put({ id: 1, uuid: 'a1', name: 'a' });
      cache.put({ id: 2, uuid: 'b2', name: 'b' });
      cache.put({ id: 3, uuid: 'c3', name: 'c' });
      cache.put({ id: 4, uuid: 'd4', name: 'd' });
      cache.put({ id: 5, uuid: 'e5', name: 'e' });
      let item = cache.getByIndex('uuid', 'a1');
      expect(item.id).toEqual(1);
      item = cache.getByIndex('uuid', 'b2');
      expect(item.id).toEqual(2);
      item = cache.getByIndex('uuid', 'c3');
      expect(item.id).toEqual(3);
      item = cache.getByIndex('uuid', 'd4');
      expect(item.id).toEqual(4);
      item = cache.getByIndex('uuid', 'e5');
      expect(item.id).toEqual(5);
      item = cache.getByIndex('uuid', 'f6');
      expect(item).toBeUndefined();
      item = cache.getByIndex('name', 'a');
      expect(item.id).toEqual(1);
      item = cache.getByIndex('name', 'b');
      expect(item.id).toEqual(2);
      item = cache.getByIndex('name', 'c');
      expect(item.id).toEqual(3);
      item = cache.getByIndex('name', 'd');
      expect(item.id).toEqual(4);
      item = cache.getByIndex('name', 'e');
      expect(item.id).toEqual(5);
      item = cache.getByIndex('name', 'f');
      expect(item).toBeUndefined();
    });
    it('should remove indexes if element is removed', () => {
      const cache = new Cache({ indexFields: ['name', 'uuid'] });
      cache.put({ id: 1, uuid: 'a1', name: 'a' });
      cache.put({ id: 2, uuid: 'b2', name: 'b' });
      cache.put({ id: 3, uuid: 'c3', name: 'c' });
      cache.put({ id: 4, uuid: 'd4', name: 'd' });
      cache.put({ id: 5, uuid: 'e5', name: 'e' });
      cache.remove(3);
      const actual = cache.getByIndex('name', 'c');
      expect(actual).toBeUndefined();
    });
  });
});
