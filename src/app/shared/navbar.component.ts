import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, LucideAngularModule],
template: `
    <nav class="fixed top-0 left-0 right-0 z-50 backdrop-blur bg-white/70 border-b">
      <div class="mx-auto max-w-3xl px-4 h-16 flex items-center gap-4">
        <!-- Logo 區 -->
        <a routerLink="/" class="font-bold flex items-center gap-3">
          <img src="/icons/babyLog.png" alt="Baby Log Logo" class="w-10 h-12" />
          <p class="hidden md:block">Baby Log ｜ 萌芽誌</p>
        </a>

        <!-- 導覽連結 -->
        <div class="ml-auto flex items-center gap-4 text-sm">
          <a routerLink="/babies" class="hover:text-[#2e7c71] flex items-center gap-1">
            <lucide-icon name="baby" class="w-4 h-4"></lucide-icon>
            <p class="hidden md:block">寶寶</p>
          </a>
          <a routerLink="/feed" class="hover:text-[#2e7c71] flex items-center gap-1">
            <lucide-icon name="utensils" class="w-4 h-4"></lucide-icon>
            <p class="hidden md:block">飲食</p>
          </a>
          <a routerLink="/diaper" class="hover:text-[#2e7c71] flex items-center gap-1">
            <lucide-icon name="toilet" class="w-4 h-4"></lucide-icon>
            <p class="hidden md:block">尿布</p>
          </a>
          <a routerLink="/sleep" class="hover:text-[#2e7c71] flex items-center gap-1">
            <lucide-icon name="bed-single" class="w-4 h-4"></lucide-icon>
            <p class="hidden md:block">睡眠</p>
          </a>
          <a routerLink="/records" class="hover:text-[#2e7c71] flex items-center gap-1">
            <lucide-icon name="calendar-days" class="w-4 h-4"></lucide-icon>
            <p class="hidden md:block">今日紀錄</p>
          </a>
        </div>
      </div>
    </nav>
  `,
})
export class NavbarComponent {}
