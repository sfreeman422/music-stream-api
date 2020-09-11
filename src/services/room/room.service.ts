import { getRepository } from 'typeorm';
import { Room } from '../../shared/db/models/Room';
import { RoomLink } from '../../shared/db/models/RoomLink';
import * as bcrypt from 'bcrypt';

export class RoomService {
  public async getRoomInfo(roomName: string) {
    return await getRepository(Room)
      .findOneOrFail({ name: roomName })
      .then(async result => {
        const queue = await getRepository(RoomLink).find({ room: result.id, played: false });
        const history = await getRepository(RoomLink).find({ room: result.id, played: true });
        return {
          queue: this.robinSort(queue),
          history,
          roomName,
        };
      })
      .catch(e => e);
  }

  public async addRoom(roomName: string, adminUser: string, password: string) {
    return await getRepository(Room)
      .findOne({ name: roomName })
      .then(async result => {
        if (result) {
          return 'Sorry, a room with this name already exists. Please try another room.';
        } else {
          const hashedPw = await bcrypt.hash(password, 10);
          return await getRepository(Room)
            .insert({ name: roomName, admin: adminUser, password: hashedPw })
            .then(_result => 'Room created!')
            .catch(e => e);
        }
      });
  }

  private robinSort(queue: RoomLink[]) {
    const allSongs = queue;
    let sortedArr: RoomLink[] = [];

    while (allSongs.length > 0) {
      const orderedSet = [];
      for (let i = 0; i < allSongs.length; i += 1) {
        const found = orderedSet.find(element => element.user === allSongs[i].user);
        if (!found) {
          orderedSet.push(allSongs[i]);
          allSongs.splice(i, 1);
          i -= 1;
        }
      }
      sortedArr = sortedArr.concat(orderedSet);
    }
    return sortedArr;
  }
}
