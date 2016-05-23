document.getElementById("filecontent").addEventListener("keydown", checkInput);



function checkInput(event){
    //console.log(event.keyCode)
    //console.log(document.getElementById("filecontent").selectionStart);
}


function insertChar() {
	console.log("insertChar called")
	var char = 'x'
	var pos = document.getElementById("pos").value
	//take char and pos as input.
	console.log(pos)
	var textElem = document.getElementById("filecontent");
	var content = textElem.value;
	var currentPos = textElem.selectionStart;
	var finalPos = -1;
	if(pos > content.length) {
		return;
	}
	if(pos <= currentPos) {
		finalPos = currentPos + 1;
	} else {
		finalPos = currentPos
	}
	
	textElem.value = (content.substring(0,pos) + char + content.substring(pos))
	textElem.setSelectionRange(finalPos,finalPos);

}