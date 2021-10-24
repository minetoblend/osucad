import {Express} from "express";
//@ts-ignore
import proxy from "express-http-proxy"

export function setupFrontent(app: Express) {
    app.use('*', proxy('localhost:8080', {
        proxyReqPathResolver: (req: any) => {
            return req.params[0]
        }
    }));
}