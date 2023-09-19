import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Book, Prisma } from '@prisma/client';
@Injectable()
export class BooksService {
  constructor(private prisma: PrismaService) {}

  async create(createBookDto: Prisma.BookUncheckedCreateInput): Promise<Book> {
    try {
      return await this.prisma.book.create({ data: createBookDto });
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
    return await this.prisma.book.findMany({
      include: {
        // Nb: true means that all properties will be included, otherwise we just specify the shape and conditions in options
        author: true,
      },
    });
  }

  async findOne(where: Prisma.BookWhereUniqueInput) {
    try {
      return await this.prisma.book.findUniqueOrThrow({
        where,
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new NotFoundException('Book Not found');
        }
      }
      throw error;
    }
  }

  async update(params: {
    where: Prisma.BookWhereUniqueInput;
    data: Prisma.BookUncheckedUpdateInput;
  }) {
    const { data, where } = params;
    try {
      return await this.prisma.book.update({
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

  async remove(where: Prisma.BookWhereUniqueInput) {
    try {
      return await this.prisma.book.delete({
        where,
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new NotFoundException('Book Not found');
        }
      }
      throw error;
    }
  }
}
