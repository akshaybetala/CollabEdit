import redis

def Client(object):

	def __init__(self, server_ip, server_port, filename):
		config = {
		'host': 'localhost',
		'port': 6379,
		'db': 0,
		}

		self.r = redis.StrictRedis(**config)
		self.pubsub = self.r.pubsub()
		self.pubsub.subscribe(filename)
		start_new_thread(read_data,(self))

	def write(data):
		
	def work(data):
		print data

	def read_data():
		while True:
			for item in self.pubsub.listen():

			clientsocket.read()


client = Client(server_ip,server_port)



