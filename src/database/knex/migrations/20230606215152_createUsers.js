exports.up = knex => knex.schema.createTable('users', table => {
  table.increments("id").primary(); 
  table.text("name").notNullable(); 
  table.text("email"); 
  table.text("password");
  table.boolean("isAdmin").default(false); 
}); 


exports.down = knex => knex.schema.dropTable('users');