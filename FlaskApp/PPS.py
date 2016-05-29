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
	    i = bisect.bisect_left(self.positions,ppi)
	    if i != len(self.positions) and self.positions[i] == ppi:
	        return i
	    raise ValueError

	def apply_operation(self,operation):
		print 'apply_operation'

		with self.lock:
			print 'insert'
			if operation['type'].lower() == 'insert':
				print 	'ye kaha'
				return_operation =  self.apply_insert_operation(operation)
			elif operation['type'].lower() is 'delete':
				return_operation = self.apply_delete_operation(operation)

			print'end'

			return return_operation

	def apply_insert_operation(self,operation):
		print 'here'
		with self.lock:
			print 'here'

			client_id = operation['client_id']
			print client_id
			start_ppi = operation['start_ppi']
			print start_ppi
			end_ppi = operation['end_ppi']
			print end_ppi
			value = operation['value']
			print value

			print 'here'

			end_index = self.index(end_ppi)
			new_ppi = (self.positions[end_index-1] + self.positions[end_index])/2
			self.positions.insert(end_index, new_ppi)
			self.Flag.insert(end_index, True)
			self.values.insert(end_index, value)

			return_operation = {'client_id':client_id,
								'value':(new_ppi,True,value),
								'type':'Insert'}
			return return_operation

	def apply_delete_operation(self,operation):
		with self.lock:
			ppi = operation['ppi']
			client_id = operation['client_id']
			ppi_index = self.index(ppi)
			self.Flag[ppi_index] = False

			return_operation = {'client_id':client_id,
								'type':'Delete',
								'ppi': ppi}

			return return_operation

	def get_pps(self):
		with self.lock:
			return zip(self.positions,self.values,self.Flag)




# id = '123'
# global_pps = pps(id)

# operation = {}

# operation['type'] = "Insert";
# operation['start_ppi'] = 0;
# operation['end_ppi'] = 1 
# operation['value'] = 'a';
# operation['client_id'] = 123123


# print global_pps.apply_operation(operation)

# operation['type'] = "Delete";
# operation['ppi'] = .5;
# operation['client_id'] = 123123

# print global_pps.apply_operation(operation)