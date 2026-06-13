const router       = require('express').Router();
const { body }     = require('express-validator');
const { authenticate } = require('../middleware/auth');
const validate     = require('../middleware/validate');
const ctrl         = require('../controllers/addressController');

router.use(authenticate);

router.get('/', ctrl.getAddresses);

router.post(
  '/',
  [
    body('name').trim().notEmpty().withMessage('name is required'),
    body('phone')
      .matches(/^\d{10}$/)
      .withMessage('phone must be 10 digits'),
    body('line1').trim().notEmpty().withMessage('line1 is required'),
    body('city').trim().notEmpty().withMessage('city is required'),
    body('state').trim().notEmpty().withMessage('state is required'),
    body('pincode')
      .matches(/^\d{6}$/)
      .withMessage('pincode must be 6 digits'),
    body('type')
      .optional()
      .isIn(['HOME', 'WORK', 'OTHER'])
      .withMessage('type must be HOME, WORK or OTHER'),
  ],
  validate,
  ctrl.addAddress
);

// PATCH /:id/default MUST come before PATCH /:id to avoid param conflict
router.patch('/:id/default', ctrl.setDefaultAddress);

router.patch(
  '/:id',
  [
    body('name').optional().trim().notEmpty(),
    body('phone').optional().matches(/^\d{10}$/),
    body('pincode').optional().matches(/^\d{6}$/),
    body('type').optional().isIn(['HOME', 'WORK', 'OTHER']),
  ],
  validate,
  ctrl.updateAddress
);

router.delete('/:id', ctrl.deleteAddress);

module.exports = router;
