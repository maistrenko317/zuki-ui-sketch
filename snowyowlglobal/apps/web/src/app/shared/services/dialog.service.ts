import {

  BaseDialogOptions,
  BaseDialogService, DialogContent, FormattedDialogOptions
} from '@snowl/base-app/shared';
import {VxDialogDataType, VxDialog, VxDialogDef, VxDialogRef, VxDialogCloseDataType} from 'vx-components';
import {Injectable, Type} from '@angular/core';
import {LoadingComponent} from '../loading/loading.component';
import {DialogComponentResponse} from '@snowl/base-app/shared/services/base-dialog.service';
import {FormattedDialogComponent} from '../formatted-dialog/formatted-dialog.component';
import {Constructor} from '@snowl/base-app/util';

@Injectable()
export class DialogService extends BaseDialogService {
  openLoadingIndicator?: string;

  private loadingIndicator?: VxDialogRef;

  constructor(private dialog: VxDialog) {
    super();
  }

  open<T extends string = string>(options: BaseDialogOptions): DialogComponentResponse<T> {
    let t: FormattedDialogOptions;
    if ('message' in options) {
      t = {
        title: options.title,
        content: [new DialogContent('text', {text: options.message})],
        buttons: options.buttons
      }
    } else {
      t = options;
    }
    return this.dialog.open(FormattedDialogComponent, t) as VxDialogRef<FormattedDialogComponent, FormattedDialogOptions, T>;
  }

  showLoadingIndicator(message = 'Loading...'): void {
    if (this.loadingIndicator) {
      this.closeLoadingIndicator();
    }

    this.openLoadingIndicator = message;
    this.loadingIndicator = this.dialog.open(LoadingComponent, message);
  }

  closeLoadingIndicator(): Promise<void> {
    if (this.loadingIndicator) {
      this.loadingIndicator.close();
      this.loadingIndicator = undefined;
    }
    this.openLoadingIndicator = undefined;
    return Promise.resolve();
  }


  openComponent<ComponentType extends VxDialogDef<any, any>,
    DataType extends VxDialogDataType<ComponentType>>(
      component: Type<ComponentType>,
      ...data: DataType extends undefined ? [undefined?] : [DataType]): DialogComponentResponse<VxDialogCloseDataType<ComponentType>> {
    return this.dialog.open(component, ...data);
  }

}
