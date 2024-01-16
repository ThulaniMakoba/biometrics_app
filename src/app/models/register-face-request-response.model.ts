import { ErrorMessageModel } from "./error-message.model";

export class RegisterFaceRequestResponse extends ErrorMessageModel {
    public id: string
    public base64Image: string
}