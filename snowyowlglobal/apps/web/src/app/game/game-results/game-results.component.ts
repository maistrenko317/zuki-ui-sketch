import {AfterViewInit, Component, ElementRef, NgZone, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Firework, FireworkVars} from "./fireworks/firework";
import {randomFloat} from "@snowl/base-app/util";
import {Game} from "@snowl/base-app/model";
import {VxDialogDef, VxDialogRef} from 'vx-components';

// Alpha level that canvas cleanup iteration removes existing trails.
// Lower value increases trail duration.
const CANVAS_CLEANUP_ALPHA = 0.15;
// Hue change per loop, used to rotate through different firework colors.
const HUE_STEP_INCREASE = 0.5;

// Minimum number of ticks between each firework launch.
const TICKS_PER_FIREWORKMIN = 20;
// Maximum number of ticks between each firework launch.
const TICKS_PER_FIREWORK_MAX = 80;

let ticksSinceFirework = 0;
const CANVAS_BUTTONS_SIZE = 54;

@Component({
  selector: 'sh-game-results',
  templateUrl: './game-results.component.html',
  styleUrls: ['./game-results.component.scss']
})
export class GameResultsComponent extends VxDialogDef<Game> implements OnDestroy, AfterViewInit {
  game?: Game;
  vars: FireworkVars;
  looping = true;
  @ViewChild('canvas', {static: false}) canvas: ElementRef;

  constructor(private zone: NgZone, public dialog: VxDialogRef<GameResultsComponent>) {
    super();
    dialog.onCancel.subscribe(() => dialog.close());
    this.game = dialog.data;
  }

  ngAfterViewInit(): void {
    this.vars = {
      canvas: this.canvas.nativeElement,
      context: this.canvas.nativeElement.getContext('2d'),
      fireworks: [],
      particles: [],
      hue: 120
    };
    this.vars.canvas.width = this.vars.canvas.offsetWidth;
    this.vars.canvas.height = this.vars.canvas.offsetHeight - CANVAS_BUTTONS_SIZE;
    ticksSinceFirework = 0;
    this.zone.runOutsideAngular(() => this.loop());
  }

  ngOnDestroy(): void {
    this.looping = false;
  }

  // Primary loop.
  loop(): void {
    // Smoothly request animation frame for each loop iteration.
    if (this.looping)
      requestAnimationFrame(() => this.loop());

    // Adjusts coloration of fireworks over time.
    this.vars.hue += HUE_STEP_INCREASE;

    // Clean the canvas.
    this.cleanCanvas();

    // Update fireworks.
    this.updateFireworks();

    // Update particles.
    this.updateParticles();

    // Launch fireworks.
    this.launchFirework();

  }

  cleanCanvas(): void {
    // Set 'destination-out' composite mode, so additional fill doesn't remove non-overlapping content.
    this.vars.context.globalCompositeOperation = 'destination-out';
    // Set alpha level of content to remove.
    // Lower value means trails remain on screen longer.
    this.vars.context.fillStyle = `rgba(0, 0, 0, ${CANVAS_CLEANUP_ALPHA})`;
    // Fill entire canvas.
    this.vars.context.fillRect(0, 0, this.vars.canvas.width, this.vars.canvas.height);
    // Reset composite mode to 'lighter', so overlapping particles brighten each other.
    this.vars.context.globalCompositeOperation = 'lighter';
  }

  // Launch firework.
  launchFirework(): void {
    // Determine if ticks since last launch is greater than random min/max values.
    if (
      ticksSinceFirework >= randomFloat(TICKS_PER_FIREWORKMIN, TICKS_PER_FIREWORK_MAX)) {
      // Set start position to bottom center.
      const startX = this.vars.canvas.width / 2;
      const startY = this.vars.canvas.height;
      // Set end position to random position, somewhere in the top half of screen.
      const endX = randomFloat(0, this.vars.canvas.width);
      const endY = randomFloat(0, this.vars.canvas.height / 2);
      // Create new firework and add to collection.
      this.vars.fireworks.push(new Firework(startX, startY, endX, endY, this.vars));
      // Reset tick counter.

      ticksSinceFirework = 0;
    } else {
      // Increment counter.

      ticksSinceFirework++;
    }
  }

  // Update all active fireworks.
  updateFireworks(): void {
    // Loop backwards through all fireworks, drawing and updating each.
    for (let i = this.vars.fireworks.length - 1; i >= 0; --i) {
      this.vars.fireworks[i].draw();
      this.vars.fireworks[i].update(i);
    }
  }

  // Update all active particles.
  updateParticles(): void {
    // Loop backwards through all particles, drawing and updating each.
    for (let i = this.vars.particles.length - 1; i >= 0; --i) {
      this.vars.particles[i].draw();
      this.vars.particles[i].update(i);
    }
  }

}
