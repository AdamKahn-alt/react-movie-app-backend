import { verifyToken } from "./jwt.js";

export const authenticate = async (req, res, next) => {
  const token = req.cookies?.token;
  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Unauthenticated",
    });
  }

  try {
    const decoded = await verifyToken(token);
    req.user = decoded;
    // console.log("req.user below");
    // console.log(req.user);

    return next();
  } catch (error) {
    console.error(error.message);
    if (
      error.name === "TokenExpiredError" ||
      error.name === "JsonWebTokenError"
    ) {
      return res.status(401).json({
        success: false,
        message: "Invalid or expired token",
      });
    }
    return res.status(error.statusCode || 500).json({
      success: false,
      message: `failed due to error: ${error}`,
    });
  }
};
