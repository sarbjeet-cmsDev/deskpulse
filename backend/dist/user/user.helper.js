"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hashPassword = hashPassword;
exports.checkUserExists = checkUserExists;
exports.comparePassword = comparePassword;
exports.default = fetched_by_user_email;
const common_1 = require("@nestjs/common");
const bcrypt = require("bcrypt");
async function hashPassword(password) {
    const saltRounds = 10;
    return bcrypt.hash(password, saltRounds);
}
async function checkUserExists(userModel, email, username) {
    if (await userModel.exists({ $or: [{ email }, { username }] })) {
        throw new common_1.ConflictException('User with this email or username already exists');
    }
}
async function comparePassword(password, hashedPassword) {
    return bcrypt.compare(password, hashedPassword);
}
async function fetched_by_user_email(userModel, email) {
    return userModel.findOne({ email });
}
//# sourceMappingURL=user.helper.js.map