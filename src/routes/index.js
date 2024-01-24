const { Router } = require("express");
const routes = Router();

const usersRouter = require("./users.routes");
const dishesRouter = require("./dishes.routes");
const ingredientsRouter = require("./ingredients.routes");
const favoritesRouter = require("./favorites.routes");

const sessionsRouter = require("./sessions.routes");

const ordersRouter = require("./orders.routes");
const orderItemsRouter = require("./orderItems.routes");

routes.use("/users", usersRouter);
routes.use("/sessions", sessionsRouter);
routes.use("/dishes", dishesRouter);
routes.use("/ingredients", ingredientsRouter);
routes.use("/favorites", favoritesRouter);

routes.use("/orders", ordersRouter);
routes.use("/order_items", orderItemsRouter);


module.exports = routes;