const router = require("express").Router();
const List = require("../models/List");
const verify = require("../verifyTocken");

// CREATE
router.post("/", verify, async (req, res) => {
  if (req.user.isAdmin) {
    const newList = new List(req.body);

    try {
      const savedList = await newList.save();
      res.status(201).json(savedList);
    } catch (error) {
      res.status(500).json(error);
    }
  } else {
    res.status(403).json("You are not allowed to add movies!");
  }
});

// DELETE
router.delete("/:id", verify, async (req, res) => {
  if (req.user.isAdmin) {
    try {
      await Movie.findByIdAndDelete(req.params.id);
      res.status(200).json("List has been deleted");
    } catch (error) {
      res.status(500).json(error);
    }
  } else {
    res.status(403).json("You are not allowed to delete lists!");
  }
});

// GET 10 RANDOM LISTS
router.get("/", verify, async (req, res) => {
  const type = req.query.type;
  const genre = req.query.genre;
  let list = [];
  try {
    if (type) {
      if (genre) {
        list = await List.aggregate([
          { $sample: { size: 10 } },
          { $match: { type: type, genre: genre } },
        ]);
      } else {
        list = await List.aggregate([
          { $sample: { size: 10 } },
          { $match: { type: type } },
        ]);
      }
    } else {
      list = await List.aggregate([{ $sample: { size: 10 } }]);
    }
    res.status(200).json(list);
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
