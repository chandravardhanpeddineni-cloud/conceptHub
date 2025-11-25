const { response } = require("express");
const Articles = require("../models/articleModel");
const Users = require("../models/userModel");

const addArticle = async (req, res) => {
  try {
    const email = req.email;
    const author = await Users.findOne({ email });

    const id = author._id;
    const { title, body } = req.body.data;
    if (!title || !body) {
      return res.status(400).json({ message: "All fields are required" });
    }
    console.log('checkpost 1');
    const article = await Articles.create({ title, body });
    article.author = id;
    console.log('checkpost 2');
    await article.save();
    const articleData = await article.toArticleResponse(author);
    console.log(articleData);
    console.log('checkpost 3');
    return res.status(200).json({ article: articleData });
  }
  catch (err) {
    console.log(err);
    return res.status(402).json({ msg: err });
  }
};
const searchPosts = async (req, res) => {
  try {
    const { keyword } = req.params;
    const limit = Math.min(parseInt(req.query.limit) || 10, 50); // max 50 to prevent abuse
    const page = Math.max(parseInt(req.query.page) || 1, 1);
    const skip = (page - 1) * limit;

    console.log(`Search: "${keyword}" | page: ${page}, limit: ${limit}`);

    // Use MongoDB text search (fast, indexed) instead of regex
    // Text search automatically handles word boundaries and is much faster
    const posts = await Articles.find(
      { $text: { $search: keyword } },
      { score: { $meta: "textScore" } } // Include relevance score for sorting
    )
      .populate("author", "name image") // Only fetch needed fields
      .select("title body createdAt author likes comments slug") // Exclude unnecessary fields
      .sort({ score: { $meta: "textScore" } }) // Sort by relevance
      .skip(skip)
      .limit(limit)
      .lean(); // Use lean() for read-only queries (20-30% faster)

    const totalCount = await Articles.countDocuments({ $text: { $search: keyword } });

    res.status(200).json({
      count: posts.length,
      total: totalCount,
      page,
      limit,
      pages: Math.ceil(totalCount / limit),
      hasMore: page * limit < totalCount,
      posts
    });
  } catch (error) {
    console.error("Search error:", error);
    // If text search fails (index might not be built yet), fallback to regex
    try {
      const { keyword } = req.params;
      const limit = Math.min(parseInt(req.query.limit) || 10, 50);
      const page = Math.max(parseInt(req.query.page) || 1, 1);
      const skip = (page - 1) * limit;

      const words = keyword.split(" ");
      const regexArray = words.map(word => ({
        title: { $regex: `.*${word}.*`, $options: "i" }
      }));

      const posts = await Articles.find({ $or: regexArray })
        .populate("author", "name image")
        .select("title body createdAt author likes comments slug")
        .skip(skip)
        .limit(limit)
        .lean();

      const totalCount = await Articles.countDocuments({ $or: regexArray });

      res.status(200).json({
        count: posts.length,
        total: totalCount,
        page,
        limit,
        pages: Math.ceil(totalCount / limit),
        hasMore: page * limit < totalCount,
        posts
      });
    } catch (fallbackError) {
      console.error("Fallback search error:", fallbackError);
      res.status(404).json({ error: "Search failed" });
    }
  }
};
const getPosts = async (req, res) => {
  try {
    console.log(req.originalUrl);
    const limit = Math.min(parseInt(req.query.limit) || 5, 50); // max 50 to prevent abuse
    const page = Math.max(parseInt(req.query.page) || 1, 1);
    const skip = (page - 1) * limit;

    // Use lean() for 20-30% faster read-only queries
    const posts = await Articles.find()
      .populate("author", "name image")
      .select("title body createdAt author likes comments slug") // Only fetch needed fields
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 }) // Sort by newest first
      .lean();

    const totalPosts = await Articles.countDocuments();

    res.status(200).json({
      posts,
      totalPages: Math.ceil(totalPosts / limit),
      hasMore: page * limit < totalPosts,
      page,
      limit
    });
  } catch (err) {
    console.log(err);
    return res.status(400).json({ msg: err });
  }
};
const deletePost = async (req, res) => {
  try {
    const { _id } = req.body.data
    const newData = await Articles.findByIdAndDelete(_id);
    console.log("Post deleted successfully");
    return res.status(200).json({ msg: 'Post deleted successfully' });
  }
  catch (err) {
    return res.status(400).json({ msg: err });
  }
}

module.exports = { addArticle, getPosts, deletePost, searchPosts };
