import React, { FC, PropsWithChildren, useContext } from 'react';
import { ModalContext } from '../../contexts/Modal.context';
import './Modal.component.css';
import { CiSquareRemove } from 'react-icons/ci';

export const AppModal: FC<PropsWithChildren> = ({ children }) => {
    const { closeModal } = useContext(ModalContext);

    return (
        <div className="app-modal" >
            <div className="app-modal-header" >
                <div className="app-modal-close" onClick={ () => closeModal() } >
                    <CiSquareRemove />
                </div>
            </div>
            <div className="app-modal-content" >
                { children }
            </div>
        </div>
    )
}
