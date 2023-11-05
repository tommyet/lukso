# you Lukso popular

## Deployment and Hosting

All example dApps on LUKSO are deployed using a custom CI/CD script to host several repositories to one domain with several subfolders. Please deploy merged changes with the GitHub Workflow in the [example-hosting](https://github.com/lukso-network/example-hosting) repository.

## Local Development

### Install

```bash
npm install
```

### Run

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Production Build

This app is deployed as a static NextJS website.

```bash
npm run export
```
