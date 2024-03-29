from flask import Flask, render_template, request, jsonify
from flask_socketio import SocketIO, emit, join_room, leave_room, send
from time import sleep
import thread
import json
import PPS

app = Flask(__name__)
socketio = SocketIO(app, async_mode='threading')

id = '123'

sidlist = []
global_pps = PPS.pps(id)
operation = {}

operation['type'] = "Insert";
operation['start_ppi'] = 0;
operation['end_ppi'] = 100 
operation['value'] = 'a';
operation['client_id'] = 123123

global_pps.apply_operation(operation)

@app.route("/")
def main():
	return render_template('index.html')

@socketio.on('connect')
def handle_connect():
    '''
    New connection handler that adds a client to the room list
    :return:
    '''
    app.logger.debug('Got a client in room: ' + str(request.sid))
    sidlist.append(request.sid)
    data = {}
    data['pps'] = global_pps.get_pps()
    data['client_id'] = request.sid
    emit('initialize-client',data)

@socketio.on('disconnect')
def handle_disconnect():
    '''
    Disconnect handler that removes the client from the room list
    :return:
    '''
    app.logger.debug('Removing the room: ' + str(request.sid))
    sidlist.remove(request.sid)

@app.route('/apply-operation',methods=['POST'])
def handle_operation():
    opeartion = request.json
    print opeartion
    return_operation = global_pps.apply_operation(opeartion)
    print return_operation
    socketio.emit('server-operation',return_operation)
    return jsonify(return_operation)
	
@app.route('/reset')
def handle_reset():
	global global_pps
	global_pps = PPS.pps(id)
	operation = {}

	operation['type'] = "Insert";
	operation['start_ppi'] = 0;
	operation['end_ppi'] = 100 
	operation['value'] = 'a';
	operation['client_id'] = 123123

	global_pps.apply_operation(operation)
	return render_template('index.html')


if __name__ == "__main__":
	socketio.run(app, host='0.0.0.0')
	# app.run()
