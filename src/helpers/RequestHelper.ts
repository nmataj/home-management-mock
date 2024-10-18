import * as axios from 'axios';

export interface RequestOptions {
    baseURL: string;
    url: string;
    method: axios.Method;
    headers?: any;
    data?: any;
}

export class RequestHelper {
    static async call(options: RequestOptions): Promise<any> {

        const opts = {
            ...options,
            headers: options.headers ?? {},
            validateStatus: () => true
        };

        if (!opts.headers['content-type']) {
            opts.headers['content-type'] = 'application/json';
        }

        const response = await (<any>axios).request(opts);

        if (response.status !== 200) {
            throw new Error(JSON.stringify(response.data));
        }
        
        return response.data;
    }
}
