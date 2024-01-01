import connection from '../../../DB/connection.js'

// 🔴🔴 Another Solution for getting users
// export const getUsers = (req, res, next) => {
//   const { nameStartsWith, ageLessThan, ids } = req.query
//   if (nameStartsWith && ageLessThan) {
//     connection.execute(
//       `SELECT * FROM tbl_users WHERE name LIKE '${
//         nameStartsWith + '%'
//       }' AND age < ${Number(ageLessThan)}`,
//       function (err, result) {
//         if (err) {
//           return res.json({
//             message: 'Invalid Query',
//             err,
//           })
//         }
//         return result.length
//           ? res.json({
//               message: 'Users',
//               result,
//             })
//           : res.json({
//               message: 'No Users Found',
//             })
//       }
//     )
//   } else if (ids && ids.length >= 0) {
//     ids.length != 0
//       ? connection.execute(
//           `SELECT * FROM tbl_users WHERE user_id IN (${ids})`,
//           function (err, result) {
//             if (err) {
//               return res.json({
//                 message: 'Invalid Query',
//                 err,
//               })
//             }
//             return result.length
//               ? res.json({
//                   message: 'Users',
//                   result,
//                 })
//               : res.json({
//                   message: 'No Users Found',
//                 })
//           }
//         )
//       : res.json({
//           message: 'id should not be empty',
//         })
//   } else {
//     connection.execute(`SELECT * FROM tbl_users`, (err, result) => {
//       if (err) {
//         return res.json({
//           message: 'Invalid Query',
//           err,
//         })
//       }
//       return result.length
//         ? res.json({
//             message: 'Users',
//             result,
//           })
//         : res.json({
//             message: 'No Users Found',
//           })
//     })
//   }
// }
export const getUsers = (req, res, next) => {
  connection.execute(`SELECT * FROM tbl_users`, (err, result) => {
    if (err) {
      return res.json({
        message: 'Invalid Query',
        err,
      })
    }
    return result.length
      ? res.json({
          message: 'Users',
          result,
        })
      : res.json({
          message: 'No Users Found',
        })
  })
}
export const filterUsersStartWithAandAgeLessThan30 = (req, res, next) => {
  const { nameStartsWith, ageLessThan } = req.query
  if (nameStartsWith && ageLessThan) {
    connection.execute(
      `SELECT * FROM tbl_users WHERE name LIKE '${
        nameStartsWith + '%'
      }' AND age < ${Number(ageLessThan)}`,
      function (err, result) {
        if (err) {
          return res.json({
            message: 'Invalid Query',
            err,
          })
        }
        return result.length
          ? res.json({
              message: 'Users',
              result,
            })
          : res.json({
              message: 'No Users Found',
            })
      }
    )
  } else {
    return res.json({
      message: 'Please send the characters and age throw query params',
    })
  }
}
export const filterUsersWithIDs = (req, res, next) => {
  const { ids } = req.query
  if (ids && ids.length >= 0) {
    ids.length != 0
      ? connection.execute(
          `SELECT * FROM tbl_users WHERE user_id IN (${ids})`,
          function (err, result) {
            if (err) {
              return res.json({
                message: 'Invalid Query',
                err,
              })
            }
            return result.length
              ? res.json({
                  message: 'Users',
                  result,
                })
              : res.json({
                  message: 'No Users Found',
                })
          }
        )
      : res.json({
          message: 'id should not be empty',
        })
  } else {
    return res.json({ message: 'Please send ids throw query params' })
  }
}
export const getUsersWithTheirProducts = (req, res, next) => {
  connection.execute(
    `SELECT * FROM tbl_users INNER JOIN tbl_products on tbl_users.user_id = tbl_products.user_id`,
    (err, result) => {
      if (err) {
        return res.json({
          message: 'Invalid Query',
          err,
        })
      }
      return result.length
        ? res.json({
            message: 'Products of users',
            result,
          })
        : res.json({
            message: 'No products have been Found for current users',
          })
    }
  )
}
export const createUser = (req, res, next) => {
  const { name, age, email, password } = req.body
  connection.execute(
    `SELECT * FROM tbl_users where email ='${email}'`,
    function (err, result) {
      if (err) {
        return res.json({
          message: 'Invalid Query',
          err,
        })
      }
      if (result.length) {
        return res.json({
          message: 'User is already existed',
          result,
        })
      } else {
        connection.execute(
          `INSERT INTO tbl_users (name,age,email,password) VALUES ('${name}',${age},'${email}','${password}')`,
          function (err, result) {
            if (err) {
              return res.json({
                message: 'Invalid Query',
                err,
              })
            }
            if (!result.affectedRows) {
              return res.json({
                message: 'Invalid Query',
                status: 400,
              })
            }
            res.json({
              message: 'User has been added',
              result,
            })
          }
        )
      }
    }
  )
}
export const updateUser = (req, res, next) => {
  const { id } = req.params
  const { name, age, email, password } = req.body
  if (!name || !age || !email || !password)
    return res.json({
      message: 'name or age or email or password should not be empty',
    })
  connection.execute(
    `SELECT * FROM tbl_users where user_id =${id}`,
    function (err, result) {
      if (err) {
        return res.json({
          message: 'Invalid Query',
          err,
        })
      }
      if (!result.length) {
        return res.json({
          message: "User isn't existed",
          result,
        })
      } else {
        connection.execute(
          `UPDATE tbl_users SET name='${name}',age=${age},email='${email}',password='${password}' WHERE user_id=${id}`,
          function (err, result) {
            if (err) {
              return res.json({ message: 'Invalid Query', err })
            }
            if (!result.affectedRows) {
              // for Edge Cases
              return res.json({
                message: 'Invalid Query',
                status: 400,
              })
            }
            res.json({
              message: 'User has been updated',
              result,
            })
          }
        )
      }
    }
  )
}
export const deleteUser = (req, res, next) => {
  const { id } = req.params
  connection.execute(
    `SELECT * FROM tbl_users where user_id =${id}`,
    function (err, result) {
      if (err) {
        return res.json({
          message: 'Invalid Query',
          err,
        })
      }
      if (!result.length) {
        return res.json({
          message: "User isn't existed",
          result,
        })
      } else {
        connection.execute(
          `DELETE FROM tbl_users WHERE user_id=${id}`,
          function (err, result) {
            if (err) {
              return res.json({ message: 'Invalid Query', err })
            }
            if (!result.affectedRows) {
              // for Edge Cases
              return res.json({
                message: 'Invalid Query',
                status: 400,
              })
            }
            res.json({
              message: 'User has been deleted',
              result,
            })
          }
        )
      }
    }
  )
}
