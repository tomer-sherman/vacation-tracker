import { StatusCode } from "./enum";

export class ClientError {

    public readonly status: StatusCode;
    public readonly message: string;

    public constructor(status: StatusCode, message: string) {
        this.status = status;
        this.message = message;
    }

}