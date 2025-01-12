# About the app

This news application is build using ReactJS, Typescript, Vite and Tailwind CSS.

This application displays news from three different sources, NewsAPI.org, The Guardian and New York Times.

Populate the fields such as searchbox or category and source filter and click on search button to get news related to the specified filters.

Personalization option is also provided where user can personalize their feed and save. The personalization will be retained until the values in the personalization section is set to their default values and saved.

Once the feed is personalised app will show 'Your Feed' instead of 'Latest News'


## Running the app

**Using docker**

Run 'docker build -t react-news-app:dev .' to build
Run 'docker run -p 5173:5173 react-news-app:dev' to run the app
Application will run on port [5173](http://localhost:5173/)

**Without docker**
Run 'npm i' to install dependencies
Run 'npm run dev' to run the app which will open in port [5173](http://localhost:5173/)




```
