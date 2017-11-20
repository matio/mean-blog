import { Component } from '@angular/core';
import { OnInit } from '@angular/core/src/metadata/lifecycle_hooks';

@Component({
  selector: 'app-error-403',
  templateUrl: './error.component.html',
  styleUrls: ['./error.component.scss']
})
export class Error403Component implements OnInit {
  public errorCode: string;
  public errorMessage: string;

  constructor() {

  }

  ngOnInit(): void {
    this.errorCode = '403';
    this.errorMessage = '権限エラーです';
  }
}
