from flask import Flask, Response, request
from pymongo import MongoClient
import json
from bson import json_util
from flask_cors import CORS, cross_origin

app = Flask(__name__)

cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'

@app.route('/')
@cross_origin()
def index():
    print(request.args.get('range'))
    client = MongoClient('mongodb://localhost:27017/')
    db = client.local 
    coll = db.temps
    
    list = [{"when": doc['time'], "temp": doc['value']} for doc in coll.find()]
    print(str(len(list)) + ' temp records found')

    jList = json_util.dumps(list)
    # print(jList)
    return Response(jList, mimetype='application/json')

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0')
