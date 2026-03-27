import { Controller, Get } from "@nestjs/common";

@Controller()
export class AppController {
  @Get()
  health() {
    console.log("Health check endpoint called");
    return { status: "ok" };
  }
}
