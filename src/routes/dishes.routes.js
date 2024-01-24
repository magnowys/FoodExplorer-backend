const { Router } = require("express");

const multer = require("multer"); //importando o multer
const uploadConfig = require("../configs/upload"); // importando minhas configurações de upload, arquivo upload.js na pasta de configurações

const DishesController = require("../controllers/DishesController");


const dishesRoutes = Router();

const ensureAuthenticated = require("../middleware/ensureAuthenticated");

const upload = multer(uploadConfig.MULTER);

const dishesController = new DishesController();


dishesRoutes.post("/", ensureAuthenticated, upload.single("photo"), dishesController.create);
dishesRoutes.put("/:id", ensureAuthenticated, upload.single("photo"), dishesController.update);
dishesRoutes.get("/", dishesController.index);
dishesRoutes.get("/:id", dishesController.show);
dishesRoutes.delete("/:id", ensureAuthenticated, dishesController.delete);



module.exports = dishesRoutes;