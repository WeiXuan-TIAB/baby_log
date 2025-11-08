import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BabyStateService } from '../../core/baby-state.service';

@Component({
  selector: 'app-diaper-form',
  standalone: true,
  imports: [FormsModule],
  template: `
    <section class="space-y-4 flex flex-col items-center">
    <h1 class="text-xl font-semibold mb-4">尿布記錄</h1>
    <form class="space-y-3 max-w-md w-full" (ngSubmit)="submit()">
      <div class="flex gap-3">
        <select [(ngModel)]="status" name="status" class="border rounded px-3 py-2 w-full">
          <option value="urine">尿尿</option>
          <option value="stool">便便</option>
          <option value="mixed">綜合</option>
        </select>
        <input [(ngModel)]="time" name="time" type="datetime-local" class="border rounded px-3 py-2" />
      </div>
      <textarea [(ngModel)]="note" name="note" rows="2" class="border rounded px-3 py-2 w-full placeholder-gray-400" placeholder="備註"></textarea>
      <button class="px-3 py-2 rounded bg-black text-white">儲存</button>
    </form>
    </section>
  `,
})
export class DiaperFormComponent {
  status: 'urine' | 'stool' | 'mixed' = 'urine';
  time = new Date().toISOString().slice(0,16);
  note = '';

  constructor(public state: BabyStateService) {}

  async submit() {
    if (!this.state.currentBabyId()) return alert('Please select a baby first.');
    const timeISO = new Date(this.time).toISOString();
    await this.state.addRecord({
      type: 'diaper',
      time: timeISO,
      payload: { status: this.status, note: this.note || '' }
    });
    this.note = '';
  }
}
