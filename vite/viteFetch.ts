import {once} from "events";
import multipart from "parse-multipart-data";
import {splitCookiesString} from "set-cookie-parser";
import {Readable} from "stream";
import {File} from "undici";
import {IncomingMessage} from "http";
import {ReadStream} from "fs-capacitor";


const nodeToWeb = (nodeStream: ReadStream) => {
    let destroyed = false;
    const listeners: Record<string, (...args: any[]) => void> = {};

    return new ReadableStream({
        start(controller) {
            listeners["data"] = onData;
            listeners["end"] = onData;
            listeners["end"] = onDestroy;
            listeners["close"] = onDestroy;
            listeners["error"] = onDestroy;
            for (const name in listeners) nodeStream.on(name, listeners[name]);

            nodeStream.pause();

            function onData(/** @type {any} */ chunk) {
                if (destroyed) return;
                controller.enqueue(chunk);
                nodeStream.pause();
            }

            function onDestroy(/** @type {any} */ err) {
                if (destroyed) return;
                destroyed = true;

                for (const name in listeners) nodeStream.removeListener(name, listeners[name]);

                if (err) controller.error(err);
                else controller.close();
            }
        },
        pull() {
            if (destroyed) return;
            nodeStream.resume();
        },
        cancel() {
            destroyed = true;

            for (const name in listeners) nodeStream.removeListener(name, listeners[name]);

            nodeStream.push(null);
            nodeStream.pause();
            nodeStream.destroy();
        }
    });
};

function createHeaders(requestHeaders: Record<any, any>) {
    const headers = new Headers();

    for (const [key, values] of Object.entries(requestHeaders)) {
        if (values) {
            if (Array.isArray(values)) {
                for (const value of values) {
                    headers.append(key, value);
                }
            } else {
                headers.set(key, values);
            }
        }
    }

    return headers;
}

export class NodeRequest extends Request {
    constructor(input, init) {
        if (init && init.data && init.data.on) {
            init = {
                duplex: "half",
                ...init,
                body: init.data.headers["content-type"]?.includes("x-www")
                    ? init.data
                    : nodeToWeb(init.data)
            };
        }

        super(input, init);
    }

    // async json() {
    //   return JSON.parse(await this.text());
    // }

    async buffer() {
        return Buffer.from(await super.arrayBuffer());
    }

    // async text() {
    //   return (await this.buffer()).toString();
    // }

    // @ts-ignore
    async formData() {
        if (this.headers.get("content-type") === "application/x-www-form-urlencoded") {
            return await super.formData();
        } else if (
            this.headers.get("content-type") &&
            this.headers.get("content-type")?.includes("multipart/form-data")
        ) {
            const data = await this.buffer();
            const input = multipart.parse(
                data,
                this.headers.get("content-type")?.replace("multipart/form-data; boundary=", "") ?? ""
            );
            const form = new FormData();
            input.forEach(({name, data, filename, type}) => {
                // file fields have Content-Type set,
                // whereas non-file fields must not
                // https://html.spec.whatwg.org/multipage/form-control-infrastructure.html#multipart-form-data
                const isFile = type !== undefined;
                if (isFile && filename && name) {
                    const value: any = new File([data], filename, {type});
                    form.append(name, value, filename);
                } else if (name) {
                    const value = data.toString("utf-8");
                    form.append(name, value);
                }
            });
            return form;
        }
        return new FormData();
    }

    // @ts-ignore
    clone() {
        /** @type {Request & { buffer?: () => Promise<Buffer>; formData?: () => Promise<FormData> }}  */
        const el: any = super.clone();
        el.buffer = this.buffer.bind(el);
        el.formData = this.formData.bind(el);
        return el;
    }
}

export const createRequest = (req: IncomingMessage) => {
    const protocol = req.headers["x-forwarded-proto"] || "http";
    const origin = req.headers.origin && 'null' !== req.headers.origin
        ? req.headers.origin
        : `${protocol}://${req.headers.host}`;
    const url = new URL(req.url!, origin);

    const init = {
        method: req.method,
        headers: createHeaders(req.headers),
        // POST, PUT, & PATCH will be read as body by NodeRequest
        data: req.method?.indexOf("P") === 0 ? req : null
    };

    return new NodeRequest(url.href, init);
};

export const handleNodeResponse = async (webRes: any, res: any) => {
    res.statusCode = webRes.status;
    res.statusMessage = webRes.statusText;

    const cookiesStrings: string[] = [];

    for (const [name, value] of webRes.headers) {
        if (name === "set-cookie") {
            cookiesStrings.push(...splitCookiesString(value));
        } else res.setHeader(name, value);
    }

    if (cookiesStrings.length) {
        res.setHeader("set-cookie", cookiesStrings);
    }

    if (webRes.body) {
        const readable = Readable.from(webRes.body);
        readable.pipe(res);
        await once(readable, "end");
    } else {
        res.end();
    }
};


export {splitCookiesString};