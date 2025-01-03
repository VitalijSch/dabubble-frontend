import { Routes } from '@angular/router';
import { AuthComponent } from './auth/auth.component';
import { LoginComponent } from './auth/login/login.component';
import { SignInComponent } from './auth/sign-in/sign-in.component';
import { ChooseAvatarComponent } from './auth/choose-avatar/choose-avatar.component';
import { ForgotPasswordComponent } from './auth/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './auth/reset-password/reset-password.component';
import { HomeComponent } from './home/home.component';
import { NewMessageComponent } from './home/new-message/new-message.component';
import { ChannelComponent } from './home/channel/channel.component';
import { MessageComponent } from './home/message/message.component';

export const routes: Routes = [
    { path: '', redirectTo: 'auth/login', pathMatch: 'full' },
    {
        path: 'auth',
        component: AuthComponent,
        children: [
            { path: '', redirectTo: 'login', pathMatch: 'full' },
            { path: 'login', component: LoginComponent },
            { path: 'sign-in', component: SignInComponent },
            { path: 'choose-avatar', component: ChooseAvatarComponent },
            { path: 'forgot-password', component: ForgotPasswordComponent },
            { path: 'reset-password/:id', component: ResetPasswordComponent },
        ],
    },
    { path: 'home', redirectTo: 'home/new-message', pathMatch: 'full' },
    {
        path: 'home',
        component: HomeComponent,
        children: [
            { path: 'new-message', component: NewMessageComponent },
            { path: 'channel', component: ChannelComponent },
            { path: 'message', component: MessageComponent },
        ]
    },
];
