// import API_URL from './config'

class HttpClient {
	constructor(opts) {
		if (opts.baseUrl) {
			this.baseUrl =
				opts.baseUrl.slice(-1) === "/"
					? opts.baseUrl.slice(0, -1)
					: opts.baseUrl;
		}
		this.defaultOpts = opts.defaultOpts ?? {};
	}
	post(resource, data = {}) {
		// Ensure the resource path starts with "/"
		const path = resource.startsWith("/") ? resource : `/${resource}`;
		const url = `${this.baseUrl}${path}`;

		// Prepare the request options
		const options = {
			method: "POST",
			headers: {
				"Content-Type": "application/json", // Ensure JSON content type
				Authorization: `Token ${localStorage.getItem("token")}`, // Include the token if available
				...this.defaultOpts.headers, // Include any default headers
			},
			body: JSON.stringify(data), // Convert the data object to a JSON string
		};

		// Execute the fetch request
		return fetch(url, options).then((response) => {
			// Check if the response is successful
			if (!response.ok) {
				// If not, convert the response to JSON and throw an error
				return response.json().then((body) => {
					throw new Error(`Error ${response.status}: ${response.statusText}`, {
						cause: body,
					});
				});
			}
			// If the response is successful, parse it as JSON
			return response.json();
		});
	}

	delete(resource, opts) {
		if (resource.slice(0, 1) !== "/") {
			resource = `/${resource}`;
		}
		const url = this.baseUrl ? `${this.baseUrl}${resource}` : resource;
		opts["method"] = "DELETE";
		return fetch(url, { ...this.defaultOpts, ...opts });
	}
	get(resource, opts) {
		if (resource.slice(0, 1) !== "/") {
			resource = `/${resource}`;
		}
		const url = this.baseUrl ? `${this.baseUrl}${resource}` : resource;
		return fetch(url, { ...this.defaultOpts, ...opts });
	}
}

const apiClient = new HttpClient({
	baseUrl: "http://localhost:8080/api",
	defaultOpts: {
		headers: {
			"Content-Type": "application/json",
		},
	},
});

export { apiClient };
