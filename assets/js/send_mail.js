(() => {
	'use strict'

	const form = document.getElementById('contactForm')

	form.addEventListener('submit', event => {
		if (!form.checkValidity()) {
			event.preventDefault()
			event.stopPropagation()
		}

		form.classList.add('was-validated')
	}, true)
})();

window.formspree = window.formspree || function () {
	(formspree.q = formspree.q || []).push(arguments);
};

formspree("initForm", {
	formElement: "#contactForm",
	formId: "mbgjyepq",

	onSuccess: ({ form }) => {
		form.reset();
		form.classList.remove('was-validated');

		form.querySelectorAll('.is-valid, .is-invalid').forEach(field => {
			field.classList.remove('is-valid', 'is-invalid');
		});
	}
});

document.querySelectorAll(".alert-close").forEach((button) => {
	button.addEventListener("click", () => {
		button.closest(".alert").dataset.dismissed = "true";
	});
});

const alertObserver = new ChangeObserver((changes) => {
	changes.forEach((change) => {
		if (change.attributeName === "data-fs-active") {
			const alert = change.target;

			if (alert.hasAttribute("data-fs-active")) {
				delete alert.dataset.dismissed;
			}
		}
	});
});

document.querySelectorAll(".alert").forEach((alert) => {
	alertObserver.observe(alert, { attributes: true });
});