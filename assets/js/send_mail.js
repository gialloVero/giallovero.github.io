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

// window.onbeforeunload = () => {
// 	for(const form of document.getElementsByTagName('form')) {
// 		form.reset();
// 	}
// }

/*
const form = document.getElementById("my-form");
const status = document.getElementById("form-status");

form.addEventListener("submit", async function (event) {
	// 1. Blocca il ricaricamento della pagina standard
	event.preventDefault(); 
	
	// 2. Raccoglie i dati inseriti nei campi del form
	const data = new FormData(form); 
	
	status.innerHTML = "Invio in corso...";

	// 3. Invia i dati a Formspree in background
	try {
		const response = await fetch("https://formspree.io", {
			method: "POST",
			body: data,
			headers: {
				'Accept': 'application/json'
			}
		});

		if (response.ok) {
			// Successo: svuota il modulo e mostra un messaggio positivo
			status.innerHTML = "Grazie! Il tuo messaggio è stato inviato con successo.";
			status.style.color = "green";
			form.reset(); 
		} else {
			// Errore restituito dal server di Formspree
			const errorData = await response.json();
			if (errorData.errors) {
				status.innerHTML = errorData.errors.map(error => error.message).join(", ");
			} else {
				status.innerHTML = "Ops! Si è verificato un problema durante l'invio.";
			}
			status.style.color = "red";
		}
	} catch (error) {
		// Errore di rete (es. mancanza di connessione internet)
		status.innerHTML = "Impossibile connettersi al server. Riprova più tardi.";
		status.style.color = "red";
	}
});*/