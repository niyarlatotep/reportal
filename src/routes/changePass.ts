import express from 'express';
import {UserAccountModel} from "../models/userAccount";
import {onlyAdminAllowed} from "../lib/authorizationCheck";


const changePasswordRouter = express.Router();

changePasswordRouter.get('/admin', async (req, res) => {
    if (!req.session.user){
        res.sendStatus(404);
    } else {
        if (req.session.user.name === "admin") {
            res.render('change-password', {layout: false});
        } else {
            console.log('not an admin');
            res.sendStatus(404);
        }
    }
});

changePasswordRouter.post('/changePassword', onlyAdminAllowed, async (req, res) => {
    const oldPassword = req.body.oldPassword;
    const newPassword = req.body.newPassword;
    try {
        const admin = await UserAccountModel.authorize(req.session.user.name, oldPassword);
        if (admin){
            const admin = await UserAccountModel.findById(req.session.user._id).exec();
            admin.password = newPassword;
            await admin.save();
            res.send();
        } else {
            res.status(403).send();
        }
    } catch (e) {
        console.error(e)
    }
});

export {
    changePasswordRouter
}