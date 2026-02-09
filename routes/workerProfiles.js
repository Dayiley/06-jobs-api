const express = require("express");
const router = express.Router();

const authenticateUser = require("../middleware/authentication");

const {
  createProfile,
  getAllProfiles,
  getProfile,
  updateProfile,
  deleteProfile,
} = require("../controllers/workerProfiles");

router
  .route("/")
  .post(authenticateUser, createProfile)
  .get(authenticateUser, getAllProfiles);

router
  .route("/:id")
  .get(authenticateUser, getProfile)
  .patch(authenticateUser, updateProfile)
  .delete(authenticateUser, deleteProfile);

module.exports = router;
