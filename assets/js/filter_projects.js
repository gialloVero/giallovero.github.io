const animation = document.getElementById("AniButton");
const art3D = document.getElementById("3dButton");
const gameDesign = document.getElementById("gDButton");
const programming = document.getElementById("progButton");
const sfx = document.getElementById("sfxButton");
const teamWork = document.getElementById("twButton");
const vfx = document.getElementById("vfxButton");
const gameJam = document.getElementById("gameJamButton");

const buttons = [animation, art3D, gameDesign, programming, teamWork, vfx, sfx, gameJam];

const tagMap = {
	"3dButton": ["3d", "3D Art"],
	"AniButton": ["animation", "Animation"],
	"gDButton": ["game_design", "Game Design"],
	"progButton": ["programming", "Programming"],
	"twButton": ["teamwork", "Team Work"],
	"vfxButton": ["vfx", "Visual Effects & Shader"],
	"sfxButton": ["sfx", "Sound Effects"],
	"gameJamButton": ["gameJam", "Game Jam"],
};

const title = document.getElementById("projectTitle");

function filterProjects() {
	let projects = document.querySelectorAll(".card-project");

	const selectedButton = buttons.find(button => button && button.classList.contains("active"));
	const selectedTag = selectedButton ? tagMap[selectedButton.id][0] : null;

	title.textContent = selectedTag ? `Projects - ${tagMap[selectedButton.id][1]}` : "Projects";

	projects.forEach((project) => {
		const column = project.closest("[class*='col-']");
		const projectTags = project.getAttribute("data-tags");
		
		// If nothing is selected, show all
		if (!selectedTag) {
			column.style.display = "block";
			return;
		}
		
		// Filter based on the selected tag
		if (projectTags) {
			const tagList = projectTags.split(",").map(tag => tag.trim());
			column.style.display = tagList.includes(selectedTag) ? "block" : "none";
		} else {
			column.style.display = "none";
		}
	});
}

buttons.forEach((button) => {
	if (button) {
		button.addEventListener("click", (e) => {
			e.preventDefault();

			const isCurrentlyActive = button.classList.contains("active");
			
			// Reset all buttons
			buttons.forEach(btn => {
				if (btn) {
					btn.setAttribute("aria-pressed", "false");
					btn.classList.remove("btn-primary", "active");
					btn.classList.add("btn-secondary");
				}
			});
			
			// If clicking an unpressed button, activate it
			if (!isCurrentlyActive) {
				button.setAttribute("aria-pressed", "true");
				button.classList.remove("btn-secondary");
				button.classList.add("btn-primary", "active");
			}

			filterProjects();
		});
	}
});