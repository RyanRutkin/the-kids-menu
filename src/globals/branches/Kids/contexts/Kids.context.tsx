import React, { FC, PropsWithChildren, createContext, useMemo, useContext, useState, useEffect, useCallback } from 'react';
import { useLocalStorage } from '../../../hooks/useLocalStorage.hook';
import { Kid } from '../../../types/Kid.type';
import { Outlet } from 'react-router-dom';
import { LocalStorageContext } from '../../../contexts/LocalStorage.context';
import { KidDefinition } from '../Definitions/Kid.definition';

export const KidsContext = createContext<{
    selectedKid: Kid | undefined;
    kids: Kid[];
    setSelectedKidId: (id: string | undefined) => void;
}>({
    selectedKid: undefined,
    kids: [],
    setSelectedKidId: (id: string | undefined) => { throw new Error("KidsContext is not within scope.") },
});

export const KidsContextProvider: FC<PropsWithChildren> = () => {
    const { getTableContents, registerListener } = useContext(LocalStorageContext);
    const [ _selectedKidId, setSelectedKidId ] = useLocalStorage<string | undefined>('selected_kid_id', undefined);
    const [ kids, setKids ] = useState<Kid[]>([]);
    const selectedKid = useMemo(() => _selectedKidId ? kids.find(kid => kid.id === _selectedKidId) as Kid : undefined, [ kids, _selectedKidId ]);

    const _updateKids = useCallback(() => {
        console.log("KidsContextProvider - updateKids");
        setKids(getTableContents(KidDefinition.storageKey) as Kid[]);
    }, [ getTableContents ]);

    useEffect(() => {
        console.log("KidsContextProvider - useEffect");
        registerListener(KidDefinition.storageKey, _updateKids, KidDefinition);
        _updateKids();
    }, [ _updateKids, registerListener ]);
    

    return <KidsContext.Provider value={{ kids, selectedKid, setSelectedKidId }} >
        <Outlet />
    </KidsContext.Provider>
}