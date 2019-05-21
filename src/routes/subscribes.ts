import {Response} from "express-serve-static-core";

class Subscribes {
    private clients: {[key: string]: Response[]} = {};
    subscribe(res: Response, objectId: string){

        console.log(`subscribe to ${objectId}`);
        res.writeHead(200, {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache',
            'Connection': 'keep-alive',
        });
        res.write('\n');
        this.clients[objectId] ? this.clients[objectId].push(res) :  this.clients[objectId] = [res];
        res.on('close', ()=>{
            this.clients[objectId].splice(this.clients[objectId].indexOf(res), 1)
        });
    }
    publish(objectId){
        if (!this.clients[objectId]){
            //no subscribers yet
            return;
        }
        console.log(`publish to ${objectId}`);
        for (const res of this.clients[objectId]){
            res.write('\n\n');
        }
        console.log(this.clients[objectId]);
        this.clients[objectId] = [];
    }
}

const subscribes = new Subscribes();

export {
    subscribes
}