import { sql } from "@vercel/postgres";
import bcrypt from "bcryptjs";
import generateToken from "../utils/generateToken.js"; // Function to generate JWT tokens

export async function login(req, res) {
  const { email, password } = req.body;

  // Validate if there is username
  if (!email) {
    return res.status(401).json({ message: "Please, insert your username!" });
  }

  // Validate if there is password, and lengh greater or equal 3
  if (!password || password.length < 3) {
    return res.status(401).json({ message: "Please, insert your password!" });
  }

  try {
    const user = await sql`
      SELECT * FROM stock_users
        WHERE email = ${email};`;
    if (user.rowCount == 0) {
      return res.status(404).json({ message: "Invalid User." });
    }
    const passwordMatch = await bcrypt.compare(password, user.rows[0].password);
    // if (!passwordMatch) {
    //   return res.status(401).json({message:'Invalid credentials'});
    // } else {

    // Generate JWT token for the authenticated user
    const token = generateToken(user.rows[0]);
    // Set the token in a cookie with httpOnly option for security
    // console.log(process.env.NODE_ENV === 'production')
    return res
      .cookie("token", token, {
        httpOnly: true,
        secure: true,
        sameSite: "None",
      })
      .status(200)
      .json({ message: "Logged in successfully" });
    // }
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Error. Try again later" });
  }
}

export async function getWatchlist(req, res) {
  try {
    const findUser = await sql`
      SELECT *
      FROM stock_watchlist
      WHERE email = ${req.user.email}
      `;

    if (findUser.rows[0]) {
      res.status(200).json(findUser.rows);
    } else {
      res.status(404).json({ message: "Invalid Session" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Invalid Session" });
  }
}

export async function addToWatchlist(req, res) {
  const { ticker } = req.body;

  try {
    const insertUser = await sql`
        INSERT INTO stock_watchlist (email, ticker)
        VALUES (${req.user.email}, ${ticker})
        `;
console.log(insertUser)
    if (insertUser.rowCount == 1) {
      res.status(200).json({ message: `${ticker} added sucessfully!` });
    } else {
      res.status(404).json({ message: "Invalid Session" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Invalid Session" });
  }
}


export async function removeFromWatchlist(req, res) {
    const { ticker } = req.body;
  
    try {
      const removedTicker = await sql`
          DELETE FROM stock_watchlist
          WHERE ticker = ${ticker}
          `;
  console.log(removedTicker)
      if (removedTicker.rowCount >= 1) {
        res.status(200).json({ message: `${ticker} removed sucessfully!` });
      } else {
        res.status(404).json({ message: "Invalid Session" });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Invalid Session" });
    }
  }

// export async function signup (req, res) {
//   try {
//       const user = req.body;
//       if(!user.first_name || !user.last_name || !user.email || !user.phone || !user.birthday || !user.department || !user.program || !user.username || !user.password || !user.retypePassword){
//         res.status(400)
//           .json({message : "Incomplete fields."})
//           return
//       }
//       if(user.password  != user.retypePassword){
//         res.status(400)
//           .json({message : "Password and Retyped Password doesn't match"})
//           return
//       }

//       if(user.password.length <3){
//         res.status(400)
//           .json({message : "Password must have at least 3 characters"})
//           return
//       }

//       const searchUsername = await sql`
//       SELECT userid
//         FROM bvc_users
//         WHERE username = ${user.username}
//       `;

//       const searchEmail = await sql`
//       SELECT userid
//         FROM bvc_users
//         WHERE email = ${user.email}
//       `;

//       if (searchUsername.rowCount >0){
//         res.status(409)
//           .json({message : "username already exist"})
//           return
//       }
//       if (searchEmail.rowCount >0){
//         res.status(409)
//           .json({message : "Email already exist"})
//           return
//       }

//       const hashedpassword = bcrypt.hashSync(user.password, 10)

//       const insertUser = await sql`
//       INSERT INTO bvc_users (first_name, last_name, email, phone, birthday, department, program, username, password, isadmin)
//       VALUES (${user.first_name}, ${user.last_name}, ${user.email}, ${user.phone}, ${user.birthday}, ${user.department}, ${user.program}, ${user.username}, ${hashedpassword}, false)
//       `;
//       if (insertUser.rowCount ==1){
//           res.status(201)
//           .json({message : "Signup sucessful"})

//       }else{
//           res.status(404)
//           .json({message : "Cannot create User. Try again later"})
//           }
//       } catch (error) {
//           console.error(error)
//           res.status(500).json({message: 'Cannot create user!'});
//       }
// };

// export async function updateUser(req, res) {
//   const user = req.user
//   const userUpdated = req.body;

//     try {

//       var updateUser
//       if(userUpdated.password){
//         const hashedpassword = bcrypt.hashSync(userUpdated.password, 10)
//         updateUser = await sql`
//           UPDATE bvc_users
//           SET first_name= ${userUpdated.first_name},
//             last_name = ${userUpdated.last_name},
//             email = ${userUpdated.email},
//             phone = ${userUpdated.phone},
//             birthday = ${userUpdated.birthday},
//             department = ${userUpdated.department},
//             program = ${userUpdated.program},
//             username = ${userUpdated.username},
//             password = ${hashedpassword}
//           WHERE userid = ${user.userid}
//         `;
//       }else{
//         updateUser = await sql`
//         UPDATE bvc_users
//         SET first_name= ${userUpdated.first_name},
//         last_name = ${userUpdated.last_name},
//         email = ${userUpdated.email},
//         phone = ${userUpdated.phone},
//         birthday = ${userUpdated.birthday},
//         department = ${userUpdated.department},
//         program = ${userUpdated.program},
//         username = ${userUpdated.username}
//         WHERE userid = ${user.userid}
//         `;
//       }

//         if (updateUser.rowCount ==1){
//           res.status(201)
//           .json({message : "User updated sucessful"})

//   }else{
//       res.status(404)
//       .json({message : "Cannot update user. Try again later"})
//       }
//   } catch (error) {
//       console.error(error)
//       res.status(500).json({message: 'Cannot update user. '});
//   }
// }

// export async function logout (req, res) {
//   return res.clearCookie('token').status(200).json({ message: 'Logged out successfully' });
// };
