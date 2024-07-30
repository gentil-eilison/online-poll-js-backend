import DAO from "./DAO.model";
import { PollOption, Prisma } from "@prisma/client";
import HttpResponse from "../../utils/HttpResponse";

type PollData = {
    title: string,
    poll_options: Array<PollOption>
}

export default class PollDAO extends DAO {
    #validatePollData(pollData: PollData) {
        if (!pollData.poll_options) {
            return new HttpResponse(400, {"data": "poll_options field is required"});
        } else {
            if (pollData.poll_options.length < 2) {
                return new HttpResponse(400, {"data": "You must provide at least two poll options"})
            }
        }
        if (pollData.title === "") {
            return new HttpResponse(400, {"data": "Poll title must not be empty"});
        }
        return null;
    }

    async createPoll(pollData: PollData) {
        const pollValidation = this.#validatePollData(pollData);
        if (pollValidation) {
            return pollValidation;
        }
        const prisma = this.getPrisma();

        try {
            const poll = await prisma.poll.create({
                data: {
                    title: pollData.title,
                    poll_options: {
                        create: pollData.poll_options
                    }
                },
            });
            return new HttpResponse(201, poll);
        } catch (error) {
            if (error instanceof Prisma.PrismaClientValidationError) {
                return new HttpResponse(400, {"data": "Poll option text and Poll title are required"});
            }
            return new HttpResponse(500, {"data": "Server error"});
        }
    }

    async getPolls() {
        const prisma = this.getPrisma();
        return prisma.poll.findMany({ include: { poll_options: true } });
    }

    async getPoll(pollId: number) {
        const prisma = this.getPrisma();
        const poll = await prisma.poll.findUnique({
            where: {
                id: pollId
            },
            include: {
                poll_options: true
            }
        });
        
        if (!poll) {
            return new HttpResponse(404, {"data": "Not found"});
        }
        return new HttpResponse(200, poll);
    }
}