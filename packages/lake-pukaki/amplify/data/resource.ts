import { a, type ClientSchema, defineData } from "@aws-amplify/backend";
import { schema as generatedSqlSchema } from "./schema.sql";

const schema = generatedSqlSchema
  .authorization((allow) => allow.publicApiKey().to(["read"]))
  .setAuthorization((models) => [
    models.form_inputs.authorization((allow) => [
      allow.publicApiKey().to(["read"]),
      allow.groups(["Administrators"]).to(["read", "delete"]),
    ]),
    models.field_inputs.authorization((allow) => [
      allow.publicApiKey().to(["read"]),
      allow.groups(["Administrators"]).to(["read", "delete"]),
    ]),
    models.forms.authorization((allow) => [
      allow.publicApiKey().to(["read"]),
      allow.groups(["Administrators"]).to(["read", "update", "delete"]),
    ]),
    models.fields.authorization((allow) => [
      allow.publicApiKey().to(["read"]),
      allow.groups(["Administrators"]).to(["read", "update", "delete"]),
    ]),
  ])
  .addToSchema({
    createFormInput: a
      .mutation()
      .arguments({
        form_id: a.integer().required(),
        parent_id: a.integer(),
        composition_id: a.integer(),
        index: a.integer().required(),
      })
      .returns(a.ref("form_inputs").array())
      .authorization((allow) => [allow.groups(["Administrators"])])
      .handler(
        a.handler.inlineSql(
          "INSERT INTO form_inputs (form_id, form_type, parent_id, parent_form_id, composition_id, index) SELECT f.id, f.type, :parent_id, p.form_id, :composition_id, :index FROM forms f LEFT JOIN form_inputs p ON p.id = :parent_id WHERE f.id = :form_id AND :index >= 0 AND (CAST(:parent_id AS bigint) IS NULL OR p.id IS NOT NULL) RETURNING *",
        ),
      ),
    createFieldInput: a
      .mutation()
      .arguments({
        form_input_id: a.integer().required(),
        field_id: a.integer().required(),
        value: a.string(),
      })
      .returns(a.ref("field_inputs").array())
      .authorization((allow) => [allow.groups(["Administrators"])])
      .handler(
        a.handler.inlineSql(
          "INSERT INTO field_inputs (form_input_id, field_id, form_id, value) SELECT i.id, :field_id, i.form_id, :value FROM form_inputs i WHERE i.id = :form_input_id RETURNING *",
        ),
      ),
    createFieldDefinition: a
      .mutation()
      .arguments({
        name: a.string().required(),
        description: a.string(),
        type: a.ref("FieldsType"),
        required: a.boolean().required(),
        simple_form_id: a.integer().required(),
      })
      .returns(a.ref("fields").array())
      .authorization((allow) => [allow.groups(["Administrators"])])
      .handler(
        a.handler.inlineSql(
          "INSERT INTO fields (name, description, type, required, simple_form_id) SELECT BTRIM(:name), :description, CAST(:type AS field_type), :required, :simple_form_id WHERE LENGTH(BTRIM(:name)) > 0 RETURNING *",
        ),
      ),
    createFormDefinition: a
      .mutation()
      .arguments({
        name: a.string().required(),
        description: a.string(),
        type: a.ref("FormsType").required(),
      })
      .returns(a.ref("forms").array())
      .authorization((allow) => [allow.groups(["Administrators"])])
      .handler(
        a.handler.inlineSql(
          "INSERT INTO forms (name, description, type) SELECT BTRIM(:name), :description, CAST(:type AS form_type) WHERE LENGTH(BTRIM(:name)) > 0 RETURNING *",
        ),
      ),
  })
  .setRelationships((models) => [
    // IDs identify API relationships; PostgreSQL's composite foreign keys also
    // enforce form kinds and membership when records are written.
    models.forms.relationships({
      fields: a.hasMany("fields", "simple_form_id"),
      compositions: a.hasMany("form_compositions", "composite_form_id"),
      memberOf: a.hasMany("form_compositions", "member_id"),
      inputs: a.hasMany("form_inputs", "form_id"),
      bindings: a.hasMany("form_bindings", "form_id"),
      fieldInputs: a.hasMany("field_inputs", "form_id"),
      inputBindings: a.hasMany("form_input_bindings", "form_id"),
    }),
    models.fields.relationships({
      form: a.belongsTo("forms", "simple_form_id"),
      inputs: a.hasMany("field_inputs", "field_id"),
    }),
    models.form_compositions.relationships({
      compositeForm: a.belongsTo("forms", "composite_form_id"),
      member: a.belongsTo("forms", "member_id"),
      inputs: a.hasMany("form_inputs", "composition_id"),
    }),
    models.form_inputs.relationships({
      form: a.belongsTo("forms", "form_id"),
      composition: a.belongsTo("form_compositions", "composition_id"),
      parent: a.belongsTo("form_inputs", "parent_id"),
      children: a.hasMany("form_inputs", "parent_id"),
      fieldInputs: a.hasMany("field_inputs", "form_input_id"),
      bindings: a.hasMany("form_input_bindings", "form_input_id"),
    }),
    models.field_inputs.relationships({
      form: a.belongsTo("forms", "form_id"),
      formInput: a.belongsTo("form_inputs", "form_input_id"),
      field: a.belongsTo("fields", "field_id"),
    }),
    // Subject IDs are polymorphic (geo_layer or geo_feature). A relationship
    // on the ID alone would ignore the subject type and could return wrong rows.
    models.form_bindings.relationships({
      form: a.belongsTo("forms", "form_id"),
      inputBindings: a.hasMany("form_input_bindings", "form_binding_id"),
    }),
    models.form_input_bindings.relationships({
      form: a.belongsTo("forms", "form_id"),
      binding: a.belongsTo("form_bindings", "form_binding_id"),
      formInput: a.belongsTo("form_inputs", "form_input_id"),
    }),
    models.geo_layers.relationships({
      features: a.hasMany("geo_features", "geo_layer_id"),
    }),
    models.geo_features.relationships({
      layer: a.belongsTo("geo_layers", "geo_layer_id"),
    }),
  ]);

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: "apiKey",
    apiKeyAuthorizationMode: {
      expiresInDays: 30,
    },
  },
  logging: {
    fieldLogLevel: "error",
    excludeVerboseContent: true,
    retention: "1 week",
  },
});
