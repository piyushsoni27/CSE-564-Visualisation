import numpy as np
import pandas as pd

from sklearn.datasets import load_boston
import pandas as pd

boston = load_boston()
bostondf= pd.DataFrame(boston.data, columns=boston.feature_names)

bostondf['MEDV'] = boston.target


print(bostondf.head())
print(bostondf.shape)

print(bostondf.isna().sum())

print(bostondf.nunique(axis=0))

# df = pd.read_csv("E:\Projects\Visualization Course\proj1_js\\data\\diabetes.csv")

# df.age = round(df.age / 365).astype("int64")

# df["high_bp"]=df.pressure.apply(lambda a: a.split('/')[0])
# df["low_bp"]=df.pressure.apply(lambda a: a.split('/')[1])

# df.drop(["pressure", "id"], axis=1, inplace=True)


# df = df.sample(500)
# print(df.isna().sum())

bostondf.to_csv("E:\Projects\Visualization Course\proj1_js\\data\\boston_data.csv")

# print(df.head())
# print(df.nunique(axis=0))
# print(df.shape)

# print(df.describe())