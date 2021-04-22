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
line_data_path = os.path.join(curr_dir, os.path.join('data', "world-data.csv"))

with open(geo_json_path) as f:
    gj = geojson.load(f)

# Geo features for plotting world map
geo_features = gj['features']

# read data
data = pd.read_csv(data_path)
data_original = data.copy()

global covid_geo
def preprocess():
    data.fillna(0, inplace=True)
    data.rename({"iso_code" : "id"}, axis="columns", inplace=True)
    
    
def createjson(df):
    for i in geo_features:
        for index, row in df.iterrows():
            if(row['id'] == i['id']):
                i['new_cases'] = row['new_cases']
                i['new_deaths'] = row['new_deaths']
            else:
                pass
        with open(covid_geo_json_path, 'w') as outfile:
            json.dump(gj, outfile)
            
    return json.dumps(gj)

@app.route("/geo_data", methods=["GET"])
def get_geo_data():
    return gj

@app.route("/worldmap", methods=["POST" , "GET"])
def get_worldmap_data():
    
    start_date = "2021-01-25"
    end_date = "2021-03-28"
        
    country_codes = data.id.unique()
    world_data = pd.DataFrame(columns=("new_cases", "new_deaths", "new_vaccinations"))
    
    
    world_data.new_vaccinations = data.loc[(pd.to_datetime(data.date)>=pd.to_datetime(start_date)) & (pd.to_datetime(data.date)<=pd.to_datetime(end_date))].groupby(["id"]).new_vaccinations.mean()
    world_data.new_deaths = data.loc[(pd.to_datetime(data.date)>=pd.to_datetime(start_date)) & (pd.to_datetime(data.date)<=pd.to_datetime(end_date))].groupby(["id"]).new_deaths.mean()
    world_data.new_cases = data.loc[(pd.to_datetime(data.date)>=pd.to_datetime(start_date)) & (pd.to_datetime(data.date)<=pd.to_datetime(end_date))].groupby(["id"]).new_cases.mean()
    
    world_data.reset_index(inplace=True)
    print(world_data)
    # pop_data = pd.read_csv("data/world_population.tsv", sep='\t')
    # pop_data.drop("Unnamed: 3", axis=1, inplace=True)
    
    # world_data = world_data.to_dict(orient="records")
    return json.dumps(world_data.to_dict(orient="records"))

@app.route("/linechart", methods=["POST" , "GET"])
def get_linechart_data():
    
    linedf = pd.read_csv(line_data_path)
    # start_date = "2020-03-25"
    # end_date = "2020-03-28"
        
    # country_codes = data.id.unique()
    # world_data = pd.DataFrame(columns=("new_cases", "new_deaths", "new_vaccinations"))
    
    # world_data.new_vaccinations = data.loc[(pd.to_datetime(data.date)>=pd.to_datetime(start_date)) & (pd.to_datetime(data.date)<=pd.to_datetime(end_date))].groupby(["id"]).new_vaccinations.mean()
    # world_data.new_deaths = data.loc[(pd.to_datetime(data.date)>=pd.to_datetime(start_date)) & (pd.to_datetime(data.date)<=pd.to_datetime(end_date))].groupby(["id"]).new_deaths.mean()
    # world_data.new_cases = data.loc[(pd.to_datetime(data.date)>=pd.to_datetime(start_date)) & (pd.to_datetime(data.date)<=pd.to_datetime(end_date))].groupby(["id"]).new_cases.mean()
    
    # world_data.reset_index(inplace=True)
    # print(world_data)
    # pop_data = pd.read_csv("data/world_population.tsv", sep='\t')
    # pop_data.drop("Unnamed: 3", axis=1, inplace=True)
    
    # world_data = world_data.to_dict(orient="records")
    # linedf.reset_index(inplace=True)
    linedf = linedf.drop(linedf.columns[0], axis=1)
    print(linedf)
    return json.dumps(linedf.to_dict(orient="records"))

@app.route("/")
def home():
    return render_template("index.html")


if(__name__ == "__main__"):
    preprocess()
    
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
    
    # get_country_data()
    app.config['TEMPLATES_AUTO_RELOAD'] = True
    app.config['SEND_FILE_MAX_AGE_DEFAULT'] = 0
    app.run(debug=True)