const Docma = require('docma')

const config = {
  src: [
    './src/**/*.js',
    './README.md'
  ],
  dest: './docs'
}
Docma.create()
  .build(config)
  .catch(error => {
    console.log(error)
  })
