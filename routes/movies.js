const router = require("express").Router();
const Movie = require("../models/Movie");
const verify = require("../verifyTocken");

// CREATE
router.post("/", verify, async (req, res) => {
  if (req.user.isAdmin) {
    const newMovie = new Movie(req.body);

    try {
      const savedMovie = await newMovie.save();
      res.status(201).json(savedMovie);
    } catch (error) {
      res.status(500).json(error);
    }
  } else {
    res.status(403).json("You are not allowed to add movies!");
  }
});

// UPDATE
router.put("/:id", verify, async (req, res) => {
  if (req.user.isAdmin) {
    try {
      const updatedMovie = await Movie.findByIdAndUpdate(
        req.params.id,
        {
          $set: req.body,
        },
        { new: true }
      );
      res.status(200).json(updatedMovie);
    } catch (error) {
      res.status(500).json(error);
    }
  } else {
    res.status(403).json("You are not allowed to update movies!");
  }
});

// DELETE
router.delete("/:id", verify, async (req, res) => {
  if (req.user.isAdmin) {
    try {
      await Movie.findByIdAndDelete(req.params.id);
      res.status(200).json("Movie has been deleted");
    } catch (error) {
      res.status(500).json(error);
    }
  } else {
    res.status(403).json("You are not allowed to delete movies!");
  }
});

// GET
router.get("/find/:id", verify, async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);
    res.status(200).json(movie);
  } catch (error) {
    res.status(500).json(error);
  }
});

// GET RANDOM
router.get("/random", verify, async (req, res) => {
  // It is for finding random recomendation according to selected category i.e. movies or series
  // and this type will be taken from url if url is /api/movies/ramdom?type=movies so it will take type as movies. It means it will ask for random movie
  const type = req.query.type;
  let movie;
  try {
    if (type === "series") {
      movie = await Movie.aggregate([
        { $match: { isSeries: true } },
        { $sample: { size: 1 } },
      ]);
    } else {
      movie = await Movie.aggregate([
        { $match: { isSeries: false } },
        { $sample: { size: 1 } },
      ]);
    }
    res.status(200).json(movie);
  } catch (error) {
    res.status(500).json(error);
  }
});

// RANDOM 10 IDs
router.get("/random-id", async (req, res) => {
  try {
    const movieCount = await Movie.countDocuments();
    const randomMovieIds = [];

    for (let i = 0; i < 10; i++) {
      const randomIndex = Math.floor(Math.random() * movieCount);
      const randomMovie = await Movie.findOne().skip(randomIndex).select("_id");

      randomMovieIds.push(randomMovie._id);
    }

    res.json(randomMovieIds);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch random movies" });
  }
});

// GET ALL
router.get("/", verify, async (req, res) => {
  if (req.user.isAdmin) {
    const movies = await Movie.find();
    res.status(200).json(movies.reverse());
  } else {
    res.status(403).json("You are not allowed");
  }
});

module.exports = router;
