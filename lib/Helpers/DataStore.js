
"use strict";

const Collection = require("./Collection");

class DataStore extends Collection {

    /**
     * DataStore - 
     * Base class that manages the creation, retrieval and deletion of a specific data model with additional methods that could be added.
     * @param {Array|Object} [Iterable] Optional initial values of this DataStore.
     * @extends {Collection}
     */
    constructor (Iterable = []) {

        super();

        /**
         * LRR (Last Recently Resolved) -
         * Caches the last data model that got resolved.
         * @name DataStore#LRR
         * @type {DataModel}
         */
        Object.defineProperty(this, "LRR", {value: null, writable: true, configurable: false});

        /* Iterable */
        for (const Key in Iterable) {
            if (Iterable instanceof Array)
            this.set(Iterable[Key][0], Iterable[Key][1])
            else this.set(Key, Iterable[Key]);
        }
        
    }


    /**
     * Sets a model into the DataStore.
     * @param {*} Key The key of the model to insert.
     * @param {Object|DataModel} Model The DataModel to be inserted into the DataStore.
     * @returns {DataStore} The updated DataStore.
     */
    set (Key, Model) {
        if (!["object", "function"].includes(typeof Model)) return null;

        Model._DataStore = Key;
        if (this.LRR && this.LRR._DataStore === Key) this.LRR = Model;
        return super.set(Key, Model);
    }

    /**
     * Deletes a model from the DataStore.
     * @param {*} Key The key of the model to erase.
     * @returns {DataStore} The updated DataStore.
     */
    delete (Key) {
        if (this.LRR && this.LRR._DataStore === Key) this.LRR = null;
        super.delete(Key);
        return this;
    }

    /**
     * Resolves a data model.
     * @param {*} Key The key of the model to resolve.
     * @returns {DataModel} The data model that got resolved or cached.
     */
    resolve (Key) {
        if (this.LRR && this.LRR._DataStore === Key) return this.LRR;

        const Model = super.get(Key);
        if (Model) this.LRR = Model;
        return Model;
    }

}

module.exports = DataStore;
