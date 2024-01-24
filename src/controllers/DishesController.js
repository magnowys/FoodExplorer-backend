const knex = require("../database/knex");
const AppError = require('../utils/AppError');

const DiskStorage = require("../providers/DiskStorage");

const diskStorage = new DiskStorage();

class DishesController {
  
  async create (request, response) {
    const {title, description, price, category, ingredients} = request.body;
    const { filename: photo } = request.file;

    const filename = await diskStorage.saveFile(photo);
    

    const [dish_id] = await knex("dishes").insert({
      title,
      description,
      price,
      category,
      photo: filename,
    });

    const ingredientsArray = ingredients.split(",")

     
     const ingredientsInsert = ingredientsArray.map(name => {
      return { 
        dish_id, 
        name
      }
    });

    await knex("ingredients").insert(ingredientsInsert); 
    return response.json();
  }

  
  async show (request, response) {
    const { id } = request.params;

    const dish = await knex("dishes").where({ id }).first();

    const ingredients = await knex("ingredients").where({dish_id: id}).orderBy("name");

    return response.json({
      ...dish,
      ingredients
    });

  }

  
  async update (request, response) { 
    const { title, description, ingredients, price, category, isString} = request.body;
    const { id } = request.params;

    let filename

    const dataDish = await knex("dishes").where({ id }).first();

    if (isString === 'false') {
      const { filename: photo } = request.file

      filename = await diskStorage.saveFile(photo)
    } else {
      filename = dataDish.photo
    }

    if (!dataDish) {
      throw new AppError("Prato não encontrado.");
    }

    await knex("dishes").where({ id } ).update({
      title,
      description,
      price,
      category,
      photo: filename
    });

    await knex("ingredients").where({ dish_id: dataDish.id}).delete();

    const ingredientsList = ingredients.split(",");

    for (let i = 0; i < ingredientsList.length; i++) {
        const ingredient = ingredientsList[i];

        if (ingredient.id) {
            await knex("ingredients")
            .where({ id: ingredient.id })
            .update({ name: ingredient });
        } else {
            await knex("ingredients").insert({
                dish_id: dataDish.id,
                name: ingredient
            });
        }
    }

    return response.status(201).json();
}

  
  async delete (request, response) {
    const { id } = request.params;

    await knex("dishes").where({ id }).delete();

    return response.json()
  }

  
  async index(request, response) {
    const { title, ingredients } = request.query;
  
    let dishes;
  
    const filterIngredients = ingredients
      .split(',')
      .map(ingredient => ingredient.trim());
    
    const allIngredients = await knex("ingredients").select("*");
    const ingredientNames = allIngredients.map(item => item.name);
  
    const ingredientExists = filterIngredients.some(nameIngredient =>
      ingredientNames.some(ingredientName =>
        ingredientName.toUpperCase() === nameIngredient.toUpperCase()
      )
    );
  
    if (ingredientExists) {
      dishes = await knex("ingredients")
        .select([
          "dishes.id",
          "dishes.title",
          "dishes.description",
          "dishes.photo",
          "dishes.price",
          "dishes.category"
        ])
        .whereIn(knex.raw('UPPER(name)'), filterIngredients.map(ingredient => ingredient.toUpperCase()))
        .innerJoin("dishes", "dishes.id", "ingredients.dish_id" )
        .groupBy("dishes.id") 
        .orderBy("dishes.title")
    } else if (!ingredientExists && title) {
      dishes = await knex("dishes").select("*")
        .whereRaw('UPPER(title) LIKE ?', `%${title.toUpperCase()}%`)
        .orderBy("title")
    } else {
      dishes = await knex("dishes").select("*")
        .orderBy("title")
    }

    const fullIngredients = await knex("ingredients").select("*"); 
    const dishesWithIngredients = dishes.map(dish => {
      const dishIngredients =  fullIngredients.filter(ingredient => ingredient.dish_id === dish.id);
      
      return {
        ...dish,
        ingredients: dishIngredients
      }
    });

    return response.json(dishesWithIngredients);
  }
 
}

module.exports = DishesController;