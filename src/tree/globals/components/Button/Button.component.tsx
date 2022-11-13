import React, { FC, PropsWithChildren } from 'react';

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

export const AppButton: FC<PropsWithChildren<AppButtonProps>> = ({ children, buttonType, ...props }) => (
    <button 
        className="app-button"
        style={ BUTTON_TYPE_MAP [buttonType || 'info' ] }
        { ...props }
    >
        { children }
    </button>
);
