from flask import Flask, Response
from pymongo import MongoClient
import json
from bson import json_util

app = Flask(__name__)

@app.route('/')
def index():
    client = MongoClient('mongodb://localhost:27017/')
    db = client.local 
    coll = db.temps
    #list = [doc for doc in coll.find()]
    # print(list)
    list = [{"when": doc['time'], "temp": doc['value']} for doc in coll.find()]
    print(str(len(list)) + ' temp records found')

    jList = json_util.dumps(list)
    # print(jList)
    return Response(jList, mimetype='application/json')

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0')
