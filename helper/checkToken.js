const { admin } = require("../config/firebase-admin");

const checkToken = async (req) => {
  const token = req.headers.authorization.split(" ")[1];
  let user = {};

  try {
    const decodedValue = await admin.auth().verifyIdToken(token);
    if (decodedValue) {
      user.name = decodedValue.name;
      user.email = decodedValue.email;
      user.picture = decodedValue.picture;
      user.id = decodedValue.uid;

      return user;
    }

  } catch (error) {
    user = null
    return user
  }
};

module.exports = checkToken;
