class AuthService {
  constructor(userModel) {
    this.userModel = userModel;
  }

  async login(user) {
    try {
      const result = await this.userModel.findOne(user).exec();
      if (!result) {
        return 'Error on log in for this user';
      }
      const res = {
        id: result._id,
        username: result.username,
        name: result.name,
        message: 'Log in is successful',
      };
      return res;
    } catch (err) {
      return err.message;
    }
  }

  async register(user) {
    try {
      await this.userModel.create(user);
      return `Register is successful - ${user.username}`;
    } catch (err) {
      return err.message;
    }
  }
}

module.exports = AuthService;
