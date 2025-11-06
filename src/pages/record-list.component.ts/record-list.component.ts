import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BabyStateService } from '../../core/baby-state.service';

@Component({
  selector: 'app-record-list',
  standalone: true,
  imports: [CommonModule],
  template: `
    <h1 class="text-xl font-semibold mb-4">今日紀錄</h1>

    @if (state.loading()) {
      <div class="text-sm text-gray-500">Loading...</div>
    }
    @if (state.error()) {
      <div class="text-sm text-red-600">{{ state.error() }}</div>
    }

    @if (state.todayRecords().length > 0) {
      <div class="space-y-3">
        @for (r of state.todayRecords(); track r.id) {
          <div class="border rounded p-3">
            <div class="text-xs text-gray-500">{{ r.time }}</div>
            <div class="font-medium">{{ r.type | uppercase }}</div>
            <pre class="text-xs bg-gray-50 p-2 rounded overflow-auto">{{ r.payload | json }}</pre>
          </div>
        }
      </div>
    } @else {
      <p class="text-gray-500">今日沒有任何記錄</p>
    }
  `,
})

export class RecordListComponent {
  constructor(public state: BabyStateService) {}
}
