import { Controller, Get, Body, Post, Param, Put, Delete, UseGuards, Req } from '@nestjs/common';
import { BookService } from './book.service';
import { Book } from './schemas/book.schema';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('book')
export class BookController {

    constructor( private bookService: BookService) {}

    @Get()
    async getAllBooks(): Promise<Book[]> {
        return this.bookService.findAll()
    }

    @Post()
    @UseGuards( AuthGuard() )
    async createBook(

        @Body()
        book: CreateBookDto,
        @Req() req,

    ): Promise<Book> {
        return this.bookService.create( book, req.user )
    }

    @Get( ':id' )
    async getBook (
        @Param( 'id' )
        id: string,
    ): Promise<Book> {
        return this.bookService.findById( id )
    }
    
    @Put( ':id' )
    async updateBook (
        @Param( 'id' )
        id: string,
        @Body()
        book: UpdateBookDto,
    ): Promise<Book> {
        return this.bookService.updateById( id, book )
    }

    @Delete( ':id' )
    async deleteBook (
        @Param( 'id' )
        id: string,
    ): Promise<Book> {
        return this.bookService.deleteById( id )
    }
}
