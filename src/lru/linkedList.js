class Node {

  constructor(key, val) {
    this.key = key;
    this.val = val;
    this.next = null;
    this.last = null;
  }

  remove() {
    if (this.next) {
      this.next.last = this.last;
    }
    if (this.last) {
      this.last.next = this.next;
    }
    this.next = null;
    this.last = null;
  }


}

export default class LinkedList {

  constructor() {
    //head node is the MRU, tail is the LRU to be ejected
    this.head = new Node();
    this.tail = new Node();
    this.head.last = this.tail;
    this.tail.next = this.head;
  }

  add(key, val) {
    let node = new Node(key,val);
    node.next = this.head;
    node.last = this.head.last;
    this.head.last.next = node;
    this.head.last = node;
    return node;
  }


  oldest() {
    if (this.head.last === this.tail) {
      return null;
    } else {
      return this.tail.next;
    }
  }

  // newest() {
  //   if (this.head.last === this.tail) {
  //     return null;
  //   } else {
  //     return this.head.last;
  //   }
  // }

}
