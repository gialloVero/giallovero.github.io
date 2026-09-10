document.addEventListener("DOMContentLoaded", async () => {
	const projectsContainer = document.getElementById("projectsContainer");
	const row = projectsContainer.querySelector(".row");

	const projectIds = projectsContainer.dataset.projectsId.split(",").map(id => id.trim());

	try {
		const response = await fetch("/projects.html");
		if (!response.ok)
			throw new Error("Could not fetch projects.html");

		const html = await response.text();
		const documentParser = new DOMParser();
		const projectsDocument = documentParser.parseFromString(html, "text/html");

		const matchingCards = [...projectsDocument.querySelectorAll(".card-project")]
			.filter(card => projectIds.includes(card.dataset.projectId));

		row.replaceChildren();

		matchingCards.forEach(card => {
			const column = card.closest("[class*='col-']").cloneNode(true);

			column.querySelectorAll(".tag-badge").forEach(badge => {
				const tag = badge.dataset.tag;
				const link = document.createElement("a");

				link.href = `/projects.html?tag=${encodeURIComponent(tag)}`;
				link.className = badge.className;
				link.classList.add("text-decoration-none");
				link.classList.remove("tag-badge");
				link.textContent = badge.textContent;

				badge.replaceWith(link);
			});

			row.appendChild(column);
		});
	} catch (error) {
		console.error("Error loading project cards:", error);
	}
});