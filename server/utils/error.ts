import _ from 'lodash';

export function toResponse(error: number, msg?: string, data?: any) {
    const errorMsg = _.get(ERROR_MAPPING, error);

    const res = {
        error,
        msg: errorMsg || msg || "Internal Error",
    }

    return data ? Object.assign(res, { data }) : res;
}

const ERROR_MAPPING = {
    0: "success",
    500: "Internal Error"
}