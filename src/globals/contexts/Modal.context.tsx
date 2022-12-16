import React, { createContext, FC, PropsWithChildren, ReactElement, useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import { AppModal } from '../components/Modal/Modal.component';

type AppModalCallback = (data: any) => void;
interface AppModalContentProps extends Record<string, any> { modalCallback?: AppModalCallback };

type AppModalStackEntry = {
    content: ReactElement<FC<PropsWithChildren<AppModalContentProps>>>;
}

export const ModalContext = createContext<{
    modalStack: AppModalStackEntry[];
    openModal: (entry: AppModalStackEntry) => void;
    closeModal: () => void;
}>({
    modalStack: [],
    openModal: (entry: AppModalStackEntry) => { throw new Error("ModalContext"); },
    closeModal: () => { throw new Error("ModalContext"); },
});

export const ModalContextProvider: FC<PropsWithChildren> = () => {
    const [ modalStack, _setModalStack ] = useState<AppModalStackEntry[]>([]);

    const openModal = (entry: AppModalStackEntry) => {
        _setModalStack(stack => {
            return [ ...stack, entry ]
        });
    };

    const closeModal = () => _setModalStack(stack => {
        const n_stack = [...stack];
        n_stack.pop();
        return n_stack;
    });

    useEffect(() => console.log(`Modal count: ${ modalStack.length }`), [ modalStack ]);

    return <ModalContext.Provider value={{ modalStack, openModal, closeModal }} >
        <Outlet/>
        {
            modalStack.map((modal, idx) => (
                <AppModal key={ `app_modal_${ idx }` }>
                    { modal.content }
                </AppModal>
            ))
        }
    </ModalContext.Provider>
}
