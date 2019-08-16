import _ from "lodash";

interface Response {
    request: {
        url: string,
        params?: any
    };
    response: {
        status: number,
        data: any
    };
}

export default class HttpServer {
    private responses: Response[] = [];

    constructor(private baseUrl: string, private debug = false) {
    }

    addResponses(responses: Response[]) {
        this.responses.push(...responses);
    }

    responsesSize() {
        return this.responses.length;
    }

    matchParams(storedParams: any | undefined, requestedParams: any) {
        for (const prop in storedParams) {
            if (storedParams[prop] !== requestedParams[prop])
                return false;
        }
        return true;
    }

    async doRequest(options: { url: string, params: Record<string, string> }) {
        const url = options.url.substring(this.baseUrl.length);
        if (this.debug)
            console.log(`requesting ${url}`);

        for (let i = 0; i < this.responses.length; i++) {
            const { request, response } = this.responses[i];
            if (url.match(request.url) && this.matchParams(request.params, options.params)) {
                this.responses.splice(i, 1);
                if (this.debug)
                    console.log("response", response);
                if (response.status === 200)
                    return response;
                else
                    throw response;
            }
        }

        console.error(`no response found for ${url}`, options.params);
        console.info("possible options:", this.responses.map(response => response.request));
        throw `Cannot process request for ${url}`;
    }
}
