import { AddQuestionsComponent } from './features/admin/add-questions/add-questions.component';
import { Routes } from '@angular/router';
import { MainLayoutComponent } from './layout/main-layout/main-layout/main-layout.component';
import { LoginComponent } from './features/auth/login/login.component';
import { AuthGuard } from './core/guards/auth.guard';
import { AddExamComponent } from './features/admin/add-exam/add-exam.component';
import { RegisterComponent } from './features/auth/register/register.component';
import { ExamsComponent } from './features/exams/exams.component';
import { EditExamComponent } from './features/admin/edit-exam/edit-exam.component';
import { UserProfileComponent } from './users/components/user-profile/user-profile/user-profile.component';
import { EditProfileComponent } from './users/components/user-profile/edit-profile/edit-profile.component';
import { EditQuestionComponent } from './features/admin/edit-question/edit-question.component';
import { TakeExamComponent } from './features/student/take-exam/take-exam.component';
import { ResultListComponent } from './features/student/result-list/result-list.component';
import { ResultsComponent } from './features/student/results/results.component';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: RegisterComponent },
  {
    path: '',
    component: MainLayoutComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: 'add-exam',
        component: AddExamComponent,
      },
      {
        path: 'exams',
        component: ExamsComponent,
      },
      {
        path: 'edit-exam/:id',
        component: EditExamComponent,
      },
      {
        path: 'profile',
        component: UserProfileComponent,
      },
      {
        path: 'edit-profile',
        component: EditProfileComponent,
      },
      { path: 'results', component: ResultsComponent },
      { path: 'result-list', component: ResultListComponent },
      {
        path: 'exams/:examId/createquestion',
        component: AddQuestionsComponent,
      },
      { path: 'exams/:examId/allquestions', component: TakeExamComponent },
      { path: 'exams/:examId/question/:id', component: EditQuestionComponent },
    ],
  },
  { path: '**', redirectTo: '/login' },
];
