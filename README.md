# Hahn.ApplicatonProcess.Application

This is a solution that is used to manage application in the most basic level.
The solution contains three projects:
* Hahn.ApplicatonProcess.December2020.Data - A Class Library
* Hahn.ApplicatonProcess.December2020.Web- An Aurelia powered website
* Hahn.ApplicatonProcess.December2020.Domain – API containing business logic and models

## Building Projects
After cloning this repo. Do the following.
* Take note of your project folder path. Let's take this example: `C:\repos\Hahn.ApplicatonProcess.Application` Navigate to this folder with this command: `cd C:\repos\Hahn.ApplicatonProcess.Application`
* Restore packages for the first project, cd into it first: `cd Hahn.ApplicatonProcess.December2020.Data`, then run `dotnet restore`
* Go to the next project. `cd..` - to go back one level. Then `cd Hahn.ApplicatonProcess.December2020.Domain` to enter this project.
* Run `dotnet restore` to restore the packages for this project.
* Go to the last project. `cd..` - to go back one level. Then `cd Hahn.ApplicatonProcess.December2020.Web` to enter this project.
* Run `npm install` to restore the packages for this project.

## Running Projects
* Open the solution folder (C:\repos\Hahn.ApplicatonProcess.Application) with Visual Studio Code.
* Open the Run & Debug tab by clicking on the Run icon by the left or pressing `Ctrl+Shift+D`.
* Click on the green icon that looks like play ▶ button to run the project. Note: make sure `.NET Core Launch (web)` is selected in the dropdown in front of that button before running.
* If everything works fine, your browser should load a blank page at `https://localhost:5001/`. Just load `https://localhost:5001/swagger` to view the API description.
* The API is up and running, next is to launch the Aurelia website.
* With command prompt, navigate to the Aurelia project, following the path example above, the aurelia full path is: `C:\repos\Hahn.ApplicatonProcess.Application\Hahn.ApplicatonProcess.December2020.Web`
* Once you're in that folder, just run `au run --open'. The browser will open the app.
