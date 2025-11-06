import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BabyStateService } from '../../core/baby-state.service';

@Component({
  selector: 'app-sleep-form',
  standalone: true,
  imports: [FormsModule],
  template: `
    <h1 class="text-xl font-semibold mb-4">睡眠記錄</h1>
    <form class="space-y-3 max-w-md" (ngSubmit)="submit()">
      <div class="flex gap-2">
        <input [(ngModel)]="start" name="start" type="datetime-local" class="border rounded px-3 py-2" />
        <input [(ngModel)]="end" name="end" type="datetime-local" class="border rounded px-3 py-2" />
      </div>
      <button class="px-3 py-2 rounded bg-black text-white">Save</button>
    </form>
  `,
})
export class SleepFormComponent {
  start = new Date().toISOString().slice(0,16);
  end = new Date().toISOString().slice(0,16);

  constructor(public state: BabyStateService) {}

  async submit() {
    if (!this.state.currentBabyId()) return alert('Please select a baby first.');
    const s = new Date(this.start);
    const e = new Date(this.end);
    const durationMin = Math.max(0, Math.round((e.getTime() - s.getTime()) / 60000));
    await this.state.addRecord({
      type: 'sleep',
      time: e.toISOString(),
      payload: { start: s.toISOString(), end: e.toISOString(), durationMin }
    });
  }
}
