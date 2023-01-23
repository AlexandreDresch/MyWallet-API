import bcrypt from "bcrypt";
import { v4 as uuid } from "uuid";

import db from "../config/database.js";

export async function signUp(req, res) {
  const { username, email, password } = req.body;

  try {
    const isUserUnavailable = await db
      .collection("users")
      .findOne({ email: email });

    if (isUserUnavailable) {
      return res.sendStatus(409);
    }

    const passwordHash = bcrypt.hashSync(password, 10);

    await db.collection("users").insertOne({
      username: username,
      email: email,
      password: passwordHash,
    });

    res.sendStatus(200);
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
}

export async function signIn(req, res) {
  const { email, password } = req.body;

  try {
    const user = await db.collection("users").findOne({ email: email });

    if (user && bcrypt.compareSync(password, user.password)) {
      const token = uuid();

      await db.collection("sessions").insertOne({
        userId: user._id,
        token,
      });

      res.send({ token: token, username: user.username });
    } else {
      res.sendStatus(401);
    }
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
}
