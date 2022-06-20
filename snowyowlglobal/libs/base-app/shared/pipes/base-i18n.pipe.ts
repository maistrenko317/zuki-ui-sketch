import { Pipe, PipeTransform } from '@angular/core';
import { Localized } from '../../model/index';

@Pipe({
  name: 'i18n'
})
export class BaseI18nPipe implements PipeTransform {
  transform(value: Localized, ...args: any[]): string {
    return value ? value.en : '';
  }
}
