import express from "express";
import {
  getUser,
  getUsers,
  patchUser,
  postUser,
  removeUser
} from "../controllers/userController.js";

const router = express.Router();

router.route("/")
  .post(postUser)
  .get(getUsers);
router.route("/:userID")
  .get(getUser)
  .patch(patchUser)
  .delete(removeUser);

export default router;
