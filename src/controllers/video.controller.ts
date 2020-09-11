import express, { Router } from 'express';
import { VideoService } from '../services/video/video.service';
import { YouTubeService } from '../services/youtube/youtube.service';

export const videoController: Router = express.Router();

const videoService = new VideoService();
const youtubeService = new YouTubeService();

// Updates video status
videoController.put('/api/video/status', async (req, res) => {
  await videoService
    .updateStatus(req.body.videoId, req.body.upvotes, req.body.downvotes, req.body.roomId, req.body.userId)
    .then(result => {
      res.send(result);
    })
    .catch(e => res.send(e));
});

// Handles adding videos
videoController.post('/api/video/add', async (req, res) => {
  let title = req.body.title.replace(/"/g, '');
  title = title.replace(/'/g, '');
  const { url, thumbnail, userId, roomId } = req.body;
  await videoService
    .addVideo(title, url, thumbnail, roomId, userId)
    .then(result => res.send(result))
    .catch(e => res.send(e));
});

// Handles removing videos from a room.
videoController.delete('/api/video/remove', async (req, res) => {
  await videoService
    .removeVideo(req.body.linkId, req.body.roomId, req.body.userId)
    .then(result => res.send(result))
    .catch(e => res.send(e));
});

videoController.get('/api/video/search/:query', async (req, res) => {
  console.log(req.params.query);
  await youtubeService
    .searchYoutube(req.params.query)
    .then(result => {
      console.log('result');
      console.log(result);
      res.send(result);
    })
    .catch(e => {
      console.log('error');
      console.log(e);
      res.send(e);
    });
});
