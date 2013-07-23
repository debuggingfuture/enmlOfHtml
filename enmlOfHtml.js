var Styliner = require('styliner');
var resanitize = require('resanitize');
var XMLWriter = require('xml-writer');

function createWriterWithENMLHeader() {

  var writer = new XMLWriter();

  writer.startDocument = writer.startDocument || writer.writeStartDocument;
  writer.endDocument = writer.endDocument || writer.writeEndDocument;
  writer.startDocument = writer.startElement || writer.writeStartElement;
  writer.startDocument = writer.endElement || writer.writeEndElement;


  // writeDocType : function (name, pubid, sysid, subset) {
  //     return this.startDocType(name, pubid, sysid, subset).endDocType()
  // },
  writer.startDocument('1.0', 'UTF-8', false);
  // writer.writeDocType('en-note',null,"http://xml.evernote.com/pub/enml2.dtd")
  writer.write('<!DOCTYPE en-note SYSTEM "http://xml.evernote.com/pub/enml2.dtd">');
  writer.write("\n");
  writer.startElement('en-note');
  writer.writeAttribute('style', 'word-wrap: break-word; -webkit-nbsp-mode: space; -webkit-line-break: after-white-space;');

  return writer;
}


//Portable override before pull request merge into it
resanitize.stripUnsafeAttrs = function(str, unsafeAttrs) {
  var unsafeAttrsDefault = ['id', 'class', 'style', 'clear', 'target', 'onclick', 'ondblclick', 'onmousedown', 'onmousemove', 'onmouseover', 'onmouseout', 'onmouseup', 'onkeydown', 'onkeypress', 'onkeyup', 'onabort', 'onerror', 'onload', 'onresize', 'onscroll', 'onunload', 'onblur', 'onchange', 'onfocus', 'onreset', 'onselect', 'onsubmit'];


  unsafeAttrs = unsafeAttrs || unsafeAttrsDefault;
  //TODO extend instead

  return str.replace(/<([^ >]+?) [^>]*?>/g, resanitize.filterTag(resanitize.stripAttrs(unsafeAttrs)));
};

// resanitize.stripUnsafeHref = function(str,accepted){
//    accepted =  accepted ||{};
//    //strip non accepted e.g. non-http, ftp, https
//    //problem is what to substitute
//        // str.replace(/<a[^>]*?href=("|')http:\/\/api\.tweetmeme\.com\/share\?[^>]*?\1[\s\S]*?<\/a>/gi, '')

// }
var addHostUrlToHref = function(str, host) {
  //only replace those start immediately with /
  return str.replace(/<a([^>]*?)href=(?:"|')\/([^"']*)(?:"|')([^>]*)>/gi, '<a$1href=\'' + host + '/$2\'$3>');
  // [^>]*?\1.*?>
};

var ENMLOfHTML = function(text, options, cb) {
  var writer = createWriterWithENMLHeader();
  //delete original HTML tags, or dont create those tags from the beginning
  //TODO replace css -> options
  if (!cb) {
    cb = options;
  }
  options = options || {};

  if (options.css) {
    var regex = /(<link [^>]*>)/g;
    //TODO ensure it is gist tag?
    //asssume static tag
    //style after body tag as original link tag also after body tag
    text = text.replace(regex, '<style>' + options.css + '</style>');
    console.log('text after replaced with styleTagCss\n' + text)

  }


  var styliner = new Styliner('/', {});
  styliner.processHTML(text)
    .then(function(text) {
      //Directly grep body and put into handlebars will be more efficient? need test
      // console.log('[source]\n' + source);
      //slow impl TODO find a better html parser


      // resanitize
      var enmlUnsafeAttrs = ['rel', 'id', 'class', 'clear', 'target', 'onclick', 'ondblclick', 'onmousedown', 'onmousemove', 'onmouseover', 'onmouseout', 'onmouseup', 'onkeydown', 'onkeypress', 'onkeyup', 'onabort', 'onerror', 'onload', 'onresize', 'onscroll', 'onunload', 'onblur', 'onchange', 'onfocus', 'onreset', 'onselect', 'onsubmit'];

      text = resanitize.stripUnsafeAttrs(text, enmlUnsafeAttrs);

      // //TODO use chain .replace
      text = text.replace(/<\/*html>/g, '')
        .replace(/<\/?head>/g, '').replace(/<(\/?)body[^>]*>/g, '<$1div>')
      //convert body to div & keep the styles
      .replace(/<\/?meta[^>]*>/g, '');

      text = text.replace(/<\/?style[^<]*<\/style>/g, '');

      //default host
      //replace with defaultDomain
      if (options.defaultDomain) {
        text = exports.addHostUrlToHref(text, options.defaultDomain);
      }


      //also link. pull stuff in style sheet to here??
      writer.writeRaw(text);
      //previously worked. pasting it directly to client, what is its enml?
    }).then(function() {
      writer.endDocument();
      if (cb) {
        cb(null, writer.toString());
      }
    });


  // var lines = text.match(/^.*((\r\n|\n|\r)|$)/gm);
}

module.exports.ENMLOfHTML = ENMLOfHTML;
//alias
module.exports.enmlOfHtml = ENMLOfHTML;