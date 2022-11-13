import React, { useContext } from 'react';
import { AppButton } from '../../../../components/Button/Button.component';
import { AppKid } from '../../components/Kid/Kid.component';
import { AppPage } from '../../../../components/Page/Page.component';
import { KidsContext } from '../../contexts/Kids.context';

export const KidsPage = () => {
    const { kids, addKid, removeKid } = useContext(KidsContext);

    return (
        <AppPage>
            <div className="app-kids-page-content" >
                <div className="app-kids-page-kids-section" >
                    {
                        kids.map(kid => (
                            <AppKid kid={ kid } allowEdit />
                        ))
                    }
                </div>
                <div className="app-kids-page-footer" >
                    <AppButton 
                        className="app-kids-page-add-button" 
                        onClick={ () => { console.log('Add kid') } } 
                    >Add Kid</AppButton>
                </div>
            </div>
        </AppPage>
    )
}