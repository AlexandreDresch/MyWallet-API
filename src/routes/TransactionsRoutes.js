import { Router } from "express";

import { Wallet, NewEntry, NewWithdraw } from "../controller/Transactions.js";

const transactionsRouter = Router();

transactionsRouter.get("/wallet", Wallet);
transactionsRouter.post("/new-entry", NewEntry);
transactionsRouter.post("/new-withdraw", NewWithdraw);

export default transactionsRouter;
