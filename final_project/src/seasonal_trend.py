# -*- coding: utf-8 -*-
"""
Created on Thu Apr 22 00:14:51 2021

@author: Piyush Soni
"""

import os

import pandas as pd
import numpy as np


curr_dir = os.path.dirname(__file__)
data_path = os.path.join(curr_dir, os.path.join('data', "owid-covid-data.csv"))
save_path = os.path.join(curr_dir, os.path.join('data', "world-data.csv"))


data = pd.read_csv(data_path)

def preprocess():
    global data
    data.fillna(0, inplace=True)
    data = data[~data['iso_code'].astype(str).str.startswith('OWID')]
    data.reset_index(drop=True, inplace=True)
    data.rename({"iso_code" : "id"}, axis="columns", inplace=True)
    
preprocess()

data["month"] = pd.DatetimeIndex(data.date).month.values % 12

winter_north = {"start_month": 0, "end_month": 2}
spring_north = {"start_month": 3, "end_month": 5}
summer_north = {"start_month": 6, "end_month": 8}
autumn_north = {"start_month": 9, "end_month": 11}

north_data = pd.DataFrame(columns=("season", "new_cases", "new_deaths", "new_vaccinations"))
 
north_data.season = "winter"   
north_data.new_vaccinations = data.loc[((data.month>=winter_north["start_month"]) & (data.month<=winter_north["end_month"])), "new_vaccinations"].sum()
north_data.new_deaths = data.loc[((data.month>=winter_north["start_month"]) & (data.month<=winter_north["end_month"])), "new_deaths"].sum()
north_data.new_cases = data.loc[((data.month>=winter_north["start_month"]) & (data.month<=winter_north["end_month"])), "new_cases"].sum()