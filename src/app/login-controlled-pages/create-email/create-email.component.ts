import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-create-email',
  templateUrl: './create-email.component.html',
  styleUrls: ['./create-email.component.css']
})
export class CreateEmailComponent implements OnInit {

  attachments: File[] = [];

  constructor() {
  }

  ngOnInit() {

  }

  removeAttachment(i: number) {
    console.log('lasd');
    this.attachments.splice(i, 1);
  }

  onAttachmentSelected(value) {
    const attachment = (<any>value.srcElement).files[0];
    this.attachments.push(attachment);
  }
}
