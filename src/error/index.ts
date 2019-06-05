import http from 'http';

class HttpError extends Error{
    constructor(public status, public message){
        super();
        this.message = message || http.STATUS_CODES[status] || "Error";
    }
}

export {
    HttpError
}