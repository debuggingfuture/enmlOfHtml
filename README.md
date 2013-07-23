enmlOfHtml
==========

This is a js library to convert HTML to ENML, Evernote's XHTML format
This is what powered [Cheeatz](http://www.cheeatz.com/home) to save rendered Gist tags to Evernote

###Explained
The API is simple but the whole idea is little bit more complex then its name, so please read this [Blog Post](http://kleineblase.wordpress.com/2013/07/24/convert-html-to-enml-for-evernote-a-non-trivial-process/)


This library is insipired by & designed to be used with berryboy's [enml-js](https://github.com/berryboy/enml-js)
I put it as separate project at the moment as there is additional complexity and the style may not align.

At the moment hacking the source code is expected.

###Usage
```
var enmlOfHtmljs = require('enmlOfHtml');

var html = '<html><p>put html here</p></html>'

//ENML is valid ENML that you can send to evernote for creation
enmlOfHtml.ENMLOfHTML(html,function(err,ENML){
	console.log(ENML);
});

or put options
`css` and `defaultDomain` is supported
var options={
	css: 'put actual css you got in stylesheet and want to be inlined here',
	defaultDomain:'will be used for replacing href or src with relative path as values'
}

```


###Libraries
- enmljs
- Styliner
- resanitize

###Dev

####Test
written in mocha / chai style


###TODO
- as requirejs module