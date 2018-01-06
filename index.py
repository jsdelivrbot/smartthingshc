from httpsig.verify import HeaderVerifier, Verifier
from flask import Flask, request, jsonify

app = Flask(__name__)

def get_public_key():
with open('../resources/smartthings_rsa.pub', 'r') as f:
 return f.read()

@app.route('/', methods=['POST'])
def execute_app():
  content = request.get_json()
  if (content.get('lifecycle') != 'PING':
    hv = HeaderVerifier(headers=request.headers, secret=get_public_key(), method='POST', path='/')
    try:
      if (hv.verify()):
        print 'verified - ok'
        # Signature verified, can now handle all SmartThings lifecycle  requests
        return  '', 200
      else:
        print 'verified - forbidden'
        # Invalid signature, return 403
        return '', 403
    except Exception as e:
      print(e)
      return '', 403
