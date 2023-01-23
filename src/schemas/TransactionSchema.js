import Joi from "joi";

export const transactionsSchema = Joi.object({
  value: Joi.number().precision(2).required(),
  description: Joi.string().required(),
  type: Joi.string().min(1).required().valid("entry", "withdraw"),
});
