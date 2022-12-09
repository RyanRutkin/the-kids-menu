export type GraphitEntityFieldType = 'string' | 'number' | 'boolean' | 'file' | 'entity';
export type GraphitEntityFieldValue = string | number | boolean | File | GraphitEntity | null | undefined;

interface GraphitEntityField_base {
    displayName: string;
    required?: boolean;
    dataType: GraphitEntityFieldType;
    elementProps?: Record<string, any>;
}

export interface GraphitEntityField_string extends GraphitEntityField_base {
    dataType: 'string';
    defaultValue?: string;
}

export interface GraphitEntityField_number extends GraphitEntityField_base {
    dataType: 'number';
    defaultValue?: number;
}

export interface GraphitEntityField_boolean extends GraphitEntityField_base {
    dataType: 'boolean';
    defaultValue?: boolean;
}

export interface GraphitEntityField_file extends GraphitEntityField_base {
    dataType: 'file';
}

export interface GraphitEntityField_entity extends GraphitEntityField_base {
    dataType: 'entity';
    definition: GraphitEntityDefinition;
    defaultValue?: GraphitEntity;
}

export type GraphitEntityField = GraphitEntityField_string
 | GraphitEntityField_number
 | GraphitEntityField_boolean
 | GraphitEntityField_file
 | GraphitEntityField_entity;

export type GraphitEntityDefinition<T extends GraphitEntity = Record<string, GraphitEntityFieldValue>> = {
    displayName: string;
    storageKey: string;
    fields: {
        [K in keyof T]: GraphitEntityField;
    };
}

export interface GraphitEntity extends Record<string, GraphitEntityFieldValue> {
    id?: string;
};

// The relations field is initially indexed by table name,
// then by entity id of the parent table
// then by entity id of the related table.
export type GraphitEntityTableRelations = Record<string, boolean>;
export type GraphitEntityRelations = Record<string, Record<string, GraphitEntityTableRelations>>;
export type GraphitEntityTable = {
    relations: GraphitEntityRelations;
    entries: Record<string, GraphitEntity>;
}