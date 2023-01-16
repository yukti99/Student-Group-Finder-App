import firebase_admin
from firebase_admin import firestore

def init_firestore():
    import firebase_admin
    from firebase_admin import credentials
    from firebase_admin import firestore

    # Use a service account.
    cred = credentials.Certificate('service_account.json')
    app = firebase_admin.initialize_app(cred)
    db = firestore.client()

def read_data(collection_name, doc_name):
    db = firestore.client()
    doc_ref = db.collection(collection_name).document(doc_name)
    doc = doc_ref.get()
    if doc.exists:
        return f'data: {doc.to_dict()}'
    return "Document does not exist."

def read_alldocs(collection_name):
    db = firestore.client()
    docs = db.collection(collection_name).stream()
    docs_list = []
    for doc in docs:
        docs_list.append(doc.to_dict())
    return docs_list

def add_data(collection_name, doc_name, data):
    db = firestore.client()
    doc_ref = db.collection(collection_name).document(doc_name)
    doc_ref.set(data)

def delete_data(collection_name, doc_name):
    db = firestore.client()
    doc_ref = db.collection(collection_name).document(doc_name)
    doc_ref.delete()
