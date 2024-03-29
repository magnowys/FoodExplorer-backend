const { hash, compare } = require("bcryptjs");
const AppError = require("../utils/AppError");
const knex = require("../database/knex");

class UsersController {
  async create(request, response) {
    const { name, email, password } = request.body;

    const checkUserExists = await knex("users").where({ email: email}).first();

    if (checkUserExists) {
      throw new AppError("Este email já encontra-se em uso.");
    }

    const hashedPassword = await hash(password, 8);

    const [user_id] = await knex("users").insert({
      name,
      email,
      password: hashedPassword
    });

    return response.status(201).json();
  }

  async update(request, response) { 
    const { name, email, password, old_password } = request.body;
    const user_id = request.user.id;

    const user = await knex("users").where({ id:user_id }).first();

    if (!user) {
      throw new AppError("Usuário não encontrado");
    }

    const userWithUpdatedEmail =  await knex("users").where({ email: email}).first();

    if (userWithUpdatedEmail && userWithUpdatedEmail.id !== user.id) {
      throw new AppError("Este email já está em uso.");
    }

    user.name = name ?? user.name;
    user.email = email ?? user.email;

     
     if(password && !old_password) {
      throw new AppError("Você precisa informar a senha antiga para definir a nova senha.");
    }

    
    if(password && old_password) {
      const checkOldPassword = await compare(old_password, user.password);
      if(!checkOldPassword) {
        throw new AppError("A senha antiga não confere.");
      }

      
      user.password = await hash(password, 8); 
    }

    await knex("users").update(user).where({ id:user_id });

    return response.status(201).json();
  }

}

module.exports = UsersController;