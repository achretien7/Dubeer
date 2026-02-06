import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

import { DataSource } from 'typeorm';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api/v1');

  // Auto-run migrations in production (Railway)
  try {
    const dataSource = app.get(DataSource);
    const migrations = await dataSource.runMigrations();
    console.log(`Executed ${migrations.length} migrations:`, migrations.map(m => m.name));
  } catch (err) {
    console.error('Error running migrations:', err);
  }

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
