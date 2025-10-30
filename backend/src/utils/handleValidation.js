import { validationResult } from 'express-validator'

export const handleValidation = async (req, res, next) => {
    const result = validationResult(req)
    if (result.errors.length > 0) {
        return res.status(422).send(result)
    } else {
        next()
    }
}
