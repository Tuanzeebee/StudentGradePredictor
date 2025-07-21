import { Controller, Get, Post, Body } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

@Controller('post')
export class PostController {
  @Get()
  async getPosts() {
    return prisma.post.findMany();
  }
  @Post()
  async createPost(@Body() body: { title: string; content: string }) {
    return prisma.post.create({ data: body });
  }
}
