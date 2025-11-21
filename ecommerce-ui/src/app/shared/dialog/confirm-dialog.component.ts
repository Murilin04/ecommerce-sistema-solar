import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

export interface ConfirmDialogData {
  title?: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
}

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule, MatIconModule],
  template: `
    <div class="confirm-dialog">
      <div class="header">
        <mat-icon color="warn">warning</mat-icon>
        <h2>{{ data.title || 'Confirmação' }}</h2>
      </div>
      <p class="message">{{ data.message }}</p>
      <div class="actions">
        <button mat-raised-button (click)="onCancel()">{{ data.cancelText || 'Cancelar' }}</button>
        <button mat-raised-button color="warn" (click)="onConfirm()">{{ data.confirmText || 'Excluir' }}</button>
      </div>
    </div>
  `,
  styles: [
    `
      .confirm-dialog { padding: 16px; max-width: 420px; background-color: #fff; }
      .header { display:flex; align-items:center; gap:12px; }
      .header h2 { margin:0; font-size:1.1rem; }
      .message { margin: 16px 0; color: rgba(0,0,0,0.87); }
      .actions { display:flex; justify-content:flex-end; gap:8px;
        button {
                 border-radius: 8px; box-shadow: 0 6px 12px rgba(198,40,40,0.18);
                 background: linear-gradient(90deg, #e64a48 0%, #c62828 100%);
                 color: #ffffff;
                 font-weight: 500;
               }
      }
    `
  ]
})
export class ConfirmDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<ConfirmDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ConfirmDialogData
  ) {}

  onConfirm() {
    this.dialogRef.close(true);
  }

  onCancel() {
    this.dialogRef.close(false);
  }
}
