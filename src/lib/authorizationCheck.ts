export function authorizationCheck(req, res, next) {
    if (!req.session.user){
        res.redirect('/');
    } else {
        next();
    }
}

export function onlyAdminAllowed(req, res, next) {
    if (!req.session.user){
        res.sendStatus(401);
    } else {
        if (req.session.user.name === "admin"){
            next();
        } else {
            console.log('not an admin');
            res.sendStatus(401);
        }
    }
}

export function isAdmin(req) {
    return req.session.user.name === "admin";
}