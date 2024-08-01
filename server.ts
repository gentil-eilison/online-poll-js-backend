import cors from "cors";
import { Server } from "socket.io";
import express, { Express } from "express";
import { createServer } from "node:http";
import usersRoutes from "./app/routes/User.routes";
import pollRoutes from "./app/routes/Poll.routes";

const app: Express = express();
const server = createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*"
    }
});

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/users", usersRoutes);
app.use("/polls", pollRoutes);

io.on("connection", (socket) => {
    console.log("a user connected");
});

server.listen(3000, "192.168.0.102",() => {
    console.log("Server listening on port 3000");
});

export { io }
