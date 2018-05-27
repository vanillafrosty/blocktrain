import LinkedList from './linkedList';

export default class LRUCache {

  constructor(maxCount, pieceValues) {
    this.count = 0;
    this.max = maxCount;
    this.map = {};
    this.list = new LinkedList();
    this.pieceValues = pieceValues;
  }

  get(key) {
    if (this.map[key] !== undefined) {
      let node = this.map[key];
      node.remove();
      let newNode = this.list.add(node.key, node.val);
      this.map[key] = newNode;
    } else if (this.count < this.max) {
      let newNode = this.list.add(key, this.pieceValues[key]);
      this.count += 1;
      this.map[key] = newNode;
    } else {
      let oldestNode = this.list.oldest();
      oldestNode.remove();
      delete this.map[oldestNode.key];
      let newNode = this.list.add(key, this.pieceValues[key]);
      this.map[key] = newNode;
    }
  }


}
