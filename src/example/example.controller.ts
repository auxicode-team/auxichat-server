import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from "@nestjs/common";

import { ExampleService } from "./example.service";

@Controller("example")
export class ExampleController {
  constructor(private readonly exampleService: ExampleService) {}

  @Get("/")
  async get(): Promise<any> {
    return this.exampleService.get();
  }

  @Post("/")
  async post(@Body() body: any): Promise<any> {
    return this.exampleService.post(body);
  }

  @Patch("/:id")
  async patch(@Param("id") id: string, @Body() body: any): Promise<any> {
    return this.exampleService.patch(id, body);
  }

  @Delete("/:id")
  async delete(@Param("id") id: string): Promise<any> {
    return this.exampleService.delete(id);
  }
}
