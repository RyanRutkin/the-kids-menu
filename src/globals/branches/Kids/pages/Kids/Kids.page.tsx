import React, { useContext } from 'react';
import { AppKid } from '../../components/Kid/Kid.component';
import { AppPage } from '../../../../components/Page/Page.component';
import { KidsContext } from '../../contexts/Kids.context';
import { ModalContext } from '../../../../contexts/Modal.context';
import './Kids.page.css';
import { AppButton } from '../../../../components/Button/Button.component';
import { AppEditItemModal } from '../../../../Modals/EditItem/EditItem.modal';
import { KidDefinition } from '../../Definitions/Kid.definition';

export const KidsPage = () => {
    const { kids, setSelectedKidId } = useContext(KidsContext);
    const { openModal } = useContext(ModalContext);

    return (
        <AppPage>
            <div className="app-kids-page-content" >
                <div className="app-kids-page-kids-section" >
                    {
                        kids.map(kid => (
                            <AppKid key={ `kid_page__${kid.id}` } kid={ kid } allowEdit />
                        ))
                    }
                </div>
                <div className="app-kids-page-footer" >
                    <AppButton
                        onClick={ e => {
                            setSelectedKidId(undefined);
                            openModal({
                                content: <AppEditItemModal
                                    entityDefinition={ KidDefinition }
                                />
                            });
                        } } 
                    >Add Kid</AppButton>
                </div>
            </div>
        </AppPage>
    )
}