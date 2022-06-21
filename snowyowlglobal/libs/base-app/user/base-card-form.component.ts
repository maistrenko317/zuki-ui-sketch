import { EventEmitter, Input, Output, ViewChild } from '@angular/core';
import {CardData, Subscriber} from '@snowl/base-app/model';
import { NgForm, NgModel } from '@angular/forms';
import * as validCard from 'card-validator';

export class BaseCardFormComponent {
  @Input() card: CardData;
  @Input() subscriber: Subscriber;

  @ViewChild('form', {static: true}) form: NgForm;
}
