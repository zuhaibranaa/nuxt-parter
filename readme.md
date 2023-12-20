# NuxtParter

NuxtParter is a utility class for handling HTTP events in a Nuxt.js application. It can parse both multipart form data and regular body data from HTTP requests. It also provides a static method for storing files.

## Installation

`npm install --save nitro-parter`

`import { NuxtParter } from 'nitro-parter';`

## Create a new instance of NuxtParter with the HTTP event you want to handle.
`let nuxtParter = new NuxtParter(event);`

## Access the parsed data and files from the `data` and `files` properties of the `NuxtParter` instance.
`let data = nuxtParter.data;`

`let files = nuxtParter.files;`

## Use the static `storeFile` method to store a file to a specified path.
`NuxtParter.storeFile(file, path);`