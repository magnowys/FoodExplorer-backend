const { Router } = require("express");


const OrderItemsController = require("../controllers/OrderItemsController");
const orderItemsController = new OrderItemsController();

const orderItemsRoutes = Router();
orderItemsRoutes.post("/", orderItemsController.create);

module.exports = orderItemsRoutes;