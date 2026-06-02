import { Routes } from '@angular/router';
// import { Access } from './access';
import { Login } from './login/login';
import { Error } from './error/error';
import { Signup } from './signup/signup';

export default [
    // { path: 'access', component: Access },
    { path: 'error', component: Error },
    { path: 'login', component: Login },
    { path: 'signup', component: Signup }
] as Routes;
