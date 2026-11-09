import app from "./app.js";
import MailDev from 'maildev';
import { connect } from "mongoose";

if (process.env.NODE_ENV === 'development') {
  const maildev = new MailDev({
    smtp: 1025,
    web: 1080,
  });
  maildev.start();
  console.log('MailDev is running at http://localhost:1080');
}

connect(process.env.DATABASE_URL)
  .then(() => {
    console.log("Database connected successfully");
    app.listen(process.env.PORT, "localhost", () => {
      console.log(
        `Server is listening at http://localhost:${process.env.PORT}`,
      );
    });
  })
  .catch((err) => {
    console.error(`Database failed to connect, error: ${err}`);
    process.exit(1);
  });
