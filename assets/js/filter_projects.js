const all = document.getElementById("allButton");
const sfx = document.getElementById("sfxButton");
const wip = document.getElementById("wipButton");
const art3D = document.getElementById("3dButton");
const gameDesign = document.getElementById("gDButton");
const animation = document.getElementById("AnButton");


function filterProjects(tag) {
	let projects = document.querySelectorAll(".card-project");

	if (tag === "all") {
		projects.forEach((project) => {
			project.style.display = "block";
		});
		return;
	}

	projects.forEach((project) => {
		tag_list = project.getAttribute("data-tags").split(",");
		if (!tag_list.includes(tag))
			project.style.display = "none";
		else
			project.style.display = "block";
	});
}

all.addEventListener("click", () => {
	const wipProjects = document.querySelectorAll("all");
});

sfx.addEventListener("click", () => {
	const sfxProjects = document.querySelectorAll("sfx");
});

wip.addEventListener("click", () => {
	const wipProjects = document.querySelectorAll("wip");
});

art3D.addEventListener("click", () => {
	const art3DProjects = document.querySelectorAll("3d");
});


