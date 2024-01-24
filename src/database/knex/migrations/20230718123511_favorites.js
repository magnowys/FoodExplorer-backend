exports.up = knex => knex.schema.createTable('favorites', table => {
  table.increments("id").primary(); 
  
  table.integer("dish_id").references("id").inTable("dishes");
  table.integer("user_id").references("id").inTable("users"); 

}); 


exports.down = knex => knex.schema.dropTable('favorites'); 

