import express, { Router } from "express";

import { createPoll, getPolls, getPoll, votePoll } from "../controllers/Poll.controller";

const router: Router = express.Router();

router.route("/")
    .post(createPoll)
    .get(getPolls)

router.route("/:pollId/")
    .get(getPoll)

router.post("/:pollId/vote/", votePoll)

export default router;