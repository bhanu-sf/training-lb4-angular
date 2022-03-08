import {MiddlewareSequence, RequestContext} from '@loopback/rest';

export class MySequence extends MiddlewareSequence {
  override async handle(context: RequestContext): Promise<void> {
    const {request} = context;

    const logData: any = {};

    let allowedOrigins = process.env.ALLOWED_ORIGIN?.split(',');

    if (!allowedOrigins?.includes(request.headers?.referer || '')) {
      logData['error time'] = new Date();
      throw new Error('Got error');
    }

    const requestStartTime = new Date();
    await this.invokeMiddleware(context, this.options);
    const requestEndTime = new Date();

    logData['request start time'] = requestStartTime;
    logData['referrer'] = request.headers.referer;
    logData['user-agent'] = request.headers['user-agent'];
    logData['host'] = request.headers.host;
    logData['request completion time'] = requestEndTime;

    console.log(logData);
  }
}
