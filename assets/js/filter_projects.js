const tagInfo = {
	"3d": "3D Art",
	animation: "Animation",
	game_design: "Game Design",
	programming: "Programming",
	teamwork: "Team Work",
	vfx: "Visual Effects & Shader",
	sfx: "Sound Effects",
	game_jam: "Game Jam",
};

const buttons = [...document.querySelectorAll(".btn-tag")];
const badges = [...document.querySelectorAll(".tag-badge")];
const title = document.getElementById("projectTitle");

let selectedTag = null;

function filterProjects() {
	const highlights = document.querySelectorAll(".card-highlight");
	const highlightSection = document.getElementById("highlightProject");
	const otherProjectsTitle = document.getElementById("otherProjectsTitle");
	let highlightFound = false;
	const highlightProjectsIds = [];

	highlights.forEach((highlight) => {
		const column = highlight.closest("[class*='row']");
		const highlightTags = (highlight.dataset.tags || "").split(",").map((tag) => tag.trim());

		const show = !selectedTag || highlightTags.includes(selectedTag);
		highlightFound = highlightFound || show;
		highlightProjectsIds.push(highlight.dataset.projectId);
		column.style.display = show && selectedTag ? "block" : "none";
	});

	highlightSection.style.display = highlightFound && selectedTag ? "block" : "none";
	otherProjectsTitle.style.display = highlightFound && selectedTag ? "block" : "none";

	const projects = document.querySelectorAll(".card-project");

	projects.forEach((project) => {
		const column = project.closest("[class*='col-']");
		const projectTags = (project.dataset.tags || "").split(",").map((tag) => tag.trim());
		const projectId = project.dataset.projectId;

		const show = !selectedTag || (projectTags.includes(selectedTag) && !highlightProjectsIds.includes(projectId));
		column.style.display = show ? "block" : "none";
	});
}

function setSelectedTag(nextTag) {
	selectedTag = nextTag;

	buttons.forEach((button) => {
		const active = button.dataset.tag === selectedTag;

		button.classList.remove("active", "btn-tag-selected", "btn-tag-unselected", "btn-secondary");

		if (!selectedTag) {
			button.classList.add("btn-secondary");
			button.setAttribute("aria-pressed", "false");
			return;
		}

		button.classList.add(active ? "btn-tag-selected" : "btn-tag-unselected");
		button.classList.toggle("active", active);
		button.setAttribute("aria-pressed", String(active));
	});

	badges.forEach((badge) => {
		const active = badge.dataset.tag === selectedTag;
		badge.classList.toggle("badge-unselected", selectedTag && !active);
		badge.classList.toggle("text-bg-secondary", !selectedTag || active);
	});

	const url = new URL(window.location.href);
	if (selectedTag) {
		url.searchParams.set("tag", selectedTag);
	} else {
		url.searchParams.delete("tag");
	}
	window.history.replaceState({}, "", url);

	title.textContent = selectedTag ? `Projects - ${tagInfo[selectedTag]}` : "Projects";

	filterProjects();
}

buttons.forEach((button) => {
	button.addEventListener("click", () => {
		const nextTag = button.dataset.tag;
		setSelectedTag(selectedTag === nextTag ? null : nextTag);
	});
});

badges.forEach((badge) => {
	badge.addEventListener("click", () => {
		const nextTag = badge.dataset.tag;
		if (selectedTag !== nextTag)
			setSelectedTag(nextTag);
	});
});

const urlParams = new URLSearchParams(window.location.search);
const initialTag = urlParams.get("tag");

if (initialTag && tagInfo[initialTag]) {
	setSelectedTag(initialTag);
}