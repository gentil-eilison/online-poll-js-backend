import express from "express";
import { createServer } from "node:http";
import usersRoutes from "./app/routes/User.routes.js";

const app = express();
const server = createServer(app);

app.use(express.json());
app.use(express.urlencoded({ extended: true }))
app.use("/users", usersRoutes);

server.listen(3000, () => {
    console.log("Server listening on port 3000")
});