from flask_sqlalchemy import SQLAlchemy
         
db = SQLAlchemy()
         
class Users(db.Model):
    __tablename__ = "tblusers"
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(150))
    details = db.Column(db.String(150))