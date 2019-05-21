"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Subscribes {
    constructor() {
        this.clients = {};
    }
    subscribe(res, objectId) {
        console.log(`subscribe to ${objectId}`);
        res.writeHead(200, {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache',
            'Connection': 'keep-alive',
        });
        res.write('\n');
        this.clients[objectId] ? this.clients[objectId].push(res) : this.clients[objectId] = [res];
        const currentObjectArray = this.clients[objectId];
        res.on('close', () => {
            // console.log('before remove ================================== ');
            // console.log(currentObjectArray);
            currentObjectArray.splice(currentObjectArray.indexOf(res), 1);
            // console.log('after remove ================================== ');
            // console.log(currentObjectArray);
        });
    }
    publish(objectId) {
        if (!this.clients[objectId]) {
            //no subscribers yet
            console.log('no subscribers');
            return;
        }
        console.log(`publish to ${objectId}`);
        for (const res of this.clients[objectId]) {
            res.write(`data: refresh client \n\n`);
        }
        delete this.clients[objectId];
    }
}
const subscribes = new Subscribes();
exports.subscribes = subscribes;
