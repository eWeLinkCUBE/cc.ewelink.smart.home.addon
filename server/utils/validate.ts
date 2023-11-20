import { Request } from 'express';
import { validationResult } from 'express-validator';

export function notNull(variable: string) {
    return {
        errorMessage: `${variable} is not allowed to be null`
    }
}

export function mustBeType(variable: string, type: 'number' | 'string' | 'boolean' | 'symbol' | 'object' | 'array') {
    return {
        errorMessage: `${variable} must be ${type}`
    }
}

export function getErrorMsg(req: Request<any>) {
    const errors = validationResult(req);
    if (errors.isEmpty()) return null;

    const error = errors.array()[0];

    return {
        error: 400,
        msg: error.msg
    }
}
