export const baseUrl = 'localhost:5000';

export interface ResponseProps<T> {
    data: T;
}

export function withLogs<T>(promise: Promise<ResponseProps<T>>, fnName: string): Promise<T> {
    console.log(`${fnName} - started`);

    return promise
        .then(res => {
            console.log(`${fnName} - succeeded`);
            return Promise.resolve(res.data);
        })
        .catch(err => {
            console.log(`${fnName} - failed`);
            console.warn(err.response.data.message);
            return Promise.reject(err);
        });
}

export const config = {
    headers: {
        'Content-Type': 'application/json'
    }
};

export const authConfig = (token?: string) => ({
    headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearear ${token}`
    }
});
