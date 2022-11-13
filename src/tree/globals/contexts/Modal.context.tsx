import React, { createContext, FC, PropsWithChildren, ReactNode, useState } from 'react';

export const ModalContext = createContext<{
    modalOpen: boolean;
    modalContent: ReactNode | undefined;
    setModalOpen: (b: boolean) => void;
    setModalContent: (content: ReactNode | undefined) => void;
}>({
    modalOpen: false,
    modalContent: undefined,
    setModalOpen: (b: boolean) => { throw new Error("ModalContext"); },
    setModalContent: (content: ReactNode | undefined) => { throw new Error("ModalContext"); },
});

export const ModalContextProvider: FC<PropsWithChildren> = ({ children }) => {
    const [ modalOpen, setModalOpen ] = useState<boolean>(false);
    const [ modalContent, setModalContent ] = useState<ReactNode | undefined>(undefined);

    return <ModalContext.Provider value={{ modalOpen, modalContent, setModalOpen, setModalContent }} >
        { children }
    </ModalContext.Provider>
}
