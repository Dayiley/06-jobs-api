const WorkerProfile = require("../models/WorkerProfile");
const { StatusCodes } = require("http-status-codes");
const { BadRequestError, NotFoundError } = require("../errors");

const createProfile = async (req, res) => {
  const { fullName, positionType, yearsExperience, state } = req.body;

  if (!fullName || !positionType || yearsExperience === undefined || !state) {
    throw new BadRequestError("Please provide all required fields");
  }

  const profile = await WorkerProfile.create({
    ...req.body,
    createdBy: req.user.userId,
  });

  res.status(StatusCodes.CREATED).json({ profile });
};

const getAllProfiles = async (req, res) => {
  const profiles = await WorkerProfile.find({
    createdBy: req.user.userId,
  }).sort("createdAt");
  res.status(StatusCodes.OK).json({ count: profiles.length, profiles });
};

const getProfile = async (req, res) => {
  const { id: profileId } = req.params;

  const profile = await WorkerProfile.findOne({
    _id: profileId,
    createdBy: req.user.userId,
  });

  if (!profile) {
    throw new NotFoundError(`No profile with id: ${profileId}`);
  }

  res.status(StatusCodes.OK).json({ profile });
};

const updateProfile = async (req, res) => {
  const { id: profileId } = req.params;

  const profile = await WorkerProfile.findOneAndUpdate(
    { _id: profileId, createdBy: req.user.userId },
    req.body,
    { new: true, runValidators: true }
  );

  if (!profile) {
    throw new NotFoundError(`No profile with id: ${profileId}`);
  }

  res.status(StatusCodes.OK).json({ profile });
};

const deleteProfile = async (req, res) => {
  const { id: profileId } = req.params;

  const profile = await WorkerProfile.findOneAndDelete({
    _id: profileId,
    createdBy: req.user.userId,
  });

  if (!profile) {
    throw new NotFoundError(`No profile with id: ${profileId}`);
  }

  res.status(StatusCodes.OK).json({ msg: "Profile removed" });
};

module.exports = {
  createProfile,
  getAllProfiles,
  getProfile,
  updateProfile,
  deleteProfile,
};
