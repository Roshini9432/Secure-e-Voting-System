import sqlite3
import smtplib
import math,random
from flask import Flask,request,json,jsonify
from flask_redis import FlaskRedis
from email.message import EmailMessage

app=Flask(__name__)
app.config['REDIS_URL'] = 'redis://localhost:6379/0'
redis_client = FlaskRedis(app)

@app.route('/',methods=['GET','POST'])
def open():  
    return{
        'Result': 'Connection Made'
    }
@app.route('/api/userCheck',methods=['POST'])
def checkUser():
    request_data = json.loads(request.data)
    voter_id=request_data['voter_id']
    mail=request_data['mail_id']
    password=request_data['password']
    voter_id=voter_id.strip()
    mail=mail.strip()
    password=password.strip()

    con = sqlite3.connect("voter_db.db")  
    cur = con.cursor()
    find_user = 'select * from details where voter_id=? and mail_id=? and password=?'
    cur.execute(find_user,[(voter_id),(mail),(password)])
    user = cur.fetchone()
    if user is None:
        return jsonify({'status': 'Authentication Failed'})
    else:
        pin=generateOTP()
        if(sendMail(mail,pin)):
            redis_client.setex(voter_id,180,pin)
            return jsonify({'status' : 'Super Pin Sent...'})
        else:
            return jsonify({'status': 'Mail Delievery Failed...'})

@app.route('/api/electionCommissionCheck',methods=['POST'])
def checkElectionCommission():
    request_data = json.loads(request.data)
    election_commission_id=request_data['election_commission_id']
    mail=request_data['mail_id']
    password=request_data['password']
    election_commission_id=election_commission_id.strip()
    mail=mail.strip()
    password=password.strip()


    con = sqlite3.connect("voter_db.db")  
    cur = con.cursor()
    find_user = 'select * from election_commission_details where election_commission_id=? and mail_id=? and password=?'
    cur.execute(find_user,[(election_commission_id),(mail),(password)])
    user = cur.fetchone()
    if user is None:
        return jsonify({'status': 'Authentication Failed'})
    else:
        pin=generateOTP()
        if(sendMail(mail,pin)):
            redis_client.setex(election_commission_id,180,pin)
            return jsonify({'status' : 'Super Pin Sent...'})
        else:
            return jsonify({'status': 'Mail Delievery Failed...'})

@app.route('/api/verifyPin',methods=['POST'])
def verifyPin():
    request_data = json.loads(request.data)
    voter_id=request_data['voter_id']
    pin=request_data['pin']
    pin_id=redis_client.get(voter_id)

    if pin_id is None:
        return jsonify({'status': 'Super Pin Expired...'})
    else:
        if pin == pin_id.decode():
            return jsonify({'status' : '' })
        else:
            return jsonify({'status' : 'Invalid Super-Pin...' })

@app.route('/api/verifyPinElectionCommission',methods=['POST'])
def verifyPinElectionCommission():
    request_data = json.loads(request.data)
    election_commission_id=request_data['election_commission_id']
    pin=request_data['pin']
    pin_id=redis_client.get(election_commission_id)

    if pin_id is None:
        return jsonify({'status': 'Super Pin Expired...'})
    else:
        if pin == pin_id.decode():
            return jsonify({'status' : '' })
        else:
            return jsonify({'status' : 'Invalid Super-Pin...' })
    


@app.route('/api/userVote',methods=['POST'])
def userVote():
    request_data = json.loads(request.data)
    party_id=request_data['party_id']
    voter_id=request_data['voter_id']
    party_id=party_id.strip()
    con = sqlite3.connect("voter_db.db")  
    cur = con.cursor()
    find_user = 'update voting_details set count=count+1 where party_id=?'
    cur.execute(find_user,[(party_id)])
    status = 'YES'
    vote_user = 'insert into voter_status values(?,?) '
    cur.execute(vote_user,[(voter_id),(status)])
    con.commit()
    return {
        '':''
    }

@app.route('/api/publishResults',methods=['POST'])
def publishResult():
    request_data = json.loads(request.data)
    election_id=request_data['election_id']
    election_id=election_id.strip()
    status='YES'
    con = sqlite3.connect("voter_db.db")  
    cur = con.cursor()
    find_status = 'select status from election_status where election_id=?'
    cur.execute(find_status,[(election_id)])
    data = cur.fetchone()
    result = data[0]
    if(result == 'NO'):
        change_status = 'update election_status set status=? where election_id=?'
        cur.execute(change_status,[(status),(election_id)])
        con.commit()
        return jsonify({'':''})
    else:
        return jsonify({'status' : 'YES'})

@app.route('/api/checkStatus',methods=['POST'])
def checkStatus():
    request_data = json.loads(request.data)
    election_id=request_data['election_id']
    election_id=election_id.strip()
    con = sqlite3.connect("voter_db.db")  
    cur = con.cursor()
    find_user = 'select status from election_status where election_id=?'
    cur.execute(find_user,[(election_id)])
    election = cur.fetchone()
    status = election[0]
    if status=='YES':
        return jsonify({'status' : status})
    else:
        return jsonify({'status' : ''})
   

@app.route('/api/forgotPassword',methods=['POST'])
def forgotPassword():
    request_data = json.loads(request.data)
    voter_id=request_data['voter_id']
    mail=request_data['mail_id']
    password=request_data['password']
    voter_id=voter_id.strip()
    mail=mail.strip()
    password=password.strip()

    con = sqlite3.connect("voter_db.db")  
    cur = con.cursor()
    find_user = 'select * from details where voter_id=? and mail_id=?'
    cur.execute(find_user,[(voter_id),(mail)])
    user = cur.fetchone()
    if user is None:
        return jsonify({'status': 'Authentication Failed'})
    else:
        find_user = 'update details set password=? where voter_id=? and mail_id=?'
        cur.execute(find_user,[(password),(voter_id),(mail)])
        con.commit()
        return jsonify({'status': ''})

@app.route('/api/forgotPasswordElectionCommission',methods=['POST'])
def forgotPasswordElectionCommission():
    request_data = json.loads(request.data)
    election_commission_id=request_data['election_commission_id']
    mail=request_data['mail_id']
    password=request_data['password']
    election_commission_id=election_commission_id.strip()
    mail=mail.strip()
    password=password.strip()

    con = sqlite3.connect("voter_db.db")  
    cur = con.cursor()
    find_user = 'select * from election_commission_details where election_commission_id=? and mail_id=?'
    cur.execute(find_user,[(election_commission_id),(mail)])
    user = cur.fetchone()
    if user is None:
        return jsonify({'status': 'Authentication Failed'})
    else:
        find_user = 'update election_commission_details set password=? where election_commission_id=? and mail_id=?'
        cur.execute(find_user,[(password),(election_commission_id),(mail)])
        con.commit()
        return jsonify({'status': ''})

@app.route('/api/voteStatus',methods=['POST'])
def voteStatus():
    request_data = json.loads(request.data)
    voter_id=request_data['voter_id']
    con = sqlite3.connect("voter_db.db")  
    cur = con.cursor()
    check_user = 'select status from voter_status where voter_id=?'
    cur.execute(check_user,[(voter_id)])
    user = cur.fetchone()
    result=user[0]
    if result=='YES':
        return jsonify({'status' :'true'})
    else:
        return jsonify({'status' : 'false' })

@app.route('/api/fetchParties',methods=['GET'])
def fetchParties():
    con = sqlite3.connect("voter_db.db")  
    cur = con.cursor()
    cur.execute('select * from parties')
    data = [
        dict(party_id=row[0], party_name=row[1], candidate_name=row[2])
        for row in cur.fetchall()
    ]
    if data is not None:
        return jsonify(data)

@app.route('/api/fetchResults',methods=['GET'])
def fetchResults():
    con = sqlite3.connect("voter_db.db")  
    cur = con.cursor()
    cur.execute('select * from voting_details')
    data = [
        dict(party_id=row[0], count=row[1])
        for row in cur.fetchall()
    ]
    if data is not None:
        return jsonify(data)

def generateOTP() :
  
    string = '#*@0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
    otp = ""
    length = len(string)
    for i in range(6) :
        otp += string[math.floor(random.random() * length)]
    return otp

def sendMail(mail,pin):
    otpstr = "Your OTP for Secure Voting is ' "+ pin +" '.\nPlease do not Share this Code with Others."
    
    msg = EmailMessage()
    msg.set_content(otpstr)
    
    sender='secureevoting5@gmail.com'
    
    msg['Subject'] = 'OTP - Secure E-Voting'
    msg['From'] = sender
    msg['To'] = mail
    
    server = smtplib.SMTP_SSL('smtp.gmail.com', 465)
    server.login(sender, "#12345678@")
    try:
        server.send_message(msg)
        return 1
    except:
        return 0
    server.quit()
    

    
   

if __name__ == '__main__':
    app.run(debug=True)

