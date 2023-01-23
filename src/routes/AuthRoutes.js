import { Router } from "express";

import { signIn, signUp } from "../controller/Auth.js";

import { authSchema } from "../Middlewares/AuthSchema.js";

import { signupSchema, signinSchema } from "../schemas/AuthSchema.js";

const authRouter = Router();

authRouter.post("/sign-up", authSchema(signupSchema), signUp);
authRouter.post("/sign-in", authSchema(signinSchema), signIn);

export default authRouter;
