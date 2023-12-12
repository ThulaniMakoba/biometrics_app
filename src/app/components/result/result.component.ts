import { Component, OnChanges, Input } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-result',
  templateUrl: './result.component.html',
  styleUrls: ['./result.component.css'],
})
export class ResultComponent implements OnChanges {
  @Input() imageUrl!: string;

  imageSrc: SafeUrl = '';

  constructor(private domSanitizer: DomSanitizer) { }

  ngOnChanges(): void {
    console.log('imageUrl', this.imageUrl)
    let img = this.domSanitizer.bypassSecurityTrustUrl(this.imageUrl);
    console.log('image', img)
    this.imageSrc = this.domSanitizer.bypassSecurityTrustUrl(this.imageUrl);

    this.blobToBase64(this.imageUrl)
      .then(base64String => {
        console.log(base64String) // i.e: data:image/jpeg;base64,/9j/4AAQSkZJ..
      });
      
  }

  blobToBase64 = (url: string) => {
    debugger
    return new Promise(async (resolve, _) => {
      // do a request to the blob uri
      const response = await fetch(url);

      // response has a method called .blob() to get the blob file
      const blob = await response.blob();

      // instantiate a file reader
      const fileReader = new FileReader();

      // read the file
      fileReader.readAsDataURL(blob);

      fileReader.onloadend = function () {
        resolve(fileReader.result); // Here is the base64 string
      }
    });
  };

}
