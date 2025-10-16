import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatProgressBarModule } from '@angular/material/progress-bar';

import { LoadingService } from '../../../features/service/loading/loading.service';

@Component({
  selector: 'app-loading',
  imports: [MatProgressBarModule, CommonModule],
  templateUrl: './loading.component.html',
  styleUrl: './loading.component.scss'
})
export class LoadingComponent {
  loading = false;

  constructor(private loadingService: LoadingService) {
    this.loadingService.loadingStatus.subscribe((value) => {
      this.loading = value;
    });
  }
}
