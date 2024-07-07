from flask import Flask, request, jsonify
from flask_cors import CORS
import json

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}})

file_path = './src/personalData.json'

# 讀寫JSON  
def read_json(file_path):
    with open(file_path, 'r', encoding='utf-8') as file:
        data = json.load(file)
    return data

def write_json(file_path, data):
    with open(file_path, 'w', encoding='utf-8') as file:
        json.dump(data, file, ensure_ascii=False, indent=4)
    data = request.json  # Get the JSON data from the request

@app.route('/submit', methods=['POST'])
def submit():

    data = request.json
    label_to_update = data.get('label', '')
    current_data = read_json(file_path)

    for task in current_data:
        if task['data']['label'] == label_to_update:
            task['data']['done'] = "1"  # Mark as done

    write_json(file_path, current_data)
    
    return jsonify({"status": "success", "updated_label": label_to_update}), 200

if __name__ == '__main__':
    app.run(debug=True)
