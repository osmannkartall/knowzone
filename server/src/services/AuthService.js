const bcrypt = require('bcryptjs');
const { createCustomError, KNOWZONE_ERROR_TYPES } = require('../knowzoneErrorHandler');

class AuthService {
  constructor(userModel) {
    this.userModel = userModel;
  }

  static throwInvalidLoginError() {
    throw createCustomError({
      description: 'Username or password is wrong',
      statusCode: 400,
      type: KNOWZONE_ERROR_TYPES.AUTH,
    });
  }

  async login(user) {
    const result = await this.userModel.findOne({ username: user.username });
    if (!result) {
      AuthService.throwInvalidLoginError();
    }

    const isPasswordTheSame = await bcrypt.compare(user.password, result.password);
    if (!isPasswordTheSame) {
      AuthService.throwInvalidLoginError();
    }

    return {
      id: result._id,
      username: result.username,
      name: result.name,
      email: result.email,
      bio: result.bio,
    };
  }

  async register(user) {
    try {
      // Check if the user exists in the database.
      const doesUserExist = await this.userModel.findOne({
        $or: [
          { username: user.username },
          { email: user.email },
        ],
      });
      if (doesUserExist) {
        return { status: 'fail', message: 'User has already registered. Please choose different username/email.' };
      }

      // Hash password.
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(user.password, salt);
      const newUser = { ...user, password: hashedPassword };

      // Add new user to database.
      await this.userModel.create(newUser);
      return { status: 'success', message: `Register is successful - ${user.username}` };
    } catch (err) {
      return { status: 'fail', message: err.message };
    }
  }

  async getUserInformation(userId) {
    try {
      const user = await this.userModel.findOne({ _id: userId });
      if (!user) {
        return { status: 'fail', message: 'Could not find user.' };
      }

      return {
        status: 'success',
        id: user._id,
        username: user.username,
        name: user.name,
        email: user.email,
        bio: user.bio,
        message: 'Fetched user information from database.',
      };
    } catch (err) {
      return { status: 'fail', message: err.message };
    }
  }
}

module.exports = AuthService;
