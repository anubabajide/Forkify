import Search from './models/Search';
import Recipe from './models/Recipe';
import List from './models/List';
import Likes from './models/Likes';
import * as searchView from './views/searchView';
import * as recipeView from './views/recipeView';
import * as listView from './views/listView';
import * as likesView from './views/likesView';
import { elements, renderLoader, clearLoader } from './views/base';

/** Global state of the app
 * - Search Object
 * - Current Recipe object
 * - Shopping list object
 * - Liked recipes
 */
const state = {};

/*************************************************************************************  SEARCH CONTROLLER  *************************************************************************************/


const controlSearch = async () => {
    // 1. Get query from view
    const query = searchView.getInput();
    
    if (query) {
        // 2. New Search Object and add to state
        state.search = new Search(query);
        
        // 3. Prepare UI for results
        searchView.clearInput();
        searchView.clearResults();
        renderLoader(elements.searchRes);

        try {

            // 4. Search for recipes
            await state.search.getResults();
            
            // 5. Render Results on UI
            clearLoader();
            searchView.renderResults(state.search.results);
        } catch (err) {
            alert('Something Went wrong with the search!')
            clearLoader();
        }
    }
}

// Event Listener for Search Field
elements.searchForm.addEventListener('submit', e => {
    e.preventDefault();
    controlSearch();
});

// Event Listener for Next Page and Previous Page
elements.searchResPages.addEventListener('click', e => {
    const btn = e.target.closest('.btn-inline');
    if (btn) {
        const goToPage = parseInt(btn.dataset.goto, 10);
        searchView.clearResults();
        searchView.renderResults(state.search.results, goToPage);
    }
});


/*************************************************************************************  RECIPE CONTROLLER *************************************************************************************/


// What Happens When a Recipe is clicked
const controlRecipe = async () => {
    //Get ID from URL
    const id = window.location.hash.replace('#', '');
    
    if (id) {
        // Prepare UI for Changes
        recipeView.clearRecipe();
        renderLoader(elements.recipe);

        //Highlight selected search Item
        if (state.search) searchView.highlightSelected(id);

        // Create new Recipe Object
        state.recipe = new Recipe(id);
        
        try {
            // Get recipe data
            await state.recipe.getRecipe();
            // Render recipe
            clearLoader();
            recipeView.renderRecipe(state.recipe, state.likes? state.likes.isLiked(id) : false);

        } catch (err) {
            alert('No vex, the thing no work');
        }
    }
}

// Event Listener for hash change(Indicating a new search result has been clicked) or page reload (to persist previously clicked data)
['hashchange', 'load'].forEach(event => window.addEventListener(event, controlRecipe));

// Handling All Button Clicks that occur in the Recipe
elements.recipe.addEventListener('click', e => {
    if (e.target.matches('.btn-decrease, .btn-decrease *')) {
        //Decrease button is clicked
        if (state.recipe.servings > 1) {
            state.recipe.updateServings('dec');
            recipeView.updateServingsIngredients(state.recipe);
        }
    } else if (e.target.matches('.btn-increase, .btn-increase *')) {
        //Increase button is clicked
        state.recipe.updateServings('inc');
        recipeView.updateServingsIngredients(state.recipe);
    } else if (e.target.matches('.recipe__btn--add, .recipe__btn--add *')) {
        // Add Ingredients to shopping List is clicked
        controlList();
    } else if (e.target.matches('.recipe__love, .recipe__love *')) {
        controlLike();
    }
});



/*************************************************************************************  LIST CONTROLLER *************************************************************************************/


const controlList = () => {
    // Create a new List if there is none yet
    if (!state.list) state.list = new List();

    //Add each ingredient to the list and UI
    state.recipe.ingredients.forEach(el => {
        const item = state.list.addItem(el.amount, el.unit, el.name);
        listView.renderItem(item);
    });
};

// Handle Delete and Update Item Events
elements.shopping.addEventListener('click', e => {
    const id = e.target.closest('.shopping__item').dataset.itemid;

    // Handle Delete Button 
    if (id) {
        if (e.target.matches('.shopping__delete, .shopping__delete *')){
            //Delete from state
            state.list.deleteItem(id);

            //Delete from UI
            listView.deleteItem(id);
        }
        // Handle the Amount Update 
        else if (e.target.matches('.shopping__count-value')) {
            const val = parseFloat(e.target.value, 10);
            if (val > 0) {
                state.list.updateAmount(id, val);
            }
            // If value drops below 0
            else {
                state.list.deleteItem(id);
                listView.deleteItem(id);
            }
        }
    }
});


/*************************************************************************************  LIKES CONTROLLER *************************************************************************************/


const controlLike = () => {
    if (!state.likes) state.likes = new Likes();
    const currentID = state.recipe.id;

    // User Has not yet liked current recipe
    if (!state.likes.isLiked(currentID)) {
        // Add like to the state
        const newLike = state.likes.addLike(currentID, state.recipe.title, state.recipe.author, state.recipe.img);
        
        // Toggle like button
        likesView.toggleLikeBtn(true);

        // Add like to UI list
        likesView.renderLike(newLike);
    }
    // User has liked current recipe
    else {
        // Remove like to the state
        state.likes.deleteLike(currentID);
        
        // Toggle like button
        likesView.toggleLikeBtn(false);

        // Remove like to UI list
        likesView.deleteLike(currentID);
    }
    likesView.toggleLikeMenu(state.likes.getNumLikes());
}


/*************************************************************************************  LIKES CONTROLLER *************************************************************************************/


// Restore liked recipes and shopping list on page reload
window.addEventListener('load', () => {
    state.likes = new Likes();
    state.list = new List();

    //Restore Items
    state.likes.readStorage();
    state.list.readStorage();

    //Toggle like menu button
    likesView.toggleLikeMenu(state.likes.getNumLikes());

    //Render the existing likes and shopping list
    state.likes.likes.forEach(like => likesView.renderLike(like));
    state.list.items.forEach(item => listView.renderItem(item));

})