import { UserDAO } from "../models/User.model.js";
import PrismaService from "../services/PrismaClient.service.js";

async function createUser(request, response) {
    const userDAO = new UserDAO();
    const { data, code } = await userDAO.createUser(request.body);
    response.status(code).send(data);
}

async function getUser(request, response) {
    const prisma = PrismaService.getInstance();
    const user = await prisma.user.findUnique({
        where: {
            id: Number(request.params.userId)
        }
    });
    response.send(user);
}

async function getUsers(request, response) {
    const prisma = PrismaService.getInstance();
    const users = await prisma.user.findMany();
    response.send(users);
}

export {
    getUser, 
    getUsers, 
    createUser
}