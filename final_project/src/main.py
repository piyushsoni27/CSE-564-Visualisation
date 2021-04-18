import os

from flask import Flask, redirect, url_for, render_template, jsonify, request
import matplotlib.pyplot as plt 

import pandas as pd
import numpy as np
import json
import random

app = Flask(__name__)
app.secret_key = "hello"

app.config['SEND_FILE_MAX_AGE_DEFAULT'] = 0

data_path = os.path.join(os.path.dirname(__file__), os.path.join('data', "owid-covid-data.csv"))

data = pd.read_csv(data_path)
data_original = data.copy()

# @app.route("/worldmap", methods=["POST" , "GET"])
def get_country_data(country_ID):
    attr = ""
    country_df = data.loc[data.iso_code == country_ID]
    print(country_df)
    # if(request.method == 'POST'):
    #     attr = request.get_json()


if(__name__ == "__main__"):
    get_country_data("USA")
    # app.config['TEMPLATES_AUTO_RELOAD'] = True
    # app.config['SEND_FILE_MAX_AGE_DEFAULT'] = 0
    # app.run(debug=True)