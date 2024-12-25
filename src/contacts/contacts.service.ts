import { Injectable, NotFoundException, ConflictException , InternalServerErrorException} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Contact } from './contact.entity';
import { CreateContactDto } from './create-contact.dto';

@Injectable()
export class ContactsService {
  constructor(
    @InjectRepository(Contact)
    private readonly contactRepository: Repository<Contact>,
  ) {}

  async findAll(): Promise<Contact[]> {
    try {
      return await this.contactRepository.find();
    } catch (error) {
      throw new InternalServerErrorException('Une erreur est survenue lors de la récupération des contacts.');
    }
  }

  async findByName(name: string): Promise<Contact[]> {
    try {
      return await this.contactRepository.find({ where: { nom: name } });
    } catch (error) {
      throw new InternalServerErrorException('Une erreur est survenue lors de la recherche des contacts.');
    }
  }

  async create(createContactDto: CreateContactDto): Promise<Contact> {
    try {
      const existingContact = await this.contactRepository.findOne({
        where: { email: createContactDto.email },
      });

      if (existingContact) {
        throw new ConflictException('Un contact avec cet email existe déjà.');
      }

      const contact = this.contactRepository.create(createContactDto);
      return await this.contactRepository.save(contact);
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }
      throw new InternalServerErrorException('Une erreur est survenue lors de la création du contact.');
    }
  }

  async remove(id: number): Promise<void> {
    try {
      const contact = await this.contactRepository.findOne({ where: { id } });

      if (!contact) {
        throw new NotFoundException('Contact introuvable.');
      }

      await this.contactRepository.delete(id);
    } catch (error) {
      throw new InternalServerErrorException('Une erreur est survenue lors de la suppression du contact.');
    }
  }
  async findPaginated(page: number, limit: number, nom?: string): Promise<{ data: Contact[]; total: number }> {
    const queryBuilder = this.contactRepository.createQueryBuilder('contact');
  
    // Add filtering by 'nom' if provided
    if (nom) {
      queryBuilder.where('contact.nom LIKE :nom', { nom: `%${nom}%` });
    }
  
    const [data, total] = await queryBuilder
      .skip((page - 1) * limit) // Skip records for previous pages
      .take(limit) // Limit the number of records returned
      .getManyAndCount(); // Get data and total count
  
    return { data, total };
  }
  
  
}
