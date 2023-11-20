import { Schema } from 'express-validator';
import { notNull, mustBeType } from '../utils/validate';

const userSchema: Schema = {
    account: {
        in: ["params", "body"],
        notEmpty: notNull('account'),
        isString: mustBeType('account', 'string')
    },
    password: {
        in: ["params", "body"],
        notEmpty: notNull('password'),
        isString: mustBeType('password', 'string')
    },
    countryCode: {
        in: ["params", "body"],
        notEmpty: notNull('countryCode'),
        isString: mustBeType('countryCode', 'string')
    }
}

export default userSchema;