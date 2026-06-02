import { HttpInterceptorFn } from "@angular/common/http";

export const authInterceptor: HttpInterceptorFn = (req, next) => {
    const token = localStorage.getItem('token');
    if (token) {
        const authReq = req.clone({ setHeaders: { Authtorization: `Bearer ${token}` } });
        return next(authReq);
    }
    return next(req);
    

}