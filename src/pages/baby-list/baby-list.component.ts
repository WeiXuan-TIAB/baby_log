import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BabyStateService, type Gender } from '../../core/baby-state.service';
import { MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'app-baby-list',
  standalone: true,
  imports: [FormsModule],
  template: `
    <section class="space-y-6 flex flex-col items-center">
      <h1 class="text-xl font-semibold">寶寶列表</h1>
      <form class="flex gap-3 max-w-xl" (ngSubmit)="create()">
        <input
          class="border rounded px-3 py-2 flex-1 placeholder-gray-400"
          [(ngModel)]="name"
          name="name"
          placeholder="寶寶暱稱"
          required
        />
        <input class="border rounded px-3 py-2" [(ngModel)]="birth" name="birth" type="date" />
        <select [(ngModel)]="gender" name="gender" class="border rounded px-3 py-2 w-full" placeholder="請選擇寶寶性別">
          <option value="male">男孩</option>
          <option value="female">女孩</option>
          <option value="other">其他</option>
        </select>
        <button class="px-3 py-2 rounded bg-black text-white">Add</button>
      </form>

      <ul class="space-y-2 max-w-sm w-full mt-10">
        @for (b of state.babies(); track b.id) {
        <li class="border rounded px-3 py-2 flex items-center justify-between w-full">
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
  gender: Gender = 'other'; // ← 明確定義與預設值

  constructor(public state: BabyStateService, private snack: MatSnackBar) {}

  async create() {
    const n = this.name.trim();
    if (!n) return;

    try {
      await this.state.addBaby({ name: n, birth: this.birth || undefined, gender: this.gender });
      this.snack.open(`已新增寶寶 - ${n}`, '關閉', {
        duration: 2000,
        horizontalPosition: 'center',
        verticalPosition: 'bottom',
      });
      // reset
      this.name = '';
      this.birth = '';
      this.gender = 'other';
    } catch {
      this.snack.open('新增失敗，請稍後再試', '關閉', { duration: 3000 });
    }
  }

  select(id: string) {
    this.state.selectBaby(id);
    const b = this.state.babies().find((x) => x.id === id);
    this.snack.open(`已選擇「${b?.name ?? '這位寶寶'}」做記錄`, '關閉', {
      duration: 2000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
    });
  }
}
