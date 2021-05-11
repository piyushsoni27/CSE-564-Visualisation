import os

from flask import Flask, redirect, url_for, render_template, jsonify, request
import matplotlib.pyplot as plt 

import pandas as pd
import numpy as np
import json
import geojson
import random

## Flask variables
app = Flask(__name__)
app.secret_key = "hello"

app.config['SEND_FILE_MAX_AGE_DEFAULT'] = 0

## global Variables
curr_dir = os.path.dirname(__file__)

# data paths
data_path = os.path.join(curr_dir, os.path.join('data', "owid-covid-data.csv"))
geo_json_path = os.path.join(curr_dir, os.path.join('data', 'countries.geo.json'))
covid_geo_json_path = os.path.join(curr_dir, os.path.join('data', 'covid_geo.json'))
world_line_data_path = os.path.join(curr_dir, os.path.join('data', "world-data.csv"))
bubble_data_path = os.path.join(curr_dir, os.path.join('data', "bubble_npi.csv"))
barchart_data_path = os.path.join(curr_dir, os.path.join('data', "world-seasonal-data.csv"))
hashtags_data_path = os.path.join(curr_dir, os.path.join('data', "hashtags.csv"))

with open(geo_json_path) as f:
    gj = geojson.load(f)
    for i in range(len(gj["features"])):
        if(gj["features"][i]["properties"]["name"] == "Antarctica"):
            gj["features"].remove(gj["features"][i])
            break

# Geo features for plotting world map
geo_features = gj['features']

# read data
data = pd.read_csv(data_path)
data_original = data.copy()

bar_df = pd.read_csv(barchart_data_path)
world_line_df = pd.read_csv(world_line_data_path)
bubble_df = pd.read_csv(bubble_data_path)
hashtag_df = pd.read_csv(hashtags_data_path)

def preprocess():
    global data
    data.fillna(0, inplace=True)
    data = data[~data['iso_code'].astype(str).str.startswith('OWID')]
    data.reset_index(drop=True, inplace=True)
    data.rename({"iso_code" : "id"}, axis="columns", inplace=True)
    data['date'] = pd.to_datetime(data['date'])

@app.route("/worldmap", methods=["POST" , "GET"])
def get_worldmap_data():
    
    start_date = pd.to_datetime("2020-03-25")
    end_date = pd.to_datetime("2021-03-28")
    
    if(request.method == 'POST'):
        dates = request.get_json()
        print(dates)
        start_date = pd.to_datetime(dates["start"])
        end_date = pd.to_datetime(dates["end"])
                
    date_check = np.where((data.date>=start_date) & (data.date<=end_date))
    
    filtered_data = data.loc[date_check]
    
    groupby_data = filtered_data.groupby(["id"])
    
    mean_new_cases = groupby_data.new_cases.mean()
    mean_new_deaths = groupby_data.new_deaths.mean()
    mean_new_vaccinations = groupby_data.new_vaccinations.mean()
        
    for i in range(len(gj["features"])):
        id = gj["features"][i]["id"]
        if(id in filtered_data["id"].values):
            gj["features"][i]["new_cases"] = int(mean_new_cases[id])
            gj["features"][i]["new_deaths"] = int(mean_new_deaths[id])
            gj["features"][i]["new_vaccinations"] = int(mean_new_vaccinations[id])  

    return gj

@app.route("/linechart", methods=["POST" , "GET"])
def get_linechart_data():
    global world_line_df
    global bubble_df
    
    line_df = pd.DataFrame()
    country_bubble_df = pd.DataFrame()
    
    country = "world"
    
    if(request.method == 'POST'):
        country = request.get_json()
        print(country)
    
    
    if(country == "world"):        
        line_df = world_line_df
    
    else:
        line_df = data.loc[data.location == country, ["date", "new_cases_smoothed", "new_deaths_smoothed", "new_vaccinations_smoothed"]]
        line_df.date = line_df.date.astype("str")
        line_df.rename(columns={'new_cases_smoothed': 'new_cases', 'new_deaths_smoothed': 'new_deaths', "new_vaccinations_smoothed" : "new_vaccinations"}, inplace=True)
    
    print(line_df)
    
    if(country != "world"):
        country_bubble_df = bubble_df.loc[bubble_df['Country']==country]
    else:
        country_bubble_df = bubble_df
        
    country_bubble_df['Date'] = pd.to_datetime(country_bubble_df.Date)

    npi_data =  country_bubble_df.groupby('Date')['Measure_L1'].value_counts().unstack().stack(dropna=True).reset_index(name="Count") 

    npi_data['Count'] = npi_data['Count'].astype('int32')
    npi_data['Date'] = npi_data['Date'].astype('str')
    npi_data['Measure_L1'] = npi_data['Measure_L1'].str.replace('\s+', '_') 
    npi_data['Measure_L1'] = npi_data['Measure_L1'].str.replace(',', '')
    npi_data.rename(columns={'Date':'date'},inplace=True)
    print(npi_data.Measure_L1)
    
    # print(world_line_df)

    
    d1 = line_df.to_dict(orient="records")
    d2 = npi_data.to_dict(orient="records")
    D = {'lined':d1,'bubbled':d2}
    return json.dumps(D)

@app.route("/barchart", methods=["POST" , "GET"])
def get_barchart_data():
    global bar_df
    
    return json.dumps(bar_df.to_dict(orient="records"))

@app.route("/wordcloud", methods=["POST" , "GET"])
def get_wordcloud_data():
    global hashtag_df
    
    start_date = pd.to_datetime("2021-01-15")
    end_date = pd.to_datetime("2021-01-30")

    
    if(request.method == 'POST'):
        dates = request.get_json()
        print(dates)
        start_date = pd.to_datetime(dates["start"])
        end_date = pd.to_datetime(dates["end"])
    
    
    hashtag_df['date'] = pd.to_datetime(hashtag_df['date'])
    
    date_check = np.where((hashtag_df.date>=start_date) & (hashtag_df.date<=end_date))
    
    word_cloud_df = hashtag_df.loc[date_check]
        
    word_cloud_df = word_cloud_df.groupby(["hashtag"])['count'].sum().astype('int64').sort_values().tail(20).reset_index()
    word_cloud_df['count'] = np.log(word_cloud_df['count'])
    
    return json.dumps(word_cloud_df.to_dict(orient="records"))

@app.route("/")
def home():
    return render_template("index.html")


if(__name__ == "__main__"):
    preprocess()
    print(data)
    # country_codes = data.iso_code.unique()
    # world_data = pd.DataFrame(columns=("iso_code", "new_cases", "new_deaths"))
    # world_data.iso_code = country_codes
    
    # for code in country_codes:
    #     world_data.loc[world_data.iso_code == code, "new_cases"] = data.loc[data.iso_code == code].new_cases.iloc[-1]
    #     world_data.loc[world_data.iso_code == code, "new_deaths"] = data.loc[data.iso_code == code].new_deaths.iloc[-1]
    
    # if(os.path.isfile(covid_geo_json_path)):
    #     with open(covid_geo_json_path) as f:
    #         covid_geo = geojson.load(f)    
    # else:
    #     covid_geo = createjson(world_data)
        
    # get_worldmap_data()
    
    # get_wordcloud_data()
    app.config['TEMPLATES_AUTO_RELOAD'] = True
    app.config['SEND_FILE_MAX_AGE_DEFAULT'] = 0
    app.run(debug=True)