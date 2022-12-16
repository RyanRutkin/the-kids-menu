import React, { FC, useContext } from 'react';
import { Kid } from '../../../../types/Kid.type';
import './Kid.component.css';
import { AiOutlineEdit } from 'react-icons/ai';
import { CiSquareRemove } from 'react-icons/ci';
import { KidsContext } from '../../contexts/Kids.context';
import { ModalContext } from '../../../../contexts/Modal.context';
import { AppAddItemModal } from '../../../../Modals/AddItem/AddItem.modal';
import { AppRemoveItemModal } from '../../../../Modals/RemoveItem/RemoveItem.modal';
import { KidDefinition } from '../../Definitions/Kid.definition';

export const AppKid: FC<{ kid: Kid, allowEdit?: boolean }> = ({ kid, allowEdit }) => {
    const { setSelectedKidId } = useContext(KidsContext);
    const { openModal } = useContext(ModalContext);
    const fullName = `${ kid.firstName }${ kid.lastName ? ` ${ kid.lastName }` : '' }`;

    return (
        <div className="app-kid" >
            <div className="app-kid-content" >
                {
                    kid.image
                        ?   <div className="app-kid-image-wrapper" >
                                <img className="app-kid-image" alt={`Kid "${ fullName }"`} src={ kid.image } />
                            </div>
                        : null
                }
                <div className={`app-kid-footer ${ kid.image ? '' : 'app-kid-footer-fullscale'}`} >
                    <div className="app-kid-name" >{ fullName }</div>
                    {
                        allowEdit
                        ? <div className="app-kid-action-container" >
                            <div className="app-kid-action" onClick={ e => {
                                setSelectedKidId(kid.id);
                                e.stopPropagation();
                                e.preventDefault();
                                openModal({
                                    content: <AppAddItemModal
                                        entityDefinition={ KidDefinition }
                                        selectedEntity={ kid }
                                    />
                                })
                            } } >
                                <AiOutlineEdit />
                            </div>
                            <div className="app-kid-action" onClick={ e => {
                                e.stopPropagation();
                                e.preventDefault();
                                openModal({
                                    content: <AppRemoveItemModal
                                        entityDefinition={ KidDefinition }
                                        entityId={ kid.id }
                                    />
                                })
                            } } >
                                <CiSquareRemove />
                            </div>
                        </div>
                        : null
                    }
                </div>
            </div>
        </div>
    )
}