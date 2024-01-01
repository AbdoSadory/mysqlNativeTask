import connection from '../../../DB/connection.js'

export const createProduct = (req, res, next) => {
  const { pName, pDescription, price, user_id } = req.body
  if (!pName || !pDescription || !price || !user_id) {
    return res.json({
      message: 'pName, pDescription, price and user_id should not be empty',
    })
  }
  connection.execute(
    `SELECT product_id FROM tbl_products WHERE pName='${pName}'`,
    function (err, result) {
      if (err) {
        return res.json({ message: 'Invalid Query' })
      }
      if (result.length) {
        return res.json({ message: 'Product is already existed', result })
      }
      connection.execute(
        `INSERT INTO tbl_products (pName,pDescription,price,createdby) VALUES ('${pName}','${pDescription}',${price},${user_id})`,
        function (err, result) {
          if (err) {
            return res.json({ message: 'Invalid Query' })
          }
          if (!result.affectedRows) {
            return res.json({
              message: 'Invalid Query',
              status: 400,
            })
          }
          res.json({
            message: 'Product has been added',
            result,
          })
        }
      )
    }
  )
}
export const getProducts = (req, res, next) => {
  connection.execute(`SELECT * FROM tbl_products`, function (err, result) {
    if (err) {
      return res.json({ message: 'Invalid Query' })
    }
    return result.length
      ? res.json({
          message: 'products',
          result,
        })
      : res.json({
          message: 'No Products Found',
        })
  })
}
export const deleteProduct = (req, res, next) => {
  const { productID, userID } = req.params
  // 1- check user if existed
  // 2- check product if existed
  connection.execute(
    `SELECT name FROM tbl_users WHERE user_id=${userID}`,
    function (err, result) {
      if (err) {
        return res.json({ message: 'Invalid Query' })
      }
      if (!result.length) {
        return res.json({ message: 'Invalid User ID' }) // in case the user id is wrong
      } else {
        // get products of the user
        connection.execute(
          `SELECT product_id 
            FROM tbl_products LEFT JOIN tbl_users 
            ON tbl_users.user_id = tbl_products.createdby 
            WHERE tbl_users.user_id=${userID}`,
          function (err, result) {
            if (err) {
              return res.json({ message: 'Invalid Query' })
            }
            let productsIDs = result.map((product) => product.product_id) // gather all ids in one array
            let productIsExisted = productsIDs.find(
              (productId) => productID == productId
            ) // check if the product id in params is existed already in db
            // if undefined => Invalid Product ID
            // if existed => Delete it
            if (!productIsExisted) {
              return res.json({ message: 'Invalid Product ID' })
            } else {
              connection.execute(
                `DELETE FROM tbl_products WHERE product_id = ${productID}`,
                function (err, result) {
                  if (err) {
                    return res.json({ message: 'Invalid Query' })
                  }
                  if (!result.affectedRows) {
                    return res.json({
                      message: 'Invalid Query',
                      status: 400,
                    })
                  }
                  res.json({
                    message: 'Product has been deleted successfully',
                    result,
                  })
                }
              )
            }
          }
        )
      }
    }
  )
}
export const updateProduct = (req, res, next) => {
  const { pName, pDescription, price } = req.body
  if (!pName || !pDescription || !price) {
    return res.json({
      message: 'pName, pDescription, price should not be empty',
    })
  }
  const { productID, userID } = req.params
  // 1- check user if existed
  // 2- check product if existed
  connection.execute(
    `SELECT name FROM tbl_users WHERE user_id=${userID}`,
    function (err, result) {
      if (err) {
        return res.json({ message: 'Invalid Query' })
      }
      if (!result.length) {
        // in case the user id is wrong
        return res.json({ message: 'Invalid User ID' })
      } else {
        // get products of the user
        connection.execute(
          `SELECT product_id 
            FROM tbl_products LEFT JOIN tbl_users 
            ON tbl_users.user_id = tbl_products.createdby 
            WHERE tbl_users.user_id=${userID}`,
          function (err, result) {
            if (err) {
              return res.json({ message: 'Invalid Query' })
            }
            let productsIDs = result.map((product) => product.product_id) // gather all ids in one array
            let productIsExisted = productsIDs.find(
              (productId) => productID == productId
            ) // check if the product id in params is existed already in db
            // if undefined => Invalid Product ID
            // if existed => Update it
            if (!productIsExisted) {
              return res.json({ message: 'Invalid Product ID' })
            } else {
              // check first that pname is already existed or not.
              connection.execute(
                `SELECT product_id,pName FROM tbl_products WHERE pName='${pName}'`,
                function (err, result) {
                  if (err) {
                    return res.json({ message: 'Invalid Query' })
                  }
                  if (result.length && result[0].product_id != productID) {
                    return res.json({
                      message: 'Product is already existed',
                      result,
                    })
                  }
                  connection.execute(
                    `UPDATE tbl_products SET pName='${pName}', pDescription='${pDescription}', price=${price} WHERE product_id=${productID}`,
                    function (err, result) {
                      if (err) {
                        return res.json({ message: 'Invalid Query' })
                      }
                      if (!result.affectedRows) {
                        return res.json({
                          message: 'Invalid Query',
                          status: 400,
                        })
                      }
                      res.json({
                        message: 'product has been updated successfully',
                        result,
                      })
                    }
                  )
                }
              )
            }
          }
        )
      }
    }
  )
}
export const getProductsgteThan3000 = (req, res, next) => {
  const { gteThan } = req.query
  if (gteThan) {
    connection.execute(
      `SELECT * from tbl_products WHERE price>${gteThan}`,
      function (err, result) {
        if (err) {
          return res.json({ message: 'Invalid Query' })
        }
        return result.length
          ? res.json({
              message: 'products',
              result,
            })
          : res.json({
              message: `No Products have been found greater than ${gteThan}`,
            })
      }
    )
  } else {
    return res.json({
      message: 'Please send Number of the limit throw query params',
    })
  }
}
