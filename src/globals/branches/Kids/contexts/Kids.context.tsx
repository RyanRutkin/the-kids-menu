import React, { FC, PropsWithChildren, createContext, useMemo } from 'react';
import { useLocalStorage } from '../../../hooks/useLocalStorage.hook';
import { Kid } from '../../../types/Kid.type';
import { Outlet } from 'react-router-dom';
import { GraphitEntityTable } from '../../../types/GraphitEntity.type';

export const KidsContext = createContext<{
    selectedKid: Kid | undefined;
    kids: Kid[];
    setSelectedKidId: (id: string | undefined) => void;
}>({
    selectedKid: undefined,
    kids: [],
    setSelectedKidId: () => { throw new Error("KidsContext is not within scope.") },
});

export const KidsContextProvider: FC<PropsWithChildren> = () => {
    const [ entityTable ] = useLocalStorage<GraphitEntityTable>('kid', {
        relations: {},
        entries: {}
    });
    const [ _selectedKidId, setSelectedKidId ] = useLocalStorage<string | undefined>('selected_kid_id', undefined);

    const selectedKid = useMemo(() => _selectedKidId ? entityTable.entries[_selectedKidId] as Kid : undefined, [ entityTable, _selectedKidId ]);
    const kids = useMemo(() => Object.values(entityTable.entries) as Kid[], [ entityTable ]);

    return <KidsContext.Provider value={{ kids, selectedKid, setSelectedKidId }} >
        <Outlet />
    </KidsContext.Provider>
}