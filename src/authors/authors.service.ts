import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Author, Prisma } from '@prisma/client';
@Injectable()
export class AuthorsService {
  constructor(private prisma: PrismaService) {}

  async create(createAuthorDto: Prisma.AuthorCreateInput): Promise<Author> {
    try {
      return await this.prisma.author.create({ data: createAuthorDto });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        // The .code property can be accessed in a type-safe manner
        if (error.code === 'P2002') {
          console.log(
            'There is a unique constraint violation, a new user cannot be created with this email',
          );
        }
        if (error.code === 'P2025') {
          throw new NotFoundException('Please provide correct information');
        }
      }
      throw error;
    }
  }

  async findAll() {
    return await this.prisma.author.findMany();
  }

  async findOne(where: Prisma.AuthorWhereUniqueInput) {
    try {
      return await this.prisma.author.findUniqueOrThrow({
        where,
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new NotFoundException('Author Not found');
        }
      }
      throw error;
    }
  }

  async update(params: {
    where: Prisma.AuthorWhereUniqueInput;
    data: Prisma.AuthorUpdateInput;
  }) {
    const { data, where } = params;
    try {
      return await this.prisma.author.update({
        data,
        where,
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new NotFoundException('Please provide correct information');
        }
      }
      throw error;
    }
  }

  async remove(where: Prisma.AuthorWhereUniqueInput) {
    try {
      return await this.prisma.author.delete({
        where,
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new NotFoundException('Author Not found');
        }
      }
      throw error;
    }
  }
}
