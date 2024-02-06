import { CreateReferenceFaceRequestModel } from "./create-reference-face-request.model";

export class ProbeFaceRequest extends CreateReferenceFaceRequestModel {
    public idNumber?: string;
    public eDNAId?: number;
    public email?: string;
}