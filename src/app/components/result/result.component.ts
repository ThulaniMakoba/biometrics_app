import { Component, OnChanges, Input } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { blobToBase64 } from 'src/app/utils/helpers';

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
    let img = this.domSanitizer.bypassSecurityTrustUrl(this.imageUrl);
    this.imageSrc = this.domSanitizer.bypassSecurityTrustUrl(this.imageUrl);
  }

 
}
