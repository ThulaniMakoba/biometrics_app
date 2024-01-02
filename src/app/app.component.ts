import { Component, ElementRef, ViewChild } from '@angular/core';
import { OnPhotoTakenEventValue, Step } from './types';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
})
export class AppComponent {
  step: typeof Step = Step;
  currentStep: Step = Step.SELECT_COMPONENT;
  imageUrl = '';
  showInnovatrics: boolean = false;

  constructor() { }

  @ViewChild('capturedCanvas') capturedCanvas!: ElementRef<HTMLCanvasElement>;

  handleStepChange(step: Step) {
    this.currentStep = step;
    this.imageUrl = '';
  }

  handlePhotoTaken<T>({ imageData, content }: OnPhotoTakenEventValue<T>) {
    this.imageUrl = URL.createObjectURL(imageData.image);
    this.processImage();
  }


  processImage(): void {
    if (this.capturedCanvas) {
      const canvas = this.capturedCanvas.nativeElement;
      const context = canvas.getContext('2d');

      if (context) {
        this.blobToBase64(this.imageUrl)
          .then((base64String: string) => {
            const image = new Image();
            image.src = base64String;

            image.onload = () => {
              const canvasSize = Math.min(image.width, image.height);
              canvas.width = canvasSize;
              canvas.height = canvasSize;

              // Create a circular mask
              context.beginPath();
              context.arc(canvasSize / 2, canvasSize / 2, canvasSize / 2, 0, 2 * Math.PI);
              context.closePath();
              context.clip();

              // Draw the image with the circular mask
              context.drawImage(image, 0, 0, canvasSize, canvasSize);

              // Convert the canvas content to a data URL
              const capturedImage = canvas.toDataURL('image/png');

              // Log or use the captured image data URL as needed
              console.log('processImage', capturedImage);
            };
          });
      } else {
        console.error('Canvas context is null.');
      }
    }
  }


  blobToBase64 = (url: string): Promise<string> => {
    return new Promise<string>(async (resolve, _) => {
      // do a request to the blob uri
      const response = await fetch(url);

      // response has a method called .blob() to get the blob file
      const blob = await response.blob();

      // instantiate a file reader
      const fileReader = new FileReader();

      // read the file
      fileReader.readAsDataURL(blob);

      fileReader.onloadend = function () {
        resolve(fileReader.result as string); // Here is the base64 string
      };
    });
  };
  handleError(error: Error) {
    alert(error);
  }
}
