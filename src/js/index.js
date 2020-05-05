import Search from './models/Search';
import * as searchView from './views/searchView';
import { elements, renderLoader, clearLoader } from './views/base';
import Recipe from './models/Recipe';

/** Global state of the app
 * - Search Object
 * - Current Recipe object
 * - Shopping list object
 * - Liked recipes
 */
const state = {};

/**
 *  SEARCH CONTROLLER
 */

const controlSearch = async () => {
    // 1. Get query from view
    const query = searchView.getInput(); //TODO
    
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

elements.searchForm.addEventListener('submit', e => {
    e.preventDefault();
    controlSearch();
});

elements.searchResPages.addEventListener('click', e => {
    const btn = e.target.closest('.btn-inline');
    if (btn) {
        const goToPage = parseInt(btn.dataset.goto, 10);
        searchView.clearResults();
        searchView.renderResults(state.search.results, goToPage);
        
    }
});

/**
 *  RECIPE CONTROLLER
 */

const controlRecipe = async () => {
    //Get ID from URL
    const id = window.location.hash.replace('#', '');
    console.log(id);
    
    if (id) {
        // Prepare UI for Changes

        // Create new Recipe Object
        state.recipe = new Recipe(id);

        try {

            // Get recipe data
            await state.recipe.getRecipe();
            
            // Render recipe
            console.log(state.recipe); 
        } catch (err) {
            alert('Error Processsing Recipe')
        }
    }
}

['haschange', 'load'].forEach(event => window.addEventListener(event, controlRecipe));