/**
 * A generic modal for adding items into storage based on an item configuration.
 */

import React, { FC, PropsWithChildren, useState, useMemo, ChangeEvent, useCallback, useContext } from 'react';
import { AppButton } from '../../components/Button/Button.component';
import { AppModalFormRow } from '../../components/ModalFormRow/ModalFormRow.component';
import { useLocalStorage } from '../../hooks/useLocalStorage.hook';
import { GraphitEntity, GraphitEntityDefinition, GraphitEntityField, GraphitEntityFieldValue, GraphitEntityRelations, GraphitEntityTable, GraphitEntityTableRelations } from '../../types/GraphitEntity.type';
import { v4 as uuidv4 } from 'uuid';
import { ModalContext } from '../../contexts/Modal.context';
import { AppModalFormLabel } from '../../components/ModalFormLabel/ModalFormLabel.component';
import { AppModalFormInput } from '../../components/ModalFormInput/ModalFormInput.component';

type AppInputEvent = ChangeEvent<HTMLInputElement>;

const buildInitialEntityField = (fieldDefinition: GraphitEntityField, defaultValue?: GraphitEntityFieldValue) => {
    switch (fieldDefinition.dataType) {
        case 'string':
            return fieldDefinition.defaultValue || '';
        case 'number':
            return fieldDefinition.defaultValue || 0;
        case 'boolean':
            return fieldDefinition.defaultValue || false;
        case 'file':
            return null;
        default:
            return buildInitialEntity(fieldDefinition.definition, (defaultValue || fieldDefinition.defaultValue) as GraphitEntity);
    }
}

const buildInitialEntity = (entityDefinition: GraphitEntityDefinition, defaultValue?: GraphitEntity) => {
    return Object.entries(entityDefinition.fields).reduce<GraphitEntity>((acc, [key, value]) => {
        acc[key] = buildInitialEntityField(value as GraphitEntityField, defaultValue ? defaultValue[key] : undefined);
        return acc;
    }, {} as GraphitEntity);
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

const AddAddItemEntityInput: FC<{
    valueDef: GraphitEntityDefinition;
    addRelation: (data: GraphitEntity) => void;
    relations: GraphitEntityTableRelations;
    defaultValue?: GraphitEntity;
}> = ({
    valueDef,
    addRelation,
    relations,
    defaultValue,
}) => {
    const { openModal } = useContext(ModalContext);
    const relationCount = useMemo(() => Object.values(relations).filter(related => related), [ relations ]);

    return (
        <div className="app-add-item-modal-entity-field" >
            <AppButton
                onClick={ () => {
                    openModal({
                        content: <AppAddItemModal 
                            entityDefinition={ valueDef } 
                            selectedEntity={ defaultValue } 
                            modalCallback={ (data: GraphitEntity) => {
                                addRelation(data);
                            } }
                        />
                    })
                }}
            >Add { valueDef.displayName }</AppButton>
            {
                relationCount
                ? <div className="app-add-item-modal-entity-relation-count" >
                    { relationCount } { valueDef.displayName } related
                </div>
                : null
            }
            {
                // TODO: Add list view
            }
        </div>
    )
}

const AppAddItemInput: FC<{
    field: string;
    valueDef: GraphitEntityField;
    handleChange: (field: string, e: ChangeEvent<HTMLInputElement>) => void;
}> = ({
    field,
    valueDef,
    handleChange
}) => {
    if (valueDef.dataType === 'entity') {
        // No-op for typescript
        return null;
    }
    if (valueDef.dataType === 'file') {
        return (
            <AppModalFormInput
                required={ !!valueDef.required }
                type="file"
                onChange={ (e: AppInputEvent) => handleChange(field, e) }
                { ...(valueDef.elementProps || {} )}
            />
        );
    }
    if (valueDef.dataType === 'boolean') {
        return (
            <AppModalFormInput
            required={ !!valueDef.required }
                type="checkbox"
                onChange={ (e: AppInputEvent) => handleChange(field, e) } 
                checked={ valueDef.defaultValue }
                { ...(valueDef.elementProps || {} )}
            />
        );
    }
    return (
        <AppModalFormInput
        required={ !!valueDef.required }
            type={ valueDef.dataType }
            onChange={ (e: AppInputEvent) => handleChange(field, e) } 
            value={ valueDef.defaultValue }
            { ...(valueDef.elementProps || {} )}
        />
    );
}

export const AppAddItemModal: FC<PropsWithChildren<{
    entityDefinition: GraphitEntityDefinition;
    selectedEntity?: GraphitEntity;
    modalCallback?: (data: GraphitEntity) => void;
}>> = ({ entityDefinition, selectedEntity, modalCallback }) => {
    const { closeModal } = useContext(ModalContext);
    const [ entityTable, setEntityTable ] = useLocalStorage<GraphitEntityTable>(entityDefinition.storageKey, {
        relations: {},
        entries: {}
    });
    const entityId = useMemo(() => selectedEntity?.id ? selectedEntity.id as string : uuidv4(), [ selectedEntity ]);
    const initialEntityValue = useMemo(() => buildInitialEntity(entityDefinition, selectedEntity), [ entityDefinition, selectedEntity ]);
    const [ entity, setEntity ] = useState<GraphitEntity>(initialEntityValue);
    const [ relations, setRelations ] = useState<GraphitEntityRelations>(entityTable.relations);

    const isDisabled = useMemo(() => checkSubmitIsDisabled(entityDefinition, entity), [ entityDefinition, entity ]);

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
                [entity.id!]: {
                    ...((_relations[table] || {})[entity.id!] || {}),
                    [data.id!]: true
                }
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
                                relations={ relations[valueDef.definition.storageKey!][entity.id!] }
                                defaultValue={ (selectedEntity && selectedEntity[key] ? selectedEntity[key] : valueDef.defaultValue) as GraphitEntity }
                            />
                            : <AppAddItemInput
                                field={ key }
                                valueDef={ valueDef }
                                handleChange={ handleChange }
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
                        setEntityTable(entityTable => ({
                            ...entityTable,
                            [entityId]: entity
                        }));
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