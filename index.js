var fs = require('fs');
const jsdom = require("jsdom");
const { JSDOM } = jsdom;

exports.BookML = function() {

  this.toc = {};

  this.hello = function(){
    return "Hello, BookML";
  }

  this.read = function(filename){
    return fs.readFileSync(filename).toString();
  }

  this.isHeading = function(tag) {
    const headings = ['H1', 'H2', 'H3'];
    return headings.indexOf(tag) >= 0 ? true : false;
  }

  this.process = function(){
    var source = new JSDOM(this.read("sample/sample.html"));
    var output = new JSDOM();

    var style = output.window.document.createElement("style");
    style.textContent = this.read("sample/sample.css");
    output.window.document.head.appendChild(style);

    source.window.document.body.childNodes.forEach(function(element) {

        if (this.isHeading(element.tagName)) {
             var span = output.window.document.createElement("span");
             span.innerHTML = element.innerHTML;

             element.innerHTML = "";
             element.appendChild(span);
             element.classList.add("heading");
             element.classList.add("heading-" + element.tagName);

        }

        output.window.document.body.appendChild(element);
    }, this);



    return output.serialize();

  }
}