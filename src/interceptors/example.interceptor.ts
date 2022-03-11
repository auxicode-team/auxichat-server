import { NestInterceptor, ExecutionContext, CallHandler } from "@nestjs/common";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";

export const ExampleInterceptor = (data: any) => {
  return class ExampleInterceptorClass implements NestInterceptor {
    intercept(
      context: ExecutionContext,
      handler: CallHandler,
    ): Observable<any> {
      const req = context.switchToHttp().getRequest();
      // Run something before a request is handled
      // by the request handler (controller)

      return handler.handle().pipe(
        map(async (data: any) => {
          // Run something after a request is handled
          // by the request handler (controller)

          return data;
        }),
      );
    }
  };
};
