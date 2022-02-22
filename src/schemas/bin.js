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
  batch: Joi.string().allow(""),
  tag: Joi.string().allow(""),
  description: Joi.string().max(50).optional().allow(""),
});

const validate = (bin) => {
  const result = schema.validate(bin, {
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
