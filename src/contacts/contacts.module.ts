import { Module } from '@nestjs/common';
import { ContactsService } from './contacts.service';
import { Contact } from './contact.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ContactsController } from './contacts.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Contact])],

  providers: [ContactsService],
  controllers: [ContactsController]
})
export class ContactsModule {}
