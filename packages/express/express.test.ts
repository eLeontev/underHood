import { express } from './express';
import { methods } from './express.model';

describe('express', () => {
    let app: any;

    const url = 'url';
    const listener = 'listener';
    const middleware = 'middleware';

    beforeEach(() => {
        app = express();
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
});
