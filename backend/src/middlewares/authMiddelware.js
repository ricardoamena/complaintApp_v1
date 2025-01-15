const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
    const authHeader = req.headers["authorization"];
    if (!authHeader) {
        return res.status(403).json({
            success: 0,
            message: "Token requerido",
        });
    }

    try {
        const token = authHeader.split(" ")[1];
        const decoded = jwt.verify(token, process.env.SECRET);
        req.user = decoded;
        next();
    }   catch (err) {
        console.error(err);
        return res.status(401).json({
            success: 0,
            message: "Token inválido",
        });
    }
};

module.exports = verifyToken;