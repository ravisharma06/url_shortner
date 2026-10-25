import { body, validationResult } from 'express-validator';

const validateUrl = [
  body('originalUrl')
    .trim()
    .notEmpty()
    .withMessage('Please enter a URL')
    .bail()
    .isLength({ max: 2048 })
    .withMessage('URL is too long')
    .bail()
    .isURL({
      protocols: ['http', 'https'],
      require_protocol: true,
      require_tld: false,
    })
    .withMessage('Please enter a valid URL starting with http:// or https://'),
  (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: errors.array()[0].msg,
      });
    }

    next();
  },
];

export default validateUrl;
