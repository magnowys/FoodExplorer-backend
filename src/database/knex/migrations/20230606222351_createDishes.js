exports.up = knex => knex.schema.createTable('dishes', table => {
  table.increments("id"); 
  table.text("title"); 
  table.text("description");
  table.text("photo").default(null); 
  table.decimal("price", 6, 2); 
  table.text("category").notNullable();
}); 


exports.down = knex => knex.schema.dropTable('dishes'); 
