import React, { FC, PropsWithChildren } from 'react';
import './ModalFormLabel.component.css';

export const AppModalFormLabel: FC<PropsWithChildren> = ({ children }) => (
    <div className="app-modal-form-label" >
        { children }
    </div>
);
