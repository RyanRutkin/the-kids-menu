import React, { FC, PropsWithChildren } from 'react';
import './Button.component.css';

type AppButtonType = 'info' | 'error' | 'success' | 'warning';

type NativeButtonProps = React.DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>;

type AppButtonProps = NativeButtonProps & {
    buttonType?: AppButtonType;
}

type AppButtonTypeStyle = {
    backgroundColor: string;
    fontColor: string;
}

const BUTTON_TYPE_MAP: Record<AppButtonType, AppButtonTypeStyle> = {
    info: {
        backgroundColor: '#31ECff',
        fontColor: '#ffffff'
    },
    error: {
        backgroundColor: '#FF5131',
        fontColor: '#ffffff'
    },
    success: {
        backgroundColor: '#39D05B',
        fontColor: '#ffffff'
    },
    warning: {
        backgroundColor: '#FFEA00',
        fontColor: '#ffffff'
    }
}

export const AppButton: FC<PropsWithChildren<AppButtonProps>> = ({ children, buttonType, className, onClick, ...props }) => (
    <button
        className={ `app-button${ className ? ` ${className}` : '' }` }
        style={ BUTTON_TYPE_MAP[buttonType || 'info' ] }
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
