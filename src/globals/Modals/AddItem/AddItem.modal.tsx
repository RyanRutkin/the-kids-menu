/**
 * A generic modal for adding items into storage based on an item configuration.
 */

import React, { FC, PropsWithChildren, useState, useMemo, ChangeEvent, useCallback, useContext, useEffect } from 'react';
import { AppButton } from '../../components/Button/Button.component';
import { AppModalFormRow } from '../../components/ModalFormRow/ModalFormRow.component';
import { GraphitEntity, GraphitEntityDefinition, GraphitEntityField, GraphitEntityFieldValue, GraphitEntityRelations } from '../../types/GraphitEntity.type';
import { v4 as uuidv4 } from 'uuid';
import { ModalContext } from '../../contexts/Modal.context';
import { AppModalFormLabel } from '../../components/ModalFormLabel/ModalFormLabel.component';
import { LocalStorageContext } from '../../contexts/LocalStorage.context';
import { AddAddItemEntityInput } from './components/AddItemEntityInput.component';
import { AppAddItemInput } from './components/AddItemInput.component';


const buildInitialEntityField = (fieldDefinition: GraphitEntityField, defaultValue?: GraphitEntityFieldValue) => {
    switch (fieldDefinition.dataType) {
        case 'string':
            return fieldDefinition.defaultValue || defaultValue || '';
        case 'number':
            return fieldDefinition.defaultValue || defaultValue || 0;
        case 'boolean':
            return fieldDefinition.defaultValue || defaultValue || false;
        case 'file':
            return null;
        default:
            return buildInitialEntity(fieldDefinition.definition, (defaultValue || fieldDefinition.defaultValue) as GraphitEntity);
    }
}

const buildInitialEntity = (entityDefinition: GraphitEntityDefinition, defaultValue?: GraphitEntity) => {
    const entity = Object.entries(entityDefinition.fields)
        .reduce<GraphitEntity>((acc, [key, value]) => {
            acc[key] = buildInitialEntityField(value as GraphitEntityField, defaultValue ? defaultValue[key] : undefined);
            return acc;
        }, {} as GraphitEntity);

    if (defaultValue?.id) {
        entity.id = defaultValue.id;
    }

    return entity;
}

const checkSubmitIsDisabled: (entityDefinition: GraphitEntityDefinition, entity: GraphitEntity) => boolean 
= (entityDefinition: GraphitEntityDefinition, entity: GraphitEntity) => {
    const missingField: [string, GraphitEntityField] | undefined = Object.entries(entityDefinition.fields).find(([ key, valueDef ]) => {
        if (!valueDef.required) {
            return false;
        }
        switch (valueDef.dataType) {
            case 'string':
                return entity[key] === "";
            case 'number':
                return false;
            case 'boolean':
                return false
            case 'file':
                return !!entity[key];
            default:
                return checkSubmitIsDisabled(valueDef.definition, entity[key] as GraphitEntity);
        }
    });

    return missingField === undefined ? false : true;
}

export const AppAddItemModal: FC<PropsWithChildren<{
    entityDefinition: GraphitEntityDefinition;
    selectedEntity?: GraphitEntity;
    modalCallback?: (data: GraphitEntity) => void;
}>> = ({ entityDefinition, selectedEntity, modalCallback }) => {
    const { closeModal } = useContext(ModalContext);
    const { addItem, updateRelations, updateItem, getRelations, registerDefinition } = useContext(LocalStorageContext);
    const entityId = useMemo(() => selectedEntity?.id ? selectedEntity.id as string : uuidv4(), [ selectedEntity ]);
    const [ entity, setEntity ] = useState<GraphitEntity>(() => buildInitialEntity(entityDefinition, {
        ...(selectedEntity || {}),
        "id": entityId
    }));
    const [ relations, setRelations ] = useState<GraphitEntityRelations>(() => getRelations(entityDefinition.storageKey, entityId) || {});

    const isDisabled = useMemo(() => checkSubmitIsDisabled(entityDefinition, entity), [ entityDefinition, entity ]);

    useEffect(() => {
        console.log(`Registering definition for: "${ entityDefinition.storageKey }"`);
        registerDefinition(entityDefinition);
        if (selectedEntity) {
            console.log('Selected entity provided', selectedEntity);
        }
    }, [ entityDefinition, registerDefinition, selectedEntity ]);

    const handleChange = useCallback((field: string, e: ChangeEvent<HTMLInputElement>) => {
        if (!e.target) {
            console.log(`Add Item Modal: Failed to locate target setting input value. Field: "${field}`);
            return
        }
        setEntity(_entity => ({
            ..._entity,
            [field]: e.target!.value
        }));
    }, [ setEntity ]);

    const handleAddRelation = (table: string, data: GraphitEntity) => {
        setRelations(_relations => ({
            ..._relations,
            [table]: {
                ...(_relations[table] || {}),
                [data.id!]: true
            }
        }));
    }

    return (
        <div className="app-add-item-modal" >
            <AppModalFormRow header >{ entityDefinition.displayName }</AppModalFormRow>
            {
                Object.entries(entityDefinition.fields).map(([ key, valueDef ]) => (
                    <AppModalFormRow key={ `app_${ entityDefinition.storageKey }_${ key }_input` }>
                        <AppModalFormLabel>{ valueDef.displayName }</AppModalFormLabel>
                        {
                            valueDef.dataType === 'entity'
                            ? <AddAddItemEntityInput
                                valueDef={valueDef.definition as GraphitEntityDefinition }
                                addRelation={ (data: GraphitEntity) => handleAddRelation(valueDef.definition.storageKey!, data) }
                                relations={ relations[valueDef.definition.storageKey!] || {} }
                            />
                            : <AppAddItemInput
                                field={ key }
                                valueDef={ valueDef }
                                handleChange={ handleChange }
                                value={ (entity[key] == null ? undefined : entity[key]) as (string | number | readonly string[] | undefined) }
                            />
                        }
                    </AppModalFormRow>
                ))
            }
            <AppModalFormRow>
                <AppButton
                    disabled={ isDisabled }
                    onClick={ () => {
                        if (isDisabled) {
                            return
                        }
                        if (selectedEntity) {
                            updateItem(entityDefinition.storageKey, entity);
                        } else {
                            addItem(entityDefinition.storageKey, entity);
                        }

                        const relationParams = Object.entries(relations)
                            .map(([ tableNameB, foreignRelations ]) => 
                                Object.entries(foreignRelations).map(([ identifierB, isRelated ]) => ({
                                    tableNameA: entityDefinition.storageKey,
                                    identifierA: entityId,
                                    tableNameB,
                                    identifierB,
                                    isRelated
                                }))
                            ).flat();

                        updateRelations(relationParams);

                        if (typeof modalCallback === 'function') {
                            modalCallback(entity);
                        }
                        closeModal();
                    }}
                >{ selectedEntity && selectedEntity.id ? 'Update' : 'Add' } { entityDefinition.displayName }</AppButton>
            </AppModalFormRow>
        </div>
    )
}