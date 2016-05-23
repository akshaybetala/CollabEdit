from flask import Flask, render_template
app = Flask(__name__)
	
@app.route("/")
def main():
	return render_template('index.html')

@app.route('/_test')
def add_numbers():
    a = request.args.get('a', 0, type=int)
    print a


if __name__ == "__main__":
	app.run()
