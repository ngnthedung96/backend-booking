import express from 'express'; // create new router
import Ctrl from './controller.mjs';

const router = express.Router();

router.get('/', Ctrl.getList);
router.get('/:id', Ctrl.getPermissionsById);
router.post('/', Ctrl.create);
router.post('/search/:data', Ctrl.search);
router.put('/:id', Ctrl.update);
router.delete('/:id', Ctrl.delete);

export default router;
