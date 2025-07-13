# re-start

a useful browser startpage, built with svelte.

features:

- customizable links
- basic todoist tasks integration
- weather
- random stats (load time, ping, fps, viewport size)

<img width="2504" height="1347" alt="image" src="https://github.com/user-attachments/assets/e469d2af-0d43-46a9-8f7f-d914771f0119" />

## how to use

### firefox

1. download the latest .xpi file from the `releases` folder.
2. go to the firefox extensions manager (`about:addons`)
3. click the gear icon in the top right.
4. click "Install Add-on From File" and select the .xpi file you downloaded.
5. make sure to click "Add" and "Keep Changes".

### chrome

1. clone/download this repo.
2. run `npm i` (you must have node.js).
3. run `npm run build`. you should see it create a `dist` folder.
4. go to the chrome extensions manager (`chrome://extensions`).
5. turn on developer mode in the top right.
6. click "Load unpacked" in the top left.
7. select the `dist` folder.

### startpage settings

hover your cursor on the top right corner of the startpage, and you should see a settings button appear. click it to configure settings.

to get your todoist api token, open the todoist website and clicking your profile in the top left. then go to "Settings" > "Integrations" > "Developer" > "Copy API Token".
