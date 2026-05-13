import { Router } from 'express';
import { OfficeController } from './office.controller';
import { requireAuth } from '../../middlewares/auth.middleware';

const router = Router();
const officeController = new OfficeController();

router.use(requireAuth)

router.get('/', officeController.getOffices);
router.post('/', officeController.createOffice);
router.put('/:id', officeController.updateOffice);
router.delete('/:id',officeController.deleteOffice);

export default router;