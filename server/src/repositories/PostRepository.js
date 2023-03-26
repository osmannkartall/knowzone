const PostModel = require('../models/Post');
const BaseRepository = require('./BaseRepository');

class PostRepository extends BaseRepository {
  constructor() {
    super(PostModel);
  }
}

module.exports = PostRepository;
