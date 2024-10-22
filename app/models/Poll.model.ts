import ModelClient from "./ModelClient.model";
import PollOptionModelClient from "./PollOption.model";
import UserModelClient from "./User.model";
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

    async hasUserVotedInPoll(pollId: number, userId: number) {
        const prisma = this.getPrisma();
        const poll = await prisma.poll.findUnique({
            where: {
                id: pollId
            },
            include: {
                users: {
                    where: {
                        id: userId
                    }
                }
            }
        });
        if (poll?.users.length !== 0) {
            return true;
        }
        return false;
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
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                return new HttpResponse(400, {"data": "Poll title must be unqiue"});
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
                poll_options: true,
                users: true
            }
        });

        if (!poll) {
            return new HttpResponse(404, {"data": "Not found"});
        }
        return new HttpResponse(200, poll);
    }

    async updatePollUsers(pollId: number, userId: number) {
        const httpResponse = await this.getPoll(pollId);
        if (httpResponse.getStatusCode() == 200) {
            const prisma = this.getPrisma();
            try {
                const pollUpdate = await prisma.poll.update({
                    where: {
                        id: pollId
                    },
                    data: {
                        users: {
                            connect: {id: userId}
                        }
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

    async votePoll(pollId: number, pollOptionId: number, userId: number) {
        const httpResponse = await this.getPoll(pollId);
        if (httpResponse.getStatusCode() === 200) {
            const userModelClient = new UserModelClient();
            const userHttpResponse = await userModelClient.getUserById(userId);

            if (userHttpResponse.getStatusCode() === 200) {
                const poll = httpResponse.getData();
                const user = userHttpResponse.getData();

                const hasUserVotedInPoll = await this.hasUserVotedInPoll(poll.id, user.id);

                if (hasUserVotedInPoll) {
                    return new HttpResponse(400, {"data": "You've already votted in this poll"});
                }
                
                const pollOptionModelClient = new PollOptionModelClient();
                const pollOptionHttpResponse = await pollOptionModelClient.getPollOptionByPollId(
                    poll.id,
                    pollOptionId
                );
    
                if (pollOptionHttpResponse.getStatusCode() == 200) {
                    const prisma = this.getPrisma();
                    const pollOption = pollOptionHttpResponse.getData();
                    try {
                        await prisma.pollOption.update({
                            where: {
                                id: pollOptionId,
                            },
                            data: {
                                votes_count: pollOption.votes_count + 1
                            }
                        });
                        this.updatePollTotalVotes(poll.id);
                        this.updatePollUsers(poll.id, userId);
                        const updatedPollResponse = await this.getPoll(pollId);
                        return new HttpResponse(200, updatedPollResponse.getData());
                    } catch (error) {
                        if (error instanceof Prisma.PrismaClientKnownRequestError) {
                            return new HttpResponse(400, {"data": error.meta?.cause});
                        }
                        return new HttpResponse(500, {"data": "Server error"});
                    }
                }
                return pollOptionHttpResponse;
            } else {
                return userHttpResponse;
            }
        } else {
            return httpResponse;
        }
    }
}