import Joi from "joi";

export const transactionsSchema = Joi.object({
  value: Joi.number().precision(2).required(),
  description: Joi.string().required(),
});
