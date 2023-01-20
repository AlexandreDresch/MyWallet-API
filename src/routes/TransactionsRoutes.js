import { Router } from "express";

import { Wallet, NewEntry } from "../controller/Transactions.js";

const transactionsRouter = Router();

transactionsRouter.get("/wallet", Wallet);
transactionsRouter.post("/new-entry", NewEntry);

export default transactionsRouter;
