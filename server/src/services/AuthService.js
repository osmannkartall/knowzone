class AuthService {
  constructor(userModel) {
    this.userModel = userModel;
  }

  async login(user) {
    return 'Login - Compare passwords ' + user.username;
  }

  async register(user) {
    return 'Register - Call save method from mongoose ' + user.username;
  }
}

module.exports = AuthService;
