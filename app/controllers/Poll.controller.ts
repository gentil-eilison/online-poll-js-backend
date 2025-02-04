import { Request, Response } from "express";
import PollModelClient from "../models/Poll.model";
import { getUpdatedPolls } from "../events/Poll.events";
import { io } from "../../server";

async function createPoll(request: Request, response: Response) {
    const pollModelClient = new PollModelClient();
    const httpResponse = await pollModelClient.createPoll(request.body);
    if (httpResponse.getStatusCode() === 201) {
        await getUpdatedPolls();
    }
    response.status(httpResponse.getStatusCode()).send(httpResponse.getData());
}

async function getPolls(request: Request, response: Response) {
    const pollModelClient = new PollModelClient();
    const polls = await pollModelClient.getPolls();
    response.status(200).send(polls);
}

async function getPoll(request: Request, response: Response) {
    const pollModelClient = new PollModelClient();
    const pollId = Number(request.params.pollId);
    const httpResponse = await pollModelClient.getPoll(pollId);
    response.status(httpResponse.getStatusCode()).send(httpResponse.getData());
}

async function votePoll(request: Request, response: Response) {
    const pollModelClient = new PollModelClient();
    const pollId = Number(request.params.pollId);
    const pollOptionId = Number(request.body.poll_option);
    const userId = Number(request.body.user_id);
    const httpResponse = await pollModelClient.votePoll(pollId, pollOptionId, userId);
    if (httpResponse.getStatusCode() === 200) {
        const poll = httpResponse.getData();
        io.to(poll.title).emit("updatePollVotes", poll);
    }
    response.status(httpResponse.getStatusCode()).send(httpResponse.getData());
}

export { createPoll, getPolls, getPoll, votePoll }