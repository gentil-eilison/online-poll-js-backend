import DAO from "./DAO.model";

type PollOption = {
    text: string
}

export default class PollOptionDAO extends DAO {
    async createPollOption(pollOptionData: PollOption) {

    }
}
