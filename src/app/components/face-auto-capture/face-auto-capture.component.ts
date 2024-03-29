import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { OnPhotoTakenEventValue, Step } from 'src/app/types';
import {
  dispatchControlEvent,
  FaceCustomEvent,
  ControlEventInstruction,
} from '@innovatrics/dot-face-auto-capture/events';
import { FaceComponentData } from '@innovatrics/dot-face-auto-capture/';

@Component({
  selector: 'app-face-auto-capture',
  templateUrl: './face-auto-capture.component.html',
  //styleUrls: ['./face-auto-capture.component.css']
  
  
})
export class FaceAutoCaptureComponent implements OnInit {
  @Output() onPhotoTaken = new EventEmitter<OnPhotoTakenEventValue<FaceComponentData>>();
  @Output() onError = new EventEmitter<Error>();
  @Output() onBack = new EventEmitter<Step>();
  @Input() isLogin: boolean;
  @Input() progressMessage: string;

  isButtonDisabled = true;
  isBackButtonDisabled = true;  

  constructor() { }

  ngOnInit(): void { }

  onBackClick() {
    this.onBack.emit(Step.SELECT_COMPONENT);
  }

  handleContinue() {
    dispatchControlEvent(
      FaceCustomEvent.CONTROL,
      ControlEventInstruction.CONTINUE_DETECTION
    );
    this.isButtonDisabled = true;
    this.isBackButtonDisabled = true;
  }

  handlePhotoTaken({ imageData, content }: OnPhotoTakenEventValue<FaceComponentData>) {
    this.onPhotoTaken.emit({ imageData, content });
    this.isButtonDisabled = false;
    this.isBackButtonDisabled = true;
  }

  handleError(error: Error) {
    this.onError.emit(error);
  }
}
