const bcrypt = require('bcryptjs');

class AuthService {
  constructor(userModel) {
    this.userModel = userModel;
  }

  async login(user) {
    try {
      // Get user by username.
      const result = await this.userModel.findOne({ username: user.username });
      if (!result) {
        return { status: 'fail', message: 'Username or password is wrong' };
      }

      // Check if password in the request body is the same password in database.
      // The message in authentication should be ambiguous for the sake of security.
      const isPasswordTheSame = await bcrypt.compare(user.password, result.password);
      if (!isPasswordTheSame) {
        return { status: 'fail', message: 'Username or password is wrong' };
      }

      const responseResult = {
        status: 'success',
        id: result._id,
        username: result.username,
        name: result.name,
        email: result.email,
        bio: result.bio,
        message: 'Log in is successful',
      };
      return responseResult;
    } catch (err) {
      return { status: 'fail', message: err.message };
    }
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
}

module.exports = AuthService;
