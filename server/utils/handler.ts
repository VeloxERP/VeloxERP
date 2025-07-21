import type {EventHandler, EventHandlerRequest} from 'h3'
import ResponseBody from "~~/server/models/util/ResponseBody";
import { useRedis } from './redis';

interface HandlerOptions {
    validateBody?: (body: any) => boolean;
    validateQuery?: (query: any) => boolean;
    validateParams?: (params: any) => boolean;
    transformResponse?: (response: any) => any;
    logRequest?: boolean;
    logResponse?: boolean;
    logError?: boolean;
    rateLimit?: {
        max: number;
        windowMs: number;
    };
}

interface ApiError {
    statusCode?: number;
    message?: string;
    body?: any;
}

async function getRateLimitRequests(key: string): Promise<number[]> {
    const redis = useRedis();
    const requests = await redis.lrange(key, 0, -1);
    return requests.map(Number);
}

async function addRateLimitRequest(key: string, timestamp: number): Promise<void> {
    const redis = useRedis();
    await redis.lpush(key, timestamp.toString());
    // Set expiration on the key to automatically clean up old data
    await redis.expire(key, 60); // 60 seconds expiration
}

export const defineWrappedResponseHandler = <T extends EventHandlerRequest, D>(
    handler: EventHandler<T, D>,
    options?: HandlerOptions
): EventHandler<T, D> =>
    defineEventHandler<T>(async event => {
        try {
            // Log request if enabled
            if (options?.logRequest) {
                const methodsWithBody = ['POST', 'PUT', 'PATCH'];
                const requestInfo: any = {
                    query: getQuery(event),
                    params: event.context.params
                };
                
                if (methodsWithBody.includes(event.method)) {
                    try {
                        requestInfo.body = await readBody(event);
                    } catch (e) {
                        requestInfo.body = null;
                    }
                }
                
                console.log(`[${event.method}] ${event.path}`, requestInfo);
            }

            // Rate limiting
            if (options?.rateLimit) {
                const ip = event.node.req.socket.remoteAddress;
                const key = `rate_limit:${ip}:${event.path}`;
                const now = Date.now();
                
                const requests = await getRateLimitRequests(key);
                if (requests.length >= options.rateLimit.max) {
                    const oldestRequest = requests[0];
                    if (now - oldestRequest < options.rateLimit.windowMs) {
                        setResponseStatus(event, 429);
                        return new ResponseBody(429, "Too Many Requests");
                    }
                }
                await addRateLimitRequest(key, now);
            }

            // Request validation
            if (options) {
                const query = getQuery(event);
                const params = event.context.params;
                
                // Only validate body for methods that should have one
                if (options.validateBody && ['POST', 'PUT', 'PATCH'].includes(event.method)) {
                    try {
                        const body = await readBody(event);
                        if (!options.validateBody(body)) {
                            setResponseStatus(event, 400);
                            return new ResponseBody(400, "Invalid request body");
                        }
                    } catch (e) {
                        setResponseStatus(event, 400);
                        return new ResponseBody(400, "Invalid request body - failed to parse");
                    }
                }
                
                if (options.validateQuery && !options.validateQuery(query)) {
                    setResponseStatus(event, 400);
                    return new ResponseBody(400, "Invalid query parameters");
                }
                if (options.validateParams && !options.validateParams(params)) {
                    setResponseStatus(event, 400);
                    return new ResponseBody(400, "Invalid route parameters");
                }
            }

            // Execute handler
            // console.log(`[${event.method}] ${event.path}`);
            const response = await handler(event);
            // console.log(`[${event.method}] ${event.path} -2`);

            // Transform response if enabled
            if (response instanceof ResponseBody) {
                setResponseStatus(event, response.status);
                if (options?.transformResponse) {
                    response.body = options.transformResponse(response.body);
                }
                if (options?.logResponse) {
                    console.log(`[${event.method}] ${event.path} Response:`, response);
                }
                return response;
            }

            // Handle non-ResponseBody responses
            setResponseStatus(event, 500);
            const transformedResponse = options?.transformResponse ? options.transformResponse(response) : response;
            return new ResponseBody(500, "Internal Server Error", transformedResponse);

        } catch (err: unknown) {
            // Error handling with improved type safety
            if (options?.logError) {
                console.error(`[${event.method}] ${event.path} Error:`, err);
            }
            
            const apiError = err as ApiError;
            const statusCode = apiError.statusCode || 500;
            const message = apiError.message || "Internal Server Error";
            const body = apiError.body || undefined;
            
            setResponseStatus(event, statusCode);
            return new ResponseBody(statusCode, message, body);
        }
    })