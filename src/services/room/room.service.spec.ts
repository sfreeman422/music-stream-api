import { RoomService } from './room.service';

describe('RoomService', () => {
  let roomService: RoomService;

  beforeEach(() => {
    roomService = new RoomService();
  });

  describe('test', () => {
    it('should have a roomService', () => {
      expect(roomService).toBeDefined();
    });
  });
});
