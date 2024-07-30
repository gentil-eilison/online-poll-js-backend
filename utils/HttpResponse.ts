export default class HttpResponse {
    #statusCode: number;
    #data: any;

    constructor(statusCode: number, data: any) {
        this.#statusCode = statusCode;
        this.#data = data;
    }

    getStatusCode() {
        return this.#statusCode;
    }
    
    getData() {
        return this.#data;
    }
}