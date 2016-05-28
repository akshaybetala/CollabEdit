import numpy as np
import PPS
import threading
import Queue
import time

class Client(object):

	def __init__(self, id):
		self.id = id
		self.pps1 = PPS.PPS(id)
		self.pps2 = PPS.PPS(id)
		print 'init'
		self.operations_from_editor = Queue.PriorityQueue()

		self.thread1 = threading.Thread(target=self.recieve_operation_from_server)
		self.thread1.start()

		self.thread2 = threading.Thread(target=self.perform_operations_from_editor)
		self.thread2.start()
		# thread.start_new_thread(self.recieve_operation_from_server,())
		# thread.start_new_thread(self.perform_operations_from_editor,())

	def recieve_operation_from_server(self):
		# infinite loop to get operations from server:
		operation1 = {'timestamp':1,
			'type':'add',
			'position':.2,
			'value':'z'}

		operation2 = {'timestamp':10,
			'type':'add',
			'position':.6,
			'value':'z'}

		self.pps2.apply_server_operation(operation1)
		self.pps2.apply_server_operation(operation2)

		self.pps1.add_operation_to_server_queue(operation1)
		self.pps1.add_operation_to_server_queue(operation2)
		
	def recieve_operation_from_editor(self,operation):
		self.operations_from_editor.put(operation)
		
	def perform_operations_from_editor(self):
		while True:
			if self.operations_from_editor.empty() == False:
				self.pps1.perform_operation(self.operations_from_editor.get())
			else:
				time.sleep(1)


operation3 = {'timestamp':2,
			'last_applied_timestamp':1,
			'type':'insert',
			'position':1,
			'value':'x'}

operation4 = {'timestamp':13,
			'last_applied_timestamp':11,
			'type':'insert',
			'position':2,
			'value':'x'}

client = Client('id')
client.pps2.printObj()
client.recieve_operation_from_editor(operation3)
client.recieve_operation_from_editor(operation4)
client.thread2.join()
client.pps1.printObj()
