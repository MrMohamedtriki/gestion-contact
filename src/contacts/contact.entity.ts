import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Contact {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  nom: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  email: string;

  @Column({ type: 'varchar', length: 20 })
  telephone: string;
}
