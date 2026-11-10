import app from "./app.js";
import { connect } from "mongoose";
import WatchList from "./src/models/watchListModel.js";

if (process.env.NODE_ENV === "development") {
  const { default: MailDev } = await import("maildev");
  const maildev = new MailDev({
    smtp: 1025,
    web: 1080,
  });
  maildev.start();
  console.log("MailDev is running at http://localhost:1080");
}

connect(process.env.DATABASE_URL)
  .then(() => {
    console.log("Database connected successfully");
    // Remove indexes from older watchlist schemas, including a legacy
    // tmdbId-only unique index that prevented different users from saving
    // the same media.
    return WatchList.syncIndexes();
  })
  .then(() => {
    console.log("Watchlist indexes synchronized");
    app.listen(process.env.PORT, () => {
      console.log(`Server is listening on port ${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.error(`Database failed to connect, error: ${err}`);
    process.exit(1);
  });
