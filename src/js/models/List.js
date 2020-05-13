import uniqid from 'uniqid';

export default class List {
    constructor() {
        this.items = [];
    }

    addItem (count, unit, ingredient) {
        const item = {
            id: uniqid(),
            count,
            unit, 
            ingredient, 

        }
    }

    deleteItem(id) {
        // Remove item from list, could be optimised
        const index = this.items.findIndex(el => el.id === id);
        this.items.splice(index, 1);
    }
}