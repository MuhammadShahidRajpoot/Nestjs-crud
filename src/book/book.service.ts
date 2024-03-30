import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Book } from './schemas/book.schema';
import mongoose from 'mongoose';
import { User } from '../auth/schemas/user.schema';

@Injectable()
export class BookService {

    constructor(

        @InjectModel( Book.name )
        private bookModel: mongoose.Model<Book>,
    ) {}

    async findAll(): Promise<Book[]> {
        const books = await this.bookModel.find();
        return books
    }

    async create( book: Book, user: User ): Promise<Book> {

        const data = Object.assign( book, { user: user._id })

        const res = await this.bookModel.create( data )
        return res
    }

    async findById( id: string): Promise<Book> {

        const book = await this.bookModel.findById(id)

        if ( !book ){
            throw new NotFoundException( "Book Not Found!" )
        }

        return book
    }

    async updateById( id: string, book: Book): Promise<Book> {

        const res = await this.bookModel.findByIdAndUpdate( id, book, { new: true, runValidators: true, } )

        if ( !res ){
            throw new NotFoundException( "Book Not Found!" )
        }
        
        return res
    }

    async deleteById( id: string): Promise<Book> {

        return await this.bookModel.findByIdAndDelete( id )
    }
}
