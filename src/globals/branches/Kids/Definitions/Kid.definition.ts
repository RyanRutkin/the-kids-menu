import { GraphitEntityDefinition } from "../../../types/GraphitEntity.type";
import { FoodDefinition } from "./Food.definition";

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
            displayName: 'Last Name',
            dataType: 'string'
        },
        image: {
            displayName: 'Image',
            dataType: 'file',
            elementProps: {
                accept: 'image/png, image/gif, image/jpeg'
            }
        },
        food: {
            displayName: 'Preffered Foods',
            dataType: 'entity',
            definition: FoodDefinition
        }
    }
};
