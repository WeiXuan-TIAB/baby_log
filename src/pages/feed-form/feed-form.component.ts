import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BabyStateService } from '../../core/baby-state.service';

@Component({
  selector: 'app-feed-form',
  standalone: true,
  imports: [FormsModule],
  template: `
    <h1 class="text-xl font-semibold mb-4">飲食</h1>
    <form class="space-y-3 max-w-md" (ngSubmit)="submit()">
      <div class="flex gap-2">
        <select [(ngModel)]="foodType" name="foodType" class="border rounded px-3 py-2">
          <option value="milk">牛奶</option>
          <option value="solid">副食品</option>
        </select>

        @if (foodType === 'milk') {
          <input [(ngModel)]="amount" name="amount" type="number" class="border rounded px-3 py-2 w-32" placeholder="ml" />
        }

        <input [(ngModel)]="time" name="time" type="datetime-local" class="border rounded px-3 py-2" />
      </div>

      <textarea [(ngModel)]="note" name="note" rows="2" class="border rounded px-3 py-2 w-full placeholder-gray-400" placeholder="備註"></textarea>
      <button class="px-3 py-2 rounded bg-black text-white">Save</button>
    </form>
  `,
})

export class FeedFormComponent {
  foodType: 'milk' | 'solid' = 'milk';
  amount?: number;
  time = new Date().toISOString().slice(0,16);
  note = '';

  constructor(public state: BabyStateService) {}

  async submit() {
    if (!this.state.currentBabyId()) return alert('Please select a baby first.');
    const timeISO = new Date(this.time).toISOString();
    const payload: any = { foodType: this.foodType, note: this.note || undefined };
    if (this.foodType === 'milk') payload.amount = this.amount ?? 0;
    await this.state.addRecord({ type: 'feed', time: timeISO, payload });
    this.note = '';
  }
}
