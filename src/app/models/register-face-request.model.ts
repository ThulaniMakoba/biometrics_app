import { DetectionModel } from "./create-reference-face-request.model";
import { ErrorMessageModel } from "./error-message.model";
import { ImageModel } from "./image.model";

export class RegisterFaceRequest {
    public customerId: string;
    public image: ImageModel;
    public detection: DetectionModel;
    public userId: number;
    public computerSerialNumber: string;
}