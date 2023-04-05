const PostModel = require('./post');
const BaseRepository = require('../common/baseRepository');

class PostRepository extends BaseRepository {
  constructor() {
    super(PostModel);
  }
}

module.exports = PostRepository;
