import React, { FC } from 'react';
import './ModalFormInput.component.css';
import { FaStarOfLife } from 'react-icons/fa';

export type AppModalFormInputProps = { required?: boolean } & React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>;

export const AppModalFormInput: FC<AppModalFormInputProps> = ({ required, className, ...props }) => (
    <div className="app-modal-form-input-wrapper" >
        <input className={ `app-modal-form-input${ className ? ` ${className}` : '' }` } { ...props } />
        {
            required
            ? <div className="app-modal-form-required" >
                <FaStarOfLife />
            </div>
            : null
        }
    </div>
);
