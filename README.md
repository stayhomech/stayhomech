# StayHome.ch

StayHome.ch is a directory of delivery services available in Switzerland. Compared to existing search engines, it bases the search on the location of the visitor and only show services that actually deliver there. This greatly simplify the visibility of available services at a given location.

This website has been created to help the Swiss population to cope with the consequences of the COVID-19 crisis and also to help small businesses to gain visibiliy.

If you own a business and want to have your service listed, simply fill the form available on the website. This is free and as simple as possible. Thank you for your help!

I want to be very clear about the fact that this website is completely volunteer. It does not collect private data nor display adds.

## How to launch the website for development

There are (at least) two ways : one is to use the Django development server directly, but you have to management yourself the environment and the dependencies, the other is to use the Docker file of the project and run it in a container.

### Option 1 : Django development server

This is my prefered way but it requires that you are a bit familiar with Python on the CLI. The example below is usable on Linux but can probably be adapted for other systems as well.

1. Clone the code from GitHub

    `git clone git@github.com:mageo/stayhomech.git`

    This will create a "stayhomech" folder that will contain the project.

2. Go to stayhome folder and create a Python 3 virtualenv

    `cd stayhomech`\
    `python3 -m venv .venv`

3. Active virtualenv (this must be done every time you want to interact with the project).

    `source .venv/bin/activate`

4. Install Python dependencies. You will probably need to install some more package on your system to be able to build all dependencies (see the Dockerfile for a list).

    `pip install -r requirements.txt`

5. Initialize Django development database.

    `python manage.py migrate`\
    `python manage.py createsuperuser`

6. Compile translations and initialize database with default translations.
   
    `python manage.py compilemessages`\
    `python manage.py update_translation_fields`

7. Run the Django development server. This is the only step you have to perform again after you modifiy the code, unless you added a dependency.

    `python manage.py runserver`

You should now be able to see the website on the URL provided by the previous command.

### Option 2 : Use the docker-compose-dev.yml file

This solution is probably the simplest to get the website running quickly.

1. Clone the code from GitHub

    `git clone git@github.com:mageo/stayhomech.git`

    This will create a "stayhomech" folder that will contain the project.

2. Run the docker-compose file
   
    ```
    cd stayhomech
    docker-compose -f docker-compose-dev.yml up --build
    ```

3. Access the website at http://localhost:8000. Admin is available at http://localhost:8000/admin.

Note for WSL users (like me) : You have to perform a few additional steps to get this working as Docker is not running in the WSL environment but on the Windows system itself.

You have to change were Windows drive are mounted on the WSL machine. Follow instruction from https://nickjanetakis.com/blog/setting-up-docker-for-windows-and-wsl-to-work-flawlessly under section "Create and modify the new WSL configuration file" :

```
sudo nano /etc/wsl.conf

# Now make it look like this and save the file when you're done:
[automount]
root = /
options = "metadata"
```

Then be sure to perform all operations in a directory that is actually on the Windows system, like /c/Users/<your_user>/Desktop as Docker for Windows cannot access WSL directories.