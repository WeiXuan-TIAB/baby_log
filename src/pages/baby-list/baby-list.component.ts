import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BabyStateService } from '../../core/baby-state.service';

@Component({
  selector: 'app-baby-list',
  standalone: true,
  imports: [FormsModule],
  template: `
    <section class="space-y-4">
      <h1 class="text-xl font-semibold">寶寶列表</h1>
      <form class="flex gap-2" (ngSubmit)="create()">
        <input
          class="border rounded px-3 py-2 flex-1 placeholder-gray-400"
          [(ngModel)]="name"
          name="name"
          placeholder="寶寶暱稱"
          required
        />
        <input class="border rounded px-3 py-2" [(ngModel)]="birth" name="birth" type="date" />

        <button class="px-3 py-2 rounded bg-black text-white">Add</button>
      </form>

      <ul class="space-y-2">
        @for (b of state.babies(); track b.id) {
        <li class="border rounded px-3 py-2 flex items-center justify-between">
          <div>
            <div class="font-medium">{{ b.name }}</div>
            @if (b.birth) {
            <div class="text-xs text-gray-500">生日: {{ b.birth }}</div>
            }
          </div>
          <button
            class="text-sm underline"
            [class.opacity-50]="state.currentBabyId() === b.id"
            (click)="select(b.id)"
          >
            {{ state.currentBabyId() === b.id ? 'Selected' : 'Use' }}
          </button>
        </li>
        }
      </ul>

      @if (state.currentBaby()) {
      <p class="text-sm text-gray-600">目前選擇寶寶: {{ state.currentBaby()!.name }}</p>
      }
    </section>
  `,
})
export class BabyListComponent {
  name = '';
  birth = '';

  constructor(public state: BabyStateService) {}

  async create() {
    await this.state.addBaby({ name: this.name, birth: this.birth || undefined });
    this.name = '';
    this.birth = '';
  }

  select(id: string) {
    this.state.selectBaby(id);
  }
}
