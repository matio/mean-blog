import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import {
  ReactiveFormsModule,
  FormsModule,
  FormGroup,
  FormGroupDirective,
  FormControl,
  NgForm,
  Validators,
  FormBuilder,
} from '@angular/forms';
import { MatSnackBar } from '@angular/material';

import { AuthenticationService } from '../../shared/services/authentication.service';
import { MessageService } from '../../shared/services/message.service';
import { MessageBarService } from '../../shared/services/message-bar.service';

import { CommentModel } from '../shared/comment.model';
import { ArticleService } from '../shared/article.service';
import { CommentService } from '../shared/comment.service';

@Component({
  selector: 'app-comment-form',
  templateUrl: './comment-form.component.html',
  styleUrls: ['./comment-form.component.scss']
})
export class CommentFormComponent implements OnInit {
  @Input() isAuthfocuse: boolean;
  @Input() commentModel: CommentModel;
  @Input() hasCancelBtn: boolean;
  @Output() complete = new EventEmitter();
  @Output() cancel = new EventEmitter();
  message: String;
  form: FormGroup;
  action: string;
  isRegister: boolean;

  constructor(
    private fb: FormBuilder,
    public snackBar: MatSnackBar,

    public messageService: MessageService,
    private messageBarService: MessageBarService,
    private commentService: CommentService,
    private articleService: ArticleService,
    public auth: AuthenticationService,
  ) {
  }

  ngOnInit() {
    this.createForm();
    this.isRegister = !this.commentModel.created;
    this.action = this.commentModel.created ? '更新' : '追加';
  }


  createForm() {
    this.form = this.fb.group({
      text: ['', [
        // Validators.required,
        // Validators.maxLength(400),
      ]],
    });

    this.form.patchValue({
      text: this.commentModel.text
    });
  }

  get text(): FormControl { return this.form.get('text') as FormControl; }

  hasError(validationName: string, control: FormControl): Boolean {
    return control.hasError(validationName) && control.dirty;
  }

  errorStateMatcher(control: FormControl, form: FormGroupDirective | NgForm): boolean {
    return !!(control.invalid && (control.dirty));
  }

  onSubmit(form: FormGroup, parentId: string = null) {
    if (!form.valid ) {
      return false;
    }

    this.commentModel.text = form.value['text'];

    if (this.isRegister) {
      this.commentService
        .register(this.commentModel)
        .subscribe(res => {
          this.snackBar.open('コメントを追加しました。', null, {duration: 3000});
          this.complete.emit();
          this.form.reset();
        }, this.onValidationError.bind(this));
    } else {
      this.commentService
        .update(this.commentModel)
        .subscribe(res => {
          this.snackBar.open('コメントを更新しました。', null, {duration: 3000});
          this.complete.emit();
          this.form.reset();
        }, this.onValidationError.bind(this));
      }
  }

  // TODO 共通化できるか検討
  private onValidationError(error: any): void {
    const noControlErrors = [];

    for (const e of error['errors']) {
      const control: FormControl | FormGroup = this[e.param];
      if (!control) {
        // 該当するfromがないものはスナックバーで表示
        noControlErrors.push(e);
        continue;
      }

      const messages = control.getError('remote');
      if (messages) {
        messages.push(e.msg);
      } else {
        control.setErrors({remote: [e.msg]});
      }
    }

    if (noControlErrors.length > 0) {
      this.messageBarService.showValidationError({errors: noControlErrors});
    }
  }

  onCancel(): void {
    this.cancel.emit();
  }
}
