import { Component, OnInit } from '@angular/core';
import { faVolumeUp, faVolumeDown, faVolumeMute } from '@fortawesome/free-solid-svg-icons';

declare var Hls;

@Component({
  selector: 'app-video-display',
  templateUrl: './video-display.component.html',
  styleUrls: ['./video-display.component.css']
})
export class VideoDisplayComponent implements OnInit {
  video: HTMLMediaElement;

  volumeButton: HTMLElement;
  volumeIcons: NodeListOf<Element>;
  volumeMute: HTMLElement;
  volumeLow: HTMLElement;
  volumeHigh: HTMLElement;
  volume: HTMLInputElement;

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
  faVolumeUpToggle = false;
  faVolumeDownToggle = true;
  faVolumeMuteToggle = true;

  volumeButtonTitle: string;

  constructor() { }

  ngOnInit(): void {
    this.loadElementRefs();
    this.loadVideo('https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8')
      .then(video => {
        this.video = video;
        video.addEventListener('timeupdate', this.updateProgress.bind(this));
      })
      .catch(err => console.log(err));
  }

  videoTogglePlayPause(event: Event) {
    this.video.paused ? this.video.play() : this.video.pause();
  }

  loadVideo(url: string): Promise<HTMLMediaElement> {
    return new Promise((resolve, reject) => {
      var video = document.getElementById('video') as HTMLMediaElement;
      const that = this;

      var videoSrc = url;
      if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = videoSrc;
        video.addEventListener('loadedmetadata', function () {
          that.initializeVideo(video.duration);
          resolve(video);
          // video.play();
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
          // video.play();
        })

        hls.media.addEventListener('timeupdate',
          () => {
            this.updateTimeElapsed(video.currentTime);
            this.updateProgress();
          });
      }
    });
  }

  loadElementRefs() {
    this.volumeButton = document.getElementById('volume-button');
    this.volumeIcons = document.querySelectorAll('.volume-button use');
    this.volumeMute = document.querySelector('use[href="#volume-mute"]');
    this.volumeLow = document.querySelector('use[href="#volume-low"]');
    this.volumeHigh = document.querySelector('use[href="#volume-high"]');
    this.volume = document.getElementById('volume') as HTMLInputElement;
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
    this.video.volume = parseInt(this.volume.value);
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
      this.volume.setAttribute('data-volume', this.volume.value);
      this.volume.value = '0';
    } else {
      this.volume.value = this.volume.dataset.volume;
    }
  }
}
