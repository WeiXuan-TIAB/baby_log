import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BabyStateService } from '../../core/baby-state.service';

@Component({
  selector: 'app-sleep-form',
  standalone: true,
  imports: [FormsModule],
  template: `
  <section class="space-y-4 flex flex-col items-center">
    <h1 class="text-xl font-semibold mb-4">睡眠記錄</h1>
    <form class="space-y-3 max-w-xl" (ngSubmit)="submit()">
      <div class="flex flex-col gap-8">
        <div>
          <p>開始時間:</p>
          <input
            [(ngModel)]="startTime"
            name="start"
            type="time"
            class="border rounded px-3 py-2 w-xs"
          />
        </div>
        <div>
        <p>結束時間:</p>
        <input
          [(ngModel)]="endTime"
          name="end"
          type="time"
          class="border rounded px-3 py-2 w-xs"
        />
      </div>
      </div>
      <button class="px-3 py-2 rounded bg-black text-white">Save</button>
    </form>
    </section>
  `,
})
// sleep-form.component.ts
export class SleepFormComponent {
  // 只綁定「時間」字串，例如 "07:24"
  startTime = this.nowTime();
  endTime = this.nowTime();

  constructor(public state: BabyStateService) {}

  private nowTime(): string {
    const d = new Date();
    const hh = String(d.getHours()).padStart(2, '0');
    const mm = String(d.getMinutes()).padStart(2, '0');
    return `${hh}:${mm}`;
  }

  private todayLocalDate(): string {
    const d = new Date();
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`; // e.g. "2025-11-07"
  }

  async submit() {
    if (!this.state.currentBabyId()) return alert('Please select a baby first.');

    const today = this.todayLocalDate();

    // 以「本地時間」組出 Date 物件；瀏覽器會當成本地時區解析
    const s = new Date(`${today}T${this.startTime}`);
    let e = new Date(`${today}T${this.endTime}`);

    // 若結束時間早於開始時間，視為跨越午夜 +1 天
    if (e.getTime() < s.getTime()) {
      e.setDate(e.getDate() + 1);
    }

    const durationMin = Math.max(0, Math.round((e.getTime() - s.getTime()) / 60000));

    await this.state.addRecord({
      type: 'sleep',
      time: e.toISOString(), // 記錄點：結束時間（UTC ISO）
      payload: {
        start: s.toISOString(),
        end: e.toISOString(),
        durationMin,
      },
    });
  }
}

