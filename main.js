import './style.css'
import * as monaco from 'monaco-editor';
import * as simplemd from 'simple-markdown';
let mdParse = simplemd.defaultBlockParse;
let mdOutput = simplemd.defaultHtmlOutput;

let editor = monaco.editor.create(document.getElementById('container'), {
	value: "",
	language: 'markdown',
	fontFamily: "Jetbrains Mono",
	lineNumbers: 'off',
	roundedSelection: false,
	scrollBeyondLastLine: false,
	readOnly: false,
	fontSize: "17",
	theme: 'vs-dark'
});
let preview_element = document.getElementById('preview')
let changing_preview = () => {
	let outhtml
	let arrayout = editor.getValue().split('\n')
	if(arrayout[0] !== " ")	{
	arrayout.forEach(element => {
		let syntaxTree = mdParse(element)
		let output = mdOutput(syntaxTree)
		if(output !== undefined){
			outhtml += output
		}
	});
	}
	if(outhtml === undefined){
		preview_element.innerHTML = ""
	}else{
		let acual_out = outhtml.slice(9)
		preview_element.innerHTML = acual_out
	}
}
document.getElementById('container').addEventListener('input',()=>{
	changing_preview()
})
document.getElementById('save').addEventListener("click", ()=>{
	console.log("saving")
	let templink = document.createElement('a')
	let file = new Blob([editor.getValue()], {type: "text/plain"})

	templink.setAttribute('href', URL.createObjectURL(file))
	templink.setAttribute('download', `markdown.md`)
	templink.click()
	URL.revokeObjectURL(templink.href)
})
document.getElementById('open').addEventListener('click' ,()=>{
	let input_file = document.createElement('input')
	input_file.type = 'file'
	input_file.onchange = e => {
		let opening_file = e.target.files[0]
		let reader = new FileReader()
		reader.readAsText(opening_file, 'UTF-8')
		reader.onload = renderEvent => {
			let content = renderEvent.target.result
			console.log(content)
			editor.setValue(content)
			changing_preview()
		}

	} 
	input_file.click()
})