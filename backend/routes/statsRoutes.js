const express = require("express");
const router = express.Router();

const Book = require("../models/Book");

router.get("/", async (req, res) => {
  try {

    const totalBooks = await Book.countDocuments();

    const downloadStats = await Book.aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: "$downloads" }
        }
      }
    ]);

    const totalDownloads =
      downloadStats.length > 0
        ? downloadStats[0].total
        : 0;

    res.json({
      totalBooks,
      totalDownloads
    });

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
});

module.exports = router;