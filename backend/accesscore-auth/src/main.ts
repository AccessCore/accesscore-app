import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors();

  Object.defineProperty(BigInt.prototype, "toJSON", {
    get() {
      "use strict";
      return () => String(this);
    }
  });
  await app.listen(process.env.PORT);
}
bootstrap();
