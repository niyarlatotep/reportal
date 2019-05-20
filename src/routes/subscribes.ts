import {Response} from "express-serve-static-core";

class Subscribes {
    private clients: Response[] = [];
    subscribe(res: Response){
        console.log('subscribe');
        res.writeHead(200, {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache',
            'Connection': 'keep-alive',
        });
        res.write('\n');
        this.clients.push(res);
    }
    publish(){
        for (const res of this.clients){
            res.write('\n');
        }
    }
}

const launchesSubscribes = new Subscribes();

export {
    launchesSubscribes
}