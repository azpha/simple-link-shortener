# simple-link-shortener
Pretty much as says. A super simple Express server to shorten links, easily able to be used with programs like ShareX.

## Setup
Clone the repository and install dependencies;
```
git clone https://github.com/azpha/simple-link-shortener && cd simple-link-shortener

npm i
```

Copy & rename `.env.sample` to `.env` and change values to your liking (what port you'd like + the secret of your choosing. something secure!) and you're done. Just run `node .` to start the server and it will start!

## Optional ShareX Setup
- Go to **Destinations > Custom Uploader Settings..**
- In the window that appears, click **New** in the top left
- Give it a name of your choosing & set its **Destination Type** to **URL shortener**
- Set **Method** to **POST**, then set **Request URL** to the hostname you have the server running on, followed by `/create` (ex. `http://localhost:3000/create`)
- Add 2 **URL parameters**
    - Name: secret, Value: the secret you set in .env
    - Name: url, Value: `{input}`
- Look at the bottom of the window, where it says `URL`. Set this to the hostname you have the server running on followed by `{json:id}`.

Once you've done all that, hit **Test** next to **URL Shortener** on the left side of the window, and you should get a URL back that you can click on.