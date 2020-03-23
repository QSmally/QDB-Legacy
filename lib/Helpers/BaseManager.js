
"use strict";

const DataStore = require("./DataStore");

class BaseManager {

    /**
     * BaseManager - 
     * Manages the API methods of DataModels and holds its cache.
     * @param {Object} [Iterable] Default values to input into the Manager.
     * @param {Function} [Holds] An optional structure belonging to this manager.
     * @implements {DataStore}
     */
    constructor (Iterable = {}, Holds = null) {

        /**
         * The cached data set instances of this Manager.
         * @name BaseManager#Cache
         * @type {DataStore}
         * @readonly
         */
        this.Cache = new DataStore();
        for (const Id in Iterable) this.Add(Id, Iterable[Id]);


        /**
         * The data structure belonging to this Manager.
         * @name BaseManager#Holds
         * @type {Function}
         * @private
         * @readonly
         */
        Object.defineProperty(this, "Holds", {value: Holds || null});
        
    }


    /**
     * Inserts an instance into this Manager's cache.
     * @param {String} Id An ID string for the DataModel and LRR.
     * @param {Object|DataModel} Model The object to convert to a DataModel in the Manager.
     * @returns {DataStore} The updated DataStore Cache.
     */
    Add (Id, Model) {
        if (typeof Id != "string") return null;
        if (this.Cache.find(Model => Model._DataStore === Id)) return null;
        return this.Cache.set(Id, Model);
    }

    /**
     * Removes an instance from this Manager's cache.
     * @param {String} Id The ID string of the instance.
     * @returns {Boolean|null} Whether this instance was deleted.
     */
    Remove (Id) {
        if (typeof Id != "string") return null;
        if (!this.Cache.find(Model => Model._DataStore === Id)) return null;

        this.Cache.delete(Id);
        if (this.Cache.LRR && this.Cache.LRR._DataStore === Id) this.Cache.LRR = null;
        return true;
    }

    /**
     * Resolves an instance of this Manager.
     * @param {String|*} IdOrInstance The key of the instance to resolve.
     * @returns {DataModel} An instance from this Manager.
     */
    Resolve (IdOrInstance) {
        if (IdOrInstance instanceof this.Holds) return this.Holds;
        if (typeof Id != "string") return null;
        return this.Cache.resolve(IdOrInstance) || undefined;
    }

}

module.exports = BaseManager;
