import React, { ChangeEvent, useCallback, useContext, useState } from 'react';
import { KidsContext } from '../../contexts/Kids.context';
import { AppModalFormRow } from '../../../../components/ModalFormRow/ModalFormRow.component';
import { AppModalFormLabel } from '../../../../components/ModalFormLabel/ModalFormLabel.component';
import { AppModalFormInput } from '../../../../components/ModalFormInput/ModalFormInput.component';
import { Kid } from '../../../../types/Kid.type';
import './AddKid.modal.css';
import { AppButton } from '../../../../components/Button/Button.component';
import { ModalContext } from '../../../../contexts/Modal.context';

type AppInputEvent = ChangeEvent<HTMLInputElement>;

export const AppAddKidModal = () => {
    const { addKid } = useContext(KidsContext);
    const { setModalOpen } = useContext(ModalContext);
    const [ kid, setKid ] = useState<Partial<Kid>>({
        firstName: '',
        lastName: '',
        image: undefined
    });

    const handleOnChange = useCallback((field: string, e: ChangeEvent<HTMLInputElement>) => {
        if (!e.target) {
            console.log(`AppAddKidModal: Failed to locate target setting input value. Field: "${field}`);
            return
        }
        setKid(kid => ({
            ...kid,
            [field]: e.target!.value
        }))
    }, [ setKid ]);

    return (
        <div className="app-add-kid-modal" >
            <AppModalFormRow header >Add Kid</AppModalFormRow>
            <AppModalFormRow>
                <AppModalFormLabel>First Name:</AppModalFormLabel>
                <AppModalFormInput required onChange={ (e: AppInputEvent) => handleOnChange('firstName', e) } />
            </AppModalFormRow>
            <AppModalFormRow>
                <AppModalFormLabel>Last Name:</AppModalFormLabel>
                <AppModalFormInput onChange={ (e: AppInputEvent) => handleOnChange('lastName', e) } />
            </AppModalFormRow>
            <AppModalFormRow>
                <AppModalFormLabel>Image:</AppModalFormLabel>
                <AppModalFormInput
                    type="file"
                    accept="image/png, image/jpeg"
                    onChange={ (e: AppInputEvent) => handleOnChange('image', e) }
                />
            </AppModalFormRow>
            <AppModalFormRow>
                <AppButton
                    disabled={ !!kid.firstName }
                    onClick={ () => {
                        addKid(kid);
                        setModalOpen(false);
                    }}
                >Add Kid</AppButton>
            </AppModalFormRow>
        </div>
    )
}