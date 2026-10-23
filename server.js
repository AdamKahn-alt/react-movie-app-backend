import app from "./app.js";
import { connect } from "mongoose";

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
