function initPlayer(src) {
  var video = document.getElementById('video-player');
  var cover = document.querySelector('[data-play-cover]');
  if (!video || !src) {
    return;
  }

  function hideCover() {
    if (cover) {
      cover.classList.add('hide');
    }
  }

  function playVideo() {
    hideCover();
    var result = video.play();
    if (result && typeof result.catch === 'function') {
      result.catch(function() {});
    }
  }

  if (window.Hls && window.Hls.isSupported()) {
    var hls = new window.Hls({
      enableWorker: true,
      lowLatencyMode: true
    });
    hls.loadSource(src);
    hls.attachMedia(video);
    hls.on(window.Hls.Events.ERROR, function(event, data) {
      if (!data || !data.fatal) {
        return;
      }
      if (data.type === window.Hls.ErrorTypes.NETWORK_ERROR) {
        hls.startLoad();
        return;
      }
      if (data.type === window.Hls.ErrorTypes.MEDIA_ERROR) {
        hls.recoverMediaError();
        return;
      }
      hls.destroy();
    });
  } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
    video.src = src;
  } else {
    video.src = src;
  }

  video.setAttribute('controls', 'controls');
  video.addEventListener('play', hideCover);
  video.addEventListener('click', function() {
    if (video.paused) {
      playVideo();
    }
  });

  if (cover) {
    cover.addEventListener('click', playVideo);
  }
}
