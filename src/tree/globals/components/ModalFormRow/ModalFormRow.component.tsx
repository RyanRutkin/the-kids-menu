import React, { FC, PropsWithChildren } from 'react';
import './ModalFormRow.component.css';

export const AppModalFormRow: FC<PropsWithChildren<{ header?: boolean }>> = ({ children, header }) => (
    <div className={ `app-modal-form-row${ header ? ' app-modal-form-header' : '' }`} >
        { children }
    </div>
);
