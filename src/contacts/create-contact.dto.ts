import { IsEmail, IsNotEmpty, Length } from 'class-validator';

export class CreateContactDto {
  @IsNotEmpty({ message: 'Le nom est requis.' })
  @Length(1, 255, { message: 'Le nom doit contenir entre 1 et 255 caractères.' })
  nom: string;

  @IsNotEmpty({ message: 'L’email est requis.' })
  @IsEmail({}, { message: 'L’email doit être valide.' })
  email: string;

  @IsNotEmpty({ message: 'Le numéro de téléphone est requis.' })
  @Length(8, 20, { message: 'Le numéro de téléphone doit contenir entre 8 et 20 caractères.' })
  telephone: string;
}
