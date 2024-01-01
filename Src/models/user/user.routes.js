import Router from 'express'
import * as userControllers from './user.controllers.js'

const router = Router()

router.get('/users', userControllers.getUsers)
router.get(
  '/filterUsersStartWithAandAgeLessThan30',
  userControllers.filterUsersStartWithAandAgeLessThan30
)
router.get('/filterUsersWithIDs', userControllers.filterUsersWithIDs)
router.get('/usersWithTheirProducts', userControllers.getUsersWithTheirProducts)
router.post('/createUser', userControllers.createUser)
router
  .route('/user/:id')
  .put(userControllers.updateUser)
  .delete(userControllers.deleteUser)
export default router
