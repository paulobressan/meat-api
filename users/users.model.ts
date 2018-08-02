const users =[
    {
        name: 'paulo',
        email:'paulo.bressan@outlook.com'
    },
    {
        name: 'teste',
        email:'teste.teste@outlook.com'
    }
];

export class User{
    static findAll(): Promise<Object[]>{
        return Promise.resolve(users);
    }
}