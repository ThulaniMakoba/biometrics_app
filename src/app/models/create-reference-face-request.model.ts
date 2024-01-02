import { ImageModel } from "./image.model";

export class CreateReferenceFaceRequestModel {
    public Image: ImageModel = new ImageModel();
    public Detection: DetectionModel = new DetectionModel();
}

export class DetectionModel {
    public Mode: string;
    public Facesizeratio: FaceSizeRatioModel = new FaceSizeRatioModel();
}

export class FaceSizeRatioModel {
    public Min: number;
    public Max: number;
}