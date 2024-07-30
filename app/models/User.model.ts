import { Prisma } from "@prisma/client";
import { PrismaClient } from "@prisma/client";
import PrismaService from "../services/PrismaClient.service";
import HttpResponse from "../../utils/HttpResponse";

type UserData = {
    username: string
}

class UserDAO {
    #prisma: PrismaClient = PrismaService.getInstance();

    async createUser(userData: UserData) {
        try {
            const user = await this.#prisma.user.create({
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
        return this.#prisma.user.findMany();
    }

    async getUserById(userId: number) {
        const user = await this.#prisma.user.findUnique({
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
            await this.#prisma.user.delete({
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
}

export { UserDAO }