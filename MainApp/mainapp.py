from flask import Flask, jsonify, render_template
import requests
import json

app = Flask(__name__)

#Get menu
def get_menu():
    response = requests.get("http://localhost:5000/menu")
    return response

def get_payment():
    response = requests.get("http://localhost:5002/payment")
    return response.json()

def menu_detail(menu_id):
    response = requests.get(f"http://localhost:5000/menu/{menu_id}")
    return response.json()

def get_order(order_id):
    response = requests.post(f"http://localhost:5001/order/{order_id}")
    return response.json()

@app.route('/menu')
def all_menu():
    response = get_menu()
    menu_data = response.content.decode('utf-8')  # Decode bytes data to string
    menu_json = json.loads(menu_data)  # Parse JSON data from string
    return render_template('index.html', menu=menu_json)

@app.route('/order/<int:id>')
def order(id):
    order_info = get_order(id)
    response = get_menu()
    menu_data = response.content.decode('utf-8')  # Decode bytes data to string
    menu_json = json.loads(menu_data)  # Parse JSON data from string
    return render_template('index.html', order=order_info, menu=menu_json)

@app.route('/payment')
def payment():
    item_detail = get_payment()
    return render_template('cart.html', payment = item_detail)



if __name__ == "__main__":
    app.run(debug=True, port=7000)