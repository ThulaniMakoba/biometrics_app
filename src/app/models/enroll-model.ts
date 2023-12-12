export class EnrollModel {
    public data: DataModel
    public image: ImageModel
}

export class DataModel {
    public detection: DetectionModel;
    public imageResolution: ImageResolutionModel;
}

export class DetectionModel {
    public confidence: number;
    public topLeft: XYAxisModel;
    public bottomRight: XYAxisModel;
    public faceCenter: XYAxisModel;
    public faceSize: number;
    public brightness: number;
    public sharpness: number;
}

export class XYAxisModel {
    public x: number;
    public y: number;
}

export class ImageResolutionModel {
    public width: number;
    public height: number;
}

export class ImageModel {
    public size: number;
    public type: string;
}

export class EnrolRequestModel {
    public data: EnrollModel;
    public content: Uint8Array;
}