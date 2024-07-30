import { Request, Response } from "express";
import PollModelClient from "../models/Poll.model";

async function createPoll(request: Request, response: Response) {
    const pollModelClient = new PollModelClient();
    const httpResponse = await pollModelClient.createPoll(request.body);
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
    const httpResponse = await pollModelClient.votePoll(pollId, pollOptionId);
    response.status(httpResponse.getStatusCode()).send(httpResponse.getData());
}

export { createPoll, getPolls, getPoll, votePoll }