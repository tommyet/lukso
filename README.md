# you Lukso popular
[branch]/image.jpg?raw=true
![Demo Picture 1](https://github.com/tommyet/lukso/blob/main/img/demo-pic-1.png)
![Demo Picture 2](https://github.com/tommyet/lukso/blob/main/img/demo-pic-2.png)
![Demo Picture 3](https://github.com/tommyet/lukso/blob/main/img/demo-pic-3.png)

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
