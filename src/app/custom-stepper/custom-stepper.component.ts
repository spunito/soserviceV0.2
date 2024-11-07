import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-custom-stepper',
  templateUrl: './custom-stepper.component.html',
  styleUrls: ['./custom-stepper.component.scss'],
})
export class CustomStepperComponent {
  @Input() currentStep: number = 0;
  @Input() previousStep!: () => void;
  @Input() nextStep!: () => void;
  @Input() isLastStep!: () => boolean;
}
