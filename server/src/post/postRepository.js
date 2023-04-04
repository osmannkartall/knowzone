import BaseRepository from '../common/baseRepository.js';
import PostModel from './post.js';

export default class PostRepository extends BaseRepository {
  constructor() {
    super(PostModel);
  }
}
