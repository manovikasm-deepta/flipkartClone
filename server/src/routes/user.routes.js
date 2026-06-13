const router           = require('express').Router();
const { body }         = require('express-validator');
const { authenticate } = require('../middleware/auth');
const { validate }     = require('../middleware/validate');
const {
  getAddresses, addAddress, updateAddress,
  deleteAddress, updateProfile,
} = require('../controllers/user.controller');

router.use(authenticate);

router.get('/addresses',       getAddresses);
router.post('/addresses',      addressValidation(), validate, addAddress);
router.put('/addresses/:id',   addressValidation(), validate, updateAddress);
router.delete('/addresses/:id', deleteAddress);
router.patch(
  '/profile',
  [
    body('name').trim().notEmpty().withMessage('Name required'),
    body('phone').optional().isMobilePhone('en-IN').withMessage('Valid phone required'),
  ],
  validate,
  updateProfile
);

function addressValidation() {
  return [
    body('name').trim().notEmpty().withMessage('Name required'),
    body('phone').isMobilePhone('en-IN').withMessage('Valid 10-digit phone required'),
    body('line1').trim().notEmpty().withMessage('Address line 1 required'),
    body('city').trim().notEmpty().withMessage('City required'),
    body('state').trim().notEmpty().withMessage('State required'),
    body('pincode').matches(/^\d{6}$/).withMessage('6-digit pincode required'),
    body('type').optional().isIn(['HOME', 'WORK', 'OTHER']).withMessage('type must be HOME, WORK or OTHER'),
  ];
}

module.exports = router;
