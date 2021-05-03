# -*- coding: utf-8 -*-
"""
Created on Thu Apr 22 00:14:51 2021

@author: Piyush Soni
"""

import os

import pandas as pd
import numpy as np


root_path = os.path.split(os.path.split(os.path.dirname(__file__))[0])[0]
data_folder = os.path.join(root_path, 'data')


data_path = os.path.join(data_folder, "owid-covid-data.csv")
save_path = os.path.join(data_folder, "world-seasonal-data.csv")


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

summer_south = {"start_month": 0, "end_month": 2}
autumn_south = {"start_month": 3, "end_month": 5}
winter_south = {"start_month": 6, "end_month": 8}
spring_south = {"start_month": 9, "end_month": 11}

# north_data = pd.DataFrame(columns=("season", "new_cases", "new_deaths", "new_vaccinations"))

south = ["ARG", "AUS", "BRA", "CHL", "NZL", "ZAF", "URY", "ZWE"]

dict_list = []

season = "winter"
new_vaccinations = data.loc[((~data.id.isin(south)) & (data.month>=winter_north["start_month"]) & (data.month<=winter_north["end_month"])), "new_vaccinations"].sum().astype("int64")
new_deaths = data.loc[((~data.id.isin(south)) & (data.month>=winter_north["start_month"]) & (data.month<=winter_north["end_month"])), "new_deaths"].sum().astype("int64")
new_cases = data.loc[((~data.id.isin(south)) & (data.month>=winter_north["start_month"]) & (data.month<=winter_north["end_month"])), "new_cases"].sum().astype("int64")

dict_list.append({"season": season, "new_cases_north": new_cases, "new_deaths_north": new_deaths, "new_vaccinations_north": new_vaccinations})

season = "spring"
new_vaccinations = data.loc[((~data.id.isin(south)) & (data.month>=spring_north["start_month"]) & (data.month<=spring_north["end_month"])), "new_vaccinations"].sum().astype("int64")
new_deaths = data.loc[((~data.id.isin(south)) & (data.month>=spring_north["start_month"]) & (data.month<=spring_north["end_month"])), "new_deaths"].sum().astype("int64")
new_cases = data.loc[((~data.id.isin(south)) & (data.month>=spring_north["start_month"]) & (data.month<=spring_north["end_month"])), "new_cases"].sum().astype("int64")

dict_list.append({"season": season, "new_cases_north": new_cases, "new_deaths_north": new_deaths, "new_vaccinations_north": new_vaccinations})

season = "summer"
new_vaccinations = data.loc[((~data.id.isin(south)) & (data.month>=summer_north["start_month"]) & (data.month<=summer_north["end_month"])), "new_vaccinations"].sum().astype("int64")
new_deaths = data.loc[((~data.id.isin(south)) & (data.month>=summer_north["start_month"]) & (data.month<=summer_north["end_month"])), "new_deaths"].sum().astype("int64")
new_cases = data.loc[((~data.id.isin(south)) & (data.month>=summer_north["start_month"]) & (data.month<=summer_north["end_month"])), "new_cases"].sum().astype("int64")

dict_list.append({"season": season, "new_cases_north": new_cases, "new_deaths_north": new_deaths, "new_vaccinations_north": new_vaccinations})

season = "autumn"
new_vaccinations = data.loc[((~data.id.isin(south)) & (data.month>=autumn_north["start_month"]) & (data.month<=autumn_north["end_month"])), "new_vaccinations"].sum().astype("int64")
new_deaths = data.loc[((~data.id.isin(south)) & (data.month>=autumn_north["start_month"]) & (data.month<=autumn_north["end_month"])), "new_deaths"].sum().astype("int64")
new_cases = data.loc[((~data.id.isin(south)) & (data.month>=autumn_north["start_month"]) & (data.month<=autumn_north["end_month"])), "new_cases"].sum().astype("int64")

dict_list.append({"season": season, "new_cases_north": new_cases, "new_deaths_north": new_deaths, "new_vaccinations_north": new_vaccinations})

world_seasonal_data = pd.DataFrame(dict_list, columns=["season", "new_cases_north", "new_deaths_north", "new_vaccinations_north", "new_cases_south", "new_deaths_south", "new_vaccinations_south"])

## south
season = "winter"
world_seasonal_data.loc[world_seasonal_data.season==season, "new_vaccinations_south"] = data.loc[((data.id.isin(south)) & (data.month>=winter_south["start_month"]) & (data.month<=winter_south["end_month"])), "new_vaccinations"].sum().astype("int64")
world_seasonal_data.loc[world_seasonal_data.season==season, "new_deaths_south"] = data.loc[((data.id.isin(south)) & (data.month>=winter_south["start_month"]) & (data.month<=winter_south["end_month"])), "new_deaths"].sum().astype("int64")
world_seasonal_data.loc[world_seasonal_data.season==season, "new_cases_south"] = data.loc[((data.id.isin(south)) & (data.month>=winter_south["start_month"]) & (data.month<=winter_south["end_month"])), "new_cases"].sum().astype("int64")

dict_list.append({"season": season, "new_cases_south": new_cases, "new_deaths_south": new_deaths, "new_vaccinations_south": new_vaccinations})

season = "spring"
world_seasonal_data.loc[world_seasonal_data.season==season, "new_vaccinations_south"] = data.loc[((data.id.isin(south)) & (data.month>=spring_south["start_month"]) & (data.month<=spring_south["end_month"])), "new_vaccinations"].sum().astype("int64")
world_seasonal_data.loc[world_seasonal_data.season==season, "new_deaths_south"] = data.loc[((data.id.isin(south)) & (data.month>=spring_south["start_month"]) & (data.month<=spring_south["end_month"])), "new_deaths"].sum().astype("int64")
world_seasonal_data.loc[world_seasonal_data.season==season, "new_cases_south"] = data.loc[((data.id.isin(south)) & (data.month>=spring_south["start_month"]) & (data.month<=spring_south["end_month"])), "new_cases"].sum().astype("int64")

dict_list.append({"season": season, "new_cases_south": new_cases, "new_deaths_south": new_deaths, "new_vaccinations_south": new_vaccinations})

season = "summer"
world_seasonal_data.loc[world_seasonal_data.season==season, "new_vaccinations_south"] = data.loc[((data.id.isin(south)) & (data.month>=summer_south["start_month"]) & (data.month<=summer_south["end_month"])), "new_vaccinations"].sum().astype("int64")
world_seasonal_data.loc[world_seasonal_data.season==season, "new_deaths_south"] = data.loc[((data.id.isin(south)) & (data.month>=summer_south["start_month"]) & (data.month<=summer_south["end_month"])), "new_deaths"].sum().astype("int64")
world_seasonal_data.loc[world_seasonal_data.season==season, "new_cases_south"] = data.loc[((data.id.isin(south)) & (data.month>=summer_south["start_month"]) & (data.month<=summer_south["end_month"])), "new_cases"].sum().astype("int64")

dict_list.append({"season": season, "new_cases_south": new_cases, "new_deaths_south": new_deaths, "new_vaccinations_south": new_vaccinations})

season = "autumn"
world_seasonal_data.loc[world_seasonal_data.season==season, "new_vaccinations_south"] = data.loc[((data.id.isin(south)) & (data.month>=autumn_south["start_month"]) & (data.month<=autumn_south["end_month"])), "new_vaccinations"].sum().astype("int64")
world_seasonal_data.loc[world_seasonal_data.season==season, "new_deaths_south"] = data.loc[((data.id.isin(south)) & (data.month>=autumn_south["start_month"]) & (data.month<=autumn_south["end_month"])), "new_deaths"].sum().astype("int64")
world_seasonal_data.loc[world_seasonal_data.season==season, "new_cases_south"] = data.loc[((data.id.isin(south)) & (data.month>=autumn_south["start_month"]) & (data.month<=autumn_south["end_month"])), "new_cases"].sum().astype("int64")

dict_list.append({"season": season, "new_cases_south": new_cases, "new_deaths_south": new_deaths, "new_vaccinations_south": new_vaccinations})

# world_seasonal_data = pd.DataFrame(dict_list, columns=["season", "new_cases_north", "new_deaths_north", "new_vaccinations_north", "new_cases_south", "new_deaths_south", "new_vaccinations_south"])

world_seasonal_data.to_csv(save_path)
