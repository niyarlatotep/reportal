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
        const currentObjectArray = this.clients[objectId];    
        res.on('close', ()=>{
            console.log('subscriber removed', objectId);            
            currentObjectArray.splice(currentObjectArray.indexOf(res), 1);            
        });
    }
    publish(objectId){
        const clients = this.clients[objectId];
        if (!this.clients[objectId]){
            //no subscribers yet
            console.log('no subscribers');
            return;
        }

        setTimeout(()=>{
            console.log(`publish to ${objectId}`);
            for (const res of clients){
                res.write(`data: refresh client \n\n`)
            }
            delete clients[objectId];
        }, 500);
    }
}

const subscribes = new Subscribes();

export {
    subscribes
}