from flask import Flask, request, render_template_string, jsonify # download
from flask_cors import CORS # download
import json
import openai
import re # download

app = Flask(__name__)
CORS(app)

# GET 請求端点，返回任務
@app.route('/api/tasks', methods=['GET'])
def get_tasks():
    return jsonify(tasks)

# 處理表單提交
@app.route('/api/add_task', methods=['POST'])
def process_input():
    data = request.json
    print(f"Received data: {data}")
    label = data.get('label', '')
    description = data.get('description', '')
    time = data.get('time', '')
    deadline = data.get('deadline', '')

    # JSON 文件路徑
    file_path = 'nodes.json'
    edge_path = 'edges.json'

    # 讀寫JSON
    def read_json(file_path):
        with open(file_path, 'r', encoding='utf-8') as file:
            data = json.load(file)
        return data

    def write_json(file_path, data):
        with open(file_path, 'w', encoding='utf-8') as file:
            json.dump(data, file, ensure_ascii=False, indent=4)

    def add_task(file_path, new_task):
        data = read_json(file_path)
        data.append(new_task)
        write_json(file_path, data)

    def add_edge(edge_path, new_edge):
        data = read_json(edge_path)
        data.append(new_edge)
        write_json(edge_path, data)

    # 定義根據多個分隔符切割文本的函數
    def split_text(text, delimiters):
        # 創建正則表達式模式，匹配任意一個分隔符
        pattern = '|'.join(map(re.escape, delimiters))
        parts = re.split(pattern, text)
        return [part.strip() for part in parts if part.strip()]


    # 添加新任務
    current_node = str(len(read_json(file_path)))
    new_task = {"id": str(len(read_json(file_path))), "data": {"label": label, "description": description, "time": time, "parent": None, "done": 0, "participants": '', "deadline": deadline},"position": {"x": 0,"y": 0}}
    add_task(file_path, new_task)

    # 使用 OpenAI API 獲取任務描述
    openai.api_key = 'key' 
    gpt_response = openai.Completion.create(
        engine="gpt-3.5-turbo-instruct",
        prompt=f"任務名稱: {new_task['data']['label']} 任務描述: {new_task['data']['description']}的拆解任務（拆解成樹狀圖），不要用編號清單呈現每個任務。每個任務有標題以及任務描述，内容完整，不要有打到一半的內容出現。還是會有編號清單，不要有編號。內容敘述可以詳細一點，子任務要很多，至少20個。"
        f"{new_task['data']['time']}是使用者自己評估所需要的時間，是相對時間，請依照這個時間幫生成的任務訂個預計要花費的時間\n"
        f"{new_task['data']['deadline']}是這個任務的完成期限，輸入為月份/日期，請幫根據今天日期以及任務完成期限，幫每個子任務也設一個完成期限"
        "生出來的流程圖，深度至少要 5，並且有 20 個節點以上"
        "格式為標題: 内容；所需時間；完成期限。舉例: prompt為任務名稱: 製作天氣預報網頁 任務描述: 抓取網路上的天氣預報資料下來到網頁上顯示；1；07/25\n"
        "預期的回答:"
        "(注意這邊不要有編號)設置網頁架構: 設置網頁的基本結構，包括標題、導覽列、主要内容區塊等；4；07/10\n"
        "抓取天氣預報資料: 使用網路爬蟲技術，從指定的天氣預報網站上抓取最新的天氣預報資料\n；2、07/12"
        "解析天氣預報資料: 將抓取下來的天氣預報資料進行解析，提取出需要的資訊，如溫度、天氣狀況、風向等以及其他生成內容；2；7/14\n",
        max_tokens=700
    )

    description = gpt_response.choices[0].text.strip()
    print(description)

    delimiters = [':', '\n', '；']
    split_parts = split_text(description, delimiters)
    sizeOfSplitParts = len(split_parts)

    for i in range(0, sizeOfSplitParts, 4):
        new_task = {"id": str(len(read_json(file_path))), "data":{ "label": split_parts[i], "description": split_parts[i+1], "time": split_parts[i+2], "parent": current_node, "done": "0", "participants": '', "deadline": split_parts[i+3]},"position": {"x": 0,"y": 0}}
        add_task(file_path, new_task)
        new_edge = {"id": "e" + current_node + "-" + str(len(read_json(file_path))-1), "source": current_node, "target": str(len(read_json(file_path))-1)}
        add_edge(edge_path, new_edge)

    return f'Received input: Name - {label}, Description - {description}'

if __name__ == '__main__':
    app.run(debug=True)
