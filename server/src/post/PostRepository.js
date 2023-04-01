const PostModel = require('./Post');
const BaseRepository = require('../common/BaseRepository');

class PostRepository extends BaseRepository {
  constructor() {
    super(PostModel);
  }
}

module.exports = PostRepository;
