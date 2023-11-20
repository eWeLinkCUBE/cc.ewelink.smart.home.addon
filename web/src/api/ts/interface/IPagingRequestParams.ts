interface IPagingRequestParams {
    num: number;
    begin_index: number;
    start_time?: number;
    end_time?: number;
    order?: 'DESC' | 'ASC'
}

export default IPagingRequestParams;
