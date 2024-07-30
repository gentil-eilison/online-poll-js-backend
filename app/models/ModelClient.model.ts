import PrismaService from "../services/PrismaClient.service";
import { PrismaClient } from "@prisma/client";

export default class ModelClient {
    #prisma: PrismaClient = PrismaService.getInstance();

    getPrisma() {
        return this.#prisma;
    }
}