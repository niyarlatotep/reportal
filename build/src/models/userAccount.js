"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
const bcrypt = require("bcryptjs");
const typegoose_1 = require("typegoose");
const mongoos_1 = require("../lib/mongoos");
class UserAccount extends typegoose_1.Typegoose {
    set password(password) {
        this.salt = bcrypt.genSaltSync(10);
        this.hashedPassword = bcrypt.hashSync(password, this.salt);
    }
    async checkPassword(password) {
        return bcrypt.compare(password, this.hashedPassword);
    }
    static async authorize(userName, password) {
        const foundUserAccount = await this.findOne({ name: userName }).exec();
        if (foundUserAccount && await foundUserAccount.checkPassword(password)) {
            return foundUserAccount;
        }
        else {
            //todo return auth error
            return null;
        }
    }
    ;
}
__decorate([
    typegoose_1.prop({ required: true, unique: true }),
    __metadata("design:type", String)
], UserAccount.prototype, "name", void 0);
__decorate([
    typegoose_1.prop({ required: true }),
    __metadata("design:type", String)
], UserAccount.prototype, "hashedPassword", void 0);
__decorate([
    typegoose_1.prop({ required: true }),
    __metadata("design:type", String)
], UserAccount.prototype, "salt", void 0);
__decorate([
    typegoose_1.prop(),
    __metadata("design:type", Object),
    __metadata("design:paramtypes", [Object])
], UserAccount.prototype, "password", null);
__decorate([
    typegoose_1.instanceMethod,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserAccount.prototype, "checkPassword", null);
__decorate([
    typegoose_1.staticMethod,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], UserAccount, "authorize", null);
const UserAccountModel = new UserAccount().getModelForClass(UserAccount, { existingConnection: mongoos_1.mongooseConnection.reportal });
exports.UserAccountModel = UserAccountModel;
