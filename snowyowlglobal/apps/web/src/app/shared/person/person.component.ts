import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import { BasePersonComponent } from '@snowl/base-app/shared';
import { environment } from '@snowl/environments/environment';

const PLAYER_BOT = /^playerbot_.+$/g;
const isPlayerBot = (name: string) => PLAYER_BOT.test(name);
const camalize = (str: string) => str
  .replace(/\s(.)/g, ($1: string) =>  $1.toUpperCase() )
  .replace(/\s/g, '')
  .replace(/^(.)/, ($1: string) => $1.toUpperCase());

const nicePlayerBotName = (botName: string) => {
  const parts = botName.split('_');
  return camalize(parts[0]).replace("bot", " Bot") + ' ' + parts[1];
};
  

@Component({
  selector: 'sh-person',
  templateUrl: './person.component.html',
  styleUrls: ['./person.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PersonComponent extends BasePersonComponent {
  photoUrl() {
    const person = this!.person;
    const personPhotoUrl = person ? person.photoUrl : undefined;;

    if(personPhotoUrl && personPhotoUrl.endsWith("Robot_icon.svg/600px-Robot_icon.svg.png")) {
      return environment.botIconUrl;
    }

    return personPhotoUrl;
  }

  personName() {
    const person = this.person;
    const defaultText = this.defaultText;
    const nickname = person ? person.nickname : null;
    const name = nickname || defaultText;

    if(isPlayerBot(name)) {
      return nicePlayerBotName(name);
    }

    return name;
  }

 }
