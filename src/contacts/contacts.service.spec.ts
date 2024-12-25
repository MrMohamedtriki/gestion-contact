import { Test, TestingModule } from '@nestjs/testing';
import { ContactsService } from './contacts.service';
import { Repository } from 'typeorm';
import { Contact } from './contact.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
const mockQueryBuilder = {
  where: jest.fn().mockReturnThis(),
  skip: jest.fn().mockReturnThis(),
  take: jest.fn().mockReturnThis(),
  getManyAndCount: jest.fn().mockResolvedValue([[], 0]), 
};
const mockRepository = {
  createQueryBuilder: jest.fn(() => mockQueryBuilder),
  findAndCount: jest.fn(),
  save: jest.fn(),
  findOne: jest.fn(),
  delete: jest.fn(),
};
describe('ContactsService', () => {
  let service: ContactsService;
  let repository: Repository<Contact>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ContactsService,
        {
          provide: getRepositoryToken(Contact),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<ContactsService>(ContactsService);
    repository = module.get<Repository<Contact>>(getRepositoryToken(Contact));

  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return paginated contacts', async () => {
    const mockContacts = [
      { id: 1, nom: 'John Doe', email: 'john@example.com', telephone: '12345678' },
    ];
    mockQueryBuilder.getManyAndCount.mockResolvedValue([mockContacts, 1]); 

    const result = await service.findPaginated(1, 5);
    expect(result).toEqual({ data: mockContacts, total: 1 }); 
    expect(mockQueryBuilder.skip).toHaveBeenCalledWith(0);
    expect(mockQueryBuilder.take).toHaveBeenCalledWith(5);
  });

  it('should filter contacts by name', async () => {
    const mockContacts = [
      { id: 1, nom: 'John', email: 'john@example.com', telephone: '12345678' },
    ];
    mockQueryBuilder.getManyAndCount.mockResolvedValue([mockContacts, 1]);

    const result = await service.findPaginated(1, 5, 'John');
    expect(result).toEqual({ data: mockContacts, total: 1 });
    expect(mockQueryBuilder.where).toHaveBeenCalledWith('contact.nom LIKE :nom', { nom: '%John%' });
  });

});
