/* eslint-disable @typescript-eslint/explicit-function-return-type, @typescript-eslint/no-explicit-any */

import { express } from './express';
import { methods } from './express.model';

const url = 'url';
const port = 'port';

const mockedMiddlewareImplementation = (req: any, res: any, next: any) => {
    req.updatedRequest = true;
    res.updatedResponse = true;
    next();
};

describe('express', () => {
    let app: any;

    let request: any;
    let response: any;

    const listener = 'listener';
    const middleware = 'middleware';

    beforeEach(() => {
        app = express();
    });

    beforeEach(() => {
        request = {};
        response = {};
    });

    describe('#listen', () => {
        it('should set port of the server', () => {
            const port = 'port';
            app.listen(port);
            expect(app.port).toBe(port);
        });
    });

    describe('#get', () => {
        it('should set listener for passed url', () => {
            app.get(url, listener);
            expect(app.routes[methods.GET][url]).toBe(listener);
        });

        it('should set only one listener per url', () => {
            app.routes[methods.GET][url] = 'previous defined listener';
            app.get(url, listener);
            expect(app.routes[methods.GET][url]).toBe(listener);
        });
    });

    describe('#post', () => {
        it('should set listener for passed url', () => {
            app.post(url, listener);
            expect(app.routes[methods.POST][url]).toBe(listener);
        });

        it('should set only one listener per url', () => {
            app.routes[methods.POST][url] = 'previous defined listener';
            app.post(url, listener);
            expect(app.routes[methods.POST][url]).toBe(listener);
        });
    });

    describe('#use', () => {
        it('should init and set middleware based on passed url', () => {
            app.use(url, middleware);
            expect(app.routes[methods.MIDDLEWARE][url]).toEqual([middleware]);
        });

        it('should add middleware to list of existed based on passed url', () => {
            app.use(url, middleware);
            app.use(url, middleware);
            expect(app.routes[methods.MIDDLEWARE][url]).toEqual([
                middleware,
                middleware,
            ]);
        });
    });

    describe('#performRequestLogic', () => {
        let fnListener: any;
        let getMiddlewaresResult: any;
        let shouldCallListener: boolean;

        const middlewares = 'middlewares';

        beforeEach(() => {
            app.port = port;
            shouldCallListener = true;

            fnListener = jest.fn();
            app.routes[methods.GET][url] = fnListener;
            app.routes[methods.MIDDLEWARE][url] = middlewares;
            getMiddlewaresResult = jest
                .spyOn(app, 'getMiddlewaresResult')
                .mockReturnValue({ shouldCallListener });
        });

        it('should do nothing if port is not defined', () => {
            app.port = undefined;
            app.performRequestLogic(methods.GET, url, request, response);
            expect(getMiddlewaresResult).not.toHaveBeenLastCalledWith();
            expect(fnListener).not.toHaveBeenLastCalledWith();
        });

        it('should do nothing if listener is not defined', () => {
            app.routes[methods.GET][url] = undefined;
            app.performRequestLogic(methods.GET, url, request, response);
            expect(getMiddlewaresResult).not.toHaveBeenLastCalledWith();
            expect(fnListener).not.toHaveBeenLastCalledWith();
        });

        it('should do nothing if middelware does not fire next event', () => {
            shouldCallListener = false;
            app.performRequestLogic(methods.GET, url, request, response);
            expect(getMiddlewaresResult).not.toHaveBeenLastCalledWith();
            expect(fnListener).not.toHaveBeenLastCalledWith();
        });

        it('should call url listener if port and listener are defiend and middelware performs next event', () => {
            const modifiedRequest = 'modifiedRequest';
            const modifiedResponse = 'modifiedResponse';
            getMiddlewaresResult.mockReturnValue({
                req: modifiedRequest,
                res: modifiedResponse,
                shouldCallListener,
            });

            app.performRequestLogic(methods.GET, url, request, response);

            expect(getMiddlewaresResult).toHaveBeenLastCalledWith(
                middlewares,
                request,
                response
            );
            expect(fnListener).toHaveBeenLastCalledWith(
                modifiedRequest,
                modifiedResponse
            );
        });
    });

    describe('#getMiddlewaresResult', () => {
        let middlewareListener: any;

        beforeEach(() => {
            middlewareListener = jest
                .fn()
                .mockImplementation(mockedMiddlewareImplementation);
        });

        it('should return modified request, response and shouldCallListener flag  is true if middleware fire next event', () => {
            expect(
                app.getMiddlewaresResult(
                    [middlewareListener],
                    request,
                    response
                )
            ).toEqual({
                req: request,
                res: response,
                shouldCallListener: true,
            });
        });

        it('should return modified request, response and shouldCallListener flag is false if middleware does not fire next event', () => {
            middlewareListener = jest.fn();
            expect(
                app.getMiddlewaresResult(
                    [middlewareListener],
                    request,
                    response
                )
            ).toEqual({
                req: request,
                res: response,
                shouldCallListener: false,
            });
        });

        it('should return request, response and shouldCallListener flag is true if has no middlewares', () => {
            expect(app.getMiddlewaresResult([], request, response)).toEqual({
                req: request,
                res: response,
                shouldCallListener: true,
            });
        });
    });
});

describe('express integration tests:', () => {
    let app: any;

    let listener: any;
    let middlewareListener: any;
    let getMiddlewaresResult: any;

    let request: any;
    let response: any;

    beforeEach(() => {
        app = express();
    });

    beforeEach(() => {
        request = {};
        response = {};
        listener = jest.fn();
        middlewareListener = jest.fn();

        getMiddlewaresResult = jest.spyOn(app, 'getMiddlewaresResult');
    });

    describe('should do nothing if', () => {
        it('port is not defined', () => {
            app.get(url, listener);
            app.performRequestLogic(methods.GET, url, request, response);
            expect(listener).not.toHaveBeenCalled();
            expect(getMiddlewaresResult).not.toHaveBeenCalled();
        });

        it('listener is not defined', () => {
            app.listen(port);
            app.performRequestLogic(methods.GET, url, request, response);
            expect(getMiddlewaresResult).not.toHaveBeenCalled();
        });

        it('middleware for handler url does not fire next event', () => {
            app.listen(port);
            app.get(url, listener);
            app.use(url, middlewareListener);

            app.performRequestLogic(methods.GET, url, request, response);

            expect(middlewareListener).toHaveBeenLastCalledWith(
                request,
                response,
                expect.any(Function)
            );

            expect(listener).not.toHaveBeenCalled();
        });
    });

    describe('should handle listener if', () => {
        beforeEach(() => {
            app.listen(port);
            app.get(url, listener);
        });

        it('port and url listener are defined', () => {
            app.performRequestLogic(methods.GET, url, request, response);
            expect(listener).toHaveBeenCalledWith(request, response);
        });

        it('port and url listener are defined and middlewares to the same url fire next event', () => {
            app.use(url, middlewareListener);
            middlewareListener.mockImplementation(
                mockedMiddlewareImplementation
            );

            app.performRequestLogic(methods.GET, url, request, response);

            expect(listener).toHaveBeenCalledWith(request, response);
        });
    });

    describe('should hanlde listener with modified request and response if', () => {
        beforeEach(() => {
            app.listen(port);
            app.get(url, listener);
        });

        it('they are modified in middlewares to the same url', () => {
            app.use(url, middlewareListener);
            middlewareListener.mockImplementation(
                mockedMiddlewareImplementation
            );

            app.performRequestLogic(methods.GET, url, request, response);

            expect(request.updatedRequest).toBeTruthy();
            expect(response.updatedResponse).toBeTruthy();
            expect(listener).toHaveBeenCalledWith(request, response);
        });
    });
});
