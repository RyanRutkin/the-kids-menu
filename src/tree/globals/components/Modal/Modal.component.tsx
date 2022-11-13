import React, { useContext } from 'react';
import { ModalContext } from '../../contexts/Modal.context';
import './Modal.component.css';
import { CiSquareRemove } from 'react-icons/ci';

export const AppModal = () => {
    const { modalOpen, modalContent, setModalOpen } = useContext(ModalContext);

    return (
        <div className={ `app-modal${ modalOpen ? ' app-modal-open' : '' }` } >
            <div className="app-modal-header" >
                <div className="app-modal-close" onClick={ () => setModalOpen(false) } >
                    <CiSquareRemove />
                </div>
            </div>
            <div className="app-modal-content" >
                { modalContent }
            </div>
        </div>
    )
}