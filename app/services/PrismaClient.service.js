import { PrismaClient } from "@prisma/client/extension";

export default class PrismaService {
    static #isInternalConstructing = false;
    static #instance = null;

    constructor() {
        if (!PrismaService.#isInternalConstructing) {
            throw new TypeError("You should call 'getInstance' method for using Prisma Client");
        }
        PrismaService.#isInternalConstructing = false;
    }

    static getInstance() {
        if (this.#instance === null) {
            this.#isInternalConstructing = true;
            this.#instance = new PrismaClient();
        }
        return this.#instance;
    }
}