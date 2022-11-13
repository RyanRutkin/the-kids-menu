import React, { FC, PropsWithChildren } from 'react';
import './Page.component.css';

export const AppPage: FC<PropsWithChildren> = ({ children }) => (
    <div className="app-page" >{ children }</div>
);
