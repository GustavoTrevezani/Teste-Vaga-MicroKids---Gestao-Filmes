import * as dotenv from "dotenv";
import * as path from "path";

// 👇 resolve caminho absoluto SEM depender de onde roda
dotenv.config({
  path: path.resolve(__dirname, "../.env"),
});

import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";

async function bootstrap() {
  // console.log("DATABASE_URL:", process.env.DATABASE_URL);

  const app = await NestFactory.create(AppModule);
  await app.listen(3000);
}
bootstrap();
