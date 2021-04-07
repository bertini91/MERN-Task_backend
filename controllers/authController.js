const User = require("../models/User");
const bcryptjs = require("bcryptjs");
const { validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");

exports.authenticateUser = async (req, res) => {
  //Revisamos si hay errores
  const errores = validationResult(req);
  if (!errores.isEmpty()) {
    return res.status(400).json({ errores: errores.array() });
  }

  //Extraer el email y password
  const { email, password } = req.body;

  try {
    let user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: "El usuario no existe" });
    }

    //Revisar pass
    const pass = await bcryptjs.compare(password, user.password);
    if (!pass) {
      return res.status(400).json({ msg: "Password Incorrecto" });
    }

    //Todo ok
    //Crear y firmar el JWT
    const payload = {
      user: {
        id: user.id,
      },
    };

    //Firma el jwt      //3600s = 1hs
    jwt.sign(
      payload,
      process.env.SECRET,
      { expiresIn: 3600 },
      (error, token) => {
        if (error) throw error;
        res.json({ token });
      }
    );
  } catch (error) {
    console.log(error);
  }
};
