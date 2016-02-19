##Rent Control

Find the neighborhood that's right for you.

#Summary

In each city I've lived in, I have wished that there were a way to more easily gain information on what the various neighborhoods are like (from a cost standpoint, among other things.) Therefore, I set out to build an app that would help people get an idea of the various neighborhoods for different cities, based on their budget. I know that such information can be useful when on the go; for that reason, I developed Rent Control to be a mobile application.

#Technologies

I designed this application specifically for mobile devices, using the Ionic framework of AngularJS. I built the client-side with Ionic and Angular, and built the server-side with Express, Node, and MongoDB. 

#General Approach

I utilized the Zillow API for retrieving neighborhood data (the average home price) for a given city and state. I used Node on the server side to make API calls, while consuming that data with Angular/Ionic on the client side. A user is able to log in, answer questions (budget, their preferences for schools, crime, and walkability in a neighborhood), and then search a city and state to receive personalized recommendations for neighborhoods.

#Installation Instructions

The application is hosted on Amazon Web Services (EC2) at http://ec2-54-191-27-68.us-west-2.compute.amazonaws.com:8000/. To run the application locally, it will be necessary to install the following:

-Node
-MongoDB
-Express
-Angular
-Ionic

The application can be served locally using 'ionic serve --lab' on port 8100, to simulate the mobile experience from a desktop.

#Hurdles/Challenges/Next Steps

One hurdle was gathering relevant data from the Zillow API, which was returned in XML format. I circumvented this by using various .substring and .split methods to retrieve only the necessary location information.

Another challenge I faced was using Services and Controllers in Angular to pass relevant information pertaining to the API calls back and forth; I eventually simplified this by using one controller for searching a location and displaying the results. I think this lends itself well to the mobile user experience.

As next steps, I would like to factor current location into the embedded Google Maps API on the 'Search' page to provide a better visual experience. Also, data on schools/crime/walkability did not seem to be widely available among the APIs that I researched; I would embrace the opportunity to include this information in helping users to filter their neighborhood search as closely as possible.

#User Stories/Trello

https://trello.com/b/U2AekT4f/project-4-rent-control


