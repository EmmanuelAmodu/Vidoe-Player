import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class VideoListService {

  constructor() { }

  getVideoList() {
    return [
      {
        id: 'oceans_aes',
        url: 'http://playertest.longtailvideo.com/adaptive/oceans_aes/oceans_aes.m3u8',
        img: 'https://i.ytimg.com/vi/6b5AaRW5110/mqdefault.jpg',
        title: 'Random VOD content, This is the title to the video'
      },
      {
        id: '1010qwoeiuryfg',
        url: 'http://qthttp.apple.com.edgesuite.net/1010qwoeiuryfg/sl.m3u8',
        img: 'https://i.ytimg.com/vi/6b5AaRW5110/mqdefault.jpg',
        title: 'Random VOD content, This is the title to the video'
      },
      {
        id: 'captionsplaylist',
        url: 'http://playertest.longtailvideo.com/adaptive/captions/playlist.m3u8',
        img: 'https://i.ytimg.com/vi/6b5AaRW5110/mqdefault.jpg',
        title: 'Random VOD content, This is the title to the video'
      },
      {
        id: 'wowzaid3',
        url: 'http://playertest.longtailvideo.com/adaptive/wowzaid3/playlist.m3u8',
        img: 'https://i.ytimg.com/vi/6b5AaRW5110/mqdefault.jpg',
        title: 'Random VOD content, This is the title to the video'
      },
      {
        id: 'vM7nH0Kl',
        url: 'http://content.jwplatform.com/manifests/vM7nH0Kl.m3u8',
        img: 'https://i.ytimg.com/vi/6b5AaRW5110/mqdefault.jpg',
        title: 'Random VOD content, This is the title to the video'
      }
    ];
  }
}
