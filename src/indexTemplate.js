'use strict'

// <script src="//cdn.ckeditor.com/4.5.4/standard/ckeditor.js"></script>
// <script type="text/javascript" src="./tinymce/tinymce.min.js"></script>

module.exports = () => {
  return `<!doctype html>
<head>
  <meta charset="utf-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1, user-scalable=no"/>
  <link rel="stylesheet" href="/bb.1.0.0.css"/>
</head>
<body>
  <div id='content'></div>
</body>
<script src="/bb.1.0.0.js"></script>
`
}
