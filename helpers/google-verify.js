
// To validate an ID token in Node.js, use the Google Auth Library for Node.js. Install the library:

// ``` npm install google-auth-library --save ```

const {OAuth2Client} = require('google-auth-library');
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const verifyGoogle = async( token ) => {

  const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,  // Specify the CLIENT_ID of the app that accesses the backend
      // Or, if multiple clients access the backend:
      //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
  });
  const payload = ticket.getPayload();
  const userid = payload['sub'];

  const { email, name, picture } = payload;
  return { email, name, picture };
  // If request specified a G Suite domain:
  // const domain = payload['hd'];

};

module.exports = verifyGoogle;