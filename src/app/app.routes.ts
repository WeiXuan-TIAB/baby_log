import { Routes } from '@angular/router';
import { BabyListComponent } from '../pages/baby-list/baby-list.component';
import { FeedFormComponent } from '../pages/feed-form/feed-form.component';
import { DiaperFormComponent } from '../pages/diaper-form/diaper-form.component';
import { SleepFormComponent } from '../pages/sleep-form/sleep-form.component';
import { RecordListComponent } from '../pages/record-list.component.ts/record-list.component';

export const routes: Routes = [
  { path: '', redirectTo: 'babies', pathMatch: 'full' },
  { path: 'babies', component: BabyListComponent, title: 'Babies' },
  { path: 'feed', component: FeedFormComponent, title: 'Feed' },
  { path: 'diaper', component: DiaperFormComponent, title: 'Diaper' },
  { path: 'sleep', component: SleepFormComponent, title: 'Sleep' },
  { path: 'records', component: RecordListComponent, title: 'Records' },
  { path: '**', redirectTo: 'babies' },
];
