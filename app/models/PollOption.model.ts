import HttpResponse from "../../utils/HttpResponse";
import ModelClient from "./ModelClient.model";

export default class PollOptionModelClient extends ModelClient {
    async getPollOptionByPollId(pollId: number, pollOptionId: number) {
        if (!pollOptionId) {
            return new HttpResponse(400, {"data": "You must provide a poll option ID"});
        }
        const prisma = this.getPrisma();
        const pollOption = await prisma.pollOption.findUnique({
            where: {
                id: pollOptionId,
                poll_id: {
                    equals: pollId,
                },
            }
        });

        if (!pollOption) {
            return new HttpResponse(404, {"data": "No poll option with this ID is related with this poll"});
        }
        return new HttpResponse(200, pollOption);
    }
}
