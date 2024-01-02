import { CreateReferenceFaceRequestModel } from "./create-reference-face-request.model";

export class ProbeFaceRequest extends CreateReferenceFaceRequestModel {
    public referenceFaceId: string;
}