import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Query,
  Body,
  UsePipes,
  ValidationPipe,
  Put,
} from '@nestjs/common';
import { ContactsService } from './contacts.service';
import { CreateContactDto } from './create-contact.dto';
import { ApiTags, ApiResponse, ApiBody, ApiParam, ApiQuery } from '@nestjs/swagger';

@ApiTags('Contacts') // Groups the endpoints under the "Contacts" section in Swagger
@Controller('contacts')
export class ContactsController {
  constructor(private readonly contactsService: ContactsService) {}

  @Get('paginated')
  @ApiQuery({ name: 'page', required: true, description: 'Numéro de la page' })
  @ApiQuery({ name: 'limit', required: true, description: 'Nombre de contacts par page' })
  @ApiQuery({ name: 'nom', required: false, description: 'Filtrer les contacts par nom' })
  @ApiResponse({ status: 200, description: 'Liste des contacts récupérée avec succès.' })
  @ApiResponse({ status: 500, description: 'Erreur interne.' })
  async findPaginated(
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Query('nom') nom?: string,
  ) {
    const pageNumber = parseInt(page as any, 10);
    const limitNumber = parseInt(limit as any, 10);
    return this.contactsService.findPaginated(pageNumber, limitNumber, nom);
  }

  @Post()
  @UsePipes(new ValidationPipe())
  @ApiBody({ type: CreateContactDto, description: 'Données pour créer un nouveau contact' })
  @ApiResponse({ status: 201, description: 'Contact créé avec succès.' })
  @ApiResponse({ status: 400, description: 'Données invalides.' })
  async create(@Body() createContactDto: CreateContactDto) {
    return this.contactsService.create(createContactDto);
  }

  @Delete(':id')
  @ApiParam({ name: 'id', description: 'ID du contact à supprimer' })
  @ApiResponse({ status: 200, description: 'Contact supprimé avec succès.' })
  @ApiResponse({ status: 404, description: 'Contact introuvable.' })
  @ApiResponse({ status: 500, description: 'Erreur interne.' })
  async remove(@Param('id') id: number) {
    return this.contactsService.remove(id);
  }
  
@Put(':id')
@UsePipes(new ValidationPipe()) // Validate fields in CreateContactDto
@ApiParam({ name: 'id', description: 'ID du contact à mettre à jour' })
@ApiBody({ type: CreateContactDto, description: 'Données pour mettre à jour un contact existant' })
@ApiResponse({ status: 200, description: 'Contact mis à jour avec succès.' })
@ApiResponse({ status: 400, description: 'Données invalides.' })
@ApiResponse({ status: 404, description: 'Contact introuvable.' })
@ApiResponse({ status: 500, description: 'Erreur interne.' })
async update(
  @Param('id') id: number,
  @Body() updateData: Partial<CreateContactDto>,
) {
  return this.contactsService.update(id, updateData);
}


}
