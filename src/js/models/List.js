import uniqid from 'uniqid';

export default class List {
    constructor() {
        this.items = [];
    }

    addItem (amount, unit, name) {
        const item = {
            id: uniqid(),
            amount,
            unit, 
            name, 
        };
        this.items.push(item);
        
        // Store Data in Local Storage
        this.persistData();

        return item;
    }

    deleteItem(id) {
        // Remove item from list, could be optimised
        const index = this.items.findIndex(el => el.id === id);
        this.items.splice(index, 1);

        // Store Data in Local Storage
        this.persistData();
    }

    updateAmount(id, newAmount) {
        this.items.find(el => el.id === id).amount = newAmount;
    }

    persistData() {
        localStorage.setItem('list', JSON.stringify(this.items));
    }

    readStorage() {
        const storage = JSON.parse(localStorage.getItem('list'));
        
        // Restore likes from local Storage
        if (storage) this.items = storage;
    }
}