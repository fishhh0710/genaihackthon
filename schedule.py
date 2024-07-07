from flask import Flask, request, jsonify
from flask_cors import CORS
import json
import openai
import re # download


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

tasks = read_json(file_path)
result = '\n'.join([f"{task['data']['label']}; {task['data']['description']}; {task['data']['time']}; {task['data']['done']}; {task['data']['deadline']}" for task in tasks])


def split_text(text, delimiters):
        # 創建正則表達式模式，匹配任意一個分隔符
        pattern = '|'.join(map(re.escape, delimiters))
        parts = re.split(pattern, text)
        return [part.strip() for part in parts if part.strip()]

@app.route('/generate', methods=['POST'])
def generate():

    openai.api_key = <api_key> 
    gpt_response = openai.Completion.create(
        engine="gpt-3.5-turbo-instruct",
        prompt=f"{result}，以上是目前有的工作任務，不同任務以分號分隔，照順序分別為名稱、預估工作時間、狀態（-1 代表未完成，0 代表進行中，1 代表已完成）、最晚必須完成的時間，請依照目前有的任務最晚必須完成的時間、狀態以及預估工作時間，安排一天的 To do list，每天預算時間為6，不要超過。\n"
            "如果有任務是已經完成的，請不要將其加入 To do list 中。\n"
            "如果有任務是進行中的，請優先將其加入 To do list 中，並且將其預估工作時間從預算時間中扣除。\n"
            "如果有任務是未完成的，請依照最晚必須完成的時間，從時間最早的開始加入 To do list 中，並且將其預估工作時間從預算時間中扣除。\n"
            "done = 1的工作請不要輸出"
            "回答請直接輸出安排好的 To do list，格式為: 任務 1; 任務 2; 任務 3\n"
            "舉例: 輸入prompt:"
            "顯示天氣資訊; 2; -1; 7/20\n"
            "製作視覺效果; 3; 0; 7/22\n"
            "測試與修正; 2; 0; 7/24"
            "預期的回答:顯示天氣資訊; 製作視覺效果\n",
        max_tokens=700
    )

    Schedule = gpt_response.choices[0].text.strip()
    print(Schedule)
    delimiters = ['；']
    split_parts = split_text(Schedule, delimiters)

    return f'{split_parts}' 

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


if __name__ == '__main__':
    app.run(debug=True)
