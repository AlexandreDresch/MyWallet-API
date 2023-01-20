import bcrypt from "bcrypt";
import { v4 as uuid } from "uuid";

import db from "../config/database.js";

import { signupSchema, signinSchema } from "../schemas/AuthSchema.js";

export async function signUp(req, res) {
  const { error, value } = signupSchema.validate(req.body);

  if (error) {
    console.error(error);
    return res.sendStatus(422);
  }

  try {
    const isUserUnavailable = await db
      .collection("users")
      .findOne({ email: value.email });

    if (isUserUnavailable) {
      return res.sendStatus(409);
    }

    const passwordHash = bcrypt.hashSync(value.password, 10);

    await db.collection("users").insertOne({
      username: value.username,
      email: value.email,
      password: passwordHash,
    });

    res.sendStatus(200);
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
}

export async function signIn(req, res) {
    const { error, value } = signinSchema.validate(req.body);

    if (error) {
      console.error(error);
      return res.sendStatus(422);
    }
  
    try {
      const user = await db.collection("users").findOne({ email: value.email });
  
      if (user && bcrypt.compareSync(value.password, user.password)) {
        const token = uuid();
  
        await db.collection("sessions").insertOne({
          userId: user._id,
          token,
        });
  
        res.send(token);
      } else {
        res.sendStatus(401);
      }
    } catch (error) {
      console.error(error);
      res.sendStatus(500);
    }
}
