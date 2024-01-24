const { Router } = require("express");

const UsersController = require("../controllers/UsersController");

const ensureAuthenticated = require("../middleware/ensureAuthenticated"); //import do middleware de autenticação

const usersRoutes = Router();

const usersController = new UsersController();


usersRoutes.post("/", usersController.create);
usersRoutes.put("/", ensureAuthenticated, usersController.update); //uso está rota para me encaminhar para a funcionalidade que irá atualizar algum dado da table Users, já criada, por isso preciso passar o id desse usuário para fazer a alteração na pessoa certa, vou usar esse id na funcionalidade do Controller que é responsável pelo update.


module.exports = usersRoutes;