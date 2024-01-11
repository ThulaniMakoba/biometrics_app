import { ErrorMessageModel } from "./error-message.model";

export class CreateReferenceFaceWithoutBackgroundResponse extends ErrorMessageModel {
    public base64Image: string;
    public id: string;
}