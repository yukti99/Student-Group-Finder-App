
import json
import uuid
from flask import Flask
from flask import render_template
from flask import Response, request, jsonify
from firestore import *

import pyrebase
from flask import flash, redirect, render_template, request, session, abort, url_for

app = Flask(__name__)

#------------------------------------------------------
# Enter your Firebase configuration details here
#------------------------------------------------------
config = {
  "apiKey": "",
  "authDomain": "",
  "databaseURL": "",
  "storageBucket": ""
}

#initialize firebase
firebase = pyrebase.initialize_app(config)
auth = firebase.auth()
db = firebase.database()

#Initialze person as dictionary
person = {"is_logged_in": False, "name": "", "email": "", "uid": ""}


# initializing Firestore connection
init_firestore()

COLLECTION = "items"


@app.route('/')
def login():
   return render_template('login.html')   

@app.route('/signup')
def signup():
   return render_template('signup.html')   

#Welcome page
@app.route("/home")
def home():
    if person["is_logged_in"] == True:
        return render_template("home.html", email = person["email"], username = person["name"])   
    else:
        return redirect(url_for('login'))


@app.route('/exploreGroups')
def exploreGroups():
   # get the information about all the groups
    db = firestore.client()
    docs = db.collection("groups").stream()
    group_list = []
    for doc in docs:
        group_list.append(doc.to_dict())
    return render_template('exploreGroups.html', email = person["email"], username = person["name"], groups = group_list)   

@app.route('/createGroups')
def createGroups():
    return render_template('createGroups.html', email = person["email"], username = person["name"])  

@app.route('/myGroups')
def myGroups():
    results = []
    db = firestore.client()
    docs = db.collection("groups").stream()
    for doc in docs:
        g = doc.to_dict()
        member_emails = g["members"]
        if person["email"] in member_emails:
            results.append(g)
    return render_template('myGroups.html', email = person["email"], username = person["name"], results=results)    


@app.route('/search/<query>')
def search(query):
    results = []
    q = query.lower()
    groups = read_alldocs("groups")
    for g in groups:
        if q in g["name"].lower() and g not in results:
            results.append(g)
        if q in g["desp"].lower() and g not in results:
            results.append(g)
    return render_template('search_results.html', email = person["email"], username = person["name"], results=results, search_text=query) 
  
@app.route('/view/<id>')
def viewGroup(id=None):
    db = firestore.client()
    docs = db.collection("groups").stream()
    group_list = []
    for doc in docs:
        group_list.append(doc.to_dict())
    group = list(filter(lambda r: r['id'] == id, group_list))[0]
    return render_template('viewGroup.html', email = person["email"], username = person["name"], group = group) 


@app.route('/exit', methods=['GET', 'POST'])
def exitGroup():
    json_data = request.get_json()  
    group = json_data["group"]
    leaving_member_email = json_data["leaving_member"]
    print(group, leaving_member_email)
    flag = True

    # deleting user from group's list of members
    db = firestore.client()
    g_ref = db.collection("groups").document(group["id"])
    existing_members = g_ref.get().to_dict()["members"]
    if leaving_member_email in existing_members:
        existing_members.remove(leaving_member_email)
        if len(existing_members) == 0:
            g_ref.delete()
        else:
            g_ref.update({
                "members": existing_members
            })
    else:
        flag = False

    # deleting the group from user's list of groups
    doc_ref = db.collection("usergroups").document(leaving_member_email)
    doc = doc_ref.get()
    if doc.exists:
        existing_groups = doc.to_dict()["groups"]
        if group["id"] in existing_groups:
            existing_groups.remove(group["id"])
            g = {"groups":existing_groups}
            add_data("usergroups", leaving_member_email, g)
        else:
            flag = False

    return jsonify(flag = flag)


@app.route('/join', methods=['GET', 'POST'])
def joinGroup():
    json_data = request.get_json()  
    group = json_data["group"]
    new_member_email = json_data["new_member"]
    print(group, new_member_email)
    flag = True
    # adding user to group's list of members
    db = firestore.client()
    g_ref = db.collection("groups").document(group["id"])
    existing_members = g_ref.get().to_dict()["members"]
    if new_member_email not in existing_members:
        existing_members.append(new_member_email)
        g_ref.update({
            "members": existing_members
        })
    else:
        flag = False

    # adding the group to user's list of groups
    doc_ref = db.collection("usergroups").document(new_member_email)
    doc = doc_ref.get()
    if doc.exists:
        existing_groups = doc.to_dict()["groups"]
        if group["id"] not in existing_groups:
            existing_groups.append(group["id"])
            g = {"groups":existing_groups}
            add_data("usergroups", new_member_email, g)
        else:
            flag = False
    else:
        g = {"groups":[group["id"]]}
        add_data("usergroups", new_member_email, g)

    return jsonify(flag = flag)



@app.route('/create', methods=['GET', 'POST'])
def create():
    json_data = request.get_json()  
    new_group = json_data["new_group"]
    # creating group-id
    id = str(uuid.uuid1())
    new_group["id"] = id

    # creating member list
    member_list = [new_group["creator"]]
    new_group["members"] = member_list

    # creating new group
    add_data("groups", id, new_group)

    # adding group to user email
    db = firestore.client()
    doc_ref = db.collection("usergroups").document(new_group["creator"])
    doc = doc_ref.get()
    if doc.exists:
        existing_groups = doc.to_dict()["groups"]
        existing_groups.append(new_group["id"])
        g = {"groups":existing_groups}
        add_data("usergroups", new_group["creator"], g)
    else:
        g = {"groups":[new_group["id"]]}
        add_data("usergroups", new_group["creator"], g)
    
    groups = read_alldocs("groups")
    return jsonify(groups = groups)

#If someone clicks on login, they are redirected to /result
@app.route("/result", methods = ["POST", "GET"])
def result():
    if request.method == "POST":        #Only if data has been posted
        result = request.form           #Get the data
        email = result["email"]
        password = result["pass"]
        try:
            #Try signing in the user with the given information
            user = auth.sign_in_with_email_and_password(email, password)
            info = auth.get_account_info(user["idToken"])
            #Insert the user data in the global person
            global person
            person["is_logged_in"] = True
            person["email"] = user["email"]
            person["uid"] = user["localId"]
            db = firestore.client()
            doc_ref = db.collection("users").document(user["email"])
            doc = doc_ref.get()
            # Get the name of the user
            person["name"] = doc.to_dict()["name"]

            #Redirect to welcome page
            return redirect(url_for('home'))
        except:
            #If there is any error, redirect back to login
            print("error occured")
            return redirect(url_for('login'))
    else:
        if person["is_logged_in"] == True:
            return redirect(url_for('home'))
        else:
            return redirect(url_for('signup'))

#If someone clicks on register, they are redirected to /register
@app.route("/register", methods = ["POST", "GET"])
def register():
    if request.method == "POST":        #Only listen to POST
        result = request.form           #Get the data submitted
        email = result["email"]
        password = result["pass"]
        name = result["name"]
        try:
            #Try creating the user account using the provided data
            auth.create_user_with_email_and_password(email, password)
            #Login the user
            user = auth.sign_in_with_email_and_password(email, password)
            #Add data to global person
            global person
            person["is_logged_in"] = True
            person["email"] = user["email"]
            person["uid"] = user["localId"]
            person["name"] = name
            # Append data to the firebase realtime database
            data = {"name": name, "email": email}
            add_data("users", user["email"], data)
            
            #Go to welcome page
            return redirect(url_for('home'))
        except:
            #If there is any error, redirect to register
            return redirect(url_for('register'))

    else:
        if person["is_logged_in"] == True:
            return redirect(url_for('home'))
        else:
            return redirect(url_for('register'))


@app.route('/update', methods=['GET', 'POST'])
def update():
    json_data = request.get_json()  
    new_item = json_data["changes"]
    print(new_item)
    add_data(COLLECTION, json_data["id"], new_item)
    items = read_alldocs(COLLECTION)
    return jsonify(items = items)

@app.route('/delete', methods=['GET', 'POST'])
def delete():
    json_data = request.get_json()  
    print(json_data)
    delete_data(COLLECTION, json_data["id"])
    items = read_alldocs(COLLECTION)
    return jsonify(items = items)

if __name__ == '__main__':
   app.run(debug = True)




