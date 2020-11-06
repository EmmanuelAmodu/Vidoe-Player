import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { faVolumeUp, faVolumeDown, faVolumeMute, faWindowMaximize, faExpand } from '@fortawesome/free-solid-svg-icons';
import { VideoListService } from '../video-list.service';

declare var Hls;

@Component({
  selector: 'app-video-display',
  templateUrl: './video-display.component.html',
  styleUrls: ['./video-display.component.css']
})
export class VideoDisplayComponent implements OnInit {
  video: HTMLMediaElement;
  duration: string;
  currentTime: string;
  skipToTooltip: number;
  durationAttr: string;
  timeElapsed: string;
  timeElapsedAttr: string;
  seekTooltipText: string;
  seekTooltipHideToggle: boolean = true;
  seekTooltipLeft: string;

  faVolumeUp = faVolumeUp;
  faVolumeDown = faVolumeDown;
  faVolumeMute = faVolumeMute;
  faWindowMaximize = faWindowMaximize;
  faExpand = faExpand;

  faVolumeUpToggle = false;
  faVolumeDownToggle = true;
  faVolumeMuteToggle = true;

  volumeButtonTitle: string;
  volume = 1;
  volumeAtMute: number;

  videoList: any[];
  videoId: string;
  next: number;

  @ViewChild("videoContainer") videoContainer: ElementRef;

  constructor(
    private videoListService: VideoListService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.videoList = videoListService.getVideoList();
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.videoId = params['video_id'];
      const videoItem = this.videoList.find((e, i) => {
        this.next = i + 1;
        return e.id === this.videoId
      });
      this.videoPlay(videoItem.url);
    });
  }

  videoTogglePlayPause(event: Event) {
    this.video.paused ? this.video.play() : this.video.pause();
  }

  videoPlay(url: string) {
    this.loadVideo(url)
      .then(video => {
        this.video = video;
        video.addEventListener('timeupdate', this.updateProgress.bind(this));
      })
      .catch(err => console.log(err));
  }

  playNext() {
    this.router.navigate(['player', this.videoList[this.next].id]);
  }

  loadVideo(url: string): Promise<HTMLMediaElement> {
    return new Promise((resolve, reject) => {
      var video = document.getElementById('video') as HTMLMediaElement; // TODO: Use element ref instead
      const that = this;

      var videoSrc = url;
      if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = videoSrc;
        video.addEventListener('loadedmetadata', function () {
          that.initializeVideo(video.duration);
          resolve(video);
          video.play();
        });

        video.addEventListener('timeupdate',
          () => this.updateTimeElapsed(video.currentTime));

      } else if (Hls.isSupported()) {
        var hls = new Hls();
        hls.loadSource(videoSrc);
        hls.attachMedia(video);
        hls.on(Hls.Events.LEVEL_LOADED, () => {
          that.initializeVideo(hls.media.duration)
          resolve(hls.media as HTMLMediaElement);
          video.play();
        })

        hls.media.addEventListener('timeupdate',
          () => {
            this.updateTimeElapsed(video.currentTime);
            this.updateProgress();
          });
      }
    });
  }

  initializeVideo(duration: number) {
    const time = this.formatTime(Math.round(duration));
    this.duration = `${time.minutes}:${time.seconds}`;
    this.durationAttr = `${time.minutes}m ${time.seconds}s`;
  }

  updateTimeElapsed(currentTime: number) {
    const time = this.formatTime(Math.round(currentTime));
    this.timeElapsed = `${time.minutes}:${time.seconds}`;
    this.timeElapsedAttr = `${time.minutes}m ${time.seconds}s`;
  }

  updateProgress() {
    this.currentTime = Math.floor(this.video.currentTime).toString();
  }

  formatTime(timeInSeconds: number) {
    const minutesNum = Math.floor(timeInSeconds / 60);
    let minutes = ('0' + Math.floor(timeInSeconds / 60)).slice(-2);
    let seconds = ('0' + (timeInSeconds - (minutesNum * 60))).slice(-2);
    return { minutes, seconds };
  }

  updateSeekTooltip(event) {
    this.skipToTooltip = Math.round((event.offsetX / event.target.clientWidth) * parseInt(event.target.getAttribute('max'), 10));
    const t = this.formatTime(this.skipToTooltip);
    this.seekTooltipText = `${t.minutes}:${t.seconds}`;
    const rect = this.video.getBoundingClientRect();
    this.seekTooltipHideToggle = false;
    this.seekTooltipLeft = `${event.pageX - rect.left}px`;
  }

  skipAhead(event) {
    const skipTo = event.target.dataset.seek ? event.target.dataset.seek : event.target.value;
    this.video.currentTime = skipTo;
    this.currentTime = skipTo;
  }

  updateVolume() {
    if (this.video.muted) {
      this.video.muted = false;
    }
    this.video.volume = this.volume;
  }

  updateVolumeIcon() {
    this.faVolumeUpToggle = true;
    this.faVolumeDownToggle = true;
    this.faVolumeMuteToggle = true;

    this.volumeButtonTitle = 'Mute (m)';
    if (this.video.muted || this.video.volume === 0) {
      this.faVolumeMuteToggle = false;
      this.volumeButtonTitle = 'Unmute (m)';
    } else if (this.video.volume > 0 && this.video.volume <= 0.5) {
      this.faVolumeDownToggle = false;
    } else {
      this.faVolumeUpToggle = false;
    }
  }

  toggleMute() {
    this.video.muted = !this.video.muted;
    if (this.video.muted) {
      this.volumeAtMute = this.volume;
      this.volume = 0;
    } else {
      this.volume = this.volumeAtMute;
    }
  }

  toggleFullScreen() {
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      this.videoContainer.nativeElement.requestFullscreen();
    }
  }
}
