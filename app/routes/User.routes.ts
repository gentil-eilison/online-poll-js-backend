import express, { Router } from "express";
import { 
    getUsers, 
    createUser, 
    getUser, 
    deleteUser, 
    updateUser 
} from "../controllers/User.controller";

const router: Router = express.Router();

router.route("/")
    .get(getUsers)
    .post(createUser)

router.route("/:userId/")
    .get(getUser)
    .delete(deleteUser)
    .put(updateUser);

export default router;