import dayjs from "dayjs";

import db from "../config/database.js";

import { transactionsSchema } from "../schemas/TransactionSchema.js";

export async function Wallet(req, res) {
  const { authorization } = req.headers;
  const token = authorization?.replace("Bearer ", "");

  try {
    const session = await db.collection("sessions").findOne({ token });

    if (!token || !session) {
      return res.sendStatus(401);
    }

    const walletData = await db
      .collection("wallet")
      .find({ userId: session.userId })
      .toArray();

    if (walletData) {
      res.send(walletData).status(200);
    } else {
      res.sendStatus(401);
    }
  } catch (error) {
    console.error(error);
    return res.sendStatus(500);
  }
}

export async function NewEntry(req, res) {
  const { error, value } = transactionsSchema.validate(req.body);
  const { authorization } = req.headers;
  const token = authorization?.replace("Bearer ", "");

  if (error) {
    console.error(error);
    return res.sendStatus(422);
  }

  try {
    const session = await db.collection("sessions").findOne({ token });

    if (!token || !session) {
      return res.sendStatus(401);
    }

    await db.collection("wallet").insertOne({
      userId: session.userId,
      value: value.value,
      description: value.description,
      type: "entry",
      date: dayjs().format("DD/MM"),
    });

    res.sendStatus(200);
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
}
