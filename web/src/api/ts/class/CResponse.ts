interface IResponse<T> {
    error: number;
    msg?: string;
    data?: T;
}

export default IResponse;
