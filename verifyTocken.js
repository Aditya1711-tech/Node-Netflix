const jwt = require("jsonwebtoken");

function verifyTocken(req, res, next) {
  const authHeader = req.headers.tocken;
  if (authHeader) {
    const tocken = authHeader.split(" ")[1];

    jwt.verify(tocken, process.env.SECRET_KEY, (err, user) => {
      if (err) res.status(403).json("Tocken is not valid!");
      req.user = user;
      next();
    });
  } else {
    res.status(401).json("You are not authenticated");
  }
}

module.exports = verifyTocken;
