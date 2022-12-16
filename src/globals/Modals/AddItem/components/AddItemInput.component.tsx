import React, { ChangeEvent, FC } from 'react';
import { AppModalFormInput, AppModalFormInputProps } from '../../../components/ModalFormInput/ModalFormInput.component';
import { GraphitEntityField } from '../../../types/GraphitEntity.type';


type AppInputEvent = ChangeEvent<HTMLInputElement>;

export const AppAddItemInput: FC<{
    field: string;
    valueDef: GraphitEntityField;
    handleChange: (field: string, e: ChangeEvent<HTMLInputElement>) => void;
} & AppModalFormInputProps> = ({
    field,
    valueDef,
    handleChange,
    ...props
}) => {
    if (valueDef.dataType === 'entity') {
        // No-op for typescript
        return null;
    }
    if (valueDef.dataType === 'file') {
        return (
            <AppModalFormInput
                required={ !!valueDef.required }
                type="file"
                onChange={ (e: AppInputEvent) => handleChange(field, e) }
                {
                    ...{
                        ...(valueDef.elementProps || {}),
                        ...(props || {})
                    }
                }
            />
        );
    }
    if (valueDef.dataType === 'boolean') {
        return (
            <AppModalFormInput
                required={ !!valueDef.required }
                type="checkbox"
                onChange={ (e: AppInputEvent) => handleChange(field, e) } 
                checked={ valueDef.defaultValue }
                {
                    ...{
                        ...(valueDef.elementProps || {}),
                        ...(props || {})
                    }
                }
            />
        );
    }
    return (
        <AppModalFormInput
            required={ !!valueDef.required }
            type={ valueDef.dataType }
            onChange={ (e: AppInputEvent) => handleChange(field, e) } 
            value={ valueDef.defaultValue }
            {
                ...{
                    ...(valueDef.elementProps || {}),
                    ...(props || {})
                }
            }
        />
    );
}
