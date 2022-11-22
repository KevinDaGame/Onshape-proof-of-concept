import { parsedPart } from "../types";

type type = "Part" | "Assembly";
export default class GltfTree {
    root: GltfNode;
    constructor(key: string, value: parsedPart | null, type: type) {
        this.root = new GltfNode(key, value, type);
    }

    *preOrderTraversal(node = this.root): Generator<GltfNode> {
        yield node;
        if (node.children.length) {
            for (let child of node.children) {
                yield* this.preOrderTraversal(child);
            }
        }
    }

    *postOrderTraversal(node = this.root): Generator<GltfNode> {
        if (node.children.length) {
            for (let child of node.children) {
                yield* this.postOrderTraversal(child);
            }
        }
        yield node;
    }

    insert(parentNodeKey: string, key: string, type: type, value: parsedPart | null, name?: string) {        
        for (let node of this.preOrderTraversal()) {
            if (node.key === parentNodeKey) {
                node.children.push(new GltfNode(key, value, type, node, name));
                return true;
            }
        }
        return false;
    }

    remove(key: string) {
        for (let node of this.preOrderTraversal()) {
            const filtered = node.children.filter((c: GltfNode) => c.key !== key);
            if (filtered.length !== node.children.length) {
                node.children = filtered;
                return true;
            }
        }
        return false;
    }

    find(key: string) {
        for (let node of this.preOrderTraversal()) {
            if (node.key === key) return node;
        }
        return undefined;
    }
}

export class GltfNode {
    children: GltfNode[];
    key: string;
    name: string
    value: parsedPart | null;
    parent: GltfNode | null;
    type: type;
    constructor(key: any, value: parsedPart | null, type: type, parent: GltfNode | null = null, name?: string) {
        this.name = name || key;
        this.key = key;
        this.value = value;
        this.type = type;
        this.parent = parent;
        this.children = [];
    }

    get isLeaf() {
        return this.children.length === 0;
    }

    get hasChildren() {
        return !this.isLeaf;
    }
}