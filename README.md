# Welcome to your Expo app 👋

This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
    npx expo start
   ```

   since we are using react-native-zip-archive library, we need to work with expo development build. hence we need to run the app in development mode.

   ```

   ```

## Build

to build an apk, sign in to expo

```
eas login
```

then run this command

```
eas build -p android --profile preview
```

## development plan

zip and decompress db: i thought i had to use 'react-native-zip-archive' library which requires expo development build. but ended up using jszip. anyways the result was not a smaller apk.
prevent text input text flowing under x mark
implement convert lat lng to plus code.
improve ui ux
