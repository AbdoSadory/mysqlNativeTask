import Router from 'express'
import * as productControllers from './product.controllers.js'

const router = Router()
// 1- add product(product must not found before)
// 2-🟢 delete product (product owner only can do this and product must be found )
// 3-🟢 update product (product owner only)
// 4- get all products
// 5- search for products where price greater than 3000
router.get('/products', productControllers.getProducts)
router.get('/productsgteThan3000', productControllers.getProductsgteThan3000)
router.post('/createProduct', productControllers.createProduct)
router
  .route('/product/:productID/user/:userID')
  .delete(productControllers.deleteProduct)
  .put(productControllers.updateProduct)

export default router
