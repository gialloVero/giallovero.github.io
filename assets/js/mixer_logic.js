document.addEventListener('DOMContentLoaded', () => {
	const masterVideo = document.getElementById('masterVideo');
	const masterPlayBtn = document.getElementById('masterPlayBtn');
	const audioTracks = document.querySelectorAll('.mixer-track');
	const volumeMaster = document.getElementById('volume-master');
	const volumeMasterBtn = document.getElementById('volume-master-btn');
	const volumeSliders = document.querySelectorAll('.volume-slider');
	const muteButtons = document.querySelectorAll('.mute-btn');

	let isPlaying = false;
	let masterVolume = Number(volumeMaster.value);
	let masterMuted = false;
	let previousMasterVolume = masterVolume;

	function updateSliderBackground(slider) {
		const percentage = (slider.value / slider.max) * 100;
		slider.style.background = `linear-gradient(to right, #0d6efd ${percentage}%, #343a40 ${percentage}%)`;
	}

	function updateMuteUI(button, isMuted) {
		const iconOn = button.querySelector('.vol-icon-on');
		const iconOff = button.querySelector('.vol-icon-off');

		iconOn.classList.toggle('d-none', isMuted);
		iconOff.classList.toggle('d-none', !isMuted);

		button.setAttribute('aria-pressed', String(isMuted));
		if (button !== volumeMasterBtn) {
			const slider = document.querySelector(`.volume-slider[data-target="${button.getAttribute('data-target')}"]`);
			updateSliderBackground(slider);
			button.setAttribute('aria-label', isMuted ? 'Unmute' : 'Mute');
		} else {
			button.setAttribute('aria-label', isMuted ? 'Unmute all sounds' : 'Mute all sounds');
		}
	}

	function updateTracksUI() {
		audioTracks.forEach(track => {
			const trackVolume = Number(track.dataset.trackVolume || 1) * masterVolume;
			track.volume = trackVolume;
			track.muted = trackVolume == 0;

			const relatedMuteBtn = document.querySelector(`.mute-btn[data-target="${track.id}"]`);
			if (relatedMuteBtn)
				updateMuteUI(relatedMuteBtn, track.muted);
		});
	}

	// --- 1. Master Play/Pause Control ---
	masterPlayBtn.addEventListener('click', () => {
		isPlaying = !isPlaying;
		if (isPlaying) {
			masterPlayBtn.textContent = "PAUSE";
			masterPlayBtn.classList.replace("btn-primary", "btn-danger");
			audioTracks.forEach(track => {
				track.currentTime = masterVideo.currentTime;
				track.play();
			});
			masterVideo.play();
		} else {
			masterPlayBtn.textContent = "PLAY";
			masterPlayBtn.classList.replace("btn-danger", "btn-primary");
			audioTracks.forEach(track => track.pause());
			masterVideo.pause();
		}
	});

	// --- 2. Master Volume Control ---
	updateSliderBackground(volumeMaster);

	volumeMaster.addEventListener('input', (e) => {
		masterVolume = Number(e.target.value);
		masterMuted = masterVolume == 0;

		if (!masterMuted) {
			previousMasterVolume = masterVolume;
		}

		updateTracksUI();
		updateMuteUI(volumeMasterBtn, masterMuted);
		updateSliderBackground(e.target);
	});

	// --- 3. Master Mute Button Control ---
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

		updateTracksUI();
		updateSliderBackground(volumeMaster);
		updateMuteUI(volumeMasterBtn, masterMuted);
	});

	// --- 4. Initialize and Listen to Volume Sliders ---
	volumeSliders.forEach(slider => {
		const targetAudio = document.getElementById(slider.dataset.target);

		if (targetAudio) {
			targetAudio.dataset.trackVolume = slider.value;
			targetAudio.volume = Number(slider.value) * masterVolume;
		}

		updateSliderBackground(slider);

		slider.addEventListener('input', (e) => {
			const track = document.getElementById(slider.dataset.target);
			
			if (track) {
				const newVolume = Number(e.target.value) * masterVolume;

				track.dataset.trackVolume = e.target.value;
				track.volume = newVolume;
				track.muted = newVolume == 0;
				
				const relatedMuteBtn = document.querySelector(`.mute-btn[data-target="${track.id}"]`);
				if (relatedMuteBtn)
					updateMuteUI(relatedMuteBtn, track.muted);
			}
			
			updateSliderBackground(e.target);
		});
	});

	// --- 5. Mute Buttons Control ---
	muteButtons.forEach(button => {
		button.addEventListener('click', (e) => {
			const btnElement = e.target.closest('.mute-btn');
			const targetAudio = document.getElementById(btnElement.getAttribute('data-target'));
			
			if (targetAudio) {
				targetAudio.muted = !targetAudio.muted;
				updateMuteUI(btnElement, targetAudio.muted);

				const slider = document.querySelector(`.volume-slider[data-target="${targetAudio.id}"]`);

				if (slider) {
					if (targetAudio.muted) {
						slider.dataset.previousValue = slider.value;
						slider.value = 0;
					} else {
						slider.value = slider.dataset.previousValue || 1;
					}
					updateSliderBackground(slider);
				}
			}
		});
	});

	// --- 6. Keep Sync on Timeline Scrub ---
	masterVideo.addEventListener('seeked', () => {
		audioTracks.forEach(track => {
			track.currentTime = masterVideo.currentTime;
		});
	});

	// --- 7. Handle Master Video Ended Event ---
	masterVideo.addEventListener('ended', () => {
		isPlaying = false;
		
		masterPlayBtn.textContent = "PLAY ALL";
		masterPlayBtn.classList.replace("btn-danger", "btn-primary");
		
		masterVideo.currentTime = 0;
		audioTracks.forEach(track => {
			track.pause();
			track.currentTime = 0;
		});
	});
});