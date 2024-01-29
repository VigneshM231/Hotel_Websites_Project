from flask import Flask, jsonify, request
from flask_marshmallow import Marshmallow #ModuleNotFoundError: No module named 'flask_marshmallow' = pip install flask-marshmallow https://pypi.org/project/flask-
from flask_cors import CORS, cross_origin #ModuleNotFoundError: No module named 'flask_cors' = pip install Flask-Cors
from models import db, Users
from werkzeug.utils import secure_filename
import os

app = Flask(__name__)
 
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///flaskdb.db'
app.config['ALLOWED_EXTENSIONS'] = {'jpg', 'jpeg', 'png', 'gif'}

UPLOAD_FOLDER = 'static/uploads'
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in app.config['ALLOWED_EXTENSIONS']

CORS(app, supports_credentials=True)
 
db.init_app(app)
        
with app.app_context():
    db.create_all()
 
ma=Marshmallow(app)
 
class UserSchema(ma.Schema):
    class Meta:
        fields = ('id','name','details')
  
user_schema = UserSchema() # one
users_schema = UserSchema(many=True) # many
  
'''@app.route("/")
def hello_world():
    return "<p>Hello, World!</p>"'''
 
@app.route('/users', methods=['GET']) 
def listusers():
    all_users = Users.query.all()
    results = users_schema.dump(all_users)
    return jsonify(results)

 
@app.route('/users/<name>', methods=['GET']) 
def listuser(name):
    all_users = Users.query.filter_by(name=name).all()
    results = users_schema.dump(all_users) # id name details
    return jsonify(results)
  
'''@app.route('/userdetails/<id>',methods =['GET'])
def userdetails(id):
    user = Users.query.get(id)
    return user_schema.jsonify(user)'''

  
@app.route('/userupdate/<name>', methods=['PUT'])
def userupdate(name):
    users = Users.query.filter_by(name=name).all()
    print(users)
    if users:
        try:
            new_name = request.json['new_name']
            #print("new_name", new_name)
            os.rename(os.path.join(app.config['UPLOAD_FOLDER'], name), os.path.join(app.config['UPLOAD_FOLDER'], new_name))
            for user in users:
                user.id = user.id
                user.name = new_name
                user.details = user.details
                db.session.commit()
            return jsonify({"message": "User updated successfully"})
            
        except Exception as e:
            print(str(e))
            db.session.rollback()
            return jsonify({"message": "Internal Server Error"}), 500
    else:
        return jsonify({"message": "User not found"}), 404

 
'''@app.route('/userdelete/<id>',methods=['DELETE'])
def userdelete(id):
    user = Users.query.get(id)
    db.session.delete(user)
    db.session.commit()
    return user_schema.jsonify(user)'''

@app.route('/userdelete/<name>/<int:id>', methods=['DELETE'])
def userdeletename(name, id):
    user = Users.query.filter_by(name=name, id=id).first()

    if user:
        db.session.delete(user)
        db.session.commit()
        return user_schema.jsonify(user)
    else:
        return jsonify({"message": "User not found"}), 404
  
@app.route('/newuser',methods=['POST'])
def newuser():
    # check if the post request has the file part
    if 'details' not in request.files:
        resp = jsonify({
            "message": 'No file part in the request',
            "status": 'failed'
        })
        resp.status_code = 400
        return resp
    name = request.form.get('name')
    files = request.files.getlist('details')
    
    errors = {}
    success = False
    os.makedirs(os.path.join(app.config['UPLOAD_FOLDER'], name))
    for file in files:
        if file and allowed_file(file.filename):
            filename = secure_filename(file.filename)
            filepath = os.path.join(app.config['UPLOAD_FOLDER'], name, filename)
            file.save(filepath)
 
            users = Users(name=name, details=filename)
            db.session.add(users)
            db.session.commit()
            success = True
        else:
            resp = jsonify({
                "message": 'No file part in the request',
                "status": 'failed'
            })
            return resp
    if success and errors:
        errors['message'] = 'File(s) successfully uploaded'
        errors['status'] = 'failed'
        resp = jsonify(errors)
        resp.status_code = 500
        return resp
    
    if success:
        resp = jsonify({
            "message": 'Files successfully uploaded',
            "status": 'successs'
        })
        resp.status_code = 201
        return resp
 
if __name__ == "__main__":
    app.run(debug=True)