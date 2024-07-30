import ModelClient from "./ModelClient.model";
import PollOptionModelClient from "./PollOption.model";
import { PollOption, Prisma } from "@prisma/client";
import HttpResponse from "../../utils/HttpResponse";

type PollData = {
    title: string,
    poll_options: Array<PollOption>
}

export default class PollModelClient extends ModelClient {
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

    async updatePollTotalVotes(pollId: number) {
        const httpResponse = await this.getPoll(pollId);
        if (httpResponse.getStatusCode() == 200) {
            const prisma = this.getPrisma();
            const poll = httpResponse.getData();
            let total_votes = 0
            poll.poll_options.forEach((option: PollOption) => {
                total_votes += option.votes_count;
            })

            try {
                const pollUpdate = await prisma.poll.update({
                    where: {
                        id: pollId
                    },
                    data: {
                        total_votes
                    }
                });
                return new HttpResponse(200, pollUpdate);
            } catch (error) {
                if (error instanceof Prisma.PrismaClientKnownRequestError) {
                    return new HttpResponse(400, {"data": error.meta?.cause});
                }
                return new HttpResponse(500, {"data": "Server error"});
            }
        }
    }

    async votePoll(pollId: number, pollOptionId: number) {
        const httpResponse = await this.getPoll(pollId);
        if (httpResponse.getStatusCode() === 200) {
            const poll = httpResponse.getData();
            const pollOptionModelClient = new PollOptionModelClient();
            const pollOptionHttpResponse = await pollOptionModelClient.getPollOptionByPollId(
                poll.id,
                pollOptionId
            );

            if (pollOptionHttpResponse.getStatusCode() == 200) {
                const prisma = this.getPrisma();
                const pollOption = pollOptionHttpResponse.getData();
                try {
                    const pollUpdated = await prisma.pollOption.update({
                        where: {
                            id: pollOptionId,
                        },
                        data: {
                            votes_count: pollOption.votes_count + 1
                        }
                    });
                    this.updatePollTotalVotes(poll.id);
                    return new HttpResponse(200, pollUpdated);
                } catch (error) {
                    if (error instanceof Prisma.PrismaClientKnownRequestError) {
                        return new HttpResponse(400, {"data": error.meta?.cause});
                    }
                    return new HttpResponse(500, {"data": "Server error"});
                }
            }
            return pollOptionHttpResponse;
        } else {
            return httpResponse;
        }
    }
}