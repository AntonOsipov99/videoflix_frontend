import { inject } from '@angular/core';
import { Router } from '@angular/router';

export const alreadyAuthGuard = () => {
  const router = inject(Router);
  
  if (localStorage.getItem('token')) {
    router.navigate(['/movie-dashboard']);
    return false;
  }
  
  return true;
};

export const authGuard = () => {
    const router = inject(Router);

    if (!localStorage.getItem('token')) {
        router.navigate(['']);
        return false;
    }

    return true;
};