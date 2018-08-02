"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const users = [
    {
        name: 'paulo',
        email: 'paulo.bressan@outlook.com'
    },
    {
        name: 'teste',
        email: 'teste.teste@outlook.com'
    }
];
class User {
    static findAll() {
        return Promise.resolve(users);
    }
}
exports.User = User;
