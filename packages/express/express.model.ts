/* eslint-disable  @typescript-eslint/no-explicit-any */
export type Request = any;
/* eslint-disable  @typescript-eslint/no-explicit-any */
export type ResponeData = any;

export interface Resposne {
    send(responeData: ResponeData): void;
}
export type RouteListener = (request: Request, response: Response) => void;

export type Next = () => void;
export type MiddleWareListener = (
    request: Request,
    response: Response,
    next: Next
) => void;

interface RouteListeners {
    [url: string]: RouteListener;
}

interface MiddleWawreListeners {
    [url: string]: Array<MiddleWareListener>;
}

export enum methods {
    GET = 'GET',
    POST = 'POST',
    MIDDLEWARE = 'MIDDLEWARE',
}
export interface Routes {
    [methods.GET]: RouteListeners;
    [methods.POST]: RouteListeners;
    [methods.MIDDLEWARE]: MiddleWawreListeners;
}

interface NetworkEmulator {
    performRequestLogic(
        method: methods.GET | methods.POST,
        url: string,
        request: Request,
        response: Response
    ): void;
}
export interface Express extends NetworkEmulator {
    listen(port: number): void;
    get(url: string, routeListener: RouteListener): void;
    post(url: string, routeListener: RouteListener): void;
    use(url: string, middlewareListener, MiddleWareListener): void;
}

export interface MiddlewaresResult {
    req: Request;
    res: Response;
    shouldCallListener: boolean;
}
