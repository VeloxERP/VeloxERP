export class ResponseBody {
    status: number;
    message?: string;
    body?: any;

    constructor(status: number, message: string = "", body: any = {}) {
        this.status = status;
        this.message = message;
        this.body = body;
    }
}

export default ResponseBody;