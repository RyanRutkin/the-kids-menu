import React, { FC, useContext, useMemo } from "react";
import { AppButton } from "../../../components/Button/Button.component";
import { ModalContext } from "../../../contexts/Modal.context";
import { GraphitEntity, GraphitEntityDefinition, GraphitEntityForeignRelations } from "../../../types/GraphitEntity.type";
import { AppAddItemModal } from "../AddItem.modal";

export const AddAddItemEntityInput: FC<{
    valueDef: GraphitEntityDefinition;
    addRelation: (data: GraphitEntity) => void;
    relations: GraphitEntityForeignRelations;
}> = ({
    valueDef,
    addRelation,
    relations,
}) => {
    const { openModal } = useContext(ModalContext);
    const relationCount = useMemo(() => Object.values(relations).filter(related => related).length, [ relations ]);

    return (
        <div className="app-add-item-modal-entity-field" >
            <AppButton
                onClick={ () => {
                    openModal({
                        content: <AppAddItemModal
                            entityDefinition={ valueDef }
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