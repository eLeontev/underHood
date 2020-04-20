import {
    Express,
    RouteListener,
    MiddleWareListener,
    Routes,
    methods,
    Request,
} from './express.model';

class App implements Express {
    private port: number;
    private routes: Routes = {
        [methods.GET]: {},
        [methods.POST]: {},
        [methods.MIDDLEWARE]: {},
    };

    listen(port: number) {
        this.port = port;
    }

    get(url: string, routeListener: RouteListener) {
        this.routes[methods.GET][url] = routeListener;
    }

    post(url: string, routeListener: RouteListener) {
        this.routes[methods.POST][url] = routeListener;
    }

    use(url: string, middleWareListener: MiddleWareListener) {
        const routes = this.routes[methods.MIDDLEWARE];
        if (!routes[url]) {
            routes[url] = [];
        }

        routes[url] = [...routes[url], middleWareListener];
    }

    performRequestLogic(
        method: methods.GET | methods.POST,
        url: string,
        request: Request,
        response: Response
    ) {
        const { routes, getMiddlewaresResult, port } = this;
        const listener = routes[method][url];
        const middlewares = routes[methods.MIDDLEWARE][url] || [];

        if (!listener || !port) {
            return;
        }

        const { req, res, shouldCallListener } = getMiddlewaresResult(
            middlewares,
            request,
            response
        );

        if (shouldCallListener) {
            listener(req, res);
        }
    }

    private getMiddlewaresResult(
        listeners: Array<MiddleWareListener>,
        req: Request,
        res: Response
    ) {
        let shouldCallListener = true;
        const next = () => (shouldCallListener = true);

        listeners.forEach((listener: MiddleWareListener) => {
            shouldCallListener = false;
            listener(req, res, next);
        });

        return {
            req,
            res,
            shouldCallListener,
        };
    }
}

export const express: () => Express = () => {
    return new App();
};
