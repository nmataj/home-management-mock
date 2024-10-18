import { PlatformContext } from '@tsed/common';
import { Catch, ExceptionFilterMethods } from '@tsed/platform-exceptions';
import { Forbidden, Unauthorized } from '@tsed/exceptions';

@Catch(Error)
export class HttpExceptionFilter implements ExceptionFilterMethods {
    async catch(exception: any, ctx: PlatformContext): Promise<void> {
        const { response } = ctx;
        response.status(exception.status ?? 500);
        response.body(exception);
    }
}

@Catch(Forbidden, Unauthorized)
export class ForbiddenExceptionFilter implements ExceptionFilterMethods {
    catch(exception: Forbidden, ctx: PlatformContext): void {
        const { response } = ctx;
        response.status(exception.status).body({ message: exception.message });
    }
}