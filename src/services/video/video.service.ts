import { getRepository } from 'typeorm';
import { Link } from '../../shared/db/models/Link';
import { RoomLink } from '../../shared/db/models/RoomLink';

export class VideoService {
  public async addVideo(title: string, url: string, thumbnail: string, roomId: string, userId: string) {
    return getRepository(Link)
      .findOne({ url: url })
      .then(async result => {
        if (result) {
          return await this.addVideoToRoom(roomId, userId, result.id);
        } else {
          return await getRepository(Link)
            .save({ url, name: title, thumbnail })
            .then(async link => {
              await this.addVideoToRoom(roomId, userId, link.id);
            });
        }
      });
  }

  public async removeVideo(linkId: string, roomId: string, userId: string) {
    const item = await getRepository(RoomLink).findOne({ link: linkId, room: roomId, user: userId });
    if (item) {
      return await getRepository(RoomLink).remove(item);
    }
    return 'Unable to remove. This video does not exist.';
  }

  public async updateStatus(linkId: string, upvotes: number, downvotes: number, roomId: string, userId: string) {
    return await getRepository(RoomLink).save({ link: linkId, upvotes, downvotes, room: roomId, user: userId });
  }

  private addVideoToRoom(roomId: string, userId: string, linkId: string) {
    return getRepository(RoomLink).save({ id: roomId, user: userId, link: linkId });
  }
}
