import {TemplateRef, Type} from '@angular/core';
import {Observable} from 'rxjs';
import {Constructor} from '@snowl/base-app/util';
import {VxDialogDataType, VxDialogCloseDataType, VxDialogDef} from 'vx-components';

export abstract class BaseDialogService {
  abstract openLoadingIndicator?: string;

  abstract open<T extends string = string>(options: BaseDialogOptions): DialogComponentResponse<T>;

  // abstract openComponent({ component, data }: ComponentDialogOptions): DialogComponentResponse;

  abstract openComponent<ComponentType extends VxDialogDef<any, any>,
    DataType extends VxDialogDataType<ComponentType>>(
      component: Constructor<ComponentType>,
      ...data: DataType extends undefined ? [undefined?] : [DataType]
  ): DialogComponentResponse<VxDialogCloseDataType<ComponentType>>;

  abstract showLoadingIndicator(message: string): void;

  abstract closeLoadingIndicator(): void;
}

export interface FormattedDialogOptions {
  title?: string;
  content: DialogContent[] | Observable<DialogContent[]>;
  buttons: string[];
}

export type BaseDialogOptions = {
  title: string;
  message: string;
  buttons: string[];
} | FormattedDialogOptions;

export interface ComponentDialogOptions {
  component: Type<any>;
  data?: any;
  options?: any;
}

export interface DialogComponentResponse<T> {
  onClose: Observable<T>;

  close(data?: T): void;
}


export type DialogContentType = 'text' | 'spinner' | 'link' | 'button' | 'divider';

export class DialogContent<T extends DialogContentType = 'text'> {
  text?: string;
  link?: string;
  mTop?: number;
  bolded?: boolean;
  // italic?: boolean;
  center: boolean;
  underline?: boolean;
  fontSize?: number;

  accent?: boolean;
  accentGreen?: boolean;
  spans?: DialogContent<'text'>[];

  clickResponse?: any;

  constructor(type: 'spinner', options?: Partial<DialogContent>);
  constructor(type: 'text' | 'link' | 'button' | 'divider', options: Partial<DialogContent>);
  constructor(public type: T, options?: Partial<DialogContent>) {
    if (type === 'spinner') {
      this.center = true;
    }

    if (options)
      Object.assign(this, options);
  }
}
