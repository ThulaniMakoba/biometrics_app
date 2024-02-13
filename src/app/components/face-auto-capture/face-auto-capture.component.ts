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
  @Output() onContinueDetection = new EventEmitter<void>();
  

  @Input() isLogin: boolean;
  @Input() showSpinner: boolean;
  @Input() progressMessage: string;

  isButtonDisabled = true;
  isBackButtonDisabled = true;
  showCameraComponent = false;  

  constructor() { }

  ngOnInit(): void {
    
   }  

  onBackClick() {
    this.onBack.emit(Step.SELECT_COMPONENT);
  }
  continueDetection() {
    window.location.reload(); // Refresh the page    
  }
  handleContinue() {
    dispatchControlEvent(
      FaceCustomEvent.CONTROL,
      ControlEventInstruction.CONTINUE_DETECTION
    );
    this.continueDetection();
    
    this.isButtonDisabled = true;
    this.isBackButtonDisabled = true;
    this.showCameraComponent = true; // Show the camera component
    this.onContinueDetection.emit(); 
  }

  handlePhotoTaken({ imageData, content }: OnPhotoTakenEventValue<FaceComponentData>) {
    this.onPhotoTaken.emit({ imageData, content });
    this.isButtonDisabled = false;
    this.isBackButtonDisabled = true;   
  }

  handleError(error: Error) {
    this.isButtonDisabled = false;    
    this.onError.emit(error);    
  }
}
