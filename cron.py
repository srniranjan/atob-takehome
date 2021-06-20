import os
import requests
import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore

def write_doc(collection, id, doc):
  doc_ref = db.collection(collection).document(id)
  doc_ref.set(doc)

cred = credentials.Certificate(os.path.join('.', 'atob-takehome-firebase-adminsdk-njnxl-d1898451fd.json'))
firebase_admin.initialize_app(cred)

db = firestore.client()

cursor_ref = db.collection(u'samsara')
docs = cursor_ref.stream()
docs = [d.to_dict() for d in docs]
params = {"types": "gps"}
if docs and len(docs) > 0 and 'previous_cursor' in docs[0]:
  params['after'] = docs[0]['previous_cursor']
url = "https://api.samsara.com/fleet/vehicles/stats/feed"
headers = {"Authorization": "Bearer samsara_api_K8GPRloiuIexN3SkUa5sD1wg3RELYD"}
secondsToWait = 10
data = {}

while True:
  print(params)
  response = requests.request("GET", url, headers=headers, params=params).json()
  for vehicle in response["data"]:
    data[vehicle['id']] = {
      'name': vehicle['name'], 
      'location': [vehicle['gps'][0]['latitude'], vehicle['gps'][0]['longitude']], 
      'id': vehicle['id']
    }
  params["after"] = response["pagination"]["endCursor"]
  if not response["pagination"]["hasNextPage"] or len(response['data']) <= 0:
    write_doc(u'samsara', u'cursor', {u'previous_cursor': response["pagination"]["endCursor"]})
    break
  print('======')


locations_ref = db.collection(u'truck_locations')
locations = locations_ref.stream()
locations = {l.to_dict()['id']: l.to_dict() for l in locations}
if len(locations) <= 0:
  for id, location in data.items():
    write_doc(u'truck_locations', id, location)
else:
  for id, location in data.items():
    if id not in locations:
      write_doc(u'truck_locations', id, location)
    else:
      old_loc = locations[id]['location']
      new_loc = location['location']
      if old_loc != new_loc:
        write_doc(u'truck_locations', id, location)