document.addEventListener('DOMContentLoaded', () => {
	const masterVideo = document.getElementById('masterVideo');
	const masterPlayBtn = document.getElementById('masterPlayBtn');
	const audioTracks = document.querySelectorAll('.mixer-track');
	const volumeSliders = document.querySelectorAll('.volume-slider');
	const muteButtons = document.querySelectorAll('.mute-btn');

	let isPlaying = false;

	function updateSliderBackground(slider) {
		const percentage = (slider.value / slider.max) * 100;
		slider.style.background = `linear-gradient(to right, #0d6efd ${percentage}%, #343a40 ${percentage}%)`;
	}

	function updateMuteUI(button, isMuted) {
		const iconOn = button.querySelector('.vol-icon-on');
		const iconOff = button.querySelector('.vol-icon-off');
		const slider = document.querySelector(`.volume-slider[data-target="${button.getAttribute('data-target')}"]`);
		
		updateSliderBackground(slider);
		iconOn.classList.toggle('d-none', isMuted);
		iconOff.classList.toggle('d-none', !isMuted);
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

	// --- 2. Initialize and Listen to Volume Sliders ---
	volumeSliders.forEach(slider => {
		updateSliderBackground(slider);

		slider.addEventListener('input', (e) => {
			const targetAudio = document.getElementById(e.target.getAttribute('data-target'));
			
			if (targetAudio) {
				targetAudio.volume = e.target.value;
				targetAudio.muted = e.target.value == 0;
				
				const relatedMuteBtn = document.querySelector(`.mute-btn[data-target="${targetAudio.id}"]`);
				if (relatedMuteBtn)
					updateMuteUI(relatedMuteBtn, targetAudio.muted);
			}
			
			updateSliderBackground(e.target);
		});
	});

	// --- 3. Mute Buttons Control ---
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

	// --- 4. Keep Sync on Timeline Scrub ---
	masterVideo.addEventListener('seeked', () => {
		audioTracks.forEach(track => {
			track.currentTime = masterVideo.currentTime;
		});
	});

	// --- 5. Handle Master Video Ended Event ---
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