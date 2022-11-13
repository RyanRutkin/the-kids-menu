import React, { FC, PropsWithChildren, createContext, useCallback } from 'react';
import { useLocalStorage } from '../../../hooks/useLocalStorage.hook';
import { Kid } from '../../../types/Kid.type';
import { v4 as uuidv4 } from 'uuid';

export const KidsContext = createContext<{
    kids: Kid[];
    addKid: (kid: Partial<Kid>) => void;
    removeKid: (kid: Kid) => void;
}>({
    kids: [],
    addKid: () => { throw new Error("KidsContext is not within scope.") },
    removeKid: () => { throw new Error("KidsContext is not within scope.") }
});

export const KidsContextProvider: FC<PropsWithChildren> = ({ children }) => {
    const [ kids, setKids ] = useLocalStorage<Kid[]>('kids', []);

    const addKid = useCallback((kid: Partial<Kid>) => setKids([...kids, {
        firstName: '',
        lastName: '',
        image: undefined,
        ...kid,
        id: uuidv4()
    }]), [kids]);

    const removeKid = useCallback((kid: Kid) => {
        setKids(_kids => {
            const index = _kids.findIndex(_kid => _kid.id === kid.id);
            if (index === -1) {
                return _kids;
            }
            const n_kids = [..._kids];
            n_kids.splice(index, 1);
            return n_kids;
        });
    }, [setKids]);

    return <KidsContext.Provider value={{ kids, addKid, removeKid }} >
        { children }
    </KidsContext.Provider>
}