import { GraphitEntityDefinition } from "../../../types/GraphitEntity.type";

export const KidDefinition: GraphitEntityDefinition = {
    displayName: 'Kid',
    storageKey: 'kid',
    fields: {
        firstName: {
            displayName: 'First Name',
            required: true,
            dataType: 'string'
        },
        lastName: {
            displayName: 'First Name',
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
