import React, { FC } from 'react';
import './ModalFormInput.component.css';
import { FaStarOfLife } from 'react-icons/fa';

type AppModalFormInputProps = { required?: boolean } & React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>;

export const AppModalFormInput: FC<AppModalFormInputProps> = ({ required, ...props }) => (
    <div className="app-modal-form-input-wrapper" >
        <input className="app-modal-form-input" { ...props } />
        {
            required
            ? <div className="app-modal-form-required" >
                <FaStarOfLife />
            </div>
            : null
        }
    </div>
);
