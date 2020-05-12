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

    parseIngredients() {
        const newIngredients = this.ingredients.map(el => {
            // 1. Uniform units
            // All units are already uniform

            // 2. Remove Parenthesis
            // No parenthesis are actually included

            // 3. Parse ingredients into count, unit and ingredient
        })
    }
}