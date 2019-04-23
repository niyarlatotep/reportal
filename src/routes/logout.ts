import * as express from 'express';

const logoutRouter = express.Router();

logoutRouter.post('/logout', async (req, res) => {
    req.session.destroy(()=>{
        res.redirect('/')
    });
});

export {
    logoutRouter
}