import axios from 'axios';
import {key} from '../config'

export default class Recipe {
    constructor(id) {
        this.id = id;
    }

    async getRecipe() {
        try {
            const res = await axios(`https://api.spoonacular.com/recipes/${this.id}/information?apiKey=${key}&includeNutrition=false`);
            this.title = res.data.title;
            this.author = res.data.sourceName;
            this.img = res.data.image;
            this.url = res.data.sourceUrl;
            this.ingredients = res.data.extendedIngredients;
            this.time = res.data.cookingMinutes;
            this.servings = res.data.servings;
        } catch (error) {
            alert(`Something went wrong :(`);
        }
    }

    updateServings (type) {
        // Servings
        const newServings = type === 'dec'? this.servings - 1 : this.servings + 1;

        //Ingredients
        this.ingredients.forEach(ing => {
            ing.amount *= newServings/this.servings;
        });

        this.servings = newServings;
    }
}