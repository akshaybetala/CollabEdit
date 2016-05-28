from __future__ import division
import numpy as np
import Queue
import bisect

class PPS(object):

	def __init__(self, id):
		self.positions = [0.0,1.0]
		self.values = ['$0','$1']
		self.id = id
		self.operations_from_server = Queue.PriorityQueue()
		
		# self.positions_set = set()
		# self.positions_set.insert(self.positions[0])
		# self.positions_set.insert(self.positions[1])

	def add_operation_to_server_queue(self, operation):
		timestamp = operation['timestamp']
		self.operations_from_server.put( (timestamp,operation))

	def perform_operation(self,operation):
		print 'operation'
		last_applied_timestamp = operation['last_applied_timestamp']
		while self.operations_from_server.empty() == False:
			print 'while'			
			_timestamp,_operation = self.operations_from_server.get()
			if(_timestamp <= last_applied_timestamp):
				self.apply_server_operation(_operation)
			else:
				self.add_operation_to_server_queue(_operation)
				break

		if(operation['type'] is 'insert'):
			self.insert_character(operation['position'],operation['value'])

	def apply_server_operation(self,operation):
		print 'apply_server_operation'
		if(operation['type'] is 'add'):
			self.insert_position(operation['position'],operation['value'])		

	def insert_character(self, character_pos, value):
		pos2_index = character_pos
		pos1_index = pos2_index-1
		new_position = self.get_new_position(pos1_index, pos2_index)

		# Contact the database and try to add it to the data base. 
		# If successfull, add to the pps, else
		# contact again with new pps between the pps1 & new_position 

		self.add_pos(pos2_index, new_position, value)

	def insert_position(self, position, value):
		pos_index = bisect.bisect(self.positions, position)
		self.add_pos(pos_index,position,value)

	def delete(self, character_pos):
		pos_index = character_pos
		self.positions.pop(pos_index)
		self.values.pop(pos_index)

	def get_new_position(self, pos1_index, pos2_index):
		return (self.positions[pos1_index]+ self.positions[pos2_index])/2

	def add_pos(self, pos_index, position, value):
		self.positions.insert(pos_index, position)
		self.values.insert(pos_index,value)

	def printObj(self):
		print self.positions
		print self.values



