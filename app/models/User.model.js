import { Prisma } from "@prisma/client";
import PrismaService from "../services/PrismaClient.service.js";

class UserDAO {
    #prisma = null;

    constructor() {
        this.#prisma = PrismaService.getInstance();
    }

    async createUser(userData) {
        try {
            const user = await this.#prisma.user.create({
                data: userData
            });
            return {"data": user, "code": 201};
        } catch (error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                return {"data": "Username already taken", "code": 400};
            }
            if (error instanceof Prisma.PrismaClientValidationError) {
                return {"data": error.message, "code": 400};
            }
        }
    }
}

export { UserDAO }