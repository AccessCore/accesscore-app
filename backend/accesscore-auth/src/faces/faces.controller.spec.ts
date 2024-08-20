import { Test, TestingModule } from '@nestjs/testing';
import { FacesController } from './faces.controller';
import { FacesService } from './faces.service';

describe('FacesController', () => {
  let controller: FacesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FacesController],
      providers: [FacesService],
    }).compile();

    controller = module.get<FacesController>(FacesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
