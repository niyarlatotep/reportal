import * as mongoose from "mongoose";
import {mongooseConfig} from "../appConfig";
import * as bcrypt from "bcrypt";
import * as http from "http";
import {Model} from "mongoose";

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

UserAccountSchema.methods.checkPassword = async function (password) {
    return await bcrypt.compare(password, this.hashedPassword)
};

UserAccountSchema.statics.authorize = async function (userName, password) {
    const UserAccountModel = this;
    const foundUserAccount = <IUserAccountDocument>await UserAccountModel.findOne({userName: userName});

    if (foundUserAccount && await foundUserAccount.checkPassword(password)){
        return foundUserAccount;
    } else {
        //todo return auth error
        return null;
    }
};

const UserAccountModel = <UserAccountModel>mongoose.model('UserAccount', UserAccountSchema);

export interface IUserAccountDocument extends mongoose.Document{
    //todo migrate to typegoost
    userName: string,
    password: string

    checkPassword(password: string): Promise<boolean>
}

interface UserAccountModel extends Model<IUserAccountDocument>{
    authorize(userName: string, password: string): Promise<IUserAccountDocument | null>
}

class AuthError extends Error{
    constructor(public status, public message){
        super();
        this.message = message;
    }
}

export {
    AuthError
}

export {
    UserAccountModel
}