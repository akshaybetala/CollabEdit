pps = []

document.getElementById("filecontent").addEventListener("keydown", checkInput);


$(document).ready(function(){
    var socket = io.connect();

    socket.on('initialize-client',function(msg){
    	console.log(msg);
    	initPPSAndEditor(msg)
    });

    socket.on('server-operation',function(operation){
    	console.log(operation);

    });

    
});




function checkInput(event){
    //console.log(event.keyCode)
    //console.log(document.getElementById("filecontent").selectionStart);
}

function initPPSAndEditor(iniDoc) {
	document.getElementById("filecontent").value = ""	
	editorPos = 0;
	for(i = 0; i < iniDoc.length ; i++ ) {
		entry = iniDoc[i]
		insertOrEditEntryInPPS(entry);
		if(entry[2] == true) {
			insertChar(entry[1],editorPos);
			editorPos++;
		}
	}
	console.log(pps)
}

function insertOrEditEntryInPPS(entry) {
	editorPos = 0;
	if(pps.length == 0) {
		pps.push(entry);
		return editorPos;
	}
	tempPPIListPosition = 0;

	for(e in pps) {
		if(e[2] == true) {
			editorPos++;
		}
		if(e[0] == entry[0]) {
			e[1] = entry[1];
			e[2] = entry[2];
			return -1;
		}
		else if(e[0] < entry[0]) {
			tempPPIListPosition++;
		} 
		else {
			break;
		}
	}
	pps.splice(tempPPIListPosition,0,entry);
	return editorPos;

}

function insertChar(char, pos) {
	console.log("insertChar called")

	// var char = 'x'
	// var pos = document.getElementById("pos").value
	//take char and pos as input.
	//console.log(pos)
	var textElem = document.getElementById("filecontent");
	//console.log("length before inserting - " + textElem.value.length)
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
	//console.log("length before inserting - " + textElem.value.length)
}

function deleteChar(pos) {
	console.log("deleteChar called")
	//var pos = document.getElementById("pos").value
	console.log(pos)
	var textElem = document.getElementById("filecontent");
	var content = textElem.value;
	var currentPos = textElem.selectionStart;
	var finalPos = -1;
	if(pos > content.length) {
		return;
	}
	if(pos <= currentPos) {
		finalPos = currentPos - 1;
	} else {
		finalPos = currentPos
	}
	
	textElem.value = (content.substring(0,pos) + content.substring(pos+1))
	textElem.setSelectionRange(finalPos,finalPos);

}