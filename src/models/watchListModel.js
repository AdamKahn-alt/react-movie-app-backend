import { model, Schema } from "mongoose";

const watchListSchema = new Schema({
  title: {
    type: String,
    required: true,
    minLength: [2, "Movie Title cannot be less than 2 characters"],
  },

  mediaType: {
    type: String,
    required: true,
    enum: ["movie", "series"],
  },

  tmdbId: {
    type: String,
    required: true,
    minLength: [3, "Movie ID cannot be less than 3 characters"],
  },

  posterPath: {
    type: String,
    required: true,
  },

  overview: String,

  rating: {
    type: Number,
    required: true,
    min: 0,
    max: 10,
  },

  user: {
    type: Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
});

watchListSchema.index(
  { user: 1, tmdbId: 1 },
  { unique: true, name: "user_tmdbId_unique" }
);

const WatchList = model("watchlist", watchListSchema);
export default WatchList;
