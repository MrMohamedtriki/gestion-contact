import { Test, TestingModule } from '@nestjs/testing';
import { ContactsController } from './contacts.controller';
import { ContactsService } from './contacts.service';
const mockService = {
  findPaginated: jest.fn(),
  create: jest.fn(),
  remove: jest.fn(),
};
describe('ContactsController', () => {
  let controller: ContactsController;
  let service: ContactsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ContactsController],
      providers: [
        {
          provide: ContactsService,
          useValue: mockService,
        },
      ],
    }).compile();

    controller = module.get<ContactsController>(ContactsController);
    service = module.get<ContactsService>(ContactsService);

  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
  it('should call findPaginated with correct parameters', async () => {
    const mockResult = { data: [], total: 0 };
    mockService.findPaginated.mockResolvedValue(mockResult);

    const result = await controller.findPaginated(1, 5, 'John'); 
    expect(result).toEqual(mockResult);
    expect(service.findPaginated).toHaveBeenCalledWith(1, 5, 'John'); 
  });


});
