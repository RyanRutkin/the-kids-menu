import React, { FC, PropsWithChildren, useContext } from 'react';
import { ModalContext } from '../../contexts/Modal.context';
import './Page.component.css';

export const AppPage: FC<PropsWithChildren> = ({ children }) => {
    const { closeModal } = useContext(ModalContext);

    return (
        <div className="app-page" >
            <div 
                className="app-page-content"
                onClick={ () => closeModal() }
            >
                { children }
            </div>
        </div>
    )
};
