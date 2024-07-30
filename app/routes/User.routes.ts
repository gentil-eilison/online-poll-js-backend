import express, { Router } from "express";
import { getUsers, createUser, getUser } from "../controllers/User.controller";

const router: Router = express.Router();

router.route("/")
    .get(getUsers)
    .post(createUser)

router.route("/:userId/")
    .get(getUser)

export default router;