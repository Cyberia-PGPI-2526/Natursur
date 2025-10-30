import { check } from 'express-validator'

export const loginValidation = [
    check('email').exists().isEmail().isLength({ min: 1, max: 255 }).trim(),
    check('password').isString().isLength({ min: 4, max: 50 }).trim(),
]

export const registerValidation = [
    check('name').isString().isLength({ min: 4, max: 100 }).trim(),
    check('email').exists().isEmail().isLength({ min: 1, max: 255 }).trim(),
    check('password').isString().isLength({ min: 4, max: 50 }).trim(),
]