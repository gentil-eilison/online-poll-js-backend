import { Request, Response } from "express";
import { UserDAO } from "../models/User.model";

async function createUser(request: Request, response: Response) {
    const userDAO = new UserDAO();
    const httpResponse = await userDAO.createUser(request.body);
    response.status(httpResponse.getStatusCode()).send(httpResponse.getData());
}

async function getUser(request: Request, response: Response) {
    const userDAO = new UserDAO();
    const userId = Number(request.params.userId);
    const httpResponse = await userDAO.getUserById(userId);
    response.status(httpResponse.getStatusCode()).send(httpResponse.getData());
}

async function getUsers(request: Request, response: Response) {
    const userDAO = new UserDAO();
    const users = await userDAO.getUsers();
    response.status(200).send(users);
}

export {
    getUser, 
    getUsers, 
    createUser
}