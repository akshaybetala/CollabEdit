pps = []
my_client_id = 0
document.getElementById("filecontent").addEventListener("keydown", checkInput);


$(document).ready(function(){
    var socket = io.connect();

    socket.on('initialize-client',function(msg){
    	console.log(msg.pps);
    	initPPSAndEditor(msg.pps)
    	my_client_id = msg.client_id
    });

    socket.on('server-operation',function(operation){
    	console.log("operation from server")
    	if(my_client_id == operation.client_id) {
    		console.log('client id same')
    		return
    	}

    	console.log(operation);
    	entry = operation.value
    	pos = insertOrEditEntryInPPS(entry)
    	if(operation.type = "Insert") {
    		insertChar(entry[1],pos)
    	} else {
			deleteChar(pos)    		 
    	}

    });

    
});

function checkInput(event){
    //console.log(event.keyCode)
    //console.log(document.getElementById("filecontent").selectionStart + 1);
    pos = document.getElementById("filecontent").selectionStart;
    key = event.keyCode
    dict = {}
    if(event.keyCode == '8') {
    	if(pos == 0) {
    		return;
    	}  
    	
    	dict['client_id'] = my_client_id 	
    	dict['ppi'] = getDeletePPIPos(pos)
    	dict['type'] = "Delete"
    	console.log("deleye called at pos" + pos);
    	
    } else {
    	if(key > 90 || key < 65) {
    		return;
    	}
    	console.log("char inserted at pos - " + (pos +1) + " " + key )
	    dict = {}
	    ppi_interval = getPPIInterval(pos + 1);
	    console.log(ppi_interval)
	    dict['type'] = "Insert";
	    dict['start_ppi'] = ppi_interval[0];
	    dict['end_ppi'] = ppi_interval[1]; 
	    dict['value'] = String.fromCharCode(event.which);
	    dict['client_id'] = my_client_id
	    
    }

    $.ajax({
    	type:"POST",
    	url: '/apply-operation', 
    	data: JSON.stringify(dict, null, '\t'),
    	contentType: 'application/json;charset=UTF-8',
    	success: function(result){
    		console.log(result)
	    	if(result.result.type == 'Insert') {

	    		entry = result.result.value
	    		console.log('position received from server -')
	    		console.log(entry)
	    	} else {
	    		entry = [result.result.ppi, '', false]
	    	}
	    	insertOrEditEntryInPPS(entry)

	    }
	})
    
    
}

function getDeletePPIPos(pos) {
	pos--;
	console.log('pos from editor to be deleted: ' + pos)
	temp = 0
	for (i = 0; i < pps.length; i++) {
		if(pps[i][2] == true) {
			if(pos == temp ) {
				return pps[i][0]
			} else {
				temp++;
			}
		}
	}
	return -1
}

function getPPIInterval(pos) {

	console.log('previous pps - ' + pps)
	console.log('po for ppiinterval - ' + pos)
	count = pos
	ppi_interval = [-2,-2]
	i = 0;
	while(count>0 && i < pps.length){
		if(pps[i][2] == true) {
			count--;
		}

		i++;
	}

	ppi_interval = [pps[i-2][0],pps[i-1][0]]	
	return ppi_interval

	// for( ; i < pps.length; i++) {
	// 	if(pps[i][2] == true) {
	// 		count++
	// 	}
	// 	if(count == pos) {
	// 		ppi_interval = [pps[i-1][0],pps[i][0]]
	// 		return
	// 	}			
	// }
	// ppi_interval = [pps[pps.length-2][0],pps[pps.length-1][0]]
	// return ppi_interval
}

function initPPSAndEditor(iniDoc) {
	document.getElementById("filecontent").value = ""	
	editorPos = 0;
	for(i = 0; i < iniDoc.length ; i++ ) {
		entry = iniDoc[i]
		console.log(entry);
		insertOrEditEntryInPPS(entry);
		if(entry[2] == true) {
			console.log('init editor with character')
			console.log(editorPos,entry[1])
			insertChar(entry[1],editorPos-1);
			editorPos++;
		}
	}
	console.log(pps)
}

function insertOrEditEntryInPPS(entry) {
	console.log('inseting in to pps')
	console.log(pps)
	console.log(entry)
	editorPos = 1;
	if(pps.length == 0) {
		pps.push(entry);
		return editorPos;
	}
	insertPosition = 0;

	for(j = 0; j< pps.length; j++) {
		e = pps[j]
		if(e[0] == entry[0]) {
			e[2] = entry[2]
			return -1
		}
		else if(e[0] < entry[0]) {
			if(e[2] == true) {
				editorPos++;
			}
			insertPosition ++ ;
		}
		else {
			break;
		} 
	}
	pps.splice(insertPosition,0,entry);
	console.log('inserting at position - ' + insertPosition)
	console.log('after inserting')
	console.log(pps)
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