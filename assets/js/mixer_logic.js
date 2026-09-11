document.addEventListener('DOMContentLoaded', () => {
	const audioTracks = document.querySelectorAll('.mixer-track');
	const volumeMaster = document.getElementById('volume-master');
	const volumeMasterBtn = document.getElementById('volume-master-btn');
	const volumeSliders = document.querySelectorAll('.volume-slider');
	const muteButtons = document.querySelectorAll('.mute-btn');

	const masterVideo = document.getElementById('masterVideo');
	const masterPlayBtn = document.getElementById('masterPlayBtn');
	const videoTimeline = document.getElementById('videoTimeline');
	const timeDisplay = document.getElementById('timeDisplay');
	const fullscreenBtn = document.getElementById('fullscreenBtn');
	const centerPlayPause = document.getElementById('centerPlayPause');


	let masterVolume = Number(volumeMaster.value);
	let masterMuted = false;
	let previousMasterVolume = masterVolume;
	let isPlaying = false;
	let wasPlayingBeforeDrag = false;

	function updateSliderBackground(slider) {
		const percentage = (slider.value / slider.max) * 100;
		slider.style.background = `linear-gradient(to right, #79ff84 ${percentage}%, #343a40 ${percentage}%)`;
	}

	function updateMuteUI(button, isMuted) {
		const iconOn = button.querySelector('.vol-icon-on');
		const iconOff = button.querySelector('.vol-icon-off');

		iconOn.classList.toggle('d-none', isMuted);
		iconOff.classList.toggle('d-none', !isMuted);
		button.setAttribute('aria-pressed', String(isMuted));

		if (button === volumeMasterBtn) {
			button.setAttribute('aria-label', isMuted ? 'Unmute all sounds' : 'Mute all sounds');
		} else {
			button.setAttribute('aria-label', isMuted ? 'Unmute' : 'Mute');
		}
	}

	function updateTracksUI(forceMute) {
		audioTracks.forEach(track => {
			const trackVolume = Number(track.dataset.trackVolume || 1);
			
			track.volume = masterMuted ? 0 : trackVolume * masterVolume;
			track.muted = forceMute ? masterMuted : track.muted;

			const muted = track.muted || track.volume === 0;
			const relatedMuteBtn = document.querySelector(`.mute-btn[data-target="${track.id}"]`);
			if (relatedMuteBtn) {
				updateMuteUI(relatedMuteBtn, muted);
			}

			const relatedSlider = document.querySelector(`.volume-slider[data-target="${track.id}"]`);
			if (relatedSlider) {
				if (muted) {
					relatedSlider.value = 0;
				} else {
					relatedSlider.value = track.dataset.trackVolume || 1;
				}

				updateSliderBackground(relatedSlider);
			}
		});
	}

	function unmuteMaster(trackUnmuted) {
		if (masterMuted) {
			masterMuted = false;
			volumeMaster.value = previousMasterVolume || 1;
			masterVolume = Number(volumeMaster.value);
			updateMuteUI(volumeMasterBtn, masterMuted);
			updateSliderBackground(volumeMaster);
		}

		audioTracks.forEach(track => {
			track.muted = track !== trackUnmuted;
		});
	}

	// --- Audio Controls ---
	// --- 1. Master Volume Control ---
	updateSliderBackground(volumeMaster);

	volumeMaster.addEventListener('mousedown', () => {
		if (masterVolume > 0) {
			previousMasterVolume = masterVolume;
		}
	});

	volumeMaster.addEventListener('input', (e) => {
		masterVolume = Number(e.target.value);
		masterMuted = masterVolume === 0;

		updateTracksUI(false);
		updateMuteUI(volumeMasterBtn, masterMuted);
		updateSliderBackground(volumeMaster);
	});

	// --- 2. Master Mute Button Control ---
	volumeMasterBtn.addEventListener('click', () => {
		masterMuted = !masterMuted;

		if (masterMuted) {
			previousMasterVolume = masterVolume;
			volumeMaster.value = 0;
			masterVolume = 0;
		} else {
			masterVolume = previousMasterVolume || 1;
			volumeMaster.value = masterVolume;
		}

		updateTracksUI(true);
		updateMuteUI(volumeMasterBtn, masterMuted);
		updateSliderBackground(volumeMaster);
	});

	// --- 3. Initialize and Listen to Volume Sliders ---
	volumeSliders.forEach(slider => {
		const track = document.getElementById(slider.dataset.target);

		if (track) {
			track.dataset.trackVolume = slider.value || 1;
			track.volume = Number(slider.value) * masterVolume;
		}

		updateSliderBackground(slider);

		slider.addEventListener('input', (e) => {
			const track = document.getElementById(slider.dataset.target);
			const newVolume = Number(e.target.value);

			if (track) {
				track.volume = newVolume * masterVolume;
				track.muted = track.volume === 0;

				if (!track.muted) {
					track.dataset.trackVolume = newVolume;
				}

				if (newVolume > 0 && masterMuted) {
					unmuteMaster(e.target);
				}
				
				const relatedMuteBtn = document.querySelector(`.mute-btn[data-target="${track.id}"]`);
				if (relatedMuteBtn) {
					updateMuteUI(relatedMuteBtn, track.muted);
				}
			}
			updateSliderBackground(e.target);
		});
	});

	// --- 4. Mute Buttons Control ---
	muteButtons.forEach(button => {
		button.addEventListener('click', (e) => {
			const btnElement = e.target.closest('.mute-btn');
			const track = document.getElementById(btnElement.getAttribute('data-target'));
			
			if (track) {
				track.muted = track.volume !== 0;
				updateMuteUI(btnElement, track.muted);

				if (track.muted) {
					track.volume = 0;
				} else {
					track.volume = Number(track.dataset.trackVolume) * masterVolume;
					unmuteMaster(track);
				}

				const slider = document.querySelector(`.volume-slider[data-target="${track.id}"]`);

				if (slider) {
					if (track.muted) {
						slider.value = 0;
					} else {
						slider.value = track.dataset.trackVolume || 1;
					}
					updateSliderBackground(slider);
				}
			}
		});
	});

	// --- Video Controls ---
	function formatTime(seconds) {
		const min = Math.floor(seconds / 60);
		const sec = Math.floor(seconds % 60);
		return `${min}:${sec < 10 ? '0' : ''}${sec}`;
	}

	function showStaticCenterPlayIcon() {
		centerPlayPause.classList.remove('d-none', 'center-icon-anim');
		centerPlayPause.style.opacity = '1';
		centerPlayPause.style.transform = 'translate(-50%, -50%) scale(1)';
		
		const playIcon = centerPlayPause.querySelector('.play-icon');
		const pauseIcon = centerPlayPause.querySelector('.pause-icon');
		playIcon.classList.remove('d-none');
		pauseIcon.classList.add('d-none');
	}

	function animateCenterIcon(isPlayingNow) {
		centerPlayPause.classList.remove('d-none');
		centerPlayPause.style.opacity = '';
		centerPlayPause.style.transform = '';

		centerPlayPause.classList.remove('center-icon-anim');
		void centerPlayPause.offsetWidth;
		centerPlayPause.classList.add('center-icon-anim');

		const playIcon = centerPlayPause.querySelector('.play-icon');
		const pauseIcon = centerPlayPause.querySelector('.pause-icon');
		
		if (isPlayingNow) {
			playIcon.classList.add('d-none');
			pauseIcon.classList.remove('d-none');
		} else {
			playIcon.classList.remove('d-none');
			pauseIcon.classList.add('d-none');
		}
	}

	function togglePlay() {
		isPlaying = !isPlaying;
		const playIcon = masterPlayBtn.querySelector('.play-icon');
		const pauseIcon = masterPlayBtn.querySelector('.pause-icon');

		animateCenterIcon(isPlaying);

		if (isPlaying) {
			playIcon.classList.add('d-none');
			pauseIcon.classList.remove('d-none');
			audioTracks.forEach(track => {
				track.currentTime = masterVideo.currentTime;
				track.play();
			});
			masterVideo.play();
		} else {
			pauseIcon.classList.add('d-none');
			playIcon.classList.remove('d-none');
			audioTracks.forEach(track => track.pause());
			masterVideo.pause();
		}
	}

	// --- 5. Master Play/Pause Control (Video & Button) ---
	showStaticCenterPlayIcon();

	masterPlayBtn.addEventListener('click', togglePlay);
	masterVideo.addEventListener('click', togglePlay);

	// --- 6. Timeline and Time Display ---
	masterVideo.addEventListener('loadedmetadata', () => {
		videoTimeline.max = masterVideo.duration;
		timeDisplay.textContent = `0:00 / ${formatTime(masterVideo.duration)}`;
	});

	masterVideo.addEventListener('timeupdate', () => {
		if (!videoTimeline.dataset.isDragging) {
			videoTimeline.value = masterVideo.currentTime;
			updateSliderBackground(videoTimeline);
			timeDisplay.textContent = `${formatTime(masterVideo.currentTime)} / ${formatTime(masterVideo.duration)}`;
		}
	});

	// --- 8. Timeline Dragging Control ---
	videoTimeline.addEventListener('mousedown', () => {
		videoTimeline.dataset.isDragging = 'true';
		wasPlayingBeforeDrag = isPlaying;

		if (isPlaying) {
			masterVideo.pause();
			audioTracks.forEach(track => track.pause());
		}
	});

	videoTimeline.addEventListener('mouseup', () => {
		videoTimeline.dataset.isDragging = '';
		
		audioTracks.forEach(track => {
			track.currentTime = masterVideo.currentTime;
		});

		if (wasPlayingBeforeDrag) {
			masterVideo.play();
			audioTracks.forEach(track => track.play());
		}
	});
	
	videoTimeline.addEventListener('input', (e) => {
		const newTime = Number(e.target.value);
		masterVideo.currentTime = newTime;
		timeDisplay.textContent = `${formatTime(newTime)} / ${formatTime(masterVideo.duration)}`;
		updateSliderBackground(e.target);
	});

	// --- 9. Reset Video and Audio on End ---
	masterVideo.addEventListener('ended', () => {
		isPlaying = false;
		
		const playIcon = masterPlayBtn.querySelector('.play-icon');
		const pauseIcon = masterPlayBtn.querySelector('.pause-icon');
		playIcon.classList.remove('d-none');
		pauseIcon.classList.add('d-none');
		showStaticCenterPlayIcon();
		
		masterVideo.currentTime = 0;
		audioTracks.forEach(track => {
			track.pause();
			track.currentTime = 0;
		});
	});

	// --- 10. Fullscreen Button Control ---
	fullscreenBtn.addEventListener('click', () => {
		const videoContainer = masterVideo.closest('.video-container');
		const fullIcon = fullscreenBtn.querySelector('.full-icon');
		const exitIcon = fullscreenBtn.querySelector('.exit-full-icon');

		if (!document.fullscreenElement) {
			fullIcon.classList.add('d-none');
			exitIcon.classList.remove('d-none');

			if (videoContainer.requestFullscreen) {
				videoContainer.requestFullscreen();
			} else if (videoContainer.webkitRequestFullscreen) { // Safari
				videoContainer.webkitRequestFullscreen();
			} else if (videoContainer.msRequestFullscreen) { // IE11
				videoContainer.msRequestFullscreen();
			}
		} else {
			exitIcon.classList.add('d-none');
			fullIcon.classList.remove('d-none');

			if (document.exitFullscreen) {
				document.exitFullscreen();
			}
		}
	});
});