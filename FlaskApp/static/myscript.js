pps = []
my_client_id = 0
document.getElementById("filecontent").addEventListener("keydown", checkInput);


$(document).ready(function(){
    var socket = io.connect();

    socket.on('initialize-client',function(msg){
    	pps =msg.pps
    	console.log(pps)
    	initEditor()
    	my_client_id = msg.client_id
    	//console.log('initialized pps ' + pps)
    });

    socket.on('server-operation',function(operation){
    	
    	//console.log('operation received from server: ')
    	//console.log(operation)
    	if(my_client_id == operation.client_id) {
    		return
    	}

    	if(operation.type == "Insert") {
    		//console.log('operation type is insert')
    		pos = applyServerInsertOperation(operation)
    		//console.log('editor pos for server insert : ' + pos)
    		insertChar(entry[1],pos)
    	} else {
    		pos = applyServerDeleteOperation(operation)
    		//console.log('editor pos for server delete : ' + pos)
			deleteChar(pos)    		 
    	}

    });

    
});

function checkInput(event){
    pos = document.getElementById("filecontent").selectionStart;
    
    key = event.keyCode
    operation = {};
    if(event.keyCode == '8') {
    	if(pos == 0) {
    		return;
    	}
    	//console.log("delete input received from user at pos: " + pos)
    	pos--;
    	  
    	operation = createClientDeleteOpeartion(my_client_id, getDeletePPIPos(pos) )
    	
    } else {
    	if(key > 90 || key < 65) {
    		return;
    	}
    	//console.log("insert input received from user at pos: " + pos)
	    ppi_interval = getPPIInterval(pos);
	    operation = createClientInsertOperation(my_client_id, 
	    									ppi_interval[0],
	    									ppi_interval[1],
	    									String.fromCharCode(event.which));
	    

	    console.log('ppi_interval for the insert: ' + ppi_interval)
    }

    $.ajax({
    	type:"POST",
    	url: '/apply-operation', 
    	data: JSON.stringify(operation, null, '\t'),
    	contentType: 'application/json;charset=UTF-8',
    	success: function(operation){
    		
	    	if(operation.type == 'Insert') {
	    		applyServerInsertOperation(operation)

	    	} else {
	    		applyServerDeleteOperation(operation)
	    	}
	    }
	})
}

function createClientInsertOperation(client_id, start_ppi, end_ppi, value){
	operation = {}
	operation['type'] = "Insert";
    operation['start_ppi'] = start_ppi;
    operation['end_ppi'] = end_ppi; 
    operation['value'] = value;
    operation['client_id'] = client_id;
    return operation
}

function createClientDeleteOpeartion(client_id, ppi){
	operation = {}
	operation['client_id'] = client_id 	
    operation['ppi'] = ppi
    operation['type'] = "Delete"    	
    return operation;
}

function getDeletePPIPos(pos) {
	
	for (i = 0; i < pps.length; i++) {
		if(pps[i][2] == true) {
			if(pos == 0 ) {
				return pps[i][0]
			}
			
			pos--;
			
		}
	}
	return -1
}

function getPPIInterval(pos) {
	i = 0;
	while(pos>=0 && i < pps.length){
		if(pps[i][2]==true) pos--;
		i++;
	}

	ppi_interval = [pps[i-2][0],pps[i-1][0]]	
	return ppi_interval

}

//  Block the text editor while initializing
function initEditor() {
	fileValue = ""

	for(i = 0; i < pps.length ; i++ ) {
		if(pps[i][2]==true){
			fileValue+=pps[i][1]
		}
	}
	console.log(fileValue)
	document.getElementById("filecontent").value = fileValue;
}

function applyServerInsertOperation(operation) {
	
	entry = operation.value

	editorPos = 0;
	if(pps.length == 0) {
		pps.push(entry);
		return editorPos;
	}
	insertPosition = 0;

	for(j = 0; j< pps.length; j++) {
		e = pps[j]
		if(e[0] == entry[0]) {
			throw 'Error : cannot insert this entry as it already exists'
			return
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
	return editorPos;
}

function applyServerDeleteOperation(operation) {
	
	entry = [operation.ppi, '', false]
	//console.log('entry received for editing pps' + entry)
	editorPos = 0;
	if(pps.length == 0) {
		pps.push(entry);
		return editorPos;
	}
	insertPosition = 0;
	found = false
	for(j = 0; j< pps.length; j++) {
		e = pps[j]
		if(e[0] == entry[0]) {
			e[2] = entry[2]
			found = true
			break
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
	if(!found) {
		throw 'No entry exists corresponding to this ppi'
	}
	pps.splice(insertPosition,0,entry);
	return editorPos;

}

function insertChar(char, pos) {

	var textElem = document.getElementById("filecontent");
	var content = textElem.value;
	var currentPos = textElem.selectionStart;
	var finalPos = -1;
	if(pos > content.length) {
		return;
	}
	if(pos < currentPos) {
		finalPos = currentPos + 1;
	} else {
		finalPos = currentPos
	}
	
	textElem.value = (content.substring(0,pos) + char + content.substring(pos))
	textElem.setSelectionRange(finalPos,finalPos);
	//console.log("length before inserting - " + textElem.value.length)
}

function deleteChar(pos) {
	var textElem = document.getElementById("filecontent");
	var content = textElem.value;
	var currentPos = textElem.selectionStart;
	var finalPos = -1;
	if(pos > content.length) {
		return;
	}
	if(pos < currentPos) {
		finalPos = currentPos - 1;
	} else {
		finalPos = currentPos
	}
	
	textElem.value = (content.substring(0,pos) + content.substring(pos+1))
	textElem.setSelectionRange(finalPos,finalPos);

}