import express from "express";
import { getUsers, createUser, getUser } from "../controllers/User.controller.js";

const router = express.Router();

router.route("/")
    .get(getUsers)
    .post(createUser)

router.route("/:userId/")
    .get(getUser)

export default router;