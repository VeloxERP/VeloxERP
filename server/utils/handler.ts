import type {EventHandler, EventHandlerRequest} from 'h3'
import ResponseBody from "~/server/models/util/ResponseBody";

export const defineWrappedResponseHandler = <T extends EventHandlerRequest, D>(
    handler: EventHandler<T, D>
): EventHandler<T, D> =>
    defineEventHandler<T>(async event => {
        try {
            // do something before the route handler
            const response = await handler(event)
            // do something after the route handler

            if (response instanceof ResponseBody) {
                setResponseStatus(event, response.status);
                return response
            }
            setResponseStatus(event, 500);
            return new ResponseBody(500, "Internal Server Error", response);
        } catch (err) {
            // Error handling
            setResponseStatus(event, err.statusCode);
            return new ResponseBody(err.statusCode, err.message, err.body);
        }
    })