import {Component} from '@angular/core';
import {BaseHomeDetailComponent} from '@snowl/base-app/home';
import {Subject} from 'rxjs';
import {getValue} from '@snowl/base-app/util';

@Component({
  selector: 'sh-home-detail',
  templateUrl: './home-detail.component.html',
  styleUrls: ['./home-detail.component.scss']
})
export class HomeDetailComponent extends BaseHomeDetailComponent {
}
