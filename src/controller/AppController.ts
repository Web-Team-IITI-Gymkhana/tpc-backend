import { Controller, Get, Logger } from '@nestjs/common';

@Controller()
export class AppController {
  private logger = new Logger(AppController.name);

  @Get()
  get(): string {
    return (
      'Go to <a href="/docs">/docs</a> to open swagger.' + 'Go to <a href="/docs-json">/docs-json</a> to get json.'
    );
  }
}
