import { GraphitEntityDefinition } from "../../../types/GraphitEntity.type";

export const FoodDefinition: GraphitEntityDefinition = {
    displayName: 'Food',
    storageKey: 'food',
    fields: {
        displayName: {
            displayName: 'Name',
            required: true,
            dataType: 'string'
        },
        image: {
            displayName: 'Image',
            dataType: 'file',
            elementProps: {
                accept: 'image/png, image/gif, image/jpeg'
            }
        }
    }
};
