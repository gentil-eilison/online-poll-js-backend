import express, { Router } from "express";

import { createPoll, getPolls } from "../controllers/Poll.controller";

const router: Router = express.Router();

router.route("/")
    .post(createPoll)
    .get(getPolls)

export default router;