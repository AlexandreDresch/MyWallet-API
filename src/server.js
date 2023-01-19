import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { MongoClient, ObjectId } from "mongodb";
import Joi from "joi";
import bcrypt from "bcrypt";
import { v4 as uuid } from "uuid";

dotenv.config();

const server = express();

server.use(cors());

server.use(express.json());

const mongoClient = new MongoClient(process.env.DATABASE_URL);
let db;

const PORT = 5000;

const token = uuid();

const signupSchema = Joi.object({
  username: Joi.string().alphanum().min(3).required(),
  email: Joi.string().email().required(),
  password: Joi.string().pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")),
  repeat_password: Joi.ref("password"),
});

const signinSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")),
});

try {
  await mongoClient.connect();
  db = mongoClient.db();
} catch (error) {
  console.error(error);
}

server.post("/sign-up", async (req, res) => {
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
});

server.post("/sign-in", async (req, res) => {
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
});

server.get("/wallet", async (req, res) => {
  const { authorization } = req.headers;
  const token = authorization?.replace("Bearer ", "");

  try {
    const session = await db.collection("sessions").findOne({ token });

    if (!token || !session) {
      return res.sendStatus(401);
    }

    const walletData = await db.collection("wallet").find({userId: session.userId}).toArray();

    if(walletData) {
        res.send(walletData).status(200);
    } else {
        res.sendStatus(401);
    }    
  } catch (error) {
    console.error(error);
    return res.sendStatus(500);
  }
});

server.listen(PORT, () => console.log(`Listening on port ${PORT}`));
