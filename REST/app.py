from flask import Flask, Response, request
from pymongo import MongoClient
import json
from bson import json_util
from flask_cors import CORS, cross_origin
from datetime import datetime, timedelta

app = Flask(__name__)

cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'

@app.route('/')
@cross_origin()
def index():
    # print(request.args.get('range'))
    client = MongoClient('mongodb://localhost:27017/')
    db = client.local 
    coll = db.temps
    switcher = {
        'all': timedelta(weeks = 52),
        'hour': timedelta(hours = 12),
        'day': timedelta(days = 1),
        'week': timedelta(weeks = 1),
        'month': timedelta(days = 30),
    }
    compare = datetime.utcnow() - switcher.get(request.args.get('range'), timedelta(hours = 5))
    mList = coll.find({"time": { "$gt": compare}}) 
    list = [{"when": doc['time'], "temp": doc['value']} for doc in mList]
    print(str(len(list)) + ' temp records found')

    jList = json_util.dumps(list)
    # print(jList)
    return Response(jList, mimetype='application/json')

if __name__ == '__main__':
    app.run(debug=False, host='0.0.0.0')
