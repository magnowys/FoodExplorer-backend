const { Router } = require("express");
const OrdersController = require("../controllers/OrdersController");

const ensureAuthenticated = require("../middleware/ensureAuthenticated");

const ordersRoutes = Router();
const ordersController = new OrdersController();

ordersRoutes.use(ensureAuthenticated);

ordersRoutes.post("/", ordersController.create);
ordersRoutes.get("/:id", ordersController.show);
ordersRoutes.get("/", ordersController.index);
ordersRoutes.patch("/:id", ordersController.update);
ordersRoutes.delete("/:id", ordersController.delete);

module.exports = ordersRoutes;