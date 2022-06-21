import {BaseToolService} from '@snowl/base-app/user';
import {Injectable} from '@angular/core';
import {copyTextToClipboardWEBONLY} from '@snowl/base-app/util';

@Injectable()
export class ToolService extends BaseToolService {
  copyToClipboard(string: string): boolean {
    return copyTextToClipboardWEBONLY(string);
  }

}
