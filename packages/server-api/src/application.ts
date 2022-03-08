import {BootMixin} from '@loopback/boot';
import {ApplicationConfig, extensionFor} from '@loopback/core';
import {
  RestExplorerBindings,
  RestExplorerComponent,
} from '@loopback/rest-explorer';
import {RepositoryMixin} from '@loopback/repository';
import {RestApplication} from '@loopback/rest';
import {ServiceMixin} from '@loopback/service-proxy';
import path from 'path';
import {format, LoggingBindings, LoggingComponent, WinstonTransports, WINSTON_TRANSPORT} from '@loopback/logging';
import * as dotenv from 'dotenv';
import {MySequence} from './sequence';
import { authMiddleware } from './middlewares/auth.middleware';

dotenv.config();

export {ApplicationConfig};



export class Application extends BootMixin(
  ServiceMixin(RepositoryMixin(RestApplication)),
) {
  constructor(options: ApplicationConfig = {}) {
    super(options);

    // Set up the custom sequence
    this.sequence(MySequence);

    // Set up default home page
    this.static('/', path.join(__dirname, '../public'));

    // Customize @loopback/rest-explorer configuration here
    this.configure(RestExplorerBindings.COMPONENT).to({
      path: '/explorer',
    });

    this.configure(LoggingBindings.COMPONENT).to({
      enableFluent: false, // default to true
      enableHttpAccessLog: true, // default to true
    });
    
    const consoleTransport = new WinstonTransports.Console({
      level: 'info',
      format: format.combine(format.colorize(), format.simple()),
    });
    this
      .bind('logging.winston.transports.console')
      .to(consoleTransport)
      .apply(extensionFor(WINSTON_TRANSPORT));
    
    this.component(LoggingComponent);
    this.component(RestExplorerComponent);

    this.middleware(authMiddleware)

    this.projectRoot = __dirname;
    // Customize @loopback/boot Booter Conventions here
    this.bootOptions = {
      controllers: {
        // Customize ControllerBooter Conventions here
        dirs: ['controllers'],
        extensions: ['.controller.js'],
        nested: true,
      },
    };
  }
}
