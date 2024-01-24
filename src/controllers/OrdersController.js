const AppError = require("../utils/AppError");

const knex = require("../database/knex");

const moment = require("moment-timezone");
class OrdersController {
    async create(request, response) {
        const user_id = request.user.id;

        const saoPauloTime = moment.tz(Date.now(), 'America/Sao_Paulo');

        const formattedDate = saoPauloTime.format('DD/MM - HH:mm');
        
        if(!user_id) {
            throw new AppError("Usuário não logado.")
        }

        const [id] = await knex("orders").insert({ 
            user_id,
            created_at: formattedDate,
            updated_at: formattedDate
        });
        
        return response.json({id});
    }

    async show(request, response) {
        const user_id = request.params.id;

        const orderUser = await knex("order_items")
        .select([
            "orders.id",
            "orders.created_at",
            "orders.user_id",
            "orders.status"
        ])
        .innerJoin("orders", "orders.id", "order_items.order_id")
        .where("orders.user_id", user_id)
        .orderBy("created_at")
        .groupBy("order_id");

        const orderWithItem = await Promise.all(orderUser.map(async order => {
            const items = await knex("order_items")
                .select([
                    "dishes.title as dish_title",
                    "order_items.amount",
                    "order_items.order_id"
                ])
                .innerJoin("dishes", "dishes.id", "order_items.dish_id")
                .where("order_items.order_id", order.id);
        
            return {
                ...order,
                items
            };
        }));

        return response.json(orderWithItem);
    }

    async index(request, response) {
        const orderAll = await knex("order_items")
        .select([
            "orders.id",
            "orders.created_at",
            "orders.user_id",
            "orders.status"
        ]).innerJoin("orders", "orders.id", "order_items.order_id")
        .orderBy("created_at")
        .groupBy("order_id");

        const orderWithItem = await Promise.all(orderAll.map(async order => {
            const items = await knex("order_items")
                .select([
                    "dishes.title as dish_title",
                    "order_items.amount",
                    "order_items.order_id"
                ])
                .innerJoin("dishes", "dishes.id", "order_items.dish_id")
                .where("order_items.order_id", order.id);
        
            return {
                ...order,
                items
            };
        }));

        return response.json(orderWithItem);
    }

    async update(request, response) {
        const { id } = request.params;
        const { status } = request.body;
        
        const order = await knex("orders").where({ id }).first();

        if(!order) {
            throw new AppError("Este prato não existe.", 404)
        }

        await knex("orders").where({ id }).update({
            status
        });

        return response.status(200).json();
        
    }

    async delete(request, response) {
        const { id } = request.params;

        await knex("orders").where({ id }).delete();

        return response.json(id);
    }
}

module.exports = OrdersController;