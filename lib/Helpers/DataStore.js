
"use strict";

const Collection = require("./Collection");

class DataStore extends Collection {

    /**
     * DataStore - 
     * Base class that manages the creation, retrieval and deletion of a specific data model with additional methods that could be added.
     * @extends {Collection}
     */
    constructor () {

        super();

        /**
         * LRR (Last Recently Resolved) -
         * Caches the last data model that got resolved.
         * @name DataStore#LRR
         * @type {DataModel}
         */
        Object.defineProperty(this, "LRR", {value: null, writable: true, configurable: false});
        
    }


    /**
     * Sets a model into the DataStore.
     * @param {*} Key The key of the model to insert.
     * @param {Object|DataModel} Model The DataModel to be inserted into the DataStore.
     * @returns {DataStore} The updated DataStore.
     */
    set (Key, Model) {
        if (!["object", "function"].includes(typeof Model)) return null;
        if (this.find(Model => Model._DataStore === Key))   return null;
        Model._DataStore = Key;
        return super.set(Key, Model);
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
