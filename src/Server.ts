import { Configuration, PlatformAcceptMimesMiddleware, Inject, PlatformApplication } from '@tsed/common';
import '@tsed/platform-express';
import '@tsed/swagger';
import { default as bodyParser } from 'body-parser';
import { default as compress } from 'compression';
import { default as cookieParser } from 'cookie-parser';
import { default as cors } from 'cors';
import { default as methodOverride } from 'method-override';
import * as rest from './controllers';
import './middlewares/exceptions';

const rootDir = __dirname;

@Configuration({
    rootDir,
    acceptMimes: ['application/json'],
    httpPort: process.env.PORT || 8083,
    httpsPort: false, // CHANGE
    logger: {
        level: 'info',
        debug: true,
        logRequest: false,
        requestFields: ['reqId', 'method', 'url', 'headers', 'query', 'params', 'duration']
    },
    mount: {
        '/': [
            ...Object.values(rest)
        ]
    },
    swagger: [
        {
            path: '/api-docs'
        }
    ]
})
export class Server {
    @Inject()
    app: PlatformApplication;

    /**
     * This method let you configure the middleware required by your application to works.
     * @returns {Server}
     */
    $beforeRoutesInit(): void | Promise<any> {
        this.app
            .use(cors())
            .use(PlatformAcceptMimesMiddleware)
            .use(cookieParser())
            .use(compress({}))
            .use(methodOverride())
            .use(bodyParser.json())
            .use(bodyParser.urlencoded({
                extended: true
            }));
    }

    $afterRoutesInit() {
        //this.app.use(GlobalErrorHandlerMiddleware);
    }
}
