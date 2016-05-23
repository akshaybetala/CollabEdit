from flask import Flask, render_template, request, jsonify
app = Flask(__name__)

pps = [[1,'a',True],[2,'b',True],[3,'c',True],[4,'d',True]]

@app.route("/")
def main():
	return render_template('index.html')

@app.route('/_load',methods=['POST'])
def add_numbers():
    return jsonify(result=pps)

if __name__ == "__main__":
	app.run()
