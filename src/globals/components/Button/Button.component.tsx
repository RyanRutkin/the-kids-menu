import React, { FC, PropsWithChildren } from 'react';
import './Button.component.css';

type AppButtonType = 'info' | 'error' | 'success' | 'warning';

type NativeButtonProps = React.DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>;

type AppButtonProps = NativeButtonProps & {
    buttonType?: AppButtonType;
    margin?: string;
}

export const AppButton: FC<PropsWithChildren<AppButtonProps>> = ({ children, buttonType, className, onClick, margin, ...props }) => {
    const buttonClassName = (() => {
        let n_className = `app-button app-button-type-${ buttonType || 'info' }`;

        if (className) {
            n_className = `${ n_className } ${ className }`
        }

        return n_className;
    })();

    return (
        <button
            className={ buttonClassName }
            style={{ "margin": margin || '0.4em 0.8em' }}
            onClick={ e => {
                if (typeof onClick === 'function') {
                    e.stopPropagation();
                    e.preventDefault();
                    onClick(e);
                }
            }}
            { ...props }
        >
            { children }
        </button>
    );
};
