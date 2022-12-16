import { FC, PropsWithChildren } from "react";
import { LocalStorageContextProvider } from "./LocalStorage.context";
import { ModalContextProvider } from "./Modal.context";

export const ContextCollection: FC<PropsWithChildren> = () => (
    <LocalStorageContextProvider>
        <ModalContextProvider />
    </LocalStorageContextProvider>
);
