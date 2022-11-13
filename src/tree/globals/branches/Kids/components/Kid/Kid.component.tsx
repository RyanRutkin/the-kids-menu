import React, { FC } from 'react';
import { Kid } from '../../../../types/Kid.type';
import './Kid.component.css';
import { AiOutlineEdit } from 'react-icons/ai';
import { CiSquareRemove } from 'react-icons/ci';

export const AppKid: FC<{ kid: Kid, allowEdit?: boolean }> = ({ kid, allowEdit }) => {
    const fullName = `${ kid.firstName }${ kid.lastName ? ` ${ kid.lastName }` : '' }`;

    return (
        <div className="app-kid" >
            {
                kid.image
                    ?   <div className="app-kid-image-wrapper" >
                            <img className="app-kid-image" alt={`Kid "${ fullName }"`} src={ kid.image } />
                        </div>
                    : null
            }
            <div className={`app-kid-footer ${ kid.image ? '' : 'app-kid-footer-fullscale'}`} >
                <div className={`app-kid-name ${ kid.image ? '' : 'app-kid-name-fullscale'}`} >{ fullName }</div>
                {
                    
                }
                <div className="app-kid-action-container" >
                    <div className="app-kid-action" >
                        <AiOutlineEdit />
                    </div>
                    <div className="app-kid-action" >
                        <CiSquareRemove />
                    </div>
                </div>
            </div>
        </div>
    )
}