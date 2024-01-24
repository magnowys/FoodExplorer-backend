const AppError = require("../utils/AppError");
const knex = require("../database/knex");

class OrderItemsController {
  async create(request, response) {
    const { items, order_id } = request.body;

    const orderAddress = await knex("orders").where({ id: order_id }).first();

    if(!orderAddress) {
        throw new AppError("Número do pedido inexistente.")
    }

    const itemsToInsert = items.map(item => {
        return {
            amount: item.amount,
            order_id,
            dish_id: item.dish_id,
            unit_price: item.unit_price,
            total_price: item.total_price
        }
    });

    await knex("order_items").insert(itemsToInsert);

    return response.json();
}

}

module.exports = OrderItemsController;