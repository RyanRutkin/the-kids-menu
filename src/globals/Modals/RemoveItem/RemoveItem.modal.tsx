import React, { FC, PropsWithChildren, useContext } from 'react';
import { AppButton } from '../../components/Button/Button.component';
import { AppModalFormRow } from '../../components/ModalFormRow/ModalFormRow.component';
import { LocalStorageContext } from '../../contexts/LocalStorage.context';
import { ModalContext } from '../../contexts/Modal.context';
import { GraphitEntityDefinition } from '../../types/GraphitEntity.type';

export const AppRemoveItemModal: FC<PropsWithChildren<{
    entityDefinition: GraphitEntityDefinition;
    entityId: string;
    modalCallback?: () => void;
}>> = ({ entityDefinition, entityId, modalCallback }) => {
    const { removeItem } = useContext(LocalStorageContext);
    const { closeModal } = useContext(ModalContext);

    return (
        <div className="app-add-item-modal" >
            <AppModalFormRow header >Remove { entityDefinition.displayName }</AppModalFormRow>
            <AppModalFormRow>Are you sure you wish to remove this { entityDefinition.displayName }?</AppModalFormRow>
            <AppModalFormRow>This action cannot be undone.</AppModalFormRow>
            <AppModalFormRow>
                <AppButton
                    buttonType="info"
                    onClick={ () => closeModal() }
                >Cancel</AppButton>
                <AppButton
                    buttonType="warning"
                    onClick={ () => {
                        removeItem(entityDefinition.storageKey, entityId);
                        closeModal();
                    }}
                >
                    Remove
                </AppButton>
            </AppModalFormRow>
        </div>
    )
};
