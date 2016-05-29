from __future__ import division
import numpy as np
import Queue
import bisect
import threading

class pps(object):

	def __init__(self,id):
		self.positions = [0.0,1.0]
		self.values = ['$0','$1']
		self.Flag = [False,False]
		self.lock = threading.RLock()


	def index(self,ppi):
	    'Locate the index of the ppi'
	    i = bisect_left(self.positions,ppi)
	    if i != len(self.positions) and self.positions[i] == ppi:
	        return i
	    raise ValueError

	def apply_operation(self,operation):
		with self.lock:

			if operation['type'] is 'Insert':
				return_operation =  self.apply_insert_operation(operation)
			elif operation['type'] is 'Delete':
				return_operation = self.apply_delete_operation(operation)

			return return_operation

	def apply_insert_operation(self,operation):
		with self.lock:
			client_id = operation['client_id']
			start_ppi = operation['start_ppi']
			end_ppi = operation['end_ppi']
			value = operation['value']

			end_index = self.index(end_ppi)
			insert_ppi = self.get_new_position(end_index-1, end_index)
			self.positions.insert(end_index, insert_ppi)
			self.Flag.insert(end_index, True)
			self.value.insert(end_index, value)

			return_operation = {'client_id':client_id,
								'value':(insert_ppi,True,value),
								'type':'Insert'}

	def apply_delete_operation(self,operation):
		with self.lock:
			ppi = operation['ppi']
			client_id = operation['client_id']
			ppi_index = self.index(ppi)
			self.Flag[index] = False

			return_operation = {'client_id':client_id,
								'type':'Delete',
								'ppi': ppi}

			return return_operation

	def get_pps(self):
		with self.lock:
			return zip(self.positions,self.values,self.Flag)
