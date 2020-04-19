export type Request = any;
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

export interface Express {
    listen(port: number): void;
    get(route: string, routeListener: RouteListener): void;
    post(route: string, routeListener: RouteListener): void;
    use(route: string, middleWareListener, MiddleWareListener): void;
}
