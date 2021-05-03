# -*- coding: utf-8 -*-
"""
Created on Sun May  2 20:01:35 2021

@author: Piyush Soni
"""


import os
import glob

import pandas as pd

root_path = os.path.split(os.path.split(os.path.dirname(__file__))[0])[0]

data_folder = os.path.join(root_path, 'data')
hash_tags_folder = os.path.join(data_folder, "hashtags")
save_path = os.path.join(data_folder, "hashtags.csv")

os.chdir(hash_tags_folder)

extension = 'tsv'
all_filenames = [i for i in glob.glob('*.{}'.format(extension))]

all_files = []

for f in all_filenames:
    try:
        df = pd.read_csv(f, delimiter='\t', nrows=20)
        df['date'] = f.split('_')[0]
        all_files.append(df)
    except pd.io.common.EmptyDataError:
      print(f.split('_')[0])
      print(f, " is empty and has been skipped.")

#combine all files in the list
combined_csv = pd.concat(all_files)

combined_csv.rename(columns=({'0':'hashtag', '1':"count"}), inplace=True)
combined_csv = combined_csv[["date", "hashtag", "count"]]
#export to csv
combined_csv.to_csv(save_path, index=False, encoding='utf-8-sig')