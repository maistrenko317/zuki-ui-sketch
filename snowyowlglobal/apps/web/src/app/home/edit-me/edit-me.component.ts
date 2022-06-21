import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

@Component({
  selector: 'sh-edit-me',
  templateUrl: './edit-me.component.html',
  styleUrls: ['./edit-me.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EditMeComponent implements OnInit {
  constructor() {}

  ngOnInit() {}
}
