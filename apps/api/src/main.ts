import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api/v1');
  // T28: Dynamic PORT for deployment
  const port = process.env.PORT || 3000;
  // Debug: Log all registered routes
  const server = app.getHttpAdapter().getInstance();
  const router = server._router;
  if (router) {
    const availableRoutes: [] = router.stack
      .map((layer: any) => {
        if (layer.route) {
          return {
            path: layer.route?.path,
            method: layer.route?.stack[0].method,
          };
        }
      })
      .filter((item: any) => item !== undefined);
    console.log('Available Routes:', JSON.stringify(availableRoutes, null, 2));
  }

  await app.listen(port, '0.0.0.0');
  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
