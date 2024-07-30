import { Request, Response } from "express";
import PollDAO from "../models/Poll.model";

async function createPoll(request: Request, response: Response) {
    const pollDAO = new PollDAO();
    const httpResponse = await pollDAO.createPoll(request.body);
    response.status(httpResponse.getStatusCode()).send(httpResponse.getData());
}

async function getPolls(request: Request, response: Response) {
    const pollDAO = new PollDAO();
    const polls = await pollDAO.getPolls();
    response.status(200).send(polls);
}

async function getPoll(request: Request, response: Response) {
    const pollDAO = new PollDAO();
    const pollId = Number(request.params.pollId);
    const httpResponse = await pollDAO.getPoll(pollId);
    response.status(httpResponse.getStatusCode()).send(httpResponse.getData());
}

export { createPoll, getPolls, getPoll }