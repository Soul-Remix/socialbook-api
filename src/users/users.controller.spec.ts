import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

describe('UsersController', () => {
  let controller: UsersController;

  const user = {
    firstName: 'John',
    lastName: 'Max',
    email: 'email@test.com',
    password: '12345',
  };

  const mockUsersService = {
    create: jest.fn((dto) => {
      return {
        id: Math.random(),
        ...dto,
      };
    }),
    update: jest.fn((id, dto) => {
      return {
        id,
        ...dto,
      };
    }),

    findOne: jest.fn((id) => {
      return { id };
    }),

    remove: jest.fn((id) => {
      return { id };
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [UsersService],
    })
      .overrideProvider(UsersService)
      .useValue(mockUsersService)
      .compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('Should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('Should create a user', () => {
    expect(
      controller.create({
        ...user,
      }),
    ).toEqual({
      id: expect.any(Number),
      ...user,
    });
  });

  it('Should update a user', () => {
    expect(controller.update('1', user)).toEqual({
      id: 1,
      ...user,
    });
  });

  it('Should find a user', () => {
    expect(controller.findOne('1')).toEqual({
      id: 1,
    });
  });

  it('Should delete a user', () => {
    expect(controller.remove('1')).toEqual({
      id: 1,
    });
  });
});
