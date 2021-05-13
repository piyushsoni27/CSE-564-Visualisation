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

pcp_data = pd.DataFrame()

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
    
    countries = []
    
    for i in range(len(gj["features"])):
        id = gj["features"][i]["id"]
        if(id in data["id"].values):
            countries.append(id)
            
    data = data.loc[data.id.isin(countries)].reset_index(drop=True)
    

def preprocess_pcp_data():
    global data
    global pcp_data
    
    pcp_data=data
    ## countries in npi data
    countries = ['ALB', 'AUT', 'BEL', 'BIH', 'BRA', 'CAN', 'HKG', 'HRV', 'CZE',
       'DNK', 'ECU', 'EGY', 'SLV', 'EST', 'FIN', 'FRA', 'DEU', 'GHA',
       'GRC', 'HND', 'HUN', 'ISL', 'IND', 'IDN', 'ITA', 'JPN', 'KAZ',
       'RKS', 'KWT', 'LIE', 'LTU', 'MYS', 'MUS', 'MEX', 'MNE', 'NLD',
       'NZL', 'MKD', 'NOR', 'POL', 'PRT', 'IRL', 'ROU', 'SEN', 'SRB',
       'SGP', 'SVK', 'SVN', 'KOR', 'ESP', 'SWE', 'CHE', 'SYR', 'TWN',
       'THA', 'GBR', 'USA']
    
    to_remove = ["SEN", "SLV", "BIH"]

    pcp_data = data.loc[data.id.isin(countries)].reset_index(drop=True)
    pcp_data = pcp_data.loc[~pcp_data.id.isin(to_remove)].reset_index(drop=True)  
    
@app.route("/pcp", methods=["POST" , "GET"])
def get_pcp_data():
    global pcp_data
    
    start_date = pd.to_datetime("2020-01-01")
    end_date = pd.to_datetime("2020-11-23")
    
    if(request.method == 'POST'):
        dates = request.get_json()

        start_date = pd.to_datetime(dates["start"])
        end_date = pd.to_datetime(dates["end"])

    pcp_data_send = pcp_data.loc[(pcp_data.date>=start_date) & (pcp_data.date<=end_date)]
    
    pcp_axis = ["id","location", 'gdp_per_capita', 'stringency_index', 'human_development_index', 'median_age', 'hospital_beds_per_thousand', 'new_cases', 'new_deaths', 'new_vaccinations']
    pcp_data_temp = pcp_data_send[pcp_axis].groupby("location")[pcp_axis[2:]].mean().reset_index()
    pcp_data_temp["id"] = pcp_data_send["id"].unique()
        
    return json.dumps(pcp_data_temp.to_dict(orient="records"))

@app.route("/worldmap", methods=["POST" , "GET"])
def get_worldmap_data():
    
    start_date = pd.to_datetime("2020-03-25")
    end_date = pd.to_datetime("2021-03-28")
    
    if(request.method == 'POST'):
        dates = request.get_json()

        start_date = pd.to_datetime(dates["start"])
        end_date = pd.to_datetime(dates["end"])
                    
    filtered_data = data.loc[(data.date>=start_date) & (data.date<=end_date)]
    
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
    npi_data = pd.DataFrame()
    
    country = "world"
    
    if(request.method == 'POST'):
        country = request.get_json()

    if(country == "world" or country==""):        
        line_df = world_line_df
    else:
        line_df = data.loc[data.id == country, ["date", "new_cases_smoothed", "new_deaths_smoothed", "new_vaccinations_smoothed"]]
        line_df.date = line_df.date.astype("str")
        line_df.rename(columns={'new_cases_smoothed': 'new_cases', 'new_deaths_smoothed': 'new_deaths', "new_vaccinations_smoothed" : "new_vaccinations"}, inplace=True)
        
    if(country != "world"):
        npi_data = bubble_df.loc[bubble_df['id']==country]
    else:
        npi_data = bubble_df
    
    if(npi_data.shape[0] != 0):
        npi_data['Date'] = pd.to_datetime(npi_data.Date)
    
        npi_data =  npi_data.groupby('Date')['Measure_L1'].value_counts().reset_index(name="Count") 
    
        npi_data['Count'] = npi_data['Count'].astype('int32')
        npi_data['Date'] = npi_data['Date'].astype('str')
        npi_data['Measure_L1'] = npi_data['Measure_L1'].str.replace('\s+', '_') 
        npi_data['Measure_L1'] = npi_data['Measure_L1'].str.replace(',', '')
        npi_data.rename(columns={'Date':'date'},inplace=True)

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
    preprocess_pcp_data()

    app.config['TEMPLATES_AUTO_RELOAD'] = True
    app.config['SEND_FILE_MAX_AGE_DEFAULT'] = 0
    app.run(debug=True)