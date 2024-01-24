exports.up = knex => knex.schema.createTable('order_items', table => {
  table.increments("id").primary(); 

  table.integer("order_id").references("id").inTable("orders");
  table.integer("dish_id").references("id").inTable("dishes");

  table.integer("amount"); 
  table.decimal("unit_price", 6, 2);
  table.decimal("total_price", 6, 2);  

}); 


exports.down = knex => knex.schema.dropTable('order_items'); 

