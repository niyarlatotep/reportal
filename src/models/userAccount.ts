import bcrypt from "bcryptjs";
import {instanceMethod, prop, Typegoose, InstanceType, staticMethod, ModelType} from "typegoose";
import {mongooseConnection} from "../lib/mongoos";


class UserAccount extends Typegoose {
    @prop({required: true, unique: true})
    name: string;

    @prop({required: true})
    hashedPassword: string;

    @prop({required: true})
    salt: string;

    @prop()
    set password(password){
        this.salt = bcrypt.genSaltSync(10);
        this.hashedPassword = bcrypt.hashSync(password, this.salt);
    }

    @instanceMethod
    async checkPassword(password){
        return bcrypt.compare(password, this.hashedPassword)
    }

    @staticMethod
    static async authorize(this: ModelType<UserAccount> & typeof UserAccount, userName, password) {
        const foundUserAccount = await this.findOne({name: userName}).exec();

        if (foundUserAccount && await foundUserAccount.checkPassword(password)){
            return foundUserAccount;
        } else {
            //todo return auth error
            return null;
        }
    };

    @staticMethod
    static async getUserById(this: ModelType<UserAccount> & typeof UserAccount, id: string) {
        const foundUserAccount = await this.findById(id).exec();
        if (foundUserAccount){
            return foundUserAccount;
        } else {
            return null;
        }
    };
}

const UserAccountModel = new UserAccount().getModelForClass(UserAccount, {existingConnection: mongooseConnection.reportal});

export {
    UserAccountModel
}