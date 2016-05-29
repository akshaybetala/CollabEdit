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
	return_operation = global_pps.apply_operation(opeartion)
	print return_operation
	return jsonify(result=return_operation)
	

if __name__ == "__main__":
	socketio.run(app, host='0.0.0.0')
	# app.run()
