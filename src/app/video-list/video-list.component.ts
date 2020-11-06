import { Component, OnInit } from '@angular/core';
import { VideoListService } from '../video-list.service';

@Component({
  selector: 'app-video-list',
  templateUrl: './video-list.component.html',
  styleUrls: ['./video-list.component.css']
})
export class VideoListComponent implements OnInit {
  vodList: any[];

  constructor(private videoListService: VideoListService) {
    this.vodList = videoListService.getVideoList();
  }

  ngOnInit(): void {
  }

  logListContent(content) {
    console.log(content)
    return content;
  }

}
