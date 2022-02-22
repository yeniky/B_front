import Joi from "joi";

const schema = Joi.object({
  id: Joi.number().integer(),
  name: Joi.string()
    .max(20)
    .required()
    .messages({ "string.empty": "Debe ingresar un ID" }),
  type: Joi.string()
    .required()
    .messages({ "string.empty": "Debe Seleccionar un tipo" }),
  order: Joi.string()
    .required()
    .messages({ "string.empty": "Debe seleccionar una orden" }),
  containers: Joi.array().min(0),
});

const validate = (batch) => {
  const result = schema.validate(batch, {
    abortEarly: false,
    allowUnknown: true,
  });
  const errors = !!result.error
    ? Object.fromEntries(
        result.error.details.map((err) => [err.path[0], err.message])
      )
    : false;
  return [result.value, errors];
};

export default { schema, validate };
