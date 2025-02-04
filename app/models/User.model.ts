import { Prisma } from "@prisma/client";
import HttpResponse from "../../utils/HttpResponse";
import ModelClient from "./ModelClient.model";

type UserData = {
    username: string
}

export default class UserModelClient extends ModelClient {
    #validateUserData(userData: UserData) {
        if (userData.username === "") {
            return new HttpResponse(400, {"data": "Username must not be empty"});
        }
        return null;
    }

    async createUser(userData: UserData) {
        const userValidation = this.#validateUserData(userData);
        if (userValidation) {
            return userValidation;
        }
        try {
            const prisma = this.getPrisma();
            const user = await prisma.user.create({
                data: userData
            });
            return new HttpResponse(200, user);
        } catch (error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                return new HttpResponse(400, {"data": "Username already taken"});
            }
            if (error instanceof Prisma.PrismaClientValidationError) {
                return new HttpResponse(400, {"data": "Username field is required"});
            }
            return new HttpResponse(500, {"data": "Server error"});
        }
    }

    async getUsers() {
        const prisma = this.getPrisma();
        return prisma.user.findMany();
    }

    async getUserById(userId: number) {
        const prisma = this.getPrisma();
        const user = await prisma.user.findUnique({
            where: {
                id: userId
            }
        })
        if (!user) {
            return new HttpResponse(404, {"data": "Not found"});
        }
        return new HttpResponse(200, user);
    }

    async deleteUser(userId: number) {
        try {
            const prisma = this.getPrisma();
            await prisma.user.delete({
                where: {
                    id: userId
                }
            });
        } catch (error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                return new HttpResponse(404, {"data": error.meta?.cause})
            }
        }

        return new HttpResponse(204, {});
    }

    async updateUser(userId: number, userData: UserData) {
        const userValidation = this.#validateUserData(userData);
        if (userValidation) {
            return userValidation;
        }
        try {
            const prisma = this.getPrisma();
            const updatedUser = await prisma.user.update({
                where: {
                    id: userId
                },
                data: userData
            });
            return new HttpResponse(200, updatedUser);
        } catch (error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                return new HttpResponse(400, {"data": error.meta?.cause})
            }
            return new HttpResponse(500, {"data": "Server error"});
        }
    }
}