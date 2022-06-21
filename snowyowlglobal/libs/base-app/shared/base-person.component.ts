import {ChangeDetectorRef, Injectable, Input, OnInit} from '@angular/core';
import { PublicProfile } from '@snowl/base-app/model';
import {IconName} from '@fortawesome/fontawesome-svg-core';
import {randomInt} from '@snowl/base-app/util';

const WEAPON_ANIMATION_TIME = 800;
@Injectable()
export class BasePersonComponent implements OnInit {
  @Input() person: PublicProfile;
  @Input() img?: string;
  @Input() defaultText = 'Loading...';
  @Input() didWin = false;
  @Input() unknown = false;
  @Input() align: 'left' | 'right' | 'center' = 'center';
  @Input() numLives?: number;
  @Input() totalLives?: number;

  private weaponIcons: Dict<IconName, number> = {};
  private weapons: IconName[] = ['hammer-war', 'dagger', 'axe-battle', 'mace',
    'sickle', 'sword', 'scythe'];

  animatingHeartNum = -1;
  finishedAnimatingHearts = new Set<number>();
  private lastAnimatedHeartNum = -1;
  constructor(private cdr: ChangeDetectorRef) {

  }

  animate = true;
  @Input() set animationDelay(delay: number) {
    this.animate = false;

    setTimeout(() => {
      this.animate = true;
      this.cdr.markForCheck();
    }, delay);
  };

  // returns never to ensure super must be called
  ngOnInit(): never {
    if (this.numLives !== undefined && this.numLives < 0) {
      this.numLives = 0;
    }

    this.lastAnimatedHeartNum = this.totalLives === undefined || this.numLives === undefined ? -1 : this.numLives + 1;
    return null as never;
  }

  getWeaponIcon(heartNum: number): IconName {
    let icon = this.weaponIcons[heartNum];
    if (!icon) {
      this.weaponIcons[heartNum] = icon = this.weapons[randomInt(0, this.weapons.length - 1)];
    }
    return icon;
  }

  showBrokenHeart(heartNum: number): boolean {
    if (this.numLives === undefined || this.totalLives === undefined) return false;
    if (heartNum <= this.numLives) return false;
    if (heartNum === this.animatingHeartNum) return false;

    if (this.lastAnimatedHeartNum === -1 || heartNum < this.lastAnimatedHeartNum) {
      this.animatingHeartNum = heartNum;

      setTimeout(() => {
        this.lastAnimatedHeartNum = heartNum;
        this.finishedAnimatingHearts.add(heartNum);
        this.animatingHeartNum = -1;
        this.cdr.markForCheck();
      }, WEAPON_ANIMATION_TIME);

      return false;
    } else {
      return true;
    }
  }
}
