import { ImageModel } from "./image.model"

export class PassiveLivenessSelfieRequestModel {
    assertion: string = 'NONE'; //this should be an enum
    image: ImageModel = new ImageModel();
}