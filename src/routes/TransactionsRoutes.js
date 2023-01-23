import { Router } from "express";

import { Wallet, NewTransaction } from "../controller/Transactions.js";

import { authSchema } from "../Middlewares/AuthSchema.js";

import { transactionsSchema } from "../schemas/TransactionSchema.js";

const transactionsRouter = Router();

transactionsRouter.get("/wallet", Wallet);
transactionsRouter.post("/new-transaction", authSchema(transactionsSchema), NewTransaction);

export default transactionsRouter;
