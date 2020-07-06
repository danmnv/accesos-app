# App accesos

## Ionic - Angular

#### Start app
```console
ionic serve
```
By default, ionic serve boots up a development server on localhost. To serve to your LAN, specify the --external option, which will use all network interfaces and print the external address(es) on which your app is being served.
```console
ionic serve --external
```

## Firebase Emulator

#### Config
Firebase ya viene configurado para que al inicar el emulador funcione en la red local, únicamente se debe configurar AngularFire en la aplicación para que escuche a las funciones del emulador. Para ello se modifica en el archivo **app.module.ts** el segundo _provider_ con el valor de la IP donde se ejecutará la aplicación:
```ts
@NgModule({
    declarations: [AppComponent],

    ......

    providers: [
        { provide: ORIGIN, useValue: 'http://x.x.x.x:5001' }
    ]
``` 

#### Run
Para ejecutar el emulador de firebase, únicamente se requieren las modalidades de functions y firestore. Para inicializar el módulo de firestore con información se utiliza el directorio **data/** para importar los registros:
```console
$ firebase emulators:start --import=data/
```