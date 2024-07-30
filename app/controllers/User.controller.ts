import { Request, Response } from "express";
import UserModelClient from "../models/User.model";

async function createUser(request: Request, response: Response) {
    const userModelClient = new UserModelClient();
    const httpResponse = await userModelClient.createUser(request.body);
    response.status(httpResponse.getStatusCode()).send(httpResponse.getData());
}

async function getUser(request: Request, response: Response) {
    const userModelClient = new UserModelClient();
    const userId = Number(request.params.userId);
    const httpResponse = await userModelClient.getUserById(userId);
    response.status(httpResponse.getStatusCode()).send(httpResponse.getData());
}

async function getUsers(request: Request, response: Response) {
    const userModelClient = new UserModelClient();
    const users = await userModelClient.getUsers();
    response.status(200).send(users);
}

async function deleteUser(request: Request, response: Response) {
    const userModelClient = new UserModelClient();
    const userId = Number(request.params.userId);
    const httpResponse = await userModelClient.deleteUser(userId);
    response.status(httpResponse.getStatusCode()).send(httpResponse.getData());
}

async function updateUser(request: Request, response: Response) {
    const userModelClient = new UserModelClient();
    const userId = Number(request.params.userId);
    const httpResponse = await userModelClient.updateUser(userId, request.body);
    response.status(httpResponse.getStatusCode()).send(httpResponse.getData());
}

export {
    getUser, 
    getUsers, 
    createUser,
    deleteUser,
    updateUser
}