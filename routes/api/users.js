const express = require("express");
const router = express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config')
const { check, validationResult } = require("express-validator");

//Import User model
const User = require('../../models/User');


//@route    POST api/users
//@desc     Register user
//@access   Public
router.post(
  "/",
  [
    check("name", "Name is required").not().isEmpty(),
    check("email", "Please enter a valid email").isEmail(),
    check("password", "Password length should be minimum 6").isLength({
      min: 6,
    }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password } = req.body;
    
    try{
      //User exists or not
      let user = await User.findOne({email});
      if(user){
          return res
            .status(400)
            .json({ errors: [{ msg: "User already exists" }] });
      }

      //Get user gravatar
      const avatar = gravatar.url(email, {
          s: '200',
          r: 'pg',
          d: 'mm'
      })

      user = new User({
          name,
          email,
          avatar,
          password
      });

      //Encrypt password
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);

      //Save user
      await user.save();
      
      //Return jsonwebtoken
      const payload = {
        user: {
          id: user.id
        }
      }

      jwt.sign(
        payload,
        config.get("jwtToken"),
        { expiresIn: 360000 },
        (err, token) => {
          if(err)
            throw err;
          res.json({ token });
        }
      ); 
    } catch(err) {
        console.log(err.message);
        res.status(500).send('Server error');
    }

  }
);

module.exports = router;
