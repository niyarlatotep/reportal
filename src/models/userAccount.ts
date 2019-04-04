import * as mongoose from "mongoose";
import {mongooseConfig} from "../appConfig";
import * as bcrypt from "bcrypt";

mongoose.connect(mongooseConfig.mongooseUri, { useNewUrlParser: true });
const UserAccountSchema = new mongoose.Schema({
    userName: {
        type: String,
        required: true,
        unique: true
    },
    hashedPassword: {
        type: String,
        required: true
    },
    salt: {
        type: String,
        required: true
    }
});

UserAccountSchema.virtual('password')
    .set(function (password) {
       this.salt = bcrypt.genSaltSync(10);
       this.hashedPassword = bcrypt.hashSync(password, this.salt);
    });

UserAccountSchema.methods.checkPassword = function (password) {
    //async
    return bcrypt.compare(password, this.hashedPassword)
};

const UserAccountModel = mongoose.model('UserAccount', UserAccountSchema);

export {
    UserAccountModel
}