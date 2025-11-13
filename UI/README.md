# COMPSCI 235 Labs Marking App

## Developing

Setup and run application locally to start developing:

```bash
npm i
npm run dev
```

This application was built with [SvelteKit](https://svelte.dev/). Start learning Svelte & SvelteKit: [Svelte Tutorial](https://svelte.dev/tutorial/svelte/welcome-to-svelte)

### Generate Certs for HTTPS development

Complete this setup so that locally the application uses HTTPS instead of HTTP

- [Follow this method](https://stackoverflow.com/a/76525335)
- Store the certs (`cert.pem` & `key.pem`) in `./cert`
- Then [Vite](./vite.config.ts) can locally deploy a server that supports https and SSL encryption.

## Building

To deploy application:

```bash
vercel deploy --prod
```
