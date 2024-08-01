import PollModelClient from "../models/Poll.model"
import { io } from "../../server"

async function getUpdatedPolls() {
    const pollModelClient = new PollModelClient();
    const polls = await pollModelClient.getPolls();
    io.emit("updatePolls", polls);
}

export { getUpdatedPolls }