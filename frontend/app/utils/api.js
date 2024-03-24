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
	post(resource, opts) {
		if (resource.slice(0, 1) !== "/") {
			resource = `/${resource}`;
		}
		const url = this.baseUrl ? `${this.baseUrl}${resource}` : resource;
		opts["method"] = "POST";
		let out = fetch(url, { ...this.defaultOpts, ...opts });
		console.log("INC", url, { ...this.defaultOpts, ...opts });
		console.log("HTTP", out);
		console.log("def", this.defaultOpts);
		return out;
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
			"content-type": "application/json",
		},
	},
});

export { apiClient };
