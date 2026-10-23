import User from "../models/userModel.js";

export const authorizeEachUser = async (req, res, next) => {
  const targetID = req.params.id;
  const requesterID = req.user?.id;

  try {
    //check if both individuals remains existing in the database
    const target = await User.findById(targetID);
    const requester = await User.findById(requesterID);

    if (!target || !requester) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (String(target._id) !== String(requester._id)) {
      return res.status(403).json({
        success: false,
        message: "Permission is forbidden",
      });
    }

    return next();
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: `failed due to error: ${error}`,
    });
  }
};
