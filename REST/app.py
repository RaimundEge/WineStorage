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
    db = client.wine 
    coll = db.temps
    switcher = {
        'all': timedelta(weeks = 52),
        'hour': timedelta(hours = 1),
        '2hours': timedelta(hours = 2),
        '6hours': timedelta(hours = 6),
        '12hours': timedelta(hours = 12),
        'day': timedelta(days = 1),
        '2day': timedelta(days = 2),
        'week': timedelta(weeks = 1),
        'month': timedelta(days = 30),
    }
    compare = datetime.utcnow() - switcher.get(request.args.get('range'), timedelta(hours = 24))
    cursor = coll.find({"time": { "$gt": compare}}, {"_id": 0, "time": 1, "value": 1}) 
    oList = [{"when": doc['time'], "temp": (doc['value']-1.7)} for doc in cursor]   
    #print(str(len(oList)) + ' temp records found')
    if len(oList) > 360:
        div = int(round(len(oList)/360))
        rList = []
        for i in range(len(oList)-1):
            if i%div == 0:
                rList.append(oList[i]) 
        rList.append(oList[len(oList)-1]) 
    else:
        rList = oList    
    print(str(len(rList)) + ' temp records made')
    return Response(json_util.dumps(rList), mimetype='application/json')

if __name__ == '__main__':
    app.run(debug=False, host='0.0.0.0')
