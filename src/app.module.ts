import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ContactsModule } from './contacts/contacts.module';


import { AppService } from './app.service';

@Module({
  imports: [
    ConfigModule.forRoot(), // Loads environment variables from the `.env` file
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DATABASE_HOST,
      port: parseInt(process.env.DATABASE_PORT, 10),
      username: process.env.DATABASE_USER,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_NAME,
      autoLoadEntities: true, // Automatically load entities
      synchronize: true, // Automatically sync schema; use only in development!
    }),
    ContactsModule, // Import the ContactsModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
