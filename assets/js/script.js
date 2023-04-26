// https://github.com/Deltaco-AB/software-download

async function fetchManifest(manifest) {
	const response = await fetch(`manifest/${manifest}.json`);
	return response.json();
}

class ProductFilter {

	constructor(input,results) {
		this.imageSize = 90;

		this.results = results;
		this.manifest = {};

		input.addEventListener("keyup",event => this.search(event));
	}

	setManifest(manifest) {
		this.manifest = manifest;
		this.restoreTree();
	}

	// Populate result subtree with all products in manifest
	restoreTree(manifest = this.manifest) {
		for(const [key,value] of Object.entries(manifest)) {
			this.append(key,value);
		}
	}

	// Clear result subtree
	resetTree() {
		while(this.results.firstChild) {
			this.results.removeChild(this.results.lastChild);
		}
	}

	// Append item to view
	append(id,url) {
		const HTML = `
		<div class="item">
			<h2>${id}</h2>
			<a href="${url}" target="_blank"><p class="button">Download</p></a>
		</div>`
		;

		this.results.insertAdjacentHTML("beforeend",HTML);
	}

	// Filter view with value from input
	search(event) {
		const input = event.target.value.toUpperCase();

		this.resetTree();

		for(const [key,value] of Object.entries(this.manifest)) {
			if(key.includes(input)) {
				this.append(key,value);
			}
		}
	}

}

/* ---- */

// Get manifest name from url query
const manifest = new URLSearchParams(window.location.search).get("manifest");

const elements = {
	input: document.getElementsByTagName("input")[0],
	results: document.getElementById("results")
}

const search = new ProductFilter(elements.input,elements.results);

// Load manifest
fetchManifest(manifest).then(manifest => search.setManifest(manifest));
