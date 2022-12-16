import React, { createContext, FC, PropsWithChildren, useState } from 'react';
import { GraphitEntity, GraphitEntityDefinition, GraphitEntityRelations, GraphitEntityTable } from '../types/GraphitEntity.type';
import { v4 as uuidv4 } from 'uuid';
import { RelationParameters } from '../types/RelationParameters.type';

const LOCAL_STORAGE_PREFIX = "__KIDS_MENU_STORAGE__";


export const LocalStorageContext = createContext<{
    addItem: (tableName: string, item: GraphitEntity) => string;
    removeItem: (tableName: string, identifier: string) => void;
    updateItem: (tableName: string, item: GraphitEntity) => void;
    getItem: (tableName: string, identifier: string) => GraphitEntity | undefined;
    registerDefinition: (definition: GraphitEntityDefinition) => void;
    registerListener: (tableName: string, listener: () => void, definition?: GraphitEntityDefinition) => void;
    deregisterListener: (tableName: string, listener: () => void) => void;
    addRelations: (relationParams: RelationParameters[]) => void;
    removeRelations: (relationParams: RelationParameters[]) => void;
    updateRelations: (relationParams: RelationParameters[]) => void;
    getRelations: (tableName: string, identifier: string) => GraphitEntityRelations | undefined;
    getTableContents: (tableName: string) => GraphitEntity[];
}>({
    addItem: (tableName: string, item: GraphitEntity) => { throw new Error('LocalStorageContext is not within scope') },
    removeItem: (tableName: string, identifier: string) => { throw new Error('LocalStorageContext is not within scope') },
    updateItem: (tableName: string, item: GraphitEntity) => { throw new Error('LocalStorageContext is not within scope') },
    getItem: (tableName: string, identifier: string) => { throw new Error('LocalStorageContext is not within scope') },
    registerDefinition: (definition: GraphitEntityDefinition) => { throw new Error('LocalStorageContext is not within scope') },
    registerListener: (tableName: string, listener: () => void, definition?: GraphitEntityDefinition) => { throw new Error('LocalStorageContext is not within scope') },
    deregisterListener: (tableName: string, listener: () => void) => { throw new Error('LocalStorageContext is not within scope') },
    addRelations: (relationParams: RelationParameters[]) => { throw new Error('LocalStorageContext is not within scope') },
    removeRelations: (relationParams: RelationParameters[]) => { throw new Error('LocalStorageContext is not within scope') },
    updateRelations: (relationParams: RelationParameters[]) => { throw new Error('LocalStorageContext is not within scope') },
    getRelations: (tableName: string, identifier: string) => { throw new Error('LocalStorageContext is not within scope') },
    getTableContents: (tableName: string) => { throw new Error('LocalStorageContext is not within scope') }
});

const TABLE_INITIAL_VALUE: GraphitEntityTable = {
    relations: {},
    entries: {},
};

export const LocalStorageContextProvider: FC<PropsWithChildren> = ({ children }) => {
    const [ definitions, setDefinitions ] = useState<{
        [tableName: string]: GraphitEntityDefinition;
    }>({});
    const [ listeners, setListeners ] = useState<{
        [tableName: string]: (() => void)[]
    }>({});

    const registerDefinition = (definition: GraphitEntityDefinition) => setDefinitions(defs => ({
        ...defs,
        [definition.storageKey]: definition
    }));

    const registerListener = (tableName: string, listener: () => void, definition?: GraphitEntityDefinition) => {
        if ((!definitions[tableName] && !definition) || (definition && tableName !== definition.storageKey)) {
            throw new Error("LocalStorageContextProvider: Unable to locate table requested for listener registration.");
        }
        if (!definitions[tableName] && definition) {
            registerDefinition(definition);
        }
        setListeners(lstnrs => ({
            ...lstnrs,
            [tableName]: [
                ...(lstnrs[tableName] || []),
                listener
            ]
        }));
    }

    const deregisterListener = (tableName: string, listener: () => void) => {
        if (!definitions[tableName]) {
            throw new Error("LocalStorageContextProvider: Unable to locate table requested for listener registration.");
        }
        setListeners(lstnrs => {
            const tableListeners = lstnrs[tableName] || [];
            const lstnrIdx = tableListeners.findIndex(lstnr => lstnr === listener);
            if (lstnrIdx > -1) {
                tableListeners.splice(lstnrIdx, 1);
            }
            return {
                ...lstnrs,
                [tableName]: tableListeners
            }
        });
    } 

    const addItem = (tableName: string, item: GraphitEntity) => {
        if (!item.id) {
            item.id = uuidv4();
        }
        _upsertItem(tableName, item);
        return item.id!;
    }

    const removeItem = (tableName: string, identifier: string) => {
        if (!definitions[tableName] || !identifier) {
            throw new Error("LocalStorageContextProvider: Failed to remove undefined item.");
        }
        const tableVal = _getTable(tableName);
        const n_entries = { ...tableVal.entries };
        if (n_entries[identifier]) {
            delete n_entries[identifier];
        }
        const n_relations = { ...tableVal.relations };
        const target_relations = n_relations[identifier] || {};

        const tablesWithUpdates = [tableName];

        // Delete relations to this record from foreign tables.
        Object.entries(target_relations).forEach(([foreignTableName, foreignRelations]) => {
            tablesWithUpdates.push(foreignTableName);
            const foreignTable = _getTable(foreignTableName);
            const n_foreign_relations = foreignTable.relations;
            Object.keys(foreignRelations).forEach(foreignId => {
                if (n_foreign_relations[foreignId] && n_foreign_relations[foreignId][tableName] && n_foreign_relations[foreignId][tableName][identifier]) {
                    delete n_foreign_relations[foreignId][tableName][identifier];
                }
            });
            _setTable(foreignTableName, {
                entries: foreignTable.entries,
                relations: n_foreign_relations
            });
        });

        if (n_relations[identifier]) {
            delete n_relations[identifier];
        }

        _setTable(tableName, {
            entries: n_entries,
            relations: n_relations
        });

        tablesWithUpdates.forEach(tblName => _triggerListeners(tblName));
    }

    const updateItem = (tableName: string, item: GraphitEntity) => {
        _upsertItem(tableName, item);
    }

    const getItem = (tableName: string, identifier: string) => {
        if (!definitions[tableName] || !identifier) {
            throw new Error("LocalStorageContextProvider: Failed to get undefined item.");
        }
        const tableVal = _getTable(tableName);
        return tableVal.entries[identifier];
    }

    const addRelations = (relationParams: RelationParameters[]) => {
        const tablesWithUpdates: string[] = [];
        relationParams.forEach(({ tableNameA, identifierA, tableNameB, identifierB }) => {
            _handleUpdateRelation(tableNameA, identifierA, tableNameB, identifierB, true);
            tablesWithUpdates.push(tableNameA);
            tablesWithUpdates.push(tableNameB);
        });
        tablesWithUpdates.forEach(tblName => _triggerListeners(tblName));
    }

    const removeRelations = (relationParams: RelationParameters[]) => {
        const tablesWithUpdates: string[] = [];
        relationParams.forEach(({ tableNameA, identifierA, tableNameB, identifierB }) => {
            _handleUpdateRelation(tableNameA, identifierA, tableNameB, identifierB, false);
            tablesWithUpdates.push(tableNameA);
            tablesWithUpdates.push(tableNameB);
        });
        tablesWithUpdates.forEach(tblName => _triggerListeners(tblName));
    }

    const updateRelations = (relationParams: RelationParameters[]) => {
        const tablesWithUpdates: string[] = [];
        relationParams.forEach(({ tableNameA, identifierA, tableNameB, identifierB, isRelated }) => {
            _handleUpdateRelation(tableNameA, identifierA, tableNameB, identifierB, !!isRelated);
            tablesWithUpdates.push(tableNameA);
            tablesWithUpdates.push(tableNameB);
        });
        tablesWithUpdates.forEach(tblName => _triggerListeners(tblName));
    }

    const getRelations = (tableName: string, identifier: string) => {
        const tableVal = _getTable(tableName);
        return tableVal.relations[identifier];
    }

    const getTableContents = (tableName: string) => {
        const tableVal = _getTable(tableName);
        return Object.values(tableVal?.entries || {}) as GraphitEntity[];
    }

    const _handleUpdateRelation = (tableNameA: string, identifierA: string, tableNameB: string, identifierB: string, isRelated: boolean) => {
        if (!definitions[tableNameA] || !identifierA) {
            throw new Error("LocalStorageContextProvider: Failed to relate undefined item A.");
        }
        if (!definitions[tableNameB] || !identifierB) {
            throw new Error("LocalStorageContextProvider: Failed to relate undefined item B.");
        }
        const tableA = _getTable(tableNameA);
        const tableB = _getTable(tableNameB);
        _setTable(tableNameA, {
            entries: tableA.entries,
            relations: {
                ...tableA.relations,
                [identifierA]: {
                    ...(tableA.relations[identifierA] || {}),
                    [tableNameB]: {
                        ...((tableA.relations[identifierA] || {})[tableNameB] || {}),
                        [identifierB]: !!isRelated
                    }
                }
            }
        });
        _setTable(tableNameB, {
            entries: tableB.entries,
            relations: {
                ...tableB.relations,
                [identifierB]: {
                    ...(tableB.relations[identifierB] || {}),
                    [tableNameA]: {
                        ...((tableB.relations[identifierB] || {})[tableNameA] || {}),
                        [identifierA]: !!isRelated
                    }
                }
            }
        });
    }

    const _triggerListeners = (tableName: string) => (listeners[tableName] || []).forEach(listener => listener());

    const _getTable = (tableName: string): GraphitEntityTable => {
        if (typeof window === "undefined") {
            throw new Error("Unable to access local storage");
        }
        try {
            // Get from local storage by key
            const item = window.localStorage.getItem(`${LOCAL_STORAGE_PREFIX}${tableName}`);
            // Parse stored json or if none return initialValue
            return item && item !== "undefined" ? JSON.parse(item) : TABLE_INITIAL_VALUE;
        } catch (error) {
            return TABLE_INITIAL_VALUE;
        }
    }

    const _setTable = (tableName: string, value: GraphitEntityTable) => {
        if (typeof window === "undefined") {
            throw new Error("Unable to access local storage");
        }
        try {
            window.localStorage.setItem(`${LOCAL_STORAGE_PREFIX}${tableName}`, JSON.stringify(value));
        } catch (error) {
            throw new Error(`Unable to set value for table: "${ tableName }"`);
        }
    };

    const _upsertItem = (tableName: string, item: GraphitEntity) => {
        if (!definitions[tableName] || !item?.id) {
            throw new Error("LocalStorageContextProvider: Failed to add undefined item.");
        }
        const tableVal = _getTable(tableName);
        _setTable(tableName, {
            relations: tableVal.relations,
            entries: {
                ...tableVal.entries,
                [item.id]: item
            }
        });
        _triggerListeners(tableName);
    }

    return <LocalStorageContext.Provider value={{
        addItem,
        removeItem,
        updateItem,
        getItem,
        registerDefinition,
        registerListener,
        deregisterListener,
        addRelations,
        removeRelations,
        getRelations,
        updateRelations,
        getTableContents
    }} >
        { children }
    </LocalStorageContext.Provider>
}