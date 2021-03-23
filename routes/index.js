var jwt = require("jsonwebtoken");
var express = require("express");
const { apolloClient } = require("../utils");
const { gql } = require("@apollo/client");
var router = express.Router();

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "Express" });
});

router.post("/login", (req, res) => {
  const { email, password } = req.body;
  // check username & password
  const {data} = await apolloClient.query(
    gql`
      query GET_USER($email: String!) {
        user_by_pk(where: { email: { _eq: $email } }) {
          id
          role
          passhash
        }
      }
    `,
    {
      variables: { email },
    }
  );

  const user = data.user.pop()
  if (!user) {
    return res.send({
      code: "E_NO_USER",
      message: "user not found",
      result: null
    })
  }
  if (hash(password) !== user.passhash) {
    return res.send({
      code: "E_WRONG_PASSWORD",
      message: "password is wrong",
      result: null
    })
  }

  const payload = {
    sub: user.id,
    username,
    "https://hasura.io/jwt/claims": {
      "x-hasura-allowed-roles": [user.role],
      "x-hasura-default-role": user.role,
      "x-hasura-user-id": user.id,
    },
  };
  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: "15 mins",
  });
  res.send({ 
    code: "SUCCESS",
    message: "login successfully",
    result: {
      token
    }
   });
});

module.exports = router;
