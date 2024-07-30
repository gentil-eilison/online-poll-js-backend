export default class HttpResponse {
    #statusCode: number;
    #data: object;

    constructor(statusCode: number, data: object) {
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